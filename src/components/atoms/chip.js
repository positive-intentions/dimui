BP.module(
  "dimui/components/atoms/chip",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
  const styles = css`
    ${themeTokens}
    :host {
      display: inline-flex;
    }
    button {
      display: inline-flex;
      align-items: center;
      min-height: 32px;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--dimui-color-border);
      border-radius: 999px;
      background: var(--dimui-color-surface);
      color: var(--dimui-color-text-muted);
      font: inherit;
      font-size: 0.8rem;
      font-weight: 560;
      cursor: pointer;
    }
    button.selected {
      border-color: var(--dimui-color-primary);
      background: color-mix(in srgb, var(--dimui-color-primary) 14%, transparent);
      color: var(--dimui-color-primary);
    }
    button:focus-visible {
      outline: 2px solid var(--dimui-color-focus);
      outline-offset: 2px;
    }
  `;
  const Chip = define({
    tag: "dimui-chip",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const label = props.label ?? props.children ?? "";
      const selected = Boolean(props.selected);
      const onClick =
        typeof props.onClick === "function" ? props.onClick : () => {};
      return tpl`
        <button
          type="button"
          class="${selected ? "selected" : ""}"
          @click="${onClick}"
        >
          ${label}
        </button>
      `;
    },
  });
  return { Chip };
  },
);
