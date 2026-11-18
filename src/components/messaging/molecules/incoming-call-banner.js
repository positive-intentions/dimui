BP.module(
  "dimui/components/messaging/molecules/incoming-call-banner",
  ["dimui/components/atoms/button", "dimui/components/atoms/avatar"],
  function (button, avatar) {
    const { define, css } = Dim;
    const { Button } = button;
    const { Avatar } = avatar;

    const styles = css`
      :host {
        display: block;
      }

      .banner {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0.5rem 0.75rem;
        padding: 0.75rem;
        border-radius: 12px;
        background: var(--dimui-color-surface, #1e293b);
        border: 1px solid var(--dimui-color-border, #334155);
        color: var(--dimui-color-text, #e2e8f0);
      }

      .banner[hidden] {
        display: none;
      }

      .copy {
        flex: 1;
        min-width: 0;
      }

      .title {
        font-weight: 650;
      }

      .sub {
        font-size: 0.8rem;
        color: var(--dimui-color-text-muted, #94a3b8);
      }

      .actions {
        display: flex;
        gap: 0.4rem;
      }
    `;

    const IncomingCallBanner = define({
      tag: "dimui-incoming-call-banner",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Button, Avatar });

        const open = Boolean(props.open);
        const peer = props.peer || {};
        const kind = props.kind === "video" ? "video" : "voice";
        const name = peer.displayName || "Peer";
        const initials = String(name)
          .split(/\s+/)
          .map((p) => p[0] || "")
          .join("")
          .slice(0, 2)
          .toUpperCase() || "?";
        const onAccept =
          typeof props.onAccept === "function" ? props.onAccept : () => {};
        const onDecline =
          typeof props.onDecline === "function" ? props.onDecline : () => {};

        return tpl`
          <div class="banner" ?hidden="${!open}" role="status">
            <dimui-avatar .props="${{ label: initials, size: "md" }}" />
            <div class="copy">
              <div class="title">Incoming ${kind} call</div>
              <div class="sub">${name}</div>
            </div>
            <div class="actions">
              <dimui-button
                .props="${{
                  label: "Decline",
                  variant: "danger",
                  size: "sm",
                  onClick: onDecline,
                }}"
              />
              <dimui-button
                .props="${{
                  label: "Accept",
                  size: "sm",
                  onClick: onAccept,
                }}"
              />
            </div>
          </div>
        `;
      },
    });

    return { IncomingCallBanner };
  },
);
