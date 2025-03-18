import "@fastify/websocket";
import { Router } from "../abstracts/router.js";
import WebSocket from "ws";
import { Notification, NotificationService } from "../services/NotificationService.js";
import { z } from "zod";

export class WebSocketController {
  constructor(
    private notify: NotificationService
  ) { }

  get register() {
    return (fastify: Router) => {
      fastify.get("/", {
        websocket: true
      }, (ws, req) => {
        const handler = (x: Notification) => {
          if (x.type == "post") {
            ws.send(JSON.stringify(x));
          }
        };

        this.notify.on("message", handler);

        ws.on("close", () => {
          this.notify.removeListener("message", handler);
        });
      })
    }
  }
}
