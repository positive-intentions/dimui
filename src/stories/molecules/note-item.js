import { html } from "@positive-intentions/dim";
import { NoteItem } from "../../demos/notes/note-item.js";
import { StoryPad } from "../pad.js";
import { SAMPLE_NOTE } from "../fixtures.js";

void NoteItem;
void StoryPad;

export default {
  title: "Molecules/Note item",
};

export const Selected = {
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
