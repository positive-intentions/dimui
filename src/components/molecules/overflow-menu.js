BP.module(
  "dimui/components/molecules/overflow-menu",
  ["dimui/theme", "dimui/components/atoms/icon-button"],
  function (theme, iconButton) {
    const { define, css, useStyle, useScope, useState } = Dim;
    const { themeTokens } = theme;
    const { IconButton } = iconButton;

    const styles = css`
      ${themeTokens}
      :host {
        display: inline-flex;
        position: relative;
      }

      .menu {
        position: absolute;
        top: calc(100% + 0.25rem);
        right: 0;
        z-index: 40;
        min-width: 180px;
        background: var(--dimui-color-surface-2, #0b1220);
        border: 1px solid var(--dimui-color-border, #334155);
        border-radius: 10px;
        box-shadow: var(--dimui-shadow, 0 12px 28px rgba(0, 0, 0, 0.35));
        padding: 0.35rem;
        display: none;
      }

      .menu.open {
        display: block;
      }

      .menu button {
        display: block;
        width: 100%;
        text-align: left;
        appearance: none;
        border: none;
        background: transparent;
        color: var(--dimui-color-text, #e2e8f0);
        font: inherit;
        font-size: 0.9rem;
        padding: 0.55rem 0.7rem;
        border-radius: 8px;
        cursor: pointer;
      }

      .menu button:hover {
        background: var(--dimui-color-surface-hover, #334155);
      }

      .menu button.danger {
        color: var(--dimui-color-danger, #f87171);
      }
    `;

    const OverflowMenu = define({
      tag: "dimui-overflow-menu",
      component: (
        props,
        { html: tpl, useState: state, useStyle: style, useScope: scope },
      ) => {
        style(styles);
        scope({ IconButton });

        const items = Array.isArray(props.items) ? props.items : [];
        const [open, setOpen] = state(false);

        const close = () => setOpen(false);
        const toggle = () => setOpen(!open);

        return tpl`
          <div>
            <dimui-icon-button
              .props="${{
                name: "more",
                label: "More",
                onClick: toggle,
              }}"
            />
            <div class="menu ${open ? "open" : ""}" role="menu">
              ${items.map((item) => {
                const label = item.label || "";
                const danger = Boolean(item.danger);
                const onClick =
                  typeof item.onClick === "function" ? item.onClick : () => {};
                return tpl`
                  <button
                    type="button"
                    class="${danger ? "danger" : ""}"
                    role="menuitem"
                    @click="${() => {
                      close();
                      onClick();
                    }}"
                  >
                    ${label}
                  </button>
                `;
              })}
            </div>
          </div>
        `;
      },
    });

    return { OverflowMenu };
  },
);
