import { ESBUILD_BINARY } from "../config/server.ts";
import { BuildOptions, Result } from "../interface.ts";
import LZUTF8 from "https://esm.sh/lzutf8@0.6.3/";

function compressText(str: string) {
  return LZUTF8.compress(str, { outputEncoding: "Base64" });
}
function decompressText(str: string) {
  return LZUTF8.decompress(str, { inputEncoding: "Base64" });
}

function addReactCodeRuntime(code: string) {
  return `
      ${code}
      window._REACT_ROOT_ = ReactDOM.createRoot(document.getElementById("root"))
      window._REACT_ROOT_.render(<App />)
    `;
}

export async function build(
  code: string,
  isPro: boolean = false,
): Promise<Result<string>> {
  const args = [
    "--loader=tsx",
    "--format=iife",
  ];
  if (isPro) {
    args.push("--minify");
  } else {
    args.push("--sourcemap=inline");
  }
  const command = new Deno.Command(ESBUILD_BINARY, {
    args: args,
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  const child = command.spawn();

  const writer = child.stdin.getWriter();
  await writer.write(
    new TextEncoder().encode(code),
  );
  await writer.releaseLock();
  await child.stdin.close();

  const ret = await child.output();

  const result = {
    data: "",
    error: "",
  };

  if (ret.stdout.length > 0) {
    result.data = new TextDecoder().decode(ret.stdout);
  } else if (ret.stderr.length > 0) {
    result.error = new TextDecoder().decode(ret.stderr);
  }

  return result;
}

export async function buildForPreview(code?: string) {
  if (!code) return "";

  const rawCode = decompressText(decodeURIComponent(code));
  const ret = await build(addReactCodeRuntime(rawCode), true);
  if (ret.data) {
    return ret.data;
  } else {
    return ret.error;
  }
}

export async function handleBuild(request: Request): Promise<Result<string>> {
  const result = {
    data: "",
    error: "",
  };

  try {
    const payload = await request.json() as BuildOptions;
    const ret = await build(addReactCodeRuntime(payload.code));
    Object.assign(result, ret);
  } catch (e) {
    result.error = e.message;
  }

  return result;
}
