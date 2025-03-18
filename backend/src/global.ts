import "@fastify/request-context";
import { Session } from "./entities/session.entity.js";
import { EntityManager } from "@mikro-orm/postgresql";

declare module "@fastify/request-context" {  
  interface RequestContextData {
    session?: Session;
    em: EntityManager;
  }
}
