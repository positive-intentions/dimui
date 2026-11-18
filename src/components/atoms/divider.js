BP.module(
  "dimui/components/atoms/divider",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
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
  const Divider = define({
    tag: "dimui-divider",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const orientation = props.orientation || "horizontal";
      return tpl`<hr aria-orientation="${orientation}" />`;
    },
  });
  return { Divider };
  },
);
