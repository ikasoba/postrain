import { ConfigService } from "../services/ConfigService.js";
import { Router } from "../abstracts/router.js";
import { ApiConfig, ApiConfigSchema } from "../views/config.js";

export class ConfigController {
  constructor(
    private configService: ConfigService
  ) { }

  get register() {
    return (fastify: Router) => {
      fastify.get("/", {
        schema: {
          response: {
            200: ApiConfigSchema,
          },
        }
      }, async (req, reply) => {
        return new ApiConfig({
          "sign.isInviteCodeRequired": this.configService.get("sign.isInviteCodeRequired")
        });
      })
    }
  }
}
