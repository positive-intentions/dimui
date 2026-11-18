BP.module(
  "dimui/components/notes/molecules/folder-item",
  ["dimui/components/atoms/icon"],
  function (icon) {
    const { define, css } = Dim;
    const { Icon } = icon;

    const styles = css`
      :host {
        display: block;
      }

      .folder-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.65rem;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--notes-text, #e2e8f0);
        font: inherit;
        font-size: 0.875rem;
        cursor: pointer;
        text-align: left;
      }

      .folder-item:hover {
        background: var(--notes-surface-hover, #334155);
      }

      .folder-item.active {
        background: var(--notes-primary-soft, #1a3a5c);
        color: var(--notes-primary, #029cfd);
        font-weight: 600;
      }

      .folder-item .count {
        margin-left: auto;
        font-size: 0.75rem;
        color: var(--notes-text-faint, #64748b);
      }

      .folder-item.active .count {
        color: var(--notes-primary, #029cfd);
      }
    `;

    const FolderItem = define({
      tag: "dimui-folder-item",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Icon });

        const id = props.id || "";
        const name = props.name || "Folder";
        const iconName = props.icon || "folder";
        const count = props.count ?? 0;
        const active = Boolean(props.active);
        const onSelect =
          typeof props.onSelect === "function" ? props.onSelect : () => {};

        return tpl`
          <button
            type="button"
            class="folder-item ${active ? "active" : ""}"
            @click="${() => onSelect(id)}"
          >
            <dimui-icon .props="${{ name: iconName }}" />
            <span>${name}</span>
            <span class="count">${count}</span>
          </button>
        `;
      },
    });

    return { FolderItem };
  },
);
