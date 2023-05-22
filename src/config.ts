export const PORT = 4000;
export const ENV = Deno.env.get("DENO_ENV") || "prd";
export const IS_DEV = ENV === "dev";
export const CORS_ALLOW_ORIGIN = "*";

export const HTML_LANG = "zh_CN";
export const CHARSET = "UTF-8";
