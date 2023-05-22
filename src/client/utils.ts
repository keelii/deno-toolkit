export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function uuidv4() {
  if (typeof crypto !== undefined && crypto.randomUUID) {
    return crypto.randomUUID();
  } else {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16));
  }
}
export function shortUuid() {
  return uuidv4().split("-")[0];
}

export function isUrl(str: string) {
  return /^(http|https):\/\//.test(str);
}

export const copyToClipboard = function (text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};
export function debounce(func: () => void, wait: number, immediate?: boolean) {
  let timeout: number | null;
  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      // @ts-ignore
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout as number);
    timeout = setTimeout(later, wait);
    // @ts-ignore
    if (callNow) func.apply(context, args);
  };
}
