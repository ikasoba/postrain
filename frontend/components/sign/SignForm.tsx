"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../form/input";
import { Button } from "../form/button";
import { encodeBase64 } from "../../lib/base64/base64";
import { useRouter } from "next/navigation";

export interface SignFormData {
  inviteCode?: string;
  username: string;
  password: string;
}

export function SignForm({ isInviteCodeRequired }: { isInviteCodeRequired: boolean; }) {
  const router = useRouter();
  const { handleSubmit, register, formState: { isValid, errors } } = useForm<SignFormData>();

  const onSubmit: SubmitHandler<SignFormData> = async (values) => {
    console.log(values, errors);

    const credential = encodeBase64(`${values.username}:${values.password}`);

    const res = await fetch(new URL("./users/sign", process.env.API_HOST), {
      method: "POST",
      headers: {
        Authorization: `Basic ${credential}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inviteCode: values.inviteCode
      })
    });

    if (!res.ok) {
      console.error(res);

      return;
    }

    const user = await res.json();

    console.log(user);

    alert("登録できました");
    
    router.push("/login");
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      { isInviteCodeRequired ? <Input placeholder="invite code" type="text" autoComplete="off" {...register("inviteCode", { required: false })} /> : null }
      <Input placeholder="username" type="text" {...register("username", { required: true })} />
      <Input placeholder="password" type="password" {...register("password", { required: true })} />
      <Button disabled={!isValid}>登録</Button>
    </form>
  );
}
