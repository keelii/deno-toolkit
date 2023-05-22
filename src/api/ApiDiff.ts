import { diffChars, diffJson, diffLines } from "https://esm.sh/diff@5.1.0/";
import { htmlEscape } from "../utils.ts";
import { Result } from "../interface.ts";

export const EMPTY_DIFFER = "no diff";

export type DiffType = "chars" | "lines" | "json";
interface DifferFormProps {
  left: string;
  right: string;
  type: DiffType;
}

function diffContent(payload: DifferFormProps) {
  switch (payload.type) {
    case "chars":
      return diffChars(payload.left, payload.right);
    case "lines":
      return diffLines(payload.left, payload.right);
    case "json":
      return diffJson(JSON.parse(payload.left), JSON.parse(payload.right));
    default:
      return diffChars(payload.left, payload.right);
  }
}

export async function handleDiff(request: Request): Promise<Result<string>> {
  const result = {
    data: "",
    error: "",
  };

  try {
    const payload = await request.json() as DifferFormProps;
    const diff = diffContent(payload);
    let html = diff.reduce((acc, part) => {
      const cls = part.added ? "c-add" : part.removed ? "c-del" : "c-unchanged";
      return acc += `<u class="${cls}">${htmlEscape(part.value)}</u>`;
    }, "");
    if (diff.length === 1 && diff[0].value === "" && diff[0].count === 0) {
      html = EMPTY_DIFFER;
    }
    result.data = html;
  } catch (e) {
    result.error = e.message;
    console.warn(e.message);
  }
  return result;
}
