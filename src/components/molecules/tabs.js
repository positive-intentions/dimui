BP.module(
  "dimui/components/molecules/tabs",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
  const styles = css`
    ${themeTokens}
    :host {
      display: block;
    }
    .tabs {
      display: flex;
      align-items: stretch;
      gap: 0;
      border-bottom: 1px solid var(--dimui-color-border-subtle);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .tabs.pill {
      border-bottom: none;
      gap: var(--dimui-space-1);
      padding: var(--dimui-space-1);
      background: var(--dimui-color-surface-2);
    }
    .tabs.bottom-nav {
      border-bottom: none;
      border-top: 1px solid var(--dimui-color-border);
      background: var(--dimui-color-surface);
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
    button {
      flex: 0 0 auto;
      min-height: 36px;
      padding: 0.5rem 0.9rem;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--dimui-color-text-muted);
      font: inherit;
      font-size: 0.8rem;
      font-weight: 560;
      cursor: pointer;
      white-space: nowrap;
    }
    .tabs.pill button,
    .tabs.bottom-nav button {
      flex: 1;
      border-bottom: none;
      border-radius: var(--dimui-radius);
      min-height: var(--dimui-touch);
    }
    button:hover {
      color: var(--dimui-color-text);
    }
    button.active {
      color: var(--dimui-color-primary);
      border-bottom-color: var(--dimui-color-primary);
    }
    .tabs.pill button.active,
    .tabs.bottom-nav button.active {
      background: color-mix(in srgb, var(--dimui-color-primary) 14%, transparent);
    }
    button:focus-visible {
      outline: 2px solid var(--dimui-color-focus);
      outline-offset: -2px;
    }
  `;
  const Tabs = define({
    tag: "dimui-tabs",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const items = Array.isArray(props.items) ? props.items : [];
      const value = props.value || items[0]?.id || "";
      const variant = props.variant || "underline";
      const label = props["aria-label"] || "Tabs";
      const onChange =
        typeof props.onChange === "function" ? props.onChange : () => {};

      const tabsClass =
        variant === "pill"
          ? "tabs pill"
          : variant === "bottom-nav"
            ? "tabs bottom-nav"
            : "tabs";

      return tpl`
        <div
          class="${tabsClass}"
          role="tablist"
          aria-label="${label}"
        >
          ${items.map((item) => {
            const selected = item.id === value ? "true" : "false";
            const tabClass = item.id === value ? "active" : "";
            return tpl`
              <button
                type="button"
                role="tab"
                id="tab-${item.id}"
                aria-selected="${selected}"
                class="${tabClass}"
                @click="${() => onChange(item.id)}"
              >
                ${item.label}
              </button>
            `;
          })}
        </div>
      `;
    },
  });
  return { Tabs };
  },
);
