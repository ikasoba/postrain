import { HTMLProps } from "../../lib/HTMLProps";

export function Button(props: HTMLProps<"button">) {
  return (
    <button {...props} className={`min-w-20 border border-slate-50 bg-slate-200 rounded-2xl p-1 px-2 shadow-md hover:bg-slate-300 active:bg-slate-200 disabled:pointer-events-none disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none ${props.className ?? ""}`} />
  );
}
