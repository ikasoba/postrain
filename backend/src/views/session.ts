import { z } from "zod";
import { Session } from "../entities/session.entity.js";
import { ApiUser, ApiUserSchema } from "./user.js";

export interface ApiSession {
  id: string;
  user: ApiUser;
  isDisposed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export class ApiSession {
  constructor(self: Session) {
    this.id = self.id.toString();
    this.user = new ApiUser(self.user);
    this.isDisposed = self.isDisposed;
    this.createdAt = self.createdAt;
    this.expiresAt = self.expiresAt;
  }
}

export const ApiSessionSchema = z.object({
  id: z.string(),
  user: ApiUserSchema,
  isDisposed: z.boolean(),
  createdAt: z.date(),
  expiresAt: z.date()
})

export interface ApiSessionWithCredential extends ApiSession {
  accessToken: string;
  csrfToken: string;
}

export class ApiSessionWithCredential extends ApiSession {
  constructor(self: Session) {
    super(self);

    this.accessToken = self.accessToken;
    this.csrfToken = self.csrfToken;
  }
}

export const ApiSessionWithCredentialSchema = ApiSessionSchema.extend({
  accessToken: z.string(),
  csrfToken: z.string()
})
