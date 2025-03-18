import { z } from "zod";
import { User } from "../entities/user.entity.js";

export interface ApiUser {
  id: string;
  name: string;
  createdAt: Date;
}

export class ApiUser {
  constructor(self: User) {
    this.id = self.id.toString();
    this.name = self.name;
    this.createdAt = self.createdAt;
  }
}

export const ApiUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date()
});
