BP.module(
  "dimui/components/messaging/molecules/chat-header",
  [
    "dimui/components/atoms/avatar",
    "dimui/components/atoms/icon-button",
    "dimui/components/molecules/overflow-menu",
  ],
  function (avatar, iconButton, overflow) {
    const { define, css } = Dim;
    const { Avatar } = avatar;
    const { IconButton } = iconButton;
    const { OverflowMenu } = overflow;

    const styles = css`
      :host {
        display: block;
        flex-shrink: 0;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.65rem 0.75rem;
        background: var(--dimui-color-surface-2, #0b1220);
        border-bottom: 1px solid var(--dimui-color-border, #334155);
      }

      .info {
        flex: 1;
        min-width: 0;
      }

      .name {
        font-weight: 650;
        font-size: 1rem;
        color: var(--dimui-color-text, #e2e8f0);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .status {
        font-size: 0.75rem;
        color: var(--dimui-color-text-muted, #94a3b8);
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 0.15rem;
      }
    `;

    const ChatHeader = define({
      tag: "dimui-chat-header",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Avatar, IconButton, OverflowMenu });

        const peer = props.peer || {};
        const title = peer.displayName || "Peer";
        const initials = String(title)
          .split(/\s+/)
          .map((p) => p[0] || "")
          .join("")
          .slice(0, 2)
          .toUpperCase() || "?";
        const online = Boolean(props.online);
        const typing = Boolean(props.typing);
        const status = typing
          ? "typing…"
          : online
            ? "online"
            : "offline";

        const onVoice =
          typeof props.onVoice === "function" ? props.onVoice : () => {};
        const onVideo =
          typeof props.onVideo === "function" ? props.onVideo : () => {};
        const onLock =
          typeof props.onLock === "function" ? props.onLock : () => {};
        const menuItems = Array.isArray(props.menuItems) ? props.menuItems : [];

        return tpl`
          <header class="header">
            <dimui-avatar
              .props="${{
                label: initials,
                size: "md",
                online,
              }}"
            />
            <div class="info">
              <div class="name">${title}</div>
              <div class="status">${status}</div>
            </div>
            <div class="actions">
              <dimui-icon-button
                .props="${{
                  name: "call",
                  label: "Voice call",
                  onClick: onVoice,
                }}"
              />
              <dimui-icon-button
                .props="${{
                  name: "video",
                  label: "Video call",
                  onClick: onVideo,
                }}"
              />
              <dimui-overflow-menu .props="${{ items: menuItems }}" />
              <dimui-icon-button
                .props="${{
                  name: "lock",
                  label: "Lock vault",
                  onClick: onLock,
                }}"
              />
            </div>
          </header>
        `;
      },
    });

    return { ChatHeader };
  },
);
