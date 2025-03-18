import { SessionTokenHeaderSchema, SessionTokenMiddleware } from "../middlewares/sessionToken.js";
import { Router } from "../abstracts/router.js";
import { Session } from "../entities/session.entity.js";
import { PostService } from "../services/PostService.js";
import { z } from "zod";
import { ApiPost, ApiPostSchema } from "../views/post.js";

export class PostController {
  constructor(
    private posts: PostService,
    private tokenMiddleware: SessionTokenMiddleware
  ) { }

  get register() {
        const tokenGuard = this.tokenMiddleware.onRequest;

    return (fastify: Router) => {
      fastify.post("/", {
        schema: {
          headers: SessionTokenHeaderSchema,
          body: z.object({
            content: z.string()
          }),
          response: {
            200: ApiPostSchema,
            400: z.object({
              message: z.string()
            })
          }
        },
        onRequest: tokenGuard
      }, async (req, reply) => {
        const session = req.requestContext.get("session");
        if (!session) {
          return reply.status(400).send({
            message: "Invalid Session."
          });
        }

        const post = await this.posts.publish({
          author: { id: BigInt(session.user.id) },
          content: req.body.content,
          ipAddress: req.ip
        });

        return new ApiPost(post);
      })
    }
  }
}
