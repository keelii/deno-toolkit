import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import {
  ENV,
  ESBUILD_BINARY,
  PORT,
  SITE_ROOT,
  STATIC_DIR,
} from "./config/server.ts";
import { route } from "./route.ts";

const handler = async (request: Request): Promise<Response> => {
  const response = await route(new URL(request.url), request);
  return response;
};

await serve(handler, {
  port: PORT,
  onListen: () => {
    console.log(`----- Server is running on port ${PORT} -----`);
    console.log("- ENV:", ENV);
    console.log("- STATIC_DIR:", STATIC_DIR);
    console.log("- ESBUILD_BINARY: ", ESBUILD_BINARY);
    console.log("- SITE_ROOT: ", SITE_ROOT);
    console.log(`------------------------------------------`);
  },
});
