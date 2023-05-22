import { createEffect, createSignal, lazy } from "solid-js";
import { postDiff, postFormat } from "../Service.ts";
import { Button } from "../components/Button.tsx";
import { Icon } from "../components/Icon.tsx";
import { ButtonGroup } from "../components/ButtonGroup.tsx";
import { Layout } from "../components/Layout.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { errorToast } from "../components/Toast.tsx";
import { Result } from "../../../interface.ts";

export type DiffType = "chars" | "lines" | "json";

// import Editor from "../components/Editor.tsx"
const Editor = lazy(() => import("../components/Editor.tsx"));

export default function Diff() {
  const [leftContent, setLeftContent] = createSignal(
    `{"foo": "bar"}`,
  );
  const [rightContent, setRightContent] = createSignal(
    `{"foo": "bar1"}`,
  );
  const [type, setType] = createSignal<DiffType>("chars");
  const [html, setHtml] = createSignal("no differ");

  const doDiff = async () => {
    const response = await postDiff({
      left: leftInputBuff,
      right: rightInputBuff,
      type: type(),
    });
    const result: Result<string> = await response.json();
    if (result.error) {
      errorToast(result.error);
    } else {
      setHtml(result.data);
    }
  };
  const doFormat = async (type: "left" | "right") => {
    const response = await postFormat({
      useTabs: false,
      useSemi: false,
      singleQuote: false,
      ext: "json",
      content: type === "left" ? leftContent() : rightContent(),
    });
    const result: Result<string> = await response.json();
    if (result.error) {
      errorToast(result.error);
    } else {
      if (type === "left") {
        setLeftContent(result.data);
      } else {
        setRightContent(result.data);
      }
    }
  };

  let leftInputBuff = leftContent();
  let rightInputBuff = rightContent();

  usePageTitle("Diff");

  createEffect(() => {
    doDiff().catch(console.error);
  });

  return (
    <Layout>
      <div className="flex h-1/2">
        <div className="w-1/2 border-r relative">
          {type() === "json" && (
            <Button
              type="secondary"
              size="xs"
              className="absolute top-1 right-1 opacity-70 z-10"
              onClick={() => {
                setLeftContent(leftInputBuff);
                doFormat("left").catch(console.error);
              }}
            >
              <Icon name="code-bracket" />
            </Button>
          )}
          <Editor
            name="diff-left"
            doc={leftContent()}
            onChange={(value) => {
              leftInputBuff = value;
              doDiff().catch(console.error);
            }}
          />
        </div>
        <div className="w-1/2 relative">
          {type() === "json" && (
            <Button
              type="secondary"
              size="xs"
              className="absolute top-1 right-1 opacity-70 z-10"
              onClick={() => {
                setRightContent(rightInputBuff);
                doFormat("right").catch(console.error);
              }}
            >
              <Icon name="code-bracket" />
            </Button>
          )}
          <Editor
            name="diff-right"
            doc={rightContent()}
            lineNumbers={false}
            foldGutter={false}
            onChange={(value) => {
              rightInputBuff = value;
              doDiff().catch(console.error);
            }}
          >
          </Editor>
        </div>
      </div>
      <div className="h-1/2">
        <div className="flex gap-2 border-y justify-center py-2">
          <ButtonGroup
            options={[
              { label: "Chars", value: "chars" },
              { label: "Lines", value: "lines" },
              { label: "JSON", value: "json" },
            ]}
            selected={type()}
            onChange={(item) => {
              setType(item.value as DiffType);
              doDiff().catch(console.error);
            }}
          />
        </div>
        <pre className="p-2" innerHTML={html()} />
      </div>
      {/*<Toast show={error} content={"dest"} />*/}
    </Layout>
  );
}
