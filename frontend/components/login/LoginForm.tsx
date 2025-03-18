import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../form/input";
import { Button } from "../form/button";
import { encodeBase64 } from "../../lib/base64/base64";
import { useRouter } from "next/navigation";

export interface LoginFormData {
  username: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { handleSubmit, register, formState: { isValid, errors } } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (values) => {
    console.log(values, errors);

    const credential = encodeBase64(`${values.username}:${values.password}`);

    const res = await fetch(new URL("./sessions/login", process.env.API_HOST), {
      method: "POST",
      headers: {
        Authorization: `Basic ${credential}`
      }
    });

    if (!res.ok) {
      console.error(res);

      alert("失敗しました");
      
      return;
    }

    const session = await res.json<Record<string, string>>();
    console.log(session);

    localStorage.setItem("token", session.accessToken);
    localStorage.setItem("csrfToken", session.csrfToken);

    router.push("/");
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="username" type="text" {...register("username", { required: true })} />
      <Input placeholder="password" type="password" {...register("password", { required: true })} />
      <Button disabled={!isValid}>ログイン</Button>
    </form>
  );
}
