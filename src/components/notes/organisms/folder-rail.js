BP.module(
  "dimui/components/notes/organisms/folder-rail",
  [
    "dimui/components/atoms/button",
    "dimui/components/atoms/icon",
    "dimui/components/notes/molecules/folder-item",
  ],
  function (button, icon, folderItem) {
    const { define, css } = Dim;
    const { Button } = button;
    const { Icon } = icon;
    const { FolderItem } = folderItem;

    const styles = css`
      :host {
        display: block;
        width: 200px;
        flex-shrink: 0;
        min-height: 0;
        color: var(--notes-text, #e2e8f0);
      }

      .folder-rail {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: var(--notes-surface, #0b1220);
        border-right: 1px solid var(--notes-border, #334155);
      }

      .folder-rail-header {
        padding: 1rem 1rem 0.5rem;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--notes-text-faint, #64748b);
      }

      .folder-list {
        list-style: none;
        margin: 0;
        padding: 0.25rem 0.5rem;
        flex: 1;
        overflow: auto;
      }

      .folder-rail-footer {
        padding: 0.75rem;
        border-top: 1px solid var(--notes-border, #334155);
      }

      .new-folder-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.65rem;
        border: 1px dashed var(--notes-border, #334155);
        border-radius: 8px;
        background: transparent;
        color: var(--notes-text-muted, #94a3b8);
        font: inherit;
        font-size: 0.8125rem;
        cursor: pointer;
      }

      .new-folder-btn:hover {
        border-color: var(--notes-primary, #029cfd);
        color: var(--notes-primary, #029cfd);
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
        max-width: none;
        width: 100%;
      }

      .new-folder-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      @media (max-width: 768px) {
        :host {
          display: none;
        }
      }
    `;

    const FolderRail = define({
      tag: "dimui-folder-rail",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Button, Icon, FolderItem });

        const smartItems = Array.isArray(props.smartItems) ? props.smartItems : [];
        const folders = Array.isArray(props.folders) ? props.folders : [];
        const trashItem = props.trashItem || null;
        const folderFilter = props.folderFilter || null;
        const countFor =
          typeof props.countFor === "function" ? props.countFor : () => 0;
        const onSelectFolder =
          typeof props.onSelectFolder === "function"
            ? props.onSelectFolder
            : () => {};
        const newFolderOpen = Boolean(props.newFolderOpen);
        const newFolderName = props.newFolderName || "";
        const onNewFolderOpen =
          typeof props.onNewFolderOpen === "function"
            ? props.onNewFolderOpen
            : () => {};
        const onNewFolderName =
          typeof props.onNewFolderName === "function"
            ? props.onNewFolderName
            : () => {};
        const onCreateFolder =
          typeof props.onCreateFolder === "function"
            ? props.onCreateFolder
            : () => {};
        const onCancelNewFolder =
          typeof props.onCancelNewFolder === "function"
            ? props.onCancelNewFolder
            : () => {};

        const renderItem = (item) => tpl`
          <li>
            <dimui-folder-item
              .props="${{
                id: item.id,
                name: item.name,
                icon: item.icon || "folder",
                count: countFor(item.id),
                active: folderFilter === item.id,
                onSelect: onSelectFolder,
              }}"
            />
          </li>
        `;

        return tpl`
          <nav class="folder-rail" aria-label="Folders">
            <div class="folder-rail-header">Folders</div>
            <ul class="folder-list">
              ${smartItems.map(renderItem)}
              ${folders.map((f) =>
                renderItem({ id: f.id, name: f.name, icon: "folder" }),
              )}
              ${trashItem ? renderItem(trashItem) : null}
            </ul>
            <div class="folder-rail-footer">
              ${newFolderOpen
                ? tpl`
                    <div class="new-folder-form">
                      <input
                        class="folder-select"
                        placeholder="Folder name"
                        .value="${newFolderName}"
                        @input="${(e) => onNewFolderName(e.target.value)}"
                        @keydown="${(e) => {
                          if (e.key === "Enter") onCreateFolder();
                          if (e.key === "Escape") onCancelNewFolder();
                        }}"
            />
                      <dimui-button
                        .props="${{
                          label: "Add",
                          size: "sm",
                          onClick: onCreateFolder,
                        }}"
                      />
                    </div>
                  `
                : tpl`
                    <button
                      type="button"
                      class="new-folder-btn"
                      @click="${() => onNewFolderOpen(true)}"
                    >
                      <dimui-icon .props="${{ name: "plus" }}" />
                      New Folder
                    </button>
                  `}
            </div>
          </nav>
        `;
      },
    });

    return { FolderRail };
  },
);
