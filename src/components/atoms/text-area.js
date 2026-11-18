BP.module(
  "dimui/components/atoms/text-area",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
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
    textarea {
      width: 100%;
      min-height: 280px;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--dimui-color-border);
      border-radius: var(--dimui-radius);
      background: var(--dimui-color-surface);
      color: var(--dimui-color-text);
      font: inherit;
      font-size: 0.875rem;
      line-height: 1.5;
      resize: vertical;
    }
    textarea::placeholder {
      color: var(--dimui-color-text-faint);
    }
    textarea:focus {
      outline: 2px solid var(--dimui-color-focus);
      outline-offset: 1px;
    }
    textarea:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  `;
  const TextArea = define({
    tag: "dimui-text-area",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const id = props.id || "dimui-textarea";
      const label = props.label || "";
      const value = props.value ?? "";
      const placeholder = props.placeholder || "";
      const disabled = Boolean(props.disabled);
      const rows = Number(props.rows) || 10;
      const onInput =
        typeof props.onInput === "function" ? props.onInput : () => {};

      return tpl`
        <div class="field">
          ${label ? tpl`<label for="${id}">${label}</label>` : null}
          <textarea
            id="${id}"
            rows="${rows}"
            placeholder="${placeholder}"
            .value="${value}"
            ?disabled="${disabled}"
            @input="${(e) => onInput(e.target.value, e)}"
          ></textarea>
        </div>
      `;
    },
  });
  return { TextArea };
  },
);
