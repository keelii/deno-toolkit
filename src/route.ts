import {
  ApiResponse,
  HtmlResponse,
  NotFoundResponse,
  PreviewResponse,
  StaticFileResponse,
} from "./Responses.ts";
import {
  CompressView,
  IndexView,
  PlaygroundView,
  PreviewView,
} from "./views.ts";
import { handleFormat } from "./api/ApiFormat.ts";
import { handleDiff } from "./api/ApiDiff.ts";
import { handleHash } from "./api/ApiHash.ts";
import { buildForPreview, handleBuild } from "./api/ApiBuild.ts";

export async function route(url: URL, request: Request) {
  const pathname = url.pathname;
  switch (pathname) {
    case "/favicon.ico":
      return StaticFileResponse.serve("favicon.ico");
    case "/":
      return Response.redirect(request.url + "format");
    case "/format":
      return new HtmlResponse(IndexView, { title: "Format" });
    case "/diff":
      return new HtmlResponse(IndexView, { title: "Diff" });
    case "/hash":
      return new HtmlResponse(IndexView, { title: "Hash" });
    case "/codec":
      return new HtmlResponse(IndexView, { title: "Codec" });
    case "/compress":
      return new HtmlResponse(CompressView, { title: "Compress/Decompress" });
    case "/design":
      return new HtmlResponse(IndexView, { title: "Design" });
    case "/preview":
      return new PreviewResponse(PreviewView, {
        title: "Preview",
        code: await buildForPreview(url.searchParams.get("code") || ""),
      });
    case "/playground":
      return new HtmlResponse(PlaygroundView, {
        title: "Playground",
      });
    case "/api/format":
      return ApiResponse.json(await handleFormat(request));
    case "/api/diff":
      return ApiResponse.json(await handleDiff(request));
    case "/api/hash":
      return ApiResponse.json(await handleHash(request));
    case "/api/build":
      return ApiResponse.json(await handleBuild(request));
    default:
      if (pathname.startsWith("/static")) {
        return StaticFileResponse.serve(pathname.slice(8));
      }
      return new NotFoundResponse();
  }
}
