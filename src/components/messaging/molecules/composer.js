BP.module(
  "dimui/components/messaging/molecules/composer",
  [
    "dimui/components/atoms/icon-button",
    "dimui/components/atoms/button",
  ],
  function (iconButton, button) {
    const { define, css } = Dim;
    const { IconButton } = iconButton;
    const { Button } = button;

    const styles = css`
      :host {
        display: block;
        flex-shrink: 0;
      }

      .composer {
        display: flex;
        align-items: flex-end;
        gap: 0.4rem;
        padding: 0.65rem 0.75rem;
        border-top: 1px solid var(--dimui-color-border, #334155);
        background: var(--dimui-color-surface-2, #0b1220);
      }

      .composer.disabled {
        opacity: 0.72;
      }

      .hint {
        flex: 1;
        color: var(--dimui-color-text-muted, #94a3b8);
        font-size: 0.9rem;
        padding: 0.55rem 0.25rem;
      }

      .draft {
        flex: 1;
        min-width: 0;
        resize: none;
        min-height: 40px;
        max-height: 120px;
        padding: 0.55rem 0.7rem;
        border-radius: 12px;
        border: 1px solid var(--dimui-color-border, #334155);
        background: var(--dimui-color-surface, #1e293b);
        color: var(--dimui-color-text, #e2e8f0);
        font: inherit;
      }

      .draft:focus {
        outline: 2px solid var(--dimui-color-primary, #029cfd);
        outline-offset: 1px;
      }

      .hidden-file {
        display: none;
      }
    `;

    const Composer = define({
      tag: "dimui-composer",
      component: (
        props,
        {
          html: tpl,
          useState: state,
          useRef: ref,
          useStyle: style,
          useScope: scope,
        },
      ) => {
        style(styles);
        scope({ IconButton, Button });

        const enabled = props.enabled !== false;
        const disabledHint =
          props.disabledHint || "Wait for connection";
        const onSend =
          typeof props.onSend === "function" ? props.onSend : () => {};
        const onAttach =
          typeof props.onAttach === "function" ? props.onAttach : () => {};
        const onTyping =
          typeof props.onTyping === "function" ? props.onTyping : () => {};

        const [draft, setDraft] = state("");
        const fileRef = ref();
        const draftRef = ref();

        const send = () => {
          var live = draft;
          try {
            var el = draftRef.current;
            if (el && typeof el.value === "string" && el.value) {
              live = el.value;
            }
          } catch (e) {}
          const text = String(live || "").trim();
          if (!enabled || !text) return;
          onSend(text);
          setDraft("");
          onTyping(false);
        };

        const onKeydown = (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        };

        const pickFile = () => {
          if (!enabled) return;
          const input = fileRef.current;
          if (input && input.click) input.click();
        };

        const onFileChange = (e) => {
          const file = e.target && e.target.files && e.target.files[0];
          if (file) {
            onAttach(file);
          }
          if (e.target) e.target.value = "";
        };

        return tpl`
          <div class="composer ${enabled ? "" : "disabled"}">
            <input
              class="hidden-file"
              type="file"
              ref=${fileRef}
              @change="${onFileChange}"
            />
            <dimui-icon-button
              .props="${{
                name: "package",
                label: "Attach",
                disabled: !enabled,
                onClick: pickFile,
              }}"
            />
            ${
              enabled
                ? tpl`
                    <textarea
                      class="draft"
                      rows="1"
                      placeholder="Type a message…"
                      ref=${draftRef}
                      .value="${draft}"
                      @input="${(e) => {
                        setDraft(e.target.value);
                        onTyping(Boolean(e.target.value));
                      }}"
                      @keydown="${onKeydown}"
                    ></textarea>
                    <dimui-icon-button
                      .props="${{
                        name: "send",
                        label: "Send",
                        disabled: false,
                        onClick: send,
                      }}"
                    />
                  `
                : tpl`<div class="hint">${disabledHint}</div>`
            }
          </div>
        `;
      },
    });

    return { Composer };
  },
);
