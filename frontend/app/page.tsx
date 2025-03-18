"use client";

import { PostForm } from "@/components/post/PostForm";
import { Timeline } from "@/components/timeline/Timeline";
import { ClientProvider } from "@/hooks/client";

export default function Home() {
  return (
    <ClientProvider>
      <div className="flex flex-col justify-center items-center gap-4 p-4 py-8 h-full">
        <Timeline className="w-full h-full -z-10 absolute overflow-hidden" />
        <PostForm className="bg-white p-4 rounded-xl" />
      </div>
    </ClientProvider>
  );
}
