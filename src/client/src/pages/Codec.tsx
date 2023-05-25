import { Button } from "../components/Button.tsx";
import { Textarea } from "../components/Textarea.tsx";
import { Layout } from "../components/Layout.tsx";
import { createSignal } from "solid-js";
import { SelectField } from "../components/SelectField.tsx";
import {ButtonGroup} from "../components/ButtonGroup.tsx"

enum CodecType {
  Base64 = "base64",
  Unicode = "unicode",
}
const CodecTypes = [
  { value: CodecType.Base64, label: "Base64", selected: true },
  { value: CodecType.Unicode, label: "Unicode" },
];

function toBase64(str: string) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
function fromBase64(str: string) {
  return decodeURIComponent(escape(window.atob(str)));
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

export default function Codec() {
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  const [type, setType] = createSignal(CodecType.Base64);

  const process = () => {
    const t = type();
    switch (t) {
      case CodecType.Base64:
        return {
          encode: () => toBase64(input()),
          decode: () => fromBase64(input()),
        };
      case CodecType.Unicode:
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
            Encode ↓
          </Button>
          <Button onClick={() => setOutput(process().decode())}>
            Decode ↓
          </Button>
          <ButtonGroup
            value={type()}
            options={CodecTypes}
            onChange={setType}
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
