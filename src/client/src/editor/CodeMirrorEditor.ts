import { EventEmitter } from "./EventEmmiter";
import { Compartment, EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { lintKeymap } from "@codemirror/lint";
import { EditorLang } from "../../../interface.ts";

const language = new Compartment();
const tabSize = new Compartment();
const indent = new Compartment();
const lineWrap = new Compartment();

export interface CodeMirrorEditorOptions {
  doc: string;
  lineNumbers: boolean;
  lineWrap: boolean;
  foldGutter: boolean;
  language: EditorLang;
}

const Defaults: CodeMirrorEditorOptions = {
  doc: "",
  lineNumbers: true,
  lineWrap: true,
  foldGutter: true,
  language: "javascript",
};

export class CodeMirrorEditor extends EventEmitter {
  private options: CodeMirrorEditorOptions;
  private lineWrap: boolean;
  private state: EditorState;
  private view: EditorView;
  private id: string;

  constructor(
    id: string,
    options: Partial<CodeMirrorEditorOptions> = {},
  ) {
    super();

    this.id = id;
    this.options = Object.assign({}, Defaults, options);
    this.lineWrap = this.options.lineWrap;

    const store = this.initStore();

    this.state = EditorState.create({
      doc: store || this.options.doc,
      extensions: [
        ...this.builtinExtensions,
        tabSize.of(EditorState.tabSize.of(4)),
        indent.of(indentUnit.of("\t")),
        this.updateListener,
      ],
    });
    this.view = new EditorView({
      state: this.state,
      // @ts-ignore
      parent: document.getElementById(id),
    });

    this.on("setContent", this.setContent.bind(this));
  }

  initStore() {
    const store = localStorage.getItem(this.id);
    if (store) {
      return store;
    } else {
      localStorage.setItem(this.id, this.options.doc);
    }
  }

  get value() {
    return this.view.state.doc.toString();
  }
  get updateListener() {
    return EditorView.updateListener.of((update: any) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        if (this.options.doc !== newValue) {
          localStorage.setItem(this.id, newValue);
          this.emit("change", newValue);
        }
      }
    });
  }

  get builtinExtensions() {
    const exts = [];
    if (this.options.lineNumbers) {
      exts.push(lineNumbers());
    }
    if (this.options.foldGutter) {
      exts.push(foldGutter());
    }

    switch (this.options.language) {
      case "javascript":
        exts.push(language.of(javascript()));
        break;
      case "json":
        exts.push(language.of(json()));
        break;
      case "html":
        exts.push(language.of(html()));
        break;
      case "jsx":
        exts.push(language.of(javascript({
          jsx: true,
        })));
        break;
      case "tsx":
        exts.push(language.of(javascript({
          jsx: true,
          typescript: true,
        })));
        break;
    }

    exts.push(
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      lineWrap.of(
        EditorView.contentAttributes.of({ "class": "cm-lineWrapping" }),
      ),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
      ]),
      keymap.of([indentWithTab]),
    );
    return exts;
  }

  setLanguage(lang: EditorLang) {
    let effects;
    switch (lang) {
      case "javascript":
        effects = language.reconfigure(javascript());
        break;
      case "json":
        effects = language.reconfigure(json());
        break;
      case "html":
        effects = language.reconfigure(html());
        break;
      case "md":
        effects = language.reconfigure(markdown());
    }

    this.view.dispatch({ effects });
  }
  setIndentConfig(size: number, isTab = false) {
    this.view.dispatch({
      effects: tabSize.reconfigure(EditorState.tabSize.of(size)),
    });
    this.view.dispatch({
      effects: indent.reconfigure(indentUnit.of(isTab ? "\t" : " ")),
    });
  }

  toggleLineWrap() {
    if (this.lineWrap) {
      this.view.dispatch({
        effects: lineWrap.reconfigure(
          EditorView.contentAttributes.of({ "class": "" }),
        ),
      });
      this.lineWrap = false;
    } else {
      this.view.dispatch({
        effects: lineWrap.reconfigure(
          EditorView.contentAttributes.of({ "class": "cm-lineWrapping" }),
        ),
      });
      this.lineWrap = true;
    }
  }

  setContent(text: string) {
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: text },
    });
  }
}
