BP.module(
  "dimui/components/messaging/molecules/message-bubble",
  ["dimui/lib/messaging/messages", "dimui/components/atoms/button"],
  function (messages, button) {
    const { define, css } = Dim;
    const { tickMarks, formatTime, normalizeMessage } = messages;
    const { Button } = button;

    const styles = css`
      :host {
        display: block;
      }

      .row {
        display: flex;
        margin: 0.35rem 0;
      }

      .row.out {
        justify-content: flex-end;
      }

      .row.in {
        justify-content: flex-start;
      }

      .bubble {
        max-width: min(78%, 420px);
        padding: 0.55rem 0.75rem;
        border-radius: 14px;
        line-height: 1.4;
        word-break: break-word;
      }

      .row.out .bubble {
        background: var(--dimui-bubble-out, #029cfd);
        color: var(--dimui-bubble-out-text, #0f172a);
        border-bottom-right-radius: 4px;
      }

      .row.in .bubble {
        background: var(--dimui-bubble-in, #1e293b);
        color: var(--dimui-bubble-in-text, #e2e8f0);
        border-bottom-left-radius: 4px;
      }

      .meta {
        display: flex;
        justify-content: flex-end;
        gap: 0.35rem;
        margin-top: 0.25rem;
        font-size: 0.7rem;
        opacity: 0.85;
      }

      .file-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .progress {
        height: 6px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.2);
        overflow: hidden;
        margin: 0.35rem 0;
      }

      .progress > span {
        display: block;
        height: 100%;
        background: currentColor;
        opacity: 0.7;
      }

      .file-actions {
        margin-top: 0.35rem;
      }
    `;

    const MessageBubble = define({
      tag: "dimui-message-bubble",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Button });

        const raw =
          props && Object.prototype.hasOwnProperty.call(props, "message")
            ? props.message
            : props;
        const msg = normalizeMessage(raw);
        if (!msg) return tpl``;

        const onCancelFile =
          typeof props.onCancelFile === "function"
            ? props.onCancelFile
            : () => {};

        const isOut = msg.direction === "out";
        const ticks = isOut ? tickMarks(msg.status) : "";
        const time = formatTime(msg.createdAt);
        const att = msg.attachment;
        const inProgress =
          att &&
          (att.phase === "encrypting" ||
            att.phase === "sending" ||
            att.phase === "receiving");

        return tpl`
          <div class="row ${msg.direction}">
            <div class="bubble">
              ${
                msg.kind === "file"
                  ? tpl`
                      <div class="file-name">${att.name}</div>
                      <div>${att.phase || "file"} · ${att.size || 0} bytes</div>
                      ${
                        inProgress
                          ? tpl`
                              <div class="progress" aria-hidden="true">
                                <span style="width: ${att.progress || 0}%"></span>
                              </div>
                              <div class="file-actions">
                                <dimui-button
                                  .props="${{
                                    label: "Cancel",
                                    variant: "outlined",
                                    size: "sm",
                                    onClick: () => onCancelFile(msg.id),
                                  }}"
                                />
                              </div>
                            `
                          : null
                      }
                    `
                  : msg.body
              }
              <div class="meta">
                <span>${time}</span>
                ${isOut ? tpl`<span>${ticks}</span>` : null}
              </div>
            </div>
          </div>
        `;
      },
    });

    return { MessageBubble };
  },
);
