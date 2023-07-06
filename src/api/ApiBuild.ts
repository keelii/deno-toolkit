import { ESBUILD_BINARY } from "../config/server.ts";
import { BuildOptions, Result } from "../interface.ts";

export async function build(code: string): Promise<Result<string>> {
  const command = new Deno.Command(ESBUILD_BINARY, {
    args: [
      "--sourcemap=inline",
      "--loader=tsx",
      "--format=iife",
    ],
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
    Object.assign(result, ret);
  } catch (e) {
    result.error = e.message;
  }

  return result;
}
