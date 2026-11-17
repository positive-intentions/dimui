import { html, define, useState, useScope } from "@positive-intentions/dim";
import { NoteList } from "../../demos/notes/note-list.js";
import { SAMPLE_NOTES } from "../fixtures.js";
import { SMART_FOLDERS } from "../../demos/notes/mockData.js";

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

export default {
  title: "Molecules/Note list",
};

export const Empty = {
  render: () =>
    html`<dimui-story-note-list-empty />`,
};

export const Populated = {
  render: () =>
    html`<dimui-story-note-list-populated />`,
};

void EmptyDemo;
void PopulatedDemo;
