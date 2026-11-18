BP.module(
  "dimui/demos/notes/NavigationView",
  ["dimui/demos/notes/styles","dimui/demos/notes/mockData","dimui/demos/notes/note-list","dimui/demos/notes/note-editor"],
  function (__dep0, __dep1, __side2, __side3) {
  void __side2;
  void __side3;
  const { define, html, css, useStyle } = Dim;
  const { appStyles } = __dep0;
  const { SMART_FOLDERS } = __dep1;


  const NavigationView = (props, { useStyle, html, css }) => {
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

    useStyle(css`
      ${appStyles}

      :host {
        display: block;
        height: 100%;
        min-height: 0;
      }

      .nav-view-root > .list-pane > *,
      .nav-view-root > .editor-pane > * {
        flex: 1;
        min-height: 0;
        height: 100%;
      }
    `);

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
  const __default = NavigationView;
  return { default: __default };
  },
);
