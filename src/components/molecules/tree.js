import { define, html, css, useStyle, useScope } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";
import { Icon } from "../atoms/icon.js";

const styles = css`
  ${themeTokens}
  :host {
    display: block;
  }
  .tree {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .group,
  .leaf {
    margin: 0;
  }
  .group-btn,
  .leaf-btn {
    display: flex;
    align-items: center;
    gap: var(--dimui-space-2);
    width: 100%;
    min-height: 32px;
    padding: 0.35rem 0.5rem;
    border: none;
    border-radius: var(--dimui-radius-sm);
    background: transparent;
    color: var(--dimui-color-text);
    font: inherit;
    font-size: 0.85rem;
    text-align: left;
    cursor: pointer;
  }
  .group-btn {
    color: var(--dimui-color-text-muted);
    font-weight: 600;
    text-transform: none;
  }
  .group-btn:hover,
  .leaf-btn:hover {
    background: var(--dimui-color-surface-hover);
  }
  .leaf-btn.active {
    background: color-mix(in srgb, var(--dimui-color-primary) 16%, transparent);
    color: var(--dimui-color-primary);
  }
  .leaf-btn:focus-visible,
  .group-btn:focus-visible {
    outline: 2px solid var(--dimui-color-focus);
    outline-offset: -1px;
  }
  .children {
    list-style: none;
    margin: 0;
    padding: 0 0 0 0.85rem;
  }
  .chevron {
    width: 0.9rem;
    height: 0.9rem;
    color: var(--dimui-color-text-faint);
    flex-shrink: 0;
  }
  .spacer {
    width: 0.9rem;
    flex-shrink: 0;
  }
`;

function filterNodes(nodes, query) {
  if (!query) return nodes;
  const q = query.toLowerCase();
  const walk = (list) =>
    list
      .map((node) => {
        if (node.type === "story") {
          return node.name.toLowerCase().includes(q) ||
            node.id.toLowerCase().includes(q)
            ? node
            : null;
        }
        const children = walk(node.children || []);
        if (children.length === 0 && !node.name.toLowerCase().includes(q)) {
          return null;
        }
        return { ...node, children };
      })
      .filter(Boolean);
  return walk(nodes);
}

function containsStory(node, storyId) {
  if (!storyId) return false;
  if (node.type === "story") return node.id === storyId;
  return (node.children || []).some((child) => containsStory(child, storyId));
}

export const Tree = define({
  tag: "dimui-tree",
  component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
    style(styles);
    scope({ Icon });

    const nodes = Array.isArray(props.nodes) ? props.nodes : [];
    const selectedId = props.selectedId || "";
    const query = props.query || "";
    const collapsed = props.collapsed || {};
    const onSelect =
      typeof props.onSelect === "function" ? props.onSelect : () => {};
    const onToggle =
      typeof props.onToggle === "function" ? props.onToggle : () => {};

    const filtered = filterNodes(nodes, query);

    const renderNode = (node, depth = 0) => {
      if (node.type === "story") {
        const leafClass =
          node.id === selectedId ? "leaf-btn active" : "leaf-btn";
        const selected = node.id === selectedId ? "true" : "false";
        const pad = `${0.5 + depth * 0.75}rem`;
        return tpl`
          <li class="leaf" role="none">
            <button
              type="button"
              class="${leafClass}"
              role="treeitem"
              aria-selected="${selected}"
              style="padding-left: ${pad}"
              @click="${() => onSelect(node.id)}"
            >
              <span class="spacer"></span>
              <span>${node.name}</span>
            </button>
          </li>
        `;
      }

      // Groups start collapsed; only an explicit `false` means expanded.
      // Keep the path to the selected story open; search expands all matches.
      const isCollapsed =
        collapsed[node.id] !== false &&
        !query &&
        !containsStory(node, selectedId);
      const expanded = isCollapsed ? "false" : "true";
      const chevron = isCollapsed ? "chevronRight" : "chevronDown";
      const pad = `${0.5 + depth * 0.75}rem`;
      return tpl`
        <li class="group" role="none">
          <button
            type="button"
            class="group-btn"
            role="treeitem"
            aria-expanded="${expanded}"
            style="padding-left: ${pad}"
            @click="${() => onToggle(node.id)}"
          >
            <span class="chevron">
              <dimui-icon
                .props="${{ name: chevron }}"
              ></dimui-icon>
            </span>
            <span>${node.name}</span>
          </button>
          ${!isCollapsed
            ? tpl`
                <ul class="children" role="group">
                  ${(node.children || []).map((child) =>
                    renderNode(child, depth + 1),
                  )}
                </ul>
              `
            : null}
        </li>
      `;
    };

    return tpl`
      <ul class="tree" role="tree" aria-label="Stories">
        ${filtered.length === 0
          ? tpl`<li class="leaf"><span class="leaf-btn" style="cursor:default;color:var(--dimui-color-text-faint)">No matches</span></li>`
          : filtered.map((node) => renderNode(node))}
      </ul>
    `;
  },
});
