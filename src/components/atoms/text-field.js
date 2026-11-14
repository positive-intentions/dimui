import { define, html, css, useStyle } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: block;
    width: 100%;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--dimui-space-1);
  }
  label {
    font-size: 0.8rem;
    color: var(--dimui-color-text-muted);
  }
  input {
    width: 100%;
    min-height: 36px;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--dimui-color-border);
    border-radius: var(--dimui-radius);
    background: var(--dimui-color-surface);
    color: var(--dimui-color-text);
    font: inherit;
    font-size: 0.875rem;
  }
  input::placeholder {
    color: var(--dimui-color-text-faint);
  }
  input:focus {
    outline: 2px solid var(--dimui-color-focus);
    outline-offset: 1px;
  }
  input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const TextField = define({
  tag: "dimui-text-field",
  component: (props, { html: tpl, useStyle: style }) => {
    style(styles);
    const id = props.id || "dimui-field";
    const label = props.label || "";
    const value = props.value ?? "";
    const placeholder = props.placeholder || "";
    const type = props.type || "text";
    const disabled = Boolean(props.disabled);
    const autocomplete = props.autocomplete || "off";
    const onInput =
      typeof props.onInput === "function" ? props.onInput : () => {};
    const onKeydown =
      typeof props.onKeydown === "function" ? props.onKeydown : () => {};

    return tpl`
      <div class="field">
        ${label ? tpl`<label for="${id}">${label}</label>` : null}
        <input
          id="${id}"
          type="${type}"
          autocomplete="${autocomplete}"
          placeholder="${placeholder}"
          .value="${value}"
          ?disabled="${disabled}"
          @input="${(e) => onInput(e.target.value, e)}"
          @keydown="${onKeydown}"
        />
      </div>
    `;
  },
});
