BP.module(
  "dimui/components/atoms/icon-button",
  ["dimui/theme","dimui/components/atoms/icon"],
  function (__dep0, __dep1) {
  const { define, html, css, useStyle, useScope } = Dim;
  const { themeTokens } = __dep0;
  const { Icon } = __dep1;
  const styles = css`
    ${themeTokens}
    :host {
      display: inline-flex;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--dimui-touch);
      height: var(--dimui-touch);
      padding: 0;
      border: none;
      border-radius: var(--dimui-radius);
      background: transparent;
      color: var(--dimui-color-text-muted);
      cursor: pointer;
      transition: background var(--dimui-transition), color var(--dimui-transition);
    }
    button:hover:not(:disabled) {
      background: var(--dimui-color-surface-hover);
      color: var(--dimui-color-text);
    }
    button:focus-visible {
      outline: 2px solid var(--dimui-color-focus);
      outline-offset: 2px;
    }
    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    button.active {
      color: var(--dimui-color-primary);
      background: color-mix(in srgb, var(--dimui-color-primary) 14%, transparent);
    }
    button.sm {
      width: 32px;
      height: 32px;
    }
    button.lg {
      width: var(--dimui-touch);
      height: var(--dimui-touch);
    }
    dimui-icon {
      width: 1.15rem;
      height: 1.15rem;
    }
  `;
  const IconButton = define({
    tag: "dimui-icon-button",
    component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
      style(styles);
      scope({ Icon });

      const name = props.name || "menu";
      const label = props["aria-label"] || props.label || name;
      const disabled = Boolean(props.disabled);
      const active = Boolean(props.active);
      const size = props.size || "md";
      const title = props.title || label;
      const onClick =
        typeof props.onClick === "function" ? props.onClick : () => {};
      const className = active ? `${size} active` : size;

      return tpl`
        <button
          type="button"
          class="${className}"
          aria-label="${label}"
          title="${title}"
          ?disabled="${disabled}"
          @click="${onClick}"
        >
          <dimui-icon .props="${{ name }}" />
        </button>
      `;
    },
  });
  return { IconButton };
  },
);
