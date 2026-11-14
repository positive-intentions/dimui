import { define, html, css, useStyle } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: inline-flex;
  }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--dimui-space-2);
    min-height: 36px;
    padding: 0.45rem 0.9rem;
    border-radius: var(--dimui-radius);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 560;
    cursor: pointer;
    transition: background var(--dimui-transition), color var(--dimui-transition),
      border-color var(--dimui-transition), filter var(--dimui-transition);
  }
  button:focus-visible {
    outline: 2px solid var(--dimui-color-focus);
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button.contained {
    border: none;
    background: var(--dimui-color-primary);
    color: var(--dimui-color-on-primary);
  }
  button.contained:hover:not(:disabled) {
    background: var(--dimui-color-primary-hover);
  }
  button.outlined {
    border: 1px solid var(--dimui-color-border);
    background: transparent;
    color: var(--dimui-color-text);
  }
  button.outlined:hover:not(:disabled) {
    background: var(--dimui-color-surface-hover);
  }
  button.text {
    border: none;
    background: transparent;
    color: var(--dimui-color-primary);
    padding-inline: 0.55rem;
  }
  button.text:hover:not(:disabled) {
    background: color-mix(in srgb, var(--dimui-color-primary) 12%, transparent);
  }
  button.danger {
    border: 1px solid var(--dimui-color-danger-bg);
    background: transparent;
    color: var(--dimui-color-danger);
  }
  button.danger:hover:not(:disabled) {
    background: color-mix(in srgb, var(--dimui-color-danger) 12%, transparent);
  }
  button.sm {
    min-height: 28px;
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
  }
  button.lg {
    min-height: 44px;
    padding: 0.65rem 1.1rem;
  }
`;

export const Button = define({
  tag: "dimui-button",
  component: (props, { html: tpl, useStyle: style }) => {
    style(styles);
    const variant = props.variant || "contained";
    const size = props.size || "md";
    const disabled = Boolean(props.disabled);
    const type = props.type || "button";
    const onClick =
      typeof props.onClick === "function" ? props.onClick : () => {};
    const label = props.label ?? props.children ?? "";

    return tpl`
      <button
        type="${type}"
        class="${variant} ${size}"
        ?disabled="${disabled}"
        @click="${onClick}"
      >
        ${label}
      </button>
    `;
  },
});
