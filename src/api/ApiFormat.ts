import { FormatOptions, Result } from "../interface.ts";
import { createFromBuffer } from "https://esm.sh/@dprint/formatter@0.2.0/";
import { STATIC_DIR } from "../config/server.ts";
import formatHtml from "https://esm.sh/html-format@1.1.2/";

const pathname = new URL(STATIC_DIR, import.meta.url).pathname;
const tsWasm = await Deno.readFile(pathname + "/wasm/typescript-0.84.4.wasm");
const jsonWasm = await Deno.readFile(pathname + "/wasm/json-0.17.2.wasm");
const mdWasm = await Deno.readFile(pathname + "/wasm/markdown-0.15.2.wasm");

const formatTs = createFromBuffer(tsWasm);
const formatJson = createFromBuffer(jsonWasm);
const formatMd = createFromBuffer(mdWasm);

function format(options: FormatOptions) {
  const filename = `file.${options.ext}`;
  switch (options.ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      formatTs.setConfig({ useTabs: options.useTabs }, {
        semiColons: options.useSemi ? "prefer" : "asi",
        quoteStyle: options.singleQuote ? "preferSingle" : "alwaysDouble",
      });
      return formatTs.formatText(filename, options.content);
    case "json":
      formatJson.setConfig({
        useTabs: options.useTabs,
      }, { quoteStyle: "alwaysDouble" });
      return formatJson.formatText(filename, options.content);
    case "md":
      return formatMd.formatText(filename, options.content);
    case "html":
      return formatHtml(
        options.content,
        options.useTabs ? "\t" : " ".repeat(2),
      );
  }
}

export async function handleFormat(request: Request): Promise<Result<string>> {
  const result = {
    data: "",
    error: "",
  };

  try {
    const payload = await request.json() as FormatOptions;
    result.data = format(payload);
  } catch (e) {
    result.error = e.message;
  }

  return result;
}
