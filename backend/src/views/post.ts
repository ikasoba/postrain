import { z } from "zod";
import { Post } from "../entities/post.entity.js";
import { ApiUser, ApiUserSchema } from "./user.js";

export interface ApiPost {
  id: string;
  content: string;
  author?: ApiUser;
  createdAt: Date;
  x: number;
  y: number;
}

export class ApiPost {
  constructor(self: Post) {
    const author = self.author;
    
    this.id = self.id.toString();
    this.content = self.content;
    this.author = author ? new ApiUser(author) : undefined;
    this.createdAt = self.createdAt;

    this.x = self.x;
    this.y = self.y;
  }
}

export const ApiPostSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.optional(ApiUserSchema),
  createdAt: z.date(),
  x: z.number(),
  y: z.number()
})
