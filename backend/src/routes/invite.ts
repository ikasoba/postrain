import { SessionTokenHeaderSchema, SessionTokenMiddleware } from "../middlewares/sessionToken.js";
import { Router } from "../abstracts/router.js";
import { Session } from "../entities/session.entity.js";
import { InviteService } from "../services/InviteService.js";
import { z } from "zod";
import { ApiInvite, ApiInviteWithCode } from "../views/invite.js";

export class InviteController {
  constructor(
    private invite: InviteService,
    private tokenMiddleware: SessionTokenMiddleware,
  ) { }

  get register() {
    return (fastify: Router) => {
      const tokenGuard = this.tokenMiddleware.onRequest;
            
      fastify.post("/", {
        schema: {
          description: "create invite code.",
          header: SessionTokenHeaderSchema,
          body: z.object({
            count: z.number().int().min(1).max(30),
            expiresAt: z.string().datetime().transform(x => new Date(x))
          })
        },
        onRequest: tokenGuard
      }, async (req, reply) => {
        const session = req.requestContext.get("session")
        console.log("invite", session)
        if (!session) {
          return reply.status(400).send({
            message: "Invalid session."
          })
        }

        const i = await this.invite.create(session.user, req.body.count, req.body.expiresAt)

        return new ApiInviteWithCode(i)
      })
    }
  }
}
