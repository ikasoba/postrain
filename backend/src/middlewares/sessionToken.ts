import { SessionService } from "../services/SessionService.js";
import fastify, { onRequestAsyncHookHandler, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerBase, RouteGenericInterface } from "fastify";
import { bearerAuth } from "../utils/bearerAuth.js";
import { z } from "zod";

export const SessionTokenHeaderSchema = z.object({
  "x-xsrf-token": z.string(),
  "authorization": z.string()
})

export const SessionTokenResponseHeaderSchema = z.object({
  "x-xsrf-token": z.string()
})

export class SessionTokenMiddleware {
  constructor(
    private sessions: SessionService
  ) {}

  get onRequest(): onRequestAsyncHookHandler {
    return async (req, reply) => {
      const parsedHeaders = SessionTokenHeaderSchema.safeParse(req.headers);
      if (!parsedHeaders.success) {
        throw new fastify.errorCodes.FST_ERR_VALIDATION();
      }
      
      const session = await bearerAuth(token => this.sessions.verifySessionFromAccessToken(token, parsedHeaders.data["x-xsrf-token"]), parsedHeaders.data.authorization);
      if (!session.isOk || session.value == null) {
        return reply.status(401).header("www-authenticate", "Bearer").send();
      }

      req.requestContext.set("session", session.value);

      reply.header("X-XSRF-TOKEN", session.value.csrfToken);
    }
  }
}
