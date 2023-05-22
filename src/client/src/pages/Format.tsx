import { createSignal, lazy, onCleanup, onMount } from "solid-js";
import { ButtonGroup } from "../components/ButtonGroup.tsx";
import { CheckboxField } from "../components/CheckboxField.tsx";
import { Icon } from "../components/Icon.tsx";
import { postFormat } from "../Service.ts";
import { Button } from "../components/Button.tsx";
import { copyToClipboard } from "../../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { errorToast } from "../components/Toast.tsx";
import { FormatExt, Result, StoredFormatOptions } from "../../../interface.ts";

const Editor = lazy(() => import("../components/Editor.tsx"));

const storedFormatOptions: StoredFormatOptions = Object.assign({
  useTabs: false,
  useSemi: false,
  singleQuote: false,
  ext: "ts",
}, localStorage.getItem("formatOptions") || {});

export default function Format() {
  const [formatOptions, setFormatOptions] = createSignal(storedFormatOptions);
  const [content, setContent] = createSignal(
    "var a ='1';\nif(true){\nconsole.log(1)\n}",
  );

  const setFormatOption = (
    key: keyof StoredFormatOptions,
    value: any,
  ) => {
    setFormatOptions({ ...formatOptions(), [key]: value });
  };

  const doFormat = async () => {
    const response = await postFormat({
      ...formatOptions(),
      content: content(),
    });
    const result: Result<string> = await response.json();
    if (result.error) {
      errorToast(result.error);
    } else {
      setContent(result.data);
    }
    localStorage.setItem("formatOptions", formatOptions());
  };
  const mainWidth = "calc(100vw - 12rem - 2px)";
  const mainHeight = "calc(100vh - 4rem)";

  const reLayout = () => {
    const el = document.getElementById("editor-wrap");
    if (el) {
      el.style.width = mainWidth;
      el.style.height = mainHeight;
    }
  };

  let inputBuff = content();

  usePageTitle("Format");

  onMount(() => {
    window.addEventListener("resize", reLayout);
  });
  onCleanup(() => {
    window.removeEventListener("resize", reLayout);
  });

  return (
    <Layout>
      <div className="border-y h-16 flex">
        <div className="p-2 flex items-center gap-4">
          <Button
            size="sm"
            onClick={() => {
              setContent(inputBuff);
              doFormat().catch(console.error);
            }}
          >
            <Icon name="code-bracket" className="mr-1" />
            Format
          </Button>
          <Button
            type="secondary"
            size="sm"
            onClick={() => copyToClipboard(content())}
          >
            <Icon name="clipboard" className="mr-1" />
            Copy
          </Button>
          <ButtonGroup
            size="sm"
            options={[
              { label: "TypeScript", value: "ts" },
              { label: "JSON", value: "json" },
              { label: "Markdown", value: "md" },
            ]}
            selected={formatOptions().ext}
            onChange={(item) => setFormatOption("ext", item.value as FormatExt)}
          />
          <CheckboxField
            name="use-tabs"
            label="Use tabs"
            onChange={(checked) => {
              setFormatOption("useTabs", checked);
              doFormat().catch(console.error);
            }}
          />
          <CheckboxField
            name="use-semi"
            label="Use semi"
            onChange={(checked) => {
              setFormatOption("useSemi", checked);
              doFormat().catch(console.error);
            }}
          />
          <CheckboxField
            name="single-quote"
            label="Single quote"
            onChange={(checked) => {
              setFormatOption("singleQuote", checked);
              doFormat().catch(console.error);
            }}
          />
        </div>
      </div>
      <div
        id="editor-wrap"
        style={`width: ${mainWidth};height: ${mainHeight}`}
        className="overflow-y-auto"
      >
        <Editor
          name="format"
          doc={content()}
          onChange={(value) => inputBuff = value}
        />
      </div>
    </Layout>
  );
}
