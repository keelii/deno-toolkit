import { BuildOptions, DifferOptions, FormatOptions } from "../../interface.ts";

export const SERVICE_URL = window.__SERVICE_URL__;

export const postFormat = async (options: FormatOptions) => {
  return fetch(SERVICE_URL + "api/format", {
    method: "POST",
    body: JSON.stringify(options),
  });
};
export const postDiff = async (options: DifferOptions) => {
  return fetch(SERVICE_URL + "api/diff", {
    method: "POST",
    body: JSON.stringify(options),
  });
};
export const postHash = async (msg: string | FormData, url: string = "") => {
  const message = url === "1" ? encodeURIComponent(msg) : msg;
  return typeof msg === "string"
    ? fetch(
      SERVICE_URL +
        `api/hash?msg=${message}&url=${url}`,
    )
    : fetch(SERVICE_URL + `api/hash`, {
      method: "POST",
      body: msg,
    });
};
export const postBuild = async (options: BuildOptions) => {
  return fetch(SERVICE_URL + "api/build", {
    method: "POST",
    body: JSON.stringify(options),
  });
};
