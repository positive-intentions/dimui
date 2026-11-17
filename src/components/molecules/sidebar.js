import { define, html, css, useStyle, useScope } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";
import { SearchField } from "./search-field.js";
import { Tree } from "./tree.js";

const styles = css`
  ${themeTokens}
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: var(--dimui-color-surface-2);
    color: var(--dimui-color-text);
    border-right: 1px solid var(--dimui-color-border-subtle);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: var(--dimui-space-2);
    padding: var(--dimui-space-4) var(--dimui-space-4) var(--dimui-space-2);
  }
  .brand h1 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .brand span {
    font-size: 0.7rem;
    color: var(--dimui-color-text-faint);
  }
  .search-wrap {
    padding: var(--dimui-space-2) var(--dimui-space-3) var(--dimui-space-3);
  }
  .tree-wrap {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 var(--dimui-space-2) var(--dimui-space-4);
    -webkit-overflow-scrolling: touch;
  }
`;

export const Sidebar = define({
  tag: "dimui-sidebar",
  component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
    style(styles);
    scope({ SearchField, Tree });

    const nodes = props.nodes || [];
    const selectedId = props.selectedId || "";
    const query = props.query || "";
    const collapsed = props.collapsed || {};
    const onQuery =
      typeof props.onQuery === "function" ? props.onQuery : () => {};
    const onSelect =
      typeof props.onSelect === "function" ? props.onSelect : () => {};
    const onToggle =
      typeof props.onToggle === "function" ? props.onToggle : () => {};

    return tpl`
      <div class="brand">
        <div>
          <h1>dimui</h1>
          <span>Component explorer</span>
        </div>
      </div>
      <div class="search-wrap">
        <dimui-search-field
          .props="${{
            id: "explorer-search",
            value: query,
            placeholder: "Find components",
            onInput: onQuery,
            onClear: () => onQuery(""),
          }}"
        />
      </div>
      <div class="tree-wrap">
        <dimui-tree
          .props="${{
            nodes,
            selectedId,
            query,
            collapsed,
            onSelect,
            onToggle,
          }}"
        />
      </div>
    `;
  },
});
