BP.module(
  "dimui/components/atoms/empty-state",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
  const styles = css`
    ${themeTokens}
    :host {
      display: block;
    }
    .empty {
      display: grid;
      place-items: center;
      gap: var(--dimui-space-2);
      padding: 2.5rem 1.5rem;
      text-align: center;
    }
    .title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--dimui-color-text);
    }
    .hint {
      margin: 0;
      font-size: 0.875rem;
      color: var(--dimui-color-text-muted);
      line-height: 1.45;
    }
  `;
  const EmptyState = define({
    tag: "dimui-empty-state",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const title = props.title || "Nothing here";
      const hint = props.hint || "";
      return tpl`
        <div class="empty">
          <p class="title">${title}</p>
          ${hint ? tpl`<p class="hint">${hint}</p>` : null}
        </div>
      `;
    },
  });
  return { EmptyState };
  },
);
