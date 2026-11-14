import { define, html, css, useStyle, renderChildren } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: block;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: var(--dimui-space-1);
    min-height: var(--dimui-toolbar-height);
    padding: 0 var(--dimui-space-2);
    border-bottom: 1px solid var(--dimui-color-border-subtle);
    background: var(--dimui-color-surface);
  }
  .title {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: 0 var(--dimui-space-2);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--dimui-color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .start,
  .end {
    display: flex;
    align-items: center;
    gap: var(--dimui-space-1);
    flex-shrink: 0;
  }
  .end {
    margin-left: auto;
  }
`;

export const Toolbar = define({
  tag: "dimui-toolbar",
  component: (props, { html: tpl, useStyle: style, renderChildren: render }) => {
    style(styles);
    const title = props.title || "";
    const children = props.children;
    const ariaLabel = props["aria-label"] || "Toolbar";

    return tpl`
      <div class="toolbar" role="toolbar" aria-label="${ariaLabel}">
        <div class="start">
          ${typeof render === "function" ? render(children) : null}
          <slot></slot>
        </div>
        ${title ? tpl`<h2 class="title">${title}</h2>` : tpl`<div class="title"></div>`}
        <div class="end" part="end">
          <slot name="end"></slot>
        </div>
      </div>
    `;
  },
});
