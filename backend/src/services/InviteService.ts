import { EntityRepository } from "@mikro-orm/core";
import { User } from "../entities/user.entity.js";
import { Invite } from "../entities/invite.entity.js";
import { Snowflake } from "../utils/sowflake.js";
import { ICredentialHashingService } from "../abstracts/CredentialHashingService.js";
import { generateSecureRandomId, generateSecureRandomIdLimited } from "../utils/secureRandomId.js";

export class InviteService {
  constructor(
    private invites: EntityRepository<Invite>,
    private hasher: ICredentialHashingService,
  ) {}

  async create(issuer: User, count: number, expiresAt: Date): Promise<Invite & { code: string; }> {
    const code = generateSecureRandomIdLimited(18)

    const createdAt = new Date()
    
    const invite = this.invites.create({
      id: Snowflake.generate(),
      codeHash: await this.hasher.digest(code),
      isExpired: count <= 0,
      count,
      createdAt,
      expiresAt,
      issuer,
      usedBy: []
    })

    await this.invites.getEntityManager().flush();

    return {
      ...invite,
      code: `${invite.id}.${code}`
    }
  }

  async getInviteFromCode(id: string, code: string) {
    const i = await this.invites.findOne({ id: BigInt(id), isExpired: false })
    if (!i) return null;
    
    if (!await this.hasher.verify(code, i?.codeHash)) {
      return null
    }

    return i
  }

  async take(id: bigint) {
    const i = await this.invites.findOne({ id, isExpired: false })
    if (!i) return false;

    await this.invites.nativeUpdate({ id }, { count: i.count - 1, isExpired: i.count <= 0 });

    return true;
  }

  async use(id: bigint, user: User) {
    const i = await this.invites.findOne({ id })
    if (!i) return false;

    i.usedBy.add(user)

    await this.invites.nativeUpdate({ id }, { usedBy: i.usedBy });

    return true;    
  }
}
