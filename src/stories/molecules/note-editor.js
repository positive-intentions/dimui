import { html, define, useState, useScope } from "@positive-intentions/dim";
import { NoteEditor } from "../../demos/notes/note-editor.js";
import { SAMPLE_NOTE, SAMPLE_FOLDERS } from "../fixtures.js";

void NoteEditor;

const EmptyDemo = define({
  tag: "dimui-story-note-editor-empty",
  component: (_, { html: tpl, useScope: scope }) => {
    scope({ NoteEditor });
    return tpl`
      <div style="min-height:100vh;background:var(--dimui-doc-bg,#0f172a)">
        <dimui-note-editor
          .props="${{
            note: null,
            folders: SAMPLE_FOLDERS,
            saveStatus: "",
            onChange: () => {},
            onTrash: () => {},
          }}"
        />
      </div>
    `;
  },
});

const EditingDemo = define({
  tag: "dimui-story-note-editor-editing",
  component: (_, { html: tpl, useState: state, useScope: scope }) => {
    scope({ NoteEditor });
    const [note, setNote] = state({ ...SAMPLE_NOTE });
    return tpl`
      <div style="min-height:100vh;background:var(--dimui-doc-bg,#0f172a)">
        <dimui-note-editor
          .props="${{
            note,
            folders: SAMPLE_FOLDERS,
            saveStatus: "Saved",
            onChange: setNote,
            onTogglePin: () =>
              setNote({ ...note, pinned: !note.pinned }),
            onMoveFolder: (_id, folderId) =>
              setNote({ ...note, folderId }),
            onTrash: () => {},
            onRestore: () => {},
            onDeleteForever: () => {},
          }}"
        />
      </div>
    `;
  },
});

const SavingDemo = define({
  tag: "dimui-story-note-editor-saving",
  component: (_, { html: tpl, useState: state, useScope: scope }) => {
    scope({ NoteEditor });
    const [note, setNote] = state({ ...SAMPLE_NOTE });
    return tpl`
      <div style="min-height:100vh;background:var(--dimui-doc-bg,#0f172a)">
        <dimui-note-editor
          .props="${{
            note,
            folders: SAMPLE_FOLDERS,
            saveStatus: "Saving…",
            onChange: setNote,
            onTogglePin: () => {},
            onMoveFolder: () => {},
            onTrash: () => {},
          }}"
        />
      </div>
    `;
  },
});

export default {
  title: "Molecules/Note editor",
};

export const Empty = {
  render: () =>
    html`<dimui-story-note-editor-empty />`,
};

export const Editing = {
  render: () =>
    html`<dimui-story-note-editor-editing />`,
};

export const Saving = {
  render: () =>
    html`<dimui-story-note-editor-saving />`,
};

void EmptyDemo;
void EditingDemo;
void SavingDemo;
