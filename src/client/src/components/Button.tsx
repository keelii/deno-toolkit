import type { ParentComponent } from "solid-js";
import { BaseSize } from "./interface.ts";

type ButtonType = "primary" | "secondary" | "dark" | "tertiary" | "soft";

interface ButtonProps {
  type?: ButtonType;
  icon?: boolean;
  rounded?: boolean;
  size?: BaseSize;
  onClick?: () => void;
  className?: string;
}

const sizes: [Record<BaseSize, string>, Record<BaseSize, string>] = [{
  xs: "px-2 py-1 text-xs",
  sm: "px-2 py-1 text-sm",
  md: "px-2.5 py-1.5 text-md",
  lg: "px-3 py-2 text-lg",
  xl: "px-3.5 py-2.5 text-xl",
}, {
  xs: "px-1 py-1 text-xs",
  sm: "px-2 py-2 text-sm",
  md: "px-2.5 py-2.5 text-md",
  lg: "px-3 py-3 text-lg",
  xl: "px-3.5 py-3.5 text-xl",
}];

const types = {
  primary:
    "font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
  secondary:
    "font-semibold bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
  tertiary:
    "font-semibold bg-transparent text-indigo-600 hover:text-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
  dark: "font-semibold bg-white/10 text-white shadow-sm hover:bg-white/20",
  soft:
    "font-semibold bg-indigo-50 text-indigo-600 shadow-sm hover:bg-indigo-100",
};

export const Button: ParentComponent<ButtonProps> = (props) => {
  const {
    type = "primary",
    size = "md",
    icon = false,
    rounded = false,
    children,
    onClick,
    className = "",
  } = props;
  let roundedClass = "";

  if (size === "xs" || size === "sm") {
    roundedClass = "rounded";
  } else {
    roundedClass = "rounded-md";
  }
  if (rounded) {
    roundedClass = "rounded-full";
  }

  const buttonClass = `inline-flex items-center ${roundedClass} ${
    types[type]
  } ${sizes[+icon][size]} ${className}`;

  return (
    <button type="button" className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};
