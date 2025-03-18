import { EntityRepository } from "@mikro-orm/core";
import { Post } from "../entities/post.entity.js";
import { Snowflake } from "../utils/sowflake.js";
import { NotificationService } from "../services/NotificationService.js";
import { ApiPost } from "../views/post.js";
import { EntityManager } from "@mikro-orm/postgresql";
import { UserService } from "./UserService.js";

export interface IPostCreatable {
  author: { id: bigint; };
  content: string;
  ipAddress: string;
}

export class PostService {
  constructor(
    private em: EntityManager,
    private users: UserService,
    private posts: EntityRepository<Post>,
    private notify: NotificationService
  ) {}

  async getPostFromId(id: bigint): Promise<Post | null> {
    return await this.posts.findOne({ id });
  }
  
  async getPostFromIdBulk(ids: bigint[]): Promise<Post[]> {
    return await this.posts.find({ id: { $in: ids } });
  }
  
  async publish(post: IPostCreatable): Promise<Post> {
    const res = this.posts.create({
      id: Snowflake.generate(),
      content: post.content,
      author: post.author.id,
      ipAddress: post.ipAddress,
      createdAt: new Date(),
      x: Math.random(),
      y: Math.random()
    });

    if (res?.author) {
      res.author = await this.users.getUserFromId(res.author.id) ?? undefined;
    }

    await this.em.flush()

    this.notify.push({
      type: "post",
      data: new ApiPost(res)
    });

    return res;
  }
}
