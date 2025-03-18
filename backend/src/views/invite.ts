import { z } from "zod";
import { Invite } from "../entities/invite.entity.js";
import { ApiUser, ApiUserSchema } from "./user.js";

export interface ApiInvite {
  id: string;
  count: number;
  issuer: ApiUser;
  usedBy: ApiUser[];
  createdAt: Date;
}

export class ApiInvite {
  constructor(self: Invite) {
    this.id = self.id.toString();
    this.count = self.count;
    this.issuer = new ApiUser(self.issuer);
    this.usedBy = self.usedBy.toArray().map(x => new ApiUser(x));
    this.createdAt = self.createdAt
  }
}

export const ApiInviteSchema = z.object({
  id: z.string(),
  count: z.number().int(),
  issuer: ApiUserSchema,
  usedBy: z.optional(ApiUserSchema),
  createdAt: z.date()
})

export interface ApiInviteWithCode extends ApiInvite {
  code: string;
}

export class ApiInviteWithCode extends ApiInvite {
  constructor(self: Invite & { code: string; }) {
    super(self)

    this.code = self.code;
  }
}

export const ApiInviteWithCodeSchema = ApiInviteSchema.extend({
  code: z.string()
})
