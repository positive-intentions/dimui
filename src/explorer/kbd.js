BP.module(
  "dimui/explorer/kbd",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
  const styles = css`
    ${themeTokens}
    :host {
      display: inline-flex;
    }
    kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.4rem;
      padding: 0.1rem 0.4rem;
      border: 1px solid var(--dimui-color-border);
      border-bottom-width: 2px;
      border-radius: var(--dimui-radius-sm);
      background: var(--dimui-color-surface-2);
      color: var(--dimui-color-text-muted);
      font-family: var(--dimui-font-mono);
      font-size: 0.75rem;
      line-height: 1.2;
    }
  `;
  const Kbd = define({
    tag: "dimui-kbd",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const keys = props.keys || props.label || "";
      return tpl`<kbd>${keys}</kbd>`;
    },
  });
  return { Kbd };
  },
);
