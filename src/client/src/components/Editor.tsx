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
  onLoad: (value: string) => void;
}
export default function Editor(props: EditorProps) {
  const [local, rest] = splitProps(props, [
    "name",
    "doc",
    "className",
    "editorLang",
    "onChange",
    "onLoad",
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
    if (window.__doc__) {
      editor.setContent(window.__doc__);
    }
    if (typeof local.onLoad === "function") {
      local.onLoad(editor.state.doc.toString());
    }
  });

  return <div id={id} className={`h-full ${local.className || ""}`} />;
}
