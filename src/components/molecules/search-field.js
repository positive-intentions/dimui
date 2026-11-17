import { define, html, css, useStyle, useScope } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";
import { Icon } from "../atoms/icon.js";
import { IconButton } from "../atoms/icon-button.js";

const styles = css`
  ${themeTokens}
  :host {
    display: block;
    width: 100%;
  }
  .search {
    display: flex;
    align-items: center;
    gap: var(--dimui-space-1);
    min-height: 36px;
    padding: 0 var(--dimui-space-2) 0 var(--dimui-space-3);
    border: 1px solid var(--dimui-color-border);
    border-radius: var(--dimui-radius);
    background: var(--dimui-color-surface);
  }
  .search:focus-within {
    outline: 2px solid var(--dimui-color-focus);
    outline-offset: 1px;
  }
  .leading {
    color: var(--dimui-color-text-faint);
    display: inline-flex;
  }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: var(--dimui-color-text);
    font: inherit;
    font-size: 0.875rem;
    padding: 0.5rem 0;
  }
  input:focus {
    outline: none;
  }
  input::placeholder {
    color: var(--dimui-color-text-faint);
  }
  dimui-icon-button {
    --dimui-touch: 32px;
  }
`;

export const SearchField = define({
  tag: "dimui-search-field",
  component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
    style(styles);
    scope({ Icon, IconButton });

    const value = props.value ?? "";
    const placeholder = props.placeholder || "Search…";
    const id = props.id || "dimui-search";
    const onInput =
      typeof props.onInput === "function" ? props.onInput : () => {};
    const onClear =
      typeof props.onClear === "function"
        ? props.onClear
        : () => onInput("");

    return tpl`
      <div class="search" role="search">
        <span class="leading" aria-hidden="true">
          <dimui-icon .props="${{ name: "search" }}" />
        </span>
        <input
          id="${id}"
          type="search"
          autocomplete="off"
          placeholder="${placeholder}"
          .value="${value}"
          @input="${(e) => onInput(e.target.value)}"
          />
        ${value
          ? tpl`
              <dimui-icon-button
                .props="${{
                  name: "close",
                  label: "Clear search",
                  size: "sm",
                  onClick: onClear,
                }}"
              />
            `
          : null}
      </div>
    `;
  },
});
