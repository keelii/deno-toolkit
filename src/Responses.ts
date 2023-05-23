import { render } from "./views.ts";
import { lookup } from "https://deno.land/x/media_types/mod.ts";
import { resolve } from "https://deno.land/std@0.140.0/path/mod.ts";
import { CORS_ALLOW_ORIGIN, IS_DEV, STATIC_DIR } from "./config.ts";

const BaseHeaders = IS_DEV
  ? {
    "Access-Control-Allow-Origin": CORS_ALLOW_ORIGIN,
  }
  : {} as HeadersInit;

export class NotFoundResponse extends Response {
  constructor() {
    super(null, { status: 404 });
  }
}
export class ServerErrorResponse extends Response {
  constructor(message?: string) {
    super(message || null, { status: 500 });
  }
}

export class ApiResponse extends Response {
  static json(data: unknown, init?: ResponseInit): Response {
    return Response.json(data, {
      headers: {
        ...BaseHeaders,
      },
      ...init,
    });
  }
}
export class HtmlResponse extends Response {
  constructor(html: string, data: Record<string, any>, init?: ResponseInit) {
    super(render(html, data), {
      headers: { "content-type": "text/html; charset=UTF-8" },
      ...init,
    });
  }
}

export class StaticFileResponse extends Response {
  static async serve(filename: string) {
    const file = resolve(
      new URL(STATIC_DIR, import.meta.url).pathname,
      filename,
    );

    let fileSize;
    let body;
    try {
      fileSize = (await Deno.stat(file)).size;
      body = (await Deno.open(file)).readable;
    } catch (e) {
      console.error(e);
      if (e instanceof Deno.errors.NotFound) {
        return new NotFoundResponse();
      }
      return new ServerErrorResponse();
    }

    return new StaticFileResponse(body, {
      headers: {
        "content-length": fileSize.toString(),
        "content-type": lookup(file) || "application/octet-stream",
      },
    });
  }
}
