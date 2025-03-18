import { Redis } from "ioredis";
import { z } from "zod";

export const InboxPost = z.object({
  type: z.literal("post"),
  id: z.string(),
  pushedAt: z.number()
})

export const InboxItem = InboxPost;
export type InboxItem = z.infer<typeof InboxItem>;

export class InboxService {
  constructor(
    private redis: Redis
  ) { }

  async push(items: InboxItem[]) {
    await this.redis.lpush(`global_inbox`, ...items.map(x => JSON.stringify(x)));
    await this.redis.ltrim(`global_inbox`, 0, 256);
  }

  async *seek(max = -1) {
    const rawItems = await this.redis.lrange(`global_inbox`, 0, max);

    for (const raw of rawItems) {
      const res = InboxItem.safeParse(JSON.parse(raw));
      if (!res.success) continue;

      yield res.data;
    }
  }
}
