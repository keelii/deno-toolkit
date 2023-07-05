import * as esbuild from "https://deno.land/x/esbuild@v0.18.11/wasm.js";
import { STATIC_DIR } from "../config/server.ts";
import { BuildOptions, Result } from "../interface.ts";

const pathname = new URL(STATIC_DIR, import.meta.url).pathname;
const esbuildWasm = await Deno.readFile(pathname + "/wasm/esbuild.wasm");
const wasmModule = new WebAssembly.Module(esbuildWasm);

await esbuild.initialize({
  wasmModule: wasmModule,
});

export async function build(code: string) {
  const result = await esbuild.transform(code, {
    sourcemap: "inline",
    loader: "tsx",
    format: "iife",
  });
  // console.log("result:", result);
  // esbuild.stop();
  return result;
}

// export async function decompressBuild(str: string) {
//   const code = LZUTF8.decompress(LZUTF8.decodeBase64(str));
//   const codeSample = `
//     ${code}
//     ReactDOM.createRoot(document.getElementById("root")).render(<App />)
//   `;
//
//   const ret = await build(codeSample);
//   return ret.code;
// }

export async function handleBuild(request: Request): Promise<Result<string>> {
  const result = {
    data: "",
    error: "",
  };

  try {
    const payload = await request.json() as BuildOptions;
    const codeSample = `
      ${payload.code}
      window._REACT_ROOT_ = ReactDOM.createRoot(document.getElementById("root"))
      window._REACT_ROOT_.render(<App />)
    `;
    const ret = await build(codeSample);
    if (ret.error) {
      result.error = ret.error;
    } else {
      result.data = ret.code;
    }
  } catch (e) {
    result.error = e.message;
  }

  return result;
}
