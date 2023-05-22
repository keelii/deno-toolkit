import { createEffect, createSignal, onCleanup } from "solid-js";

export function usePageTitle(title: string) {
  const [pageTitle, setPageTitle] = createSignal(title);

  createEffect(() => {
    document.title = pageTitle();
  });

  onCleanup(() => {
    document.title = "";
  });

  return [pageTitle, setPageTitle];
}
