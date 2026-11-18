BP.module(
  "dimui/stories/molecules/note-editor",
  ["dimui/demos/notes/note-editor","dimui/stories/fixtures"],
  function (__dep0, __dep1) {
  const { html, define, useState, useScope } = Dim;
  const { NoteEditor } = __dep0;
  const { SAMPLE_NOTE, SAMPLE_FOLDERS } = __dep1;
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
  const __default = {
    title: "Molecules/Note editor",
  };
  const Empty = {
    render: () =>
      html`<dimui-story-note-editor-empty />`,
  };
  const Editing = {
    render: () =>
      html`<dimui-story-note-editor-editing />`,
  };
  const Saving = {
    render: () =>
      html`<dimui-story-note-editor-saving />`,
  };

  void EmptyDemo;
  void EditingDemo;
  void SavingDemo;
  return { Empty, Editing, Saving, default: __default };
  },
);
