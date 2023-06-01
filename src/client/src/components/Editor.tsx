import { createEffect, onMount, splitProps } from "solid-js";
import {
  CodeMirrorEditor,
  CodeMirrorEditorOptions,
} from "../editor/CodeMirrorEditor.ts";
import { EditorLang } from "../../../interface.ts";

interface EditorProps extends Partial<CodeMirrorEditorOptions> {
  name: string;
  className?: string;
  editorLang?: EditorLang;
  onChange: (value: string) => void;
}
export default function Editor(props: EditorProps) {
  const [local, rest] = splitProps(props, [
    "name",
    "doc",
    "className",
    "editorLang",
    "onChange",
  ]);
  const id = `cm-editor-${local.name}`;
  let editor: CodeMirrorEditor;

  createEffect(() => {
    const doc = local.doc;
    if (editor) {
      editor.setContent(doc);
      editor.setLanguage(local.editorLang);
    }
  });

  onMount(() => {
    editor = new CodeMirrorEditor(id, {
      doc: local.doc,
      language: local.editorLang,
      ...rest,
    });
    editor.on("change", (value) => {
      local.onChange(value);
    });
  });

  return <div id={id} className={`h-full ${local.className || ""}`} />;
}
