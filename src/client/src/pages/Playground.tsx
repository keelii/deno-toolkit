import { createSignal, onMount } from "solid-js";
import Split from "split.js";
import { Layout } from "../components/Layout.tsx";
import Editor from "../components/Editor.tsx";
import { debounce } from "../../utils.ts";
import { postBuild, postFormat } from "../Service.ts";
import { errorToast } from "../components/Toast.tsx";
import { Button } from "../components/Button.tsx";
import { Icon } from "../components/Icon.tsx";
import { Result } from "../../../interface.ts";
import { DefaultFormatOptions, IframeLayout } from "../const.ts";

const CODE_TEMPLATE = `// Must have an <App /> Component
export function App() {
  return <div>App Hello</div>
}`;

function copyToClipboard(text) {
  let tempInput = document.createElement("input");
  tempInput.style = "position: absolute; left: -1000px; top: -1000px";
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

export default function Playground() {
  const [code, setCode] = createSignal(CODE_TEMPLATE);
  const url = new URL(location.href);

  let iframe;
  let inputBuffer = code();

  const writeIframeContent = (content) => {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument || win.document;
    const get = (id) => doc.getElementById(id);

    win._REACT_ROOT_?.unmount();
    get("script")?.remove();

    const script = doc.createElement("script");
    script.id = "script";
    script.textContent = content;

    doc.body.appendChild(script);
  };

  const doBuild = async () => {
    const response = await postBuild({
      code: inputBuffer,
    });
    const result = await response.json();
    if (result.error) {
      errorToast(result.error);
    } else {
      writeIframeContent(result.data);
    }
  };

  const handleChange = (value) => {
    inputBuffer = value;
    // setCode(value)
    doBuild().catch(console.error);
  };
  const debounceChange = debounce(handleChange, 500);

  const doFormat = async () => {
    const response = await postFormat({
      ...DefaultFormatOptions,
      content: inputBuffer,
    });
    const result: Result<string> = await response.json();
    if (result.error) {
      errorToast(result.error);
    } else {
      setCode(result.data);
    }
  };

  onMount(() => {
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(IframeLayout);
    iframe.contentWindow.document.close();

    Split(["#one", "#two"], {
      sizes: [50, 50],
      gutterSize: 6,
      gutter(index, direction) {
        const gutter = document.createElement("div");
        gutter.className =
          `cursor-col-resize bg-gray-200 gutter gutter-${direction}`;
        return gutter;
      },
    });
  });

  const empty = window.__LIVE_CODE__;

  return (
    <Layout empty={empty}>
      <div className="flex h-screen">
        <div id="one" className="w-1/2 relative">
          <Editor
            tabSize={2}
            editorLang={"tsx"}
            name={"playground"}
            doc={code()}
            onChange={debounceChange}
            onLoad={debounceChange}
          />
          <Button
            type="secondary"
            size="xs"
            className="absolute top-1 right-1 opacity-70 z-10"
            onClick={() => {
              doFormat().catch(console.error);
            }}
          >
            <Icon name="code-bracket" />
          </Button>
          <Button
            type="secondary"
            size="xs"
            className="absolute top-1 right-12 opacity-70 z-10"
            onClick={() => {
              const url = location.origin + "/preview?code=" +
                encodeURIComponent(compressText(inputBuffer));
              const yes = window.prompt(
                "按确认将复制下面的 URL 并在新页面打开：",
                url,
              );
              if (yes) {
                window.open(url);
              }
            }}
          >
            <Icon name="share" />
          </Button>
        </div>
        <div id="two" className="w-1/2">
          <iframe
            ref={iframe}
            src="about:blank"
            className="w-full h-full"
            frameborder="0"
          >
          </iframe>
        </div>
      </div>
    </Layout>
  );
}
