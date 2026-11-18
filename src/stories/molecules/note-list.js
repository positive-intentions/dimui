BP.module(
  "dimui/stories/molecules/note-list",
  ["dimui/components/notes/organisms/note-list","dimui/stories/fixtures","dimui/lib/notes/mockData"],
  function (__dep0, __dep1, __dep2) {
  const { html, define, useState, useScope } = Dim;
  const { NoteList } = __dep0;
  const { SAMPLE_NOTES } = __dep1;
  const { SMART_FOLDERS } = __dep2;
  void NoteList;

  const EmptyDemo = define({
    tag: "dimui-story-note-list-empty",
    component: (_, { html: tpl, useScope: scope }) => {
      scope({ NoteList });
      return tpl`
        <div style="height:100vh;max-width:320px;background:var(--dimui-doc-bg,#0f172a)">
          <dimui-note-list
            .props="${{
              notes: [],
              selectedId: null,
              folderFilter: SMART_FOLDERS.all,
              folderLabel: "All Notes",
              onSelect: () => {},
              onCreate: () => {},
              onEmptyTrash: () => {},
            }}"
          />
        </div>
      `;
    },
  });

  const PopulatedDemo = define({
    tag: "dimui-story-note-list-populated",
    component: (_, { html: tpl, useState: state, useScope: scope }) => {
      scope({ NoteList });
      const [selectedId, setSelectedId] = state(SAMPLE_NOTES[0].id);
      return tpl`
        <div style="height:100vh;max-width:320px;background:var(--dimui-doc-bg,#0f172a)">
          <dimui-note-list
            .props="${{
              notes: SAMPLE_NOTES,
              selectedId,
              folderFilter: SMART_FOLDERS.all,
              folderLabel: "All Notes",
              onSelect: setSelectedId,
              onCreate: () => {},
              onEmptyTrash: () => {},
            }}"
          />
        </div>
      `;
    },
  });
  const __default = {
    title: "Molecules/Note list",
  };
  const Empty = {
    render: () =>
      html`<dimui-story-note-list-empty />`,
  };
  const Populated = {
    render: () =>
      html`<dimui-story-note-list-populated />`,
  };

  void EmptyDemo;
  void PopulatedDemo;
  return { Empty, Populated, default: __default };
  },
);
