BP.module(
  "dimui/components/notes/organisms/note-editor",
  [
    "dimui/components/atoms/button",
    "dimui/components/atoms/icon-button",
    "dimui/components/atoms/empty-state",
    "dimui/components/molecules/confirm-dialog",
    "dimui/lib/notes/sharedKeys",
    "dimui/lib/notes/mockData",
    "dimui/lib/notes/types",
    "dimui/lib/notes/note-editor-logic",
  ],
  function (
    button,
    iconButton,
    emptyState,
    confirmDialog,
    shared,
    mock,
    types,
    logic,
  ) {
    const { define, css, t } = Dim;
    const { Button } = button;
    const { IconButton } = iconButton;
    const { EmptyState } = emptyState;
    const { ConfirmDialog } = confirmDialog;
    const { sharedKeys } = shared;
    const { snippetFromBody, formatRelativeTime } = mock;
    const { Note, Folder } = types;
    const { noteEditorReducer, noteEditorViewModel } = logic;

    const styles = css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        color: var(--notes-text, #e2e8f0);
      }

      .editor {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        padding: 0;
        background: var(--notes-bg, #0f172a);
      }

      .editor.empty {
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .editor-toolbar {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--notes-border, #334155);
        background: var(--notes-surface, #0b1220);
        flex-shrink: 0;
      }

      .editor-toolbar .save-status {
        margin-right: auto;
        margin-left: 0.5rem;
        color: var(--notes-text-faint, #64748b);
        font-size: 0.8rem;
      }

      .editor-back {
        display: none;
      }

      .editor-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        padding: 1rem 1.25rem 1.5rem;
      }

      .title-input {
        width: 100%;
        border: none;
        background: transparent;
        color: var(--notes-text, #e2e8f0);
        font: inherit;
        font-size: 1.5rem;
        font-weight: 650;
        letter-spacing: -0.02em;
        padding: 0.25rem 0;
        outline: none;
        margin-bottom: 0.75rem;
      }

      .title-input::placeholder {
        color: var(--notes-text-faint, #64748b);
      }

      .editor-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0.75rem;
        align-items: baseline;
        margin: 0 0 0.85rem;
        font-size: 0.75rem;
        color: var(--notes-text-faint, #64748b);
      }

      .editor-snippet {
        color: var(--notes-text-muted, #94a3b8);
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .body-input {
        flex: 1;
        width: 100%;
        min-height: 200px;
        border: none;
        background: transparent;
        color: var(--notes-text, #e2e8f0);
        font: inherit;
        font-size: 1rem;
        line-height: 1.55;
        resize: none;
        outline: none;
      }

      .body-input::placeholder {
        color: var(--notes-text-faint, #64748b);
      }

      .folder-select {
        appearance: none;
        border: 1px solid var(--notes-border, #334155);
        border-radius: 8px;
        background: var(--notes-bg, #0f172a);
        color: var(--notes-text, #e2e8f0);
        font: inherit;
        font-size: 0.8125rem;
        padding: 0.35rem 0.6rem;
        max-width: 140px;
      }

      @media (max-width: 768px) {
        .editor-back {
          display: inline-flex;
        }
      }
    `;

    const NoteEditor = define({
      tag: "dimui-note-editor",
      inputs: t.record({
        note: t.nullable(Note),
        folders: t.array(Folder, { max: 1000, onInvalid: "coerce", default: [] }),
        saveStatus: t.string({ max: 64, onInvalid: "coerce", default: "" }),
        showBack: t.bool({ onInvalid: "coerce", default: false }),
        onChange: t.fn([Note]),
        onBack: t.fn([]),
        onTogglePin: t.fn([t.id()]),
        onMoveFolder: t.fn([t.id(), t.id()]),
        onTrash: t.fn([t.id()]),
        onRestore: t.fn([t.id()]),
        onDeleteForever: t.fn([t.id()]),
      }),
      component: (
        props,
        {
          html: tpl,
          useState: state,
          useRef: ref,
          useStyle: style,
          useScope: scope,
        },
      ) => {
        style(styles);
        scope({ Button, IconButton, EmptyState, ConfirmDialog });

        const note = props.note;
        const folders = props.folders;
        const saveStatus = props.saveStatus;
        const showBack = Boolean(props.showBack);
        const onChange = props.onChange;
        const onBack = props.onBack;
        const onTogglePin = props.onTogglePin;
        const onMoveFolder = props.onMoveFolder;
        const onTrash = props.onTrash;
        const onRestore = props.onRestore;
        const onDeleteForever = props.onDeleteForever;

        const [editorState, setEditorState] = state({ confirm: null });
        // Keep kind on a ref so a stale nested .props onConfirm (WASM) still
        // dispatches the correct trash/delete action.
        const confirmRef = ref(null);
        const confirm = editorState.confirm;

        const vm = noteEditorViewModel({ note, confirm });
        if (vm.empty) {
          return tpl`
            <section class="editor empty">
              <dimui-empty-state
                .props="${{
                  title: "Select a note",
                  hint: "Choose a note from the list or create a new one.",
                }}"
              />
            </section>
          `;
        }

        const keys = sharedKeys(note.id);
        const patch = (partial) =>
          onChange({
            ...note,
            ...partial,
            updatedAt: new Date().toISOString(),
          });

        const askConfirm = (kind) => {
          confirmRef.current = kind;
          setEditorState(
            noteEditorReducer(editorState, { type: "ask", kind }),
          );
        };
        const closeConfirm = () => {
          confirmRef.current = null;
          setEditorState(noteEditorReducer(editorState, { type: "close" }));
        };

        const runConfirm = () => {
          const kind = confirmRef.current || confirm;
          if (kind === "trash") onTrash(note.id);
          if (kind === "delete") onDeleteForever(note.id);
          setEditorState(noteEditorReducer(editorState, { type: "run" }));
          confirmRef.current = null;
        };

        const confirmCopy = {
          title: vm.confirmTitle,
          body: vm.confirmBody,
          action: vm.confirmAction,
        };

        return tpl`
          <section class="editor">
            <div class="editor-toolbar">
              ${showBack
                ? tpl`
                    <dimui-icon-button
                      class="editor-back"
                      .props="${{
                        name: "back",
                        label: "Back to notes",
                        onClick: onBack,
                      }}"
                    />
                  `
                : null}

              <span class="save-status" aria-live="polite">${saveStatus}</span>

              ${note.trashed
                ? tpl`
                    <dimui-icon-button
                      .props="${{
                        name: "restore",
                        label: "Restore note",
                        onClick: () => onRestore(note.id),
                      }}"
                    />
                    <dimui-button
                      .props="${{
                        label: "Delete Forever",
                        variant: "danger",
                        size: "sm",
                        onClick: () => askConfirm("delete"),
                      }}"
                    />
                  `
                : tpl`
                    <dimui-icon-button
                      .props="${{
                        name: "pin",
                        label: note.pinned ? "Unpin note" : "Pin note",
                        active: Boolean(note.pinned),
                        onClick: () => onTogglePin(note.id),
                      }}"
                    />
                    <select
                      class="folder-select"
                      aria-label="Move to folder"
                      .value="${note.folderId || ""}"
                      @change="${(e) =>
                        onMoveFolder(note.id, e.target.value || null)}"
                    >
                      <option value="">No folder</option>
                      ${folders.map(
                        (f) =>
                          tpl`<option value="${f.id}">${f.name}</option>`,
                      )}
                    </select>
                    <dimui-icon-button
                      .props="${{
                        name: "trash",
                        label: "Move to trash",
                        onClick: () => askConfirm("trash"),
                      }}"
                    />
                  `}
            </div>

            <div class="editor-body">
              <input
                class="title-input"
                type="text"
                placeholder="Title"
                .value="${note.title || ""}"
                data-vt-shared="${keys.title}"
                @input="${(e) => patch({ title: e.target.value })}"
                    />
              <div class="editor-meta">
                <span data-vt-shared="${keys.time}"
                  >${formatRelativeTime(note.updatedAt)}</span
                >
                <span data-vt-shared="${keys.snippet}" class="editor-snippet"
                  >${snippetFromBody(note.body)}</span
                >
              </div>
              <textarea
                class="body-input"
                placeholder="Start writing…"
                .value="${note.body || ""}"
                @input="${(e) => patch({ body: e.target.value })}"
              ></textarea>
            </div>

            <dimui-confirm-dialog
              .props="${{
                open: Boolean(confirm),
                title: confirmCopy.title,
                body: confirmCopy.body,
                confirmLabel: confirmCopy.action,
                onConfirm: runConfirm,
                onCancel: closeConfirm,
              }}"
            />
          </section>
        `;
      },
    });
    return { NoteEditor };
  },
);
