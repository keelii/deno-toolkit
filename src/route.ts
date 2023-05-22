import {
  ApiResponse,
  HtmlResponse,
  NotFoundResponse,
  StaticFileResponse,
} from "./Responses.ts";
import { IndexView } from "./views.ts";
import { handleFormat } from "./api/ApiFormat.ts";
import { handleDiff } from "./api/ApiDiff.ts";
import { handleHash } from "./api/ApiHash.ts";

export async function route(pathname: string, request: Request) {
  switch (pathname) {
    case "/favicon.ico":
      return StaticFileResponse.serve("favicon.ico");
    case "/":
      return new HtmlResponse(IndexView, { title: "Index" });
    case "/format":
      return new HtmlResponse(IndexView, { title: "Format" });
    case "/diff":
      return new HtmlResponse(IndexView, { title: "Diff" });
    case "/hash":
      return new HtmlResponse(IndexView, { title: "Hash" });
    case "/design":
      return new HtmlResponse(IndexView, { title: "Design" });
    case "/api/format":
      return ApiResponse.json(await handleFormat(request));
    case "/api/diff":
      return ApiResponse.json(await handleDiff(request));
    case "/api/hash":
      return ApiResponse.json(await handleHash(request));
    default:
      if (pathname.startsWith("/static")) {
        return StaticFileResponse.serve(pathname.slice(1));
      }
      return new NotFoundResponse();
  }
}
