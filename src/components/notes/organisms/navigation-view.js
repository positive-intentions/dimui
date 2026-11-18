BP.module(
  "dimui/components/notes/organisms/navigation-view",
  [
    "dimui/lib/notes/mockData",
    "dimui/components/notes/organisms/note-list",
    "dimui/components/notes/organisms/note-editor",
  ],
  function (mock, noteList, noteEditor) {
    const { define, css } = Dim;
    const { SMART_FOLDERS } = mock;
    void noteList;
    void noteEditor;

    const styles = css`
      :host {
        display: block;
        height: 100%;
        min-height: 0;
        color: var(--notes-text, #e2e8f0);
      }

      .nav-view-root {
        display: flex;
        height: 100%;
        width: 100%;
        min-height: 0;
      }

      .list-pane {
        width: 320px;
        flex-shrink: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--notes-border, #334155);
        background: var(--notes-surface, #0b1220);
      }

      .editor-pane {
        flex: 1;
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        background: var(--notes-bg, #0f172a);
      }

      .nav-view-root > .list-pane > *,
      .nav-view-root > .editor-pane > * {
        flex: 1;
        min-height: 0;
        height: 100%;
      }

      .auto-transition-wrapper,
      .view-transition-item,
      .vt-layer {
        height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .vt-layer:not(.vt-incoming) {
        pointer-events: none;
      }

      @media (max-width: 768px) {
        .list-pane {
          width: 100%;
          border-right: none;
        }

        .nav-view-root:not(.note-open) .editor-pane {
          display: none;
        }

        .nav-view-root.note-open .list-pane {
          display: none;
        }
      }
    `;

    const NavigationView = (props, { useStyle: style, html }) => {
      const data = props.props || props;
      const {
        notes = [],
        folders = [],
        selectedId = null,
        folderFilter = SMART_FOLDERS.all,
        folderLabel = "Notes",
        navStack = ["list"],
        saveStatus = "",
        onSelect,
        onCreate,
        onBack,
        onChange,
        onTogglePin,
        onMoveFolder,
        onTrash,
        onRestore,
        onDeleteForever,
        onEmptyTrash,
      } = data;

      style(styles);

      const top = navStack[navStack.length - 1] || "list";
      const noteOpen = top.startsWith("note:");
      const openId = noteOpen ? top.slice(5) : selectedId;
      const selected =
        notes.find((n) => n.id === openId) ||
        notes.find((n) => n.id === selectedId) ||
        null;

      const rootClass = noteOpen ? "nav-view-root note-open" : "nav-view-root";

      return html`
        <div class="${rootClass}">
          <div class="list-pane">
            <dimui-note-list
              .props="${{
                notes,
                selectedId: selected?.id || null,
                folderFilter,
                folderLabel,
                onSelect,
                onCreate,
                onEmptyTrash,
              }}"
            />
          </div>
          <div class="editor-pane">
            <dimui-note-editor
              .props="${{
                note: selected,
                folders,
                saveStatus,
                showBack: noteOpen,
                onBack,
                onChange,
                onTogglePin,
                onMoveFolder,
                onTrash,
                onRestore,
                onDeleteForever,
              }}"
            />
          </div>
        </div>
      `;
    };

    define({ tag: "dimui-notes-nav", component: NavigationView });
    return { NavigationView };
  },
);
