import type { Component } from "solid-js";
import { createSignal, onCleanup } from "solid-js";
import { Icon, IconName } from "./Icon.tsx";
import { BaseStatus } from "./interface.ts";

interface ToastItem {
  tid: number;
  type: BaseStatus;
  title: string;
  content: string;
  timeout: number;
  close: (t: ToastItem) => void;
  pause: (t: ToastItem) => void;
  resume: (t: ToastItem) => void;
  closeBtn?: boolean;
}

const IconType: Record<BaseStatus, IconName> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

let id = 0;
const [toasts, setToasts] = createSignal<ToastItem[]>([]);

function removeToast(tid: number) {
  setToasts(toasts().filter((t: ToastItem) => t.tid !== tid));
}
function createToast(props: ToastProps): ToastItem {
  const { type = "info", title = "", content = "", timeout = 3000 } = props;
  const tid = id++;
  const needTimeout = timeout !== 0;

  return {
    tid,
    type,
    title,
    content,
    timeout: needTimeout
      ? window.setTimeout(() => removeToast(tid), timeout)
      : timeout,
    close: (t) => {
      if (needTimeout) {
        clearTimeout(t.timeout);
      }
      removeToast(t.tid);
    },
    pause: (t) => {
      if (needTimeout) {
        clearTimeout(t.timeout);
      }
    },
    resume: (t) => {
      if (needTimeout) {
        clearTimeout(t.timeout);
        setToasts(
          toasts().map((curr: ToastItem) =>
            curr.timeout === t.timeout
              ? {
                ...curr,
                timeout: window.setTimeout(() => removeToast(tid), timeout),
              }
              : curr
          ),
        );
      }
    },
  };
}

export function errorToast(content: string | ToastProps) {
  const toast = createToast(
    typeof content === "string" ? { type: "error", content } : content,
  );
  setToasts([...toasts(), toast]);
  return toast;
}
export function infoToast(content: string | ToastProps) {
  const toast = createToast(
    typeof content === "string" ? { type: "info", content } : content,
  );
  setToasts([...toasts(), toast]);
  return toast;
}
export function warningToast(content: string | ToastProps) {
  const toast = createToast(
    typeof content === "string" ? { type: "warning", content } : content,
  );
  setToasts([...toasts(), toast]);
  return toast;
}
export function successToast(content: string | ToastProps) {
  const toast = createToast(
    typeof content === "string" ? { type: "success", content } : content,
  );
  setToasts([...toasts(), toast]);
  return toast;
}
export function clearToast() {
  toasts().forEach((t: ToastItem) => t.close(t));
}

function ToastItem(props: ToastItem) {
  props.closeBtn = props.closeBtn || true;

  const iconClass: Record<BaseStatus, string> = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  return (
    <div
      onMouseEnter={() => props.pause(props)}
      onMouseLeave={() => props.resume(props)}
      className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon
              size="sm"
              className={iconClass[props.type]}
              name={IconType[props.type] || "info"}
            />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5 space-y-1">
            {props.title && (
              <p className="text-sm font-medium text-gray-900">
                {props.title} - {props.tid}
              </p>
            )}
            {props.content && (
              <p className="text-sm text-gray-500">{props.content}</p>
            )}
          </div>
          {props.closeBtn && (
            <div className="ml-4 flex flex-shrink-0">
              <Icon
                onClick={() => props.close(props)}
                className="cursor-pointer"
                name="close"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  type: BaseStatus;
  title?: string;
  content: string;
  timeout?: number;
}
export function Toast(props: ToastProps) {
  let toast: ToastItem;
  switch (props.type) {
    case "warning":
      toast = warningToast(props);
      break;
    case "error":
      toast = errorToast(props);
      break;
    case "success":
      toast = successToast(props);
      break;
    case "info":
    default:
      toast = infoToast(props);
  }
  return <></>;
}

export const ToastContainer: Component = () => {
  onCleanup(() => {
    toasts().forEach((t: ToastItem) => t.close(t));
  });

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-20"
    >
      <div
        className="flex w-full flex-col items-center space-y-4 sm:items-end z-20"
        id="notify-container"
      >
        {toasts().map((t: ToastItem) => <ToastItem {...t} />)}
      </div>
    </div>
  );
};
