BP.module(
  "dimui/components/molecules/view-header",
  ["dimui/theme","dimui/components/atoms/icon-button"],
  function (__dep0, __dep1) {
  const { define, html, css, useStyle, useScope } = Dim;
  const { themeTokens } = __dep0;
  const { IconButton } = __dep1;
  const styles = css`
    ${themeTokens}
    :host {
      display: block;
    }
    .header {
      display: flex;
      align-items: center;
      gap: var(--dimui-space-2);
      min-height: 52px;
      padding: 0 var(--dimui-space-2);
      border-bottom: 1px solid var(--dimui-color-border-subtle);
      background: var(--dimui-color-surface);
    }
    .title {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .end {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-left: auto;
    }
  `;
  const ViewHeader = define({
    tag: "dimui-view-header",
    component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
      style(styles);
      scope({ IconButton });
      const title = props.title || "";
      const showBack = props.showBack !== false;
      const onBack =
        typeof props.onBack === "function" ? props.onBack : () => {};
      const end = props.end || null;

      return tpl`
        <div class="header">
          ${showBack
            ? tpl`
                <dimui-icon-button
                  .props="${{
                    name: "arrowLeft",
                    label: "Back",
                    size: "sm",
                    onClick: onBack,
                  }}"
                />
              `
            : null}
          <h2 class="title">${title}</h2>
          <div class="end">${end}</div>
        </div>
      `;
    },
  });
  return { ViewHeader };
  },
);
