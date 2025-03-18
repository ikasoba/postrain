import { z } from "zod";
import fs from "fs/promises";

export const configSchema = z.object({
  "sign.isInviteCodeRequired": z.boolean()
})

export type Config = z.infer<typeof configSchema>

export class ConfigService {
  private config!: Config;
  
  async loadFrom(path: string) {
    this.config = configSchema.parse(JSON.parse(await fs.readFile(path, "utf-8")));
  }

  get<K extends keyof Config>(name: K): Config[K] {
    return this.config[name];
  }
}
