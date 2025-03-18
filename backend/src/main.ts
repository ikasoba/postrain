import fastify from "fastify";
import { createJsonSchemaTransformObject, jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { Router } from "./abstracts/router.js";
import fastifySwagger from "@fastify/swagger";
import { ApiUserSchema } from "./views/user.js";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { UserController } from "./routes/user.js";
import { UserService } from "./services/UserService.js";
import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "../mikro-orm.config.js";
import { User } from "./entities/user.entity.js";
import { Argon2Service } from "./services/Argon2Service.js";
import { SessionService } from "./services/SessionService.js";
import { Session } from "./entities/session.entity.js";
import { SessionController } from "./routes/session.js";
import { ApiSessionSchema, ApiSessionWithCredentialSchema } from "./views/session.js";
import fastifyRequestContext, { requestContext } from "@fastify/request-context";
import { PostService } from "./services/PostService.js";
import { Post } from "./entities/post.entity.js";
import { SessionTokenMiddleware } from "./middlewares/sessionToken.js";
import { PostController } from "./routes/post.js";
import { ApiPostSchema } from "./views/post.js";
import { fastifyWebsocket } from "@fastify/websocket";
import { NotificationService } from "./services/NotificationService.js";
import { WebSocketController } from "./routes/ws.js";
import cors from "@fastify/cors";
import { InviteService } from "./services/InviteService.js";
import { Invite } from "./entities/invite.entity.js";
import { ConfigService } from "./services/ConfigService.js";
import { InviteController } from "./routes/invite.js";

async function router(): Promise<Router> {
  const app = fastify({
    logger: true,
    trustProxy: true
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "postrain api",
        description: "backend service",
        version: "0.1.0"
      },
    },
    transform: jsonSchemaTransform,
    transformObject: createJsonSchemaTransformObject({
      schemas: {
        User: ApiUserSchema,
        Post: ApiPostSchema,
        Session: ApiSessionSchema,
        SessionWithCredential: ApiSessionWithCredentialSchema
      }
    })
  })

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs"
  });

  app.register(fastifyRequestContext);
  app.register(fastifyWebsocket, {
    options: {
      maxPayload: 1024 ** 2
    }
  });

  await app.register(cors, {
    origin: [process.env.CORS_ORIGIN ?? "http://localhost:3000"],
    exposedHeaders: ["X-XSRF-TOKEN"]
  })

  return app.withTypeProvider<ZodTypeProvider>();
}

const orm = await MikroORM.init({
  ...mikroOrmConfig,
  context: () => requestContext.get("em")
});
const em = orm.em;

const app = await router();

app.setErrorHandler((err, req, reply) => {
  app.log.error(err);

  if (err.code == "FST_ERR_VALIDATION") {
    return reply.status(err.statusCode ?? 500).send({
      message: err.message
    });
  } else {
    return reply.status(err.statusCode ?? 500).send({
      message: "Internal Server Error."
    });
  }
});

app.addHook("onRequest", (req, reply, done) => {
  req.requestContext.set("em", orm.em.fork({ useContext: true }));

  done();
});

app.addHook("onClose", async () => {
  await orm.close();
});

const config = new ConfigService();

await config.loadFrom(process.env.CONFIG_PATH ?? "./.config.json");

const hasher = new Argon2Service();

const invites = new InviteService(orm.em.getRepository(Invite), hasher);

const users = new UserService(em, hasher, orm.em.getRepository(User), invites, config);
const userController = new UserController(users);

const sessions = new SessionService(em, users, orm.em.getRepository(Session));
const sessionController = new SessionController(sessions, users);
const sessionTokenMiddleware = new SessionTokenMiddleware(sessions);

const notify = new NotificationService();

const posts = new PostService(em, users, orm.em.getRepository(Post), notify);
const postController = new PostController(posts, sessionTokenMiddleware);

const wsController = new WebSocketController(notify);

const inviteController = new InviteController(invites, sessionTokenMiddleware);

app.register(userController.register, {
  prefix: "/users"
});

app.register(sessionController.register, {
  prefix: "/sessions"
});

app.register(postController.register, {
  prefix: "/posts"
});

app.register(wsController.register, {
  prefix: "/ws"
});

app.register(inviteController.register, {
  prefix: "/invites"
});

app.listen({
  port: process.env.PORT ? +process.env.PORT : 8000
});
