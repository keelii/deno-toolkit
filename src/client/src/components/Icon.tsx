import { Component, splitProps } from "solid-js";
import { BaseSize } from "./interface.ts";

const icons = {
  "code-bracket":
    `<path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />`,
  "clipboard":
    `<path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />`,
  "close":
    `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />`,
  "check":
    `<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />`,
  "success":
    `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
  "warning":
    `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />`,
  "error":
    `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />`,
  "info":
    `<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />`,
  "upload":
    `<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />`,
  "format":
    `<path d="M9 21H8c-1.105 0-2-.894-2-1.999V14c0-1-1.5-2-1.5-2S6 11 6 10V5a2 2 0 012-2h1M15 21h1c1.105 0 2-.894 2-1.999V14c0-1 1.5-2 1.5-2S18 11 18 10V5a2 2 0 00-2-2h-1" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`,
  "diff":
    `<path d="M12 3h8.4a.6.6 0 01.6.6v16.8a.6.6 0 01-.6.6H12m0-18H3.6a.6.6 0 00-.6.6v16.8a.6.6 0 00.6.6H12m0-18v18" stroke="#000000" stroke-width="1.5"></path>`,
  "hash":
    `<path d="M4 19V5a2 2 0 012-2h13.4a.6.6 0 01.6.6v13.114" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
          <path d="M14 10h.4a.6.6 0 01.6.6v2.8a.6.6 0 01-.6.6H9.6a.6.6 0 01-.6-.6v-2.8a.6.6 0 01.6-.6h.4m4 0V8c0-.667-.4-2-2-2s-2 1.333-2 2v2m4 0h-4" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M6 17h14M6 21h14" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
          <path d="M6 21a2 2 0 110-4" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`,
  "codec":
    `<path d="M17 20V4m0 0l3 3m-3-3l-3 3M7 4v16m0 0l3-3m-3 3l-3-3" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`,
  "design":
    `<path d="M5.212 15.111l-2.687-2.687a.6.6 0 010-.848l2.687-2.687a.6.6 0 01.848 0l2.687 2.687a.6.6 0 010 .848L6.06 15.111a.6.6 0 01-.848 0zM11.576 21.475l-2.687-2.687a.6.6 0 010-.849l2.687-2.687a.6.6 0 01.848 0l2.687 2.687a.6.6 0 010 .849l-2.687 2.687a.6.6 0 01-.848 0zM11.576 8.748L8.889 6.06a.6.6 0 010-.848l2.687-2.687a.6.6 0 01.848 0l2.687 2.687a.6.6 0 010 .848l-2.687 2.688a.6.6 0 01-.848 0zM17.94 15.111l-2.687-2.687a.6.6 0 010-.848l2.687-2.687a.6.6 0 01.848 0l2.687 2.687a.6.6 0 010 .848l-2.687 2.687a.6.6 0 01-.848 0z" stroke="#000000" stroke-width="1.5"></path>`,
};

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: BaseSize;
  className?: string;
  onClick?: () => void;
}

const sizes: Record<BaseSize, string> = {
  xs: "w-5 h-5",
  sm: "w-6 h-6",
  md: "w-7 h-7",
  lg: "w-8 h-8",
  xl: "w-9 h-9",
};

export const Icon: Component<IconProps> = (props: IconProps) => {
  const [local, rest] = splitProps(props, [
    "size",
    "className",
    "name",
  ]);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      // className="w-9"
      className={`${local.className || ""} ${sizes[local.size || "xs"]}`}
      innerHTML={icons[local.name]}
      {...rest}
    />
  );
};
