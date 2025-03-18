"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { SignForm } from "@/components/sign/SignForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-xl font-bold">ログイン</h1>
      <div className="w-[25rem]">
        <LoginForm />
      </div>
      または 
      <h1 className="text-xl font-bold">登録</h1>
      <div className="w-[25rem]">
        <SignForm />
      </div>
    </div>
  );
}
