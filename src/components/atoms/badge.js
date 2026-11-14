import { define, html, css, useStyle } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: inline-flex;
  }
  span {
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.45rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--dimui-color-primary) 18%, transparent);
    color: var(--dimui-color-primary);
  }
  span.muted {
    background: var(--dimui-color-surface-hover);
    color: var(--dimui-color-text-muted);
  }
`;

export const Badge = define({
  tag: "dimui-badge",
  component: (props, { html: tpl, useStyle: style }) => {
    style(styles);
    const label = props.label ?? props.children ?? "";
    const variant = props.variant || "primary";
    return tpl`<span class="${variant}">${label}</span>`;
  },
});
