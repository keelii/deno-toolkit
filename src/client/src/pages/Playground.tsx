import { Layout } from "../components/Layout.tsx";
import Editor from "../components/Editor.tsx";
import {createSignal, onMount} from "solid-js"
import { debounce } from "../../utils.ts";
import { postBuild, postFormat } from "../Service.ts";
import { errorToast } from "../components/Toast.tsx";
import { Button } from "../components/Button.tsx";
import { Icon } from "../components/Icon.tsx";
import { Result } from "../../../interface.ts";
import {DefaultFormatOptions, IframeLayout, MiniResetCss, WysiwygCss} from "../const.ts"

const CODE_TEMPLATE = `// Must have an <App /> Component
export function App() {
	return (
		<div>App Hello</div>
	)
}`;

export default function Playground() {
  const [code, setCode] = createSignal(CODE_TEMPLATE);

  let iframe;
  let inputBuffer = code();

  const writeIframeContent = (content) => {
    const win = iframe.contentWindow
    const doc = iframe.contentDocument || win.document;
    const get = (id) => doc.getElementById(id);

    win._REACT_ROOT_?.unmount()
    get("script")?.remove()

    const script = doc.createElement('script');
    script.id = "script"
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
    iframe.contentWindow.document.write(IframeLayout)
    iframe.contentWindow.document.close();
  });


  return (
    <Layout>
      <div className="flex h-screen">
        <div className="w-1/2 relative">
          <Editor
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
        </div>
        <div className="border-x-2"></div>
        <div className="w-1/2">
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
