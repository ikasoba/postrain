import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../form/input";
import { Button } from "../form/button";
import { useApiClient } from "@/hooks/client";

export interface InviteFormData {
  count: number;
  expiresAt: Date;
}

export function CreateInviteForm() {
  const client = useApiClient();
  const { handleSubmit, register, formState: { isValid, errors } } = useForm<InviteFormData>();

  const onSubmit: SubmitHandler<InviteFormData> = async (values) => {
    console.log(values, errors);

    const res = await client?.fetch(new URL("./invites", process.env.API_HOST), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        count: values.count,
        expiresAt: values.expiresAt
      })
    });

    if (!res?.ok) {
      console.error(res);
      
      return;
    }

    const invite = await res.json<Record<string, object>>();
    console.log(invite)

    alert(`生成された招待コード: ${invite.code}`);
  }

  return (
    <form className="grid grid-cols-2 gap-2" onSubmit={handleSubmit(onSubmit)}>
      <label>
        利用可能な回数：
      </label>
      <Input type="number" min="1" {...register("count", { valueAsNumber: true, required: true })} />
      <label>
        無効化される時刻：
      </label>
      <Input type="datetime-local" {...register("expiresAt", { valueAsDate: true, required: true })} />
      <Button disabled={!isValid}>作成</Button>
    </form>
  );
}
