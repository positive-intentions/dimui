BP.module(
  "dimui/components/notes/molecules/notes-header",
  ["dimui/components/atoms/icon-button"],
  function (iconButton) {
    const { define, css } = Dim;
    const { IconButton } = iconButton;

    const styles = css`
      :host {
        display: block;
        flex-shrink: 0;
        color: var(--notes-text, #e2e8f0);
      }

      .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: var(--notes-surface, #0b1220);
        border-bottom: 1px solid var(--notes-border, #334155);
      }

      .app-header-title {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 650;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    `;

    const NotesHeader = define({
      tag: "dimui-notes-header",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ IconButton });

        const title = props.title || "Notes";
        const onLock =
          typeof props.onLock === "function" ? props.onLock : () => {};

        return tpl`
          <header class="app-header">
            <h1 class="app-header-title">${title}</h1>
            <div class="header-actions">
              <dimui-icon-button
                .props="${{
                  name: "lock",
                  label: "Lock vault",
                  onClick: onLock,
                }}"
              />
            </div>
          </header>
        `;
      },
    });

    return { NotesHeader };
  },
);
