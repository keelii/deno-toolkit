import { Button } from "../components/Button.tsx";
import { Textarea } from "../components/Textarea.tsx";
import { Layout } from "../components/Layout.tsx";
import { createSignal } from "solid-js";
import { SelectField } from "../components/SelectField.tsx";

enum EncodingType {
  Base64 = "base64",
}
const EncodingTypes = [
  { value: EncodingType.Base64, label: "Base64", selected: true },
];

function toBase64(str: string) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
function fromBase64(str: string) {
  return decodeURIComponent(escape(window.atob(str)));
}

export default function Encoding() {
  const [input, setInput] = createSignal("");
  const [output, setOutput] = createSignal("");
  const [type, setType] = createSignal(EncodingType.Base64);

  const changeType = (e: Event) => {
    setType(e.target.value);
  };
  const process = () => {
    const t = type();
    switch (t) {
      case EncodingType.Base64:
        return {
          encode: () => toBase64(input()),
          decode: () => fromBase64(input()),
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
      <div className="flex items-center gap-2 p-2">
        <Textarea
          rows={10}
          value={input()}
          onInput={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <div className="space-y-2 w-28 flex flex-col">
          <SelectField
            value={type()}
            options={EncodingTypes}
            onChange={changeType}
          />
          <Button onClick={() => setOutput(process().encode())}>
            Encode →
          </Button>
          <Button onClick={() => setOutput(process().decode())}>
            Decode →
          </Button>
        </div>
        <Textarea
          rows={10}
          value={output()}
          onInput={(e) => setOutput(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
    </Layout>
  );
}
