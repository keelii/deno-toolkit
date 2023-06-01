import { EditorLang, FormatExt } from "../../interface.ts";

export const enum NavType {
  Format = "format",
  Diff = "diff",
  Hash = "hash",
  Design = "design",
  Codec = "codec",
}

export const LanguageMap: Record<FormatExt, EditorLang> = {
  html: "html",
  js: "javascript",
  jsx: "javascript",
  ts: "javascript",
  tsx: "javascript",
  json: "json",
  md: "md",
};
