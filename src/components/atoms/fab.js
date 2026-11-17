import { define, html, css, useStyle, useScope } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";
import { Icon } from "./icon.js";

const styles = css`
  ${themeTokens}
  :host {
    display: inline-flex;
  }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: var(--dimui-color-primary);
    color: var(--dimui-color-on-primary);
    cursor: pointer;
    box-shadow: var(--dimui-shadow);
  }
  button:hover {
    background: var(--dimui-color-primary-hover);
  }
  button:focus-visible {
    outline: 2px solid var(--dimui-color-focus);
    outline-offset: 2px;
  }
  dimui-icon {
    width: 1.35rem;
    height: 1.35rem;
  }
`;

export const Fab = define({
  tag: "dimui-fab",
  component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
    style(styles);
    scope({ Icon });
    const name = props.name || "plus";
    const label = props.label || props["aria-label"] || "Action";
    const onClick =
      typeof props.onClick === "function" ? props.onClick : () => {};
    return tpl`
      <button type="button" aria-label="${label}" @click="${onClick}">
        <dimui-icon .props="${{ name }}" />
      </button>
    `;
  },
});
