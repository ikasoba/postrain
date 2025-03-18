import { HTMLProps } from "../../lib/HTMLProps";

export function Input(props: HTMLProps<"input">) {
  return (
    <input {...props} className={`border border-gray-400 rounded-lg p-1 px-2 ${props.className ?? ""}`} />
  );
}
