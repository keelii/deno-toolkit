import { Button } from "../components/Button.tsx";
import { Textarea } from "../components/Textarea.tsx";
import { Layout } from "../components/Layout.tsx";
import { createSignal } from "solid-js";
import { ButtonGroup } from "../components/ButtonGroup.tsx";

enum CompressType {
  Lzutf8 = "lzutf8",
  Brotli = "brotli",
}
const CompressTypes = [
  { value: CompressType.Lzutf8, label: "LZUTF8", selected: true },
  { value: CompressType.Brotli, label: "Brotli" },
];

function compressText(str) {
  return LZUTF8.compress(str, { outputEncoding: "Base64" });
}
function decompressText(str) {
  return LZUTF8.decompress(str, { inputEncoding: "Base64" });
}

function lzutf8Compress(str: string) {
  return window.compressText(str);
}
function lzutf8Decompress(str: string) {
  return window.decompressText(str);
}
function toUnicode(str: string) {
  let unicodeStr = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i).toString(16);
    unicodeStr += "\\u" + "0".repeat(4 - charCode.length) + charCode;
  }
  return unicodeStr;
}
function fromUnicode(str: string) {
  const regex = /\\u([\dA-F]{4})/gi;
  return str.replace(regex, (match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  });
}

export default function Compress() {
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  const [type, setType] = createSignal(CompressType.Lzutf8);

  const process = () => {
    const t = type();
    switch (t) {
      case CompressType.Lzutf8:
        return {
          encode: () => lzutf8Compress(input()),
          decode: () => lzutf8Decompress(input()),
        };
      case CompressType.Brotli:
        return {
          encode: () => toUnicode(input()),
          decode: () => fromUnicode(input()),
        };
      default:
        return {
          encode: () => input(),
          decode: () => input(),
        };
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center gap-2 p-2">
        <Textarea
          rows={10}
          value={input()}
          onInput={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <div className="space-x-2">
          <Button onClick={() => setOutput(process().encode())}>
            Compress ↓
          </Button>
          <Button onClick={() => setOutput(process().decode())}>
            Decompress ↓
          </Button>
          <ButtonGroup
            value={type()}
            options={CompressTypes}
            onChange={(o) => {
              setType(o.value);
            }}
          />
        </div>
        <Textarea
          readonly
          rows={10}
          value={output()}
          onInput={(e) => setOutput(e.target.value)}
          className="flex-1"
        />
      </div>
    </Layout>
  );
}
