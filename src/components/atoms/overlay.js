import { define, html, css, useStyle } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: contents;
  }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: var(--dimui-z-overlay);
    background: rgba(2, 6, 23, 0.55);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--dimui-transition);
  }
  .overlay.open {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const Overlay = define({
  tag: "dimui-overlay",
  component: (props, { html: tpl, useStyle: style }) => {
    style(styles);
    const open = Boolean(props.open);
    const onClick =
      typeof props.onClick === "function" ? props.onClick : () => {};
    const className = open ? "overlay open" : "overlay";
    const hidden = open ? "false" : "true";
    return tpl`
      <div
        class="${className}"
        aria-hidden="${hidden}"
        @click="${onClick}"
      ></div>
    `;
  },
});
