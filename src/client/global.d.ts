import type { JSX } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
      className?: string;
    }
  }
}

interface Window {
  __SERVICE_URL__: string;
  __IS_DEV__: boolean;
}
