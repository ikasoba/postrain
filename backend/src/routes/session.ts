import { SessionService } from "../services/SessionService.js";
import { UserService } from "../services/UserService.js";
import { Router } from "../abstracts/router.js";
import { z } from "zod";
import { basicAuth } from "../utils/basicAuth.js";
import { bearerAuth } from "../utils/bearerAuth.js";
import { ApiSession, ApiSessionSchema, ApiSessionWithCredential, ApiSessionWithCredentialSchema } from "../views/session.js";

export class SessionController {
  constructor(
    private sessions: SessionService,
    private users: UserService
  ) { }

  get register() {
    return (fastify: Router) => {
      fastify.post("/login", {
        schema: {
          headers: z.object({
            authorization: z.string().describe("basic auth. `<user>:<password>`")
          }),
          response: {
            200: ApiSessionWithCredentialSchema
          }
        }
      }, async (req, reply) => {
        const payload = await basicAuth(this.users.getUserFromPasswordCredential.bind(this.users), req.headers.authorization);
        if (!payload.isOk || payload.value == null) {
          return reply.status(401).header("www-authenticate", "Basic").send();
        }

        const session = await this.sessions.create(payload.value.id);

        return new ApiSessionWithCredential(session);
      })

      fastify.delete("/dispose", {
        schema: {
          headers: z.object({
            authorization: z.string().describe("bearer auth. `<accessToken>`")
          })
        }
      }, async (req, reply) => {
        const payload = await bearerAuth(this.sessions.getSessionFromAccessToken.bind(this.sessions), req.headers.authorization);
        if (!payload.isOk || payload.value == null) {
          return reply.status(401).header("www-authenticate", "Bearer").send();
        }

        await this.sessions.dispose(payload.value.id);

        return reply.status(204).send();
      })
    }
  }
}
