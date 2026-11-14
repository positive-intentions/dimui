import { define, html, css, useStyle } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: inline-flex;
  }
  .stepper {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid var(--dimui-color-border);
    border-radius: var(--dimui-radius);
    padding: 0.15rem;
    background: var(--dimui-color-surface);
  }
  button {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--dimui-radius-sm);
    background: transparent;
    color: var(--dimui-color-text);
    font: inherit;
    font-size: 1rem;
    cursor: pointer;
  }
  button:hover {
    background: var(--dimui-color-surface-hover);
  }
  .value {
    min-width: 1.5rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 0.875rem;
  }
`;

export const QtyStepper = define({
  tag: "dimui-qty-stepper",
  component: (props, { html: tpl, useStyle: style }) => {
    style(styles);
    const value = Number(props.value) || 1;
    const onChange =
      typeof props.onChange === "function" ? props.onChange : () => {};
    return tpl`
      <div class="stepper">
        <button type="button" aria-label="Decrease" @click="${() => onChange(Math.max(1, value - 1))}">−</button>
        <span class="value">${value}</span>
        <button type="button" aria-label="Increase" @click="${() => onChange(value + 1)}">+</button>
      </div>
    `;
  },
});
