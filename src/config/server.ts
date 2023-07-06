export const STATIC_DIR = Deno.env.get("STATIC_DIR") || "../static";
export const ESBUILD_BINARY = Deno.env.get("ESBUILD_BINARY") ||
  "/usr/local/bin/esbuild";
export const PORT = Deno.env.has("DENO_PORT")
  ? Number(Deno.env.get("DENO_PORT"))
  : 4000;
export const ENV = Deno.env.get("DENO_ENV") || "prd";
export const IS_DEV = ENV === "dev";
export const CORS_ALLOW_ORIGIN = "*";
