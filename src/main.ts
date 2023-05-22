import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import {ENV, PORT, STATIC_DIR} from "./config.ts"
import { route } from "./route.ts";

const handler = async (request: Request): Promise<Response> => {
  const pathname = new URL(request.url).pathname;
  const response = await route(pathname, request);
  return response;
};

console.log("ENV:", ENV)
console.log("STATIC_DIR:", STATIC_DIR)
await serve(handler, { port: PORT });
console.log(`HTTP webserver running. Access it at: http://localhost:${PORT}/`);
