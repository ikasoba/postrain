import { JSX } from "react/jsx-runtime";

export type HTMLProps<K extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[K];
