BP.module(
  "dimui/stories/molecules/note-item",
  ["dimui/components/notes/molecules/note-item","dimui/stories/pad","dimui/stories/fixtures"],
  function (__dep0, __dep1, __dep2) {
  const { html } = Dim;
  const { NoteItem } = __dep0;
  const { StoryPad } = __dep1;
  const { SAMPLE_NOTE } = __dep2;
  void NoteItem;
  void StoryPad;
  const __default = {
    title: "Molecules/Note item",
  };
  const Selected = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          content: html`
            <div style="max-width:320px;display:grid;gap:0.35rem">
              <dimui-note-item
                .props="${{
                  note: SAMPLE_NOTE,
                  selected: true,
                  shareTransition: true,
                  onSelect: () => {},
                }}"
              />
              <dimui-note-item
                .props="${{
                  note: {
                    id: "note-2",
                    title: "Ideas",
                    body: "Atomic design for dimui explorer",
                    pinned: false,
                    trashed: false,
                    updatedAt: "2026-03-11T09:15:00.000Z",
                  },
                  selected: false,
                  onSelect: () => {},
                }}"
              />
            </div>
          `,
        }}"
      />`,
  };
  return { Selected, default: __default };
  },
);
