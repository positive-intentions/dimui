BP.module(
  "dimui/components/notes/organisms/note-list",
  [
    "dimui/components/atoms/button",
    "dimui/components/atoms/empty-state",
    "dimui/components/atoms/fab",
    "dimui/components/molecules/search-field",
    "dimui/components/notes/molecules/note-item",
    "dimui/lib/notes/mockData",
  ],
  function (button, emptyState, fab, searchField, noteItem, mock) {
    const { define, css } = Dim;
    const { Button } = button;
    const { EmptyState } = emptyState;
    const { Fab } = fab;
    const { SearchField } = searchField;
    const { NoteItem } = noteItem;
    const { SMART_FOLDERS } = mock;

    const styles = css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        color: var(--notes-text, #e2e8f0);
      }

      .note-list-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        position: relative;
      }

      .list-toolbar {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .list-heading {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 650;
        color: var(--notes-text, #e2e8f0);
      }

      .note-list {
        list-style: none;
        margin: 0;
        padding: 0.25rem 0.5rem 4.5rem;
        overflow: auto;
        flex: 1;
      }

      .note-list li {
        margin: 0 0 0.25rem;
      }

      .list-fab {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        z-index: 2;
      }

      .trash-actions {
        padding: 0.5rem 0.75rem;
        border-top: 1px solid var(--notes-border, #334155);
        flex-shrink: 0;
      }
    `;

    const NoteList = define({
      tag: "dimui-note-list",
      component: (
        props,
        { html: tpl, useState: state, useStyle: style, useScope: scope },
      ) => {
        style(styles);
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
          typeof props.onEmptyTrash === "function"
            ? props.onEmptyTrash
            : () => {};

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
          return String(b.updatedAt || "").localeCompare(
            String(a.updatedAt || ""),
          );
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
