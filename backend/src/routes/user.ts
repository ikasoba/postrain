import { UserService } from "../services/UserService.js";
import { Router } from "../abstracts/router.js";
import { z } from "zod";
import { ApiUser, ApiUserSchema } from "../views/user.js";
import { RequestContext } from "@mikro-orm/core";
import { basicAuth } from "../utils/basicAuth.js";

export class UserController {
  constructor(
    private users: UserService
  ) { }

  get register() {
    return (fastify: Router) => {
      fastify.post("/sign", {
        schema: {
          headers: z.object({
            authorization: z.string().describe("basic auth")
          }),
          body: z.object({
            inviteCode: z.optional(z.string())
          }),
          response: {
            200: ApiUserSchema,
            400: z.object({
              message: z.string()
            })
          }
        }
      }, async (req, reply) => {
        const payload = await basicAuth(async (username, password) => ({ username, password }), req.headers.authorization);
        if (!payload.isOk) {
          return reply.status(401).header("www-authenticate", "Basic").send();
        }

        const user = await this.users.create(payload.value.username, payload.value.password, [req.ip], req.body.inviteCode);
        if (user == null) {
          reply.status(400);
          
          return {
            message: "User already exists."
          };
        }

        return new ApiUser(user);
      })

      fastify.get("/:id", {
        schema: {
          params: z.object({
            id: z.string().regex(/^[0-9]+$/)
          }),
          response: {
            200: ApiUserSchema,
            404: z.never()
          }
        }
      }, async (req, reply) => {
        const user = await this.users.getUserFromId(BigInt(req.params.id));

        if (user == null) {
          return reply.status(404).send();
        } else {
          return reply.status(200).send(new ApiUser(user));
        }
      })
    }
  }
}
