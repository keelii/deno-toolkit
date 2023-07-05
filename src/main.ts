import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import { ENV, PORT, STATIC_DIR } from "./config/server.ts";
import { route } from "./route.ts";

const handler = async (request: Request): Promise<Response> => {
  const pathname = new URL(request.url).pathname;
  const response = await route(pathname, request);
  return response;
};

console.log(`----- Server is running on port ${PORT} -----`);
console.log("- ENV:", ENV);
console.log("- STATIC_DIR:", STATIC_DIR);
console.log(`------------------------------------------`);

await serve(handler, { port: PORT });
