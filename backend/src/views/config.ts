import { z } from "zod";
import { Config } from "../services/ConfigService.js";

export interface ApiConfig {
  "sign.isInviteCodeRequired": boolean;
}

export class ApiConfig {
  constructor(self: Config) {
    this["sign.isInviteCodeRequired"] = !!self["sign.isInviteCodeRequired"];
  }
}

export const ApiConfigSchema = z.object({
  "sign.isInviteCodeRequired": z.boolean()
})
