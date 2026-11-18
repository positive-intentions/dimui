BP.module(
  "dimui/demos/notes/note-list",
  ["dimui/demos/notes/styles","dimui/demos/notes/note-item","dimui/components/molecules/search-field","dimui/components/atoms/empty-state","dimui/components/atoms/fab","dimui/components/atoms/button","dimui/demos/notes/mockData"],
  function (__dep0, __dep1, __dep2, __dep3, __dep4, __dep5, __dep6) {
  const { define, html, useState, useStyle, useScope } = Dim;
  const { appStyles } = __dep0;
  const { NoteItem } = __dep1;
  const { SearchField } = __dep2;
  const { EmptyState } = __dep3;
  const { Fab } = __dep4;
  const { Button } = __dep5;
  const { SMART_FOLDERS } = __dep6;
  const NoteList = define({
    tag: "dimui-note-list",
    component: (
      props,
      { html: tpl, useState: state, useStyle: style, useScope: scope },
    ) => {
      style(appStyles);
      scope({ NoteItem, SearchField, EmptyState, Fab, Button });

      const notes = Array.isArray(props.notes) ? props.notes : [];
      const selectedId = props.selectedId || null;
      const folderFilter = props.folderFilter || SMART_FOLDERS.all;
      const folderLabel = props.folderLabel || "Notes";
      const onSelect =
        typeof props.onSelect === "function" ? props.onSelect : () => {};
      const onCreate =
        typeof props.onCreate === "function" ? props.onCreate : () => {};
      const onEmptyTrash =
        typeof props.onEmptyTrash === "function" ? props.onEmptyTrash : () => {};

      const [search, setSearch] = state("");

      const q = search.trim().toLowerCase();
      const filtered = notes.filter((n) => {
        if (!q) return true;
        const title = String(n.title || "").toLowerCase();
        const body = String(n.body || "").toLowerCase();
        return title.includes(q) || body.includes(q);
      });

      const sorted = [...filtered].sort((a, b) => {
        if (folderFilter !== SMART_FOLDERS.trash) {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
        }
        return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
      });

      const isTrash = folderFilter === SMART_FOLDERS.trash;
      const emptyTitle = isTrash
        ? "Trash is empty"
        : q
          ? "No matching notes"
          : "No notes yet";
      const emptyHint = isTrash
        ? "Deleted notes appear here until you empty the trash."
        : q
          ? "Try a different search."
          : "Tap + to create your first note.";

      return tpl`
        <div class="note-list-view">
          <div class="list-toolbar">
            <h2 class="list-heading">${folderLabel}</h2>
            <dimui-search-field
              .props="${{
                id: "notes-search",
                placeholder: "Search notes…",
                value: search,
                onInput: setSearch,
              }}"
            />
          </div>

          ${sorted.length === 0
            ? tpl`
                <dimui-empty-state
                  .props="${{ title: emptyTitle, hint: emptyHint }}"
                />
              `
            : tpl`
                <ul class="note-list">
                  ${sorted.map(
                    (note) => tpl`
                      <li>
                        <dimui-note-item
                          .props="${{
                            note,
                            selected: note.id === selectedId,
                            shareTransition: note.id === selectedId,
                            onSelect,
                          }}"
                        />
                      </li>
                    `,
                  )}
                </ul>
              `}

          ${isTrash && notes.length > 0
            ? tpl`
                <div class="trash-actions">
                  <dimui-button
                    .props="${{
                      label: "Empty Trash",
                      variant: "danger",
                      size: "sm",
                      onClick: onEmptyTrash,
                    }}"
                  />
                </div>
              `
            : null}

          ${!isTrash
            ? tpl`
                <div class="list-fab">
                  <dimui-fab
                    .props="${{
                      name: "plus",
                      label: "New note",
                      onClick: onCreate,
                    }}"
                  />
                </div>
              `
            : null}
        </div>
      `;
    },
  });
  return { NoteList };
  },
);
