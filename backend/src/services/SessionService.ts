import { EntityManager, EntityRepository, IsolationLevel } from "@mikro-orm/postgresql";
import { Session } from "../entities/session.entity.js";
import { Snowflake } from "../utils/sowflake.js";
import { err, ok, Result } from "../utils/Result.js";
import { generateSecureRandomId } from "../utils/secureRandomId.js";
import { nanoid } from "nanoid";
import { UserService } from "./UserService.js";

export class SessionService {
  constructor(
    private em: EntityManager,
    private users: UserService,
    private sessions: EntityRepository<Session>
  ) { }

  async create(userId: bigint): Promise<Session> {
    const session = this.sessions.create({
      id: Snowflake.generate(),
      user: userId,
      accessToken: generateSecureRandomId(64),
      csrfToken: nanoid(),
      isDisposed: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    await this.em.flush();

    return session;
  }

  async dispose(sessionId: bigint): Promise<Result<void, void>> {
    const effectedRows = await this.sessions.nativeUpdate({ id: sessionId }, {
      isDisposed: true
    });

    if (effectedRows) {
      return ok();
    } else {
      return err();
    }
  }

  async getSessionFromId(sessionId: bigint): Promise<Session | null> {
    const session = await this.sessions.findOne({ id: sessionId, isDisposed: false });
    if (!session) return null;

    if (Date.now() >= session.expiresAt.getTime()) {
      await this.sessions.upsert({
        id: sessionId,
        isDisposed: true
      });

      return null;
    }

    return session;
  }

  async getSessionFromAccessToken(token: string): Promise<Session | null> {
    const session = await this.sessions.findOne({ accessToken: token, isDisposed: false });
    if (!session) return null;

    if (Date.now() >= session.expiresAt.getTime()) {
      await this.sessions.upsert({
        id: session.id,
        isDisposed: true
      });

      return null;
    }

    return session;
  }
  
  async verifySessionFromAccessToken(token: string, csrfToken: string): Promise<Session | null> {
    const res = await this.em.createQueryBuilder(Session)
      .update({
        csrfToken: nanoid()
      })
      .where({
        accessToken: token,
        csrfToken,
        expiresAt: {
          $gte: new Date()
        },
        isDisposed: false
      })
      .returning("*")
      .getSingleResult()

    if (res) {
      res.user = await this.users.getUserFromId(res.user.id) ?? res.user;
    }

    return res;
  }
}
