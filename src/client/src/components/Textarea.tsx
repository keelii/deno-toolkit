import type { Component } from "solid-js";
import { splitProps } from "solid-js";
import { BaseSize } from "./interface.ts";

const sizes: Record<BaseSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-2 py-1 text-sm",
  md: "px-2.5 py-1.5 text-md",
  lg: "px-3 py-2.5 text-lg",
  xl: "px-3.5 py-2.5 text-xl",
};

interface TextareaProps {
  rows?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onInput?: (e: Event) => void;
  readonly?: boolean;
  size?: BaseSize;
  title?: string;
}

export const Textarea: Component<TextareaProps> = function (
  props: TextareaProps,
) {
  const [local, rest] = splitProps(props, [
    "size",
    "rows",
    "className",
    "placeholder",
    "value",
    "onInput",
  ]);

  let classNames =
    "min-h-fullblock w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";
  if (!props.readonly) {
    classNames +=
      " focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500";
  }
  return (
    <textarea
      rows={local.rows || "1"}
      className={`${sizes[local.size || "md"]} ${classNames} ${
        local.className || ""
      }`}
      placeholder={local.placeholder || ""}
      value={local.value}
      onInput={local.onInput}
      {...rest}
    />
  );
};
