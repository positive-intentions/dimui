BP.module(
  "dimui/stories/organisms/notes-shell",
  ["dimui/demos/notes/notes-shell","dimui/theme"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { NotesShell } = __dep0;
  const { getStoredTheme } = __dep1;
  void NotesShell;

  /** Story password for a throwaway vault — shares IndexedDB with the demo when reused. */
  const STORY_PASSWORD = "dimui-story-shell";
  const __default = {
    title: "Organisms/Notes shell",
  };
  const Default = {
    render: () =>
      html`<dimui-notes-shell
        .props="${{
          password: STORY_PASSWORD,
          create: true,
          theme: getStoredTheme(),
          onLock: () => {},
          onUnlockFailed: () => {},
        }}"
      />`,
  };
  return { Default, default: __default };
  },
);
