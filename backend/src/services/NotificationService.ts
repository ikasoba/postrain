import EventEmitter from "events";
import { ApiPost } from "../views/post.js";

export interface NotificationServiceEvents {
  message: [Notification];
}

export type Notification =
  | {
    type: "post";
    data: ApiPost;
  }

export class NotificationService extends EventEmitter<NotificationServiceEvents> {
  constructor() {
    super();
  }

  push(notify: Notification) {
    console.log("pushed", notify);
    console.log(this.emit("message", notify), this.listenerCount("message"));
  }
}
