BP.module(
  "dimui/stories/pad",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
  const styles = css`
    ${themeTokens}
    :host {
      display: block;
      min-height: 100%;
      padding: 1.5rem;
      font-family: var(--dimui-font-family);
      background: var(--dimui-color-bg);
      color: var(--dimui-color-text);
      box-sizing: border-box;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 420px;
    }
    .full {
      max-width: 720px;
    }
  `;
  const StoryPad = define({
    tag: "dimui-story-pad",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const layout = props.layout || "stack";
      const content = props.content || null;
      return tpl`<div class="${layout}">${content}</div>`;
    },
  });
  return { StoryPad };
  },
);
