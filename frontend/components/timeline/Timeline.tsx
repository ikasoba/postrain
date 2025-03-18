"use client";

import { useEffect, useRef, useState } from "react";
import { useApiClient } from "../../hooks/client"
import { Bubble } from "../bubble/bubble";

type Post = {
  id: string;
  author?: { name: string; };
  content: string;
  x: number;
  y: number;
  createdAt: number;
  opacity: number;
}

export function Timeline({ className }: { className?: string }) {
  const client = useApiClient();
  const [bubbles, setBubbles] = useState<Post[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect>(null);

  useEffect(() => {
    const id = setInterval(() => {
        setBubbles(bubbles => bubbles.map(x => ({ ...x, opacity: x.opacity - 0.1 })).filter(x => x.opacity > 0));
    }, 1000);

    return () => clearInterval(id);
  })

  useEffect(() => {
    if (!client) return;

    let ws: WebSocket;

    (async () => {
      ws = await client.ws(new URL("./ws", process.env.API_HOST));

      ws.addEventListener("message", x => {
        console.log(x.data);

        if (typeof x.data != "string") return;

        const o = JSON.parse(x.data);

        if ("type" in o && o.type == "post") {
          rect.current = container.current?.getBoundingClientRect() ?? null;
          if (!rect.current) return;

          const data = {
            ...o.data,
            opacity: 1,
            createdAt: new Date(o.data.createdAt).getTime(),
          }

          data.x = 0.05 + o.data.x * 0.95
          data.y = 0.05 + o.data.y * 0.95

          setBubbles(bubbles => bubbles.concat(data).slice(0, 512));
        }
      })
    })();

    return () => ws?.close();
  }, [client])

  return (
    <div ref={container} className={className}>{
      bubbles.map(x => (
        <div key={x.id} style={{ position: "absolute", left: `${x.x * (rect.current?.width ?? 0)}px`, top: `${x.y * (rect.current?.height ?? 0)}px`, opacity: x.opacity, transition: "1.25s opacity cubic-bezier(0.5, 0, 0.75, 0)" }}>
          <Bubble authorName={x.author?.name ?? "Unknown"} message={x.content} />
        </div>
      ))
    }</div>
  )
}
