BP.module(
  "dimui/stories/notes",
  ["dimui/demos/notes/app"],
  function (__dep0) {
  const { html } = Dim;
  const { NotesApp } = __dep0;
  const __default = {
    title: "Demos/Encrypted notes",
    render: () => html`<dimui-notes-app />`,
  };

  void NotesApp;
  return { default: __default };
  },
);
