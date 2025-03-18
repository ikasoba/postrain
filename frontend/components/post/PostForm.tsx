import { SubmitHandler, useForm } from "react-hook-form";
import { useApiClient } from "../../hooks/client";
import { Input } from "../../components/form/input"
import { Button } from "../form/button";

export interface PostFormData {
  content: string;
}

function arc(startDeg: number, endDeg: number, size: number, borderWeight: number) {
  const sr = startDeg / 180 * Math.PI
  const er = endDeg / 180 * Math.PI
  const x1 = size + size * Math.cos(sr)
  const y1 = size + size * Math.sin(sr)
  const x2 = size + size * Math.cos(er)
  const y2 = size + size * Math.sin(er)

  const dx = x2 - x1
  const dy = y2 - y1

  const f1 = Math.abs(endDeg - startDeg) >= 180 ? 1 : 0

  const sz = borderWeight * 2 + size * 2

  return {
    x: borderWeight + x1,
    y: borderWeight + y1,
    size: sz,
    angle: sr / Math.PI * 180,
    f1,
    dx,
    dy
  }
}

export function PostForm({ className }: { className?: string }) {
  const client = useApiClient();
  const { handleSubmit, register, reset, formState: { isValid }, watch } = useForm<PostFormData>();
  const content = watch("content") ?? "";

  const onSubmit: SubmitHandler<PostFormData> = async (values) => {
    await client?.fetch(new URL("./posts/", process.env.API_HOST), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: values.content
      })
    })

    reset()
  }

  console.log(content.length)

  const ratio = Math.min(1, content.length / 256)

  const sd = -90
  const ed = -90 + 359.99 * ratio

  const sz = 16
  const bw = 8

  const limitArc = arc(sd, ed, sz, bw)
  const bgArc = arc(0, 359.99, sz, bw)

  const size = 2 + limitArc.size

  return (
    <form className={`flex gap-2 ${className ?? ""}`} onSubmit={handleSubmit(onSubmit)}>
      <svg width={size} height={size}>
        <path
          d={`M ${1 + bgArc.x} ${1 + bgArc.y} a ${sz} ${sz} ${bgArc.angle} ${bgArc.f1} 1 ${bgArc.dx} ${bgArc.dy}`}
          stroke="lightgray"
          fill="none"
          strokeWidth={bw}
        />
        <path
          d={`M ${1 + limitArc.x} ${1 + limitArc.y} a ${sz} ${sz} ${limitArc.angle} ${limitArc.f1} 1 ${limitArc.dx} ${limitArc.dy}`}
          stroke={`hsl(${(1 - Math.min(1, ratio / 0.75)) * 45} 100% 70% / 1)`}
          fill="none"
          strokeWidth={bw}
        />
        {content.length >= 256 ? (<>
          <text x={size / 2} y={size / 2 + 5} fill="hsl(0 100% 70% / 1)" textAnchor="middle" fontSize="14" fontWeight="bold">
            {content.length - 256}
          </text>
        </>) : null}
      </svg>
      <Input type="text" autoComplete="off" {...register("content", { required: true, maxLength: 256 })} />
      <Button disabled={!isValid}>送信</Button>
    </form>
  )
}
