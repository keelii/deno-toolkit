import { createEffect, onMount, splitProps } from "solid-js";
import {
  CodeMirrorEditor,
  CodeMirrorEditorOptions,
} from "../editor/CodeMirrorEditor.ts";

interface EditorProps extends CodeMirrorEditorOptions {
  name: string;
  className?: string;
  onChange: (value: string) => void;
}
export default function Editor(props: EditorProps) {
  const [local, rest] = splitProps(props, [
    "name",
    "doc",
    "className",
    "onChange",
  ]);
  const id = `cm-editor-${local.name}`;
  let editor: CodeMirrorEditor;

  createEffect(() => {
    const doc = local.doc;
    if (editor) {
      editor.setContent(doc);
    }
  });

  onMount(() => {
    editor = new CodeMirrorEditor(id, {
      doc: local.doc,
      ...rest,
    });
    editor.on("change", (value) => {
      local.onChange(value);
    });
  });

  return (
    <div id={id} className={`h-full ${local.className || ""}`}>
    </div>
  );
}
