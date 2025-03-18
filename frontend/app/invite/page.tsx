"use client";
import { CreateInviteForm } from "@/components/invite/CreateInviteForm";
import { ClientProvider } from "@/hooks/client";

export default function InvitePage() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <ClientProvider>
        <CreateInviteForm />
      </ClientProvider>
    </div>
  );
}
