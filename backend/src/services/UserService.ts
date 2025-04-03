import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { User } from "../entities/user.entity.js";
import { ICredentialHashingService } from "../abstracts/CredentialHashingService.js";
import { Snowflake } from "../utils/sowflake.js";
import { InviteService } from "./InviteService.js";
import { ConfigService } from "./ConfigService.js";

export class UserService {
  constructor(
    private em: EntityManager,
    private hasher: ICredentialHashingService,
    private users: EntityRepository<User>,
    private invite: InviteService,
    private config: ConfigService
  ) { }

  async create(name: string, password: string, ipAddresses: string[] = [], inviteCode?: string): Promise<User | null> {
    if (this.config.get("sign.isInviteCodeRequired")) {
      if (!inviteCode) {
        return null
      }
      
      const [id, code] = inviteCode.split(".")
      
      const i = await this.invite.getInviteFromCode(id, code)
      if (!i) return null;

      if (!await this.invite.take(i.id)) {
        return null;
      }
    }
    
    return await this.em.createQueryBuilder(User)
      .insert({
        id: Snowflake.generate(),
        name,
        passwordHash: await this.hasher.digest(password),
        ipAddresses,
        createdAt: new Date(),
      })
      .returning("*")
      .onConflict("name").ignore().getSingleResult();
  }

  async getUserFromId(id: bigint): Promise<User | null> {
    return await this.users.findOne({ id });
  }

  async getUserFromPasswordCredential(name: string, password: string): Promise<User | null> {
    const user = await this.users.findOne({
      name
    });

    if (user && await this.hasher.verify(password, user.passwordHash)) {
      return user;
    }

    return null;
  }
}
