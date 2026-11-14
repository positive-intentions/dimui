import { define, html, css, useStyle } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: block;
  }
  hr {
    margin: 0;
    border: none;
    border-top: 1px solid var(--dimui-color-border-subtle);
  }
  :host([orientation="vertical"]) {
    display: inline-block;
    height: 100%;
    align-self: stretch;
  }
  :host([orientation="vertical"]) hr {
    width: 1px;
    height: 100%;
    border: none;
    border-left: 1px solid var(--dimui-color-border-subtle);
  }
`;

export const Divider = define({
  tag: "dimui-divider",
  component: (props, { html: tpl, useStyle: style }) => {
    style(styles);
    const orientation = props.orientation || "horizontal";
    return tpl`<hr aria-orientation="${orientation}" />`;
  },
});
