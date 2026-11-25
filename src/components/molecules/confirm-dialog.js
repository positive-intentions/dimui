BP.module(
  "dimui/components/molecules/confirm-dialog",
  ["dimui/theme", "dimui/components/atoms/button"],
  function (theme, button) {
    const { define, css, useStyle, useScope } = Dim;
    const { themeTokens } = theme;
    const { Button } = button;

    const styles = css`
      ${themeTokens}
      :host {
        display: contents;
      }

      .confirm-dialog {
        position: fixed;
        inset: 0;
        z-index: 1100;
        display: grid;
        place-items: center;
        padding: 1rem;
      }

      .confirm-dialog[hidden] {
        display: none;
      }

      .confirm-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(2, 6, 23, 0.55);
      }

      .confirm-panel {
        position: relative;
        width: min(360px, 100%);
        background: var(--dimui-color-surface-2, #0b1220);
        border: 1px solid var(--dimui-color-border, #334155);
        border-radius: var(--dimui-radius-lg, 12px);
        padding: 1.25rem;
        box-shadow: var(--dimui-shadow, 0 16px 40px rgba(0, 0, 0, 0.35));
        color: var(--dimui-color-text, #e2e8f0);
      }

      .confirm-panel h3 {
        margin: 0 0 0.5rem;
        font-size: 1.0625rem;
      }

      .confirm-panel p {
        margin: 0 0 1.25rem;
        color: var(--dimui-color-text-muted, #94a3b8);
        font-size: 0.9rem;
        line-height: 1.45;
      }

      .confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }
    `;

    const ConfirmDialog = define({
      tag: "dimui-confirm-dialog",
      inputs: Dim.t.record({
        open: Dim.t.bool({ onInvalid: "coerce", default: false }),
        title: Dim.t.string({
          max: 200,
          onInvalid: "coerce",
          default: "Confirm",
        }),
        body: Dim.t.string({ max: 2000, onInvalid: "coerce", default: "" }),
        confirmLabel: Dim.t.string({
          max: 64,
          onInvalid: "coerce",
          default: "Confirm",
        }),
        confirmVariant: Dim.t.enum(
          ["danger", "contained", "outlined", "text"],
          { onInvalid: "coerce", default: "danger" },
        ),
        onConfirm: Dim.t.fn([]),
        onCancel: Dim.t.fn([]),
      }),
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Button });

        const open = Boolean(props.open);
        const title = props.title || "Confirm";
        const body = props.body || "";
        const confirmLabel = props.confirmLabel || "Confirm";
        const confirmVariant = props.confirmVariant || "danger";
        const onConfirm = props.onConfirm;
        const onCancel = props.onCancel;

        return tpl`
          <div class="confirm-dialog" ?hidden="${!open}">
            <div class="confirm-backdrop" @click="${onCancel}"></div>
            <div class="confirm-panel" role="dialog" aria-modal="true">
              <h3>${title}</h3>
              <p>${body}</p>
              <div class="confirm-actions">
                <dimui-button
                  .props="${{
                    label: "Cancel",
                    variant: "outlined",
                    size: "sm",
                    onClick: onCancel,
                  }}"
                />
                <dimui-button
                  .props="${{
                    label: confirmLabel,
                    variant: confirmVariant,
                    size: "sm",
                    onClick: onConfirm,
                  }}"
                />
              </div>
            </div>
          </div>
        `;
      },
    });

    return { ConfirmDialog };
  },
);
