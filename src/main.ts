import { serve } from "https://deno.land/std@0.184.0/http/server.ts";
import { PORT } from "./config.ts";
import { route } from "./route.ts";

const handler = async (request: Request): Promise<Response> => {
  const pathname = new URL(request.url).pathname;
  const response = await route(pathname, request);
  return response;
};

await serve(handler, { port: PORT });
console.log(`HTTP webserver running. Access it at: http://localhost:${PORT}/`);
