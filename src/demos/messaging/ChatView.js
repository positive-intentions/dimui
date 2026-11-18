BP.module(
  "dimui/demos/messaging/ChatView",
  [
    "dimui/demos/messaging/sharedStyles",
    "dimui/demos/messaging/sharedKeys",
    "dimui/components/messaging/molecules/message-bubble",
    "dimui/components/messaging/molecules/composer",
    "dimui/components/atoms/icon-button",
    "dimui/components/atoms/avatar",
    "dimui/lib/messaging/messages",
  ],
  function (
    __dep0,
    __dep1,
    bubbleMod,
    composerMod,
    iconButton,
    avatarMod,
    messagesLib,
  ) {
  const { define, html, css, useState, useStyle, useScope } = Dim;
  const { appVariables, avatarStyles } = __dep0;
  const { sharedKeys } = __dep1;
  const { MessageBubble } = bubbleMod;
  const { Composer } = composerMod;
  const { IconButton } = iconButton;
  const { Avatar } = avatarMod;
  const { normalizeMessage } = messagesLib;

  function toKitMessage(msg) {
    const direction = msg.type === "sent" ? "out" : "in";
    return normalizeMessage({
      id: msg.id || msg.timestamp + "-" + String(msg.message || "").slice(0, 12),
      direction,
      kind: "text",
      body: msg.message || "",
      status: direction === "out" ? "delivered" : "read",
      createdAt: msg.createdAt || new Date().toISOString(),
    });
  }

  const ChatView = (props, { useState, useStyle, html, css, useScope }) => {
    const data = props.props || props;
    const {
      conversation,
      messages = [],
      onBack,
      onAvatarClick,
      onSend,
    } = data;

    useScope({ MessageBubble, Composer, IconButton, Avatar });
    useStyle(css`
      ${appVariables}
      ${avatarStyles}

      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
      }

      .chat-view {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        min-height: 0;
        background: var(--app-bg, var(--dimui-color-bg, #0f172a));
        color: var(--app-text, var(--dimui-color-text, #e2e8f0));
      }

      .chat-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: var(--app-surface, var(--dimui-color-surface-2, #0b1220));
        border-bottom: 1px solid var(--app-border, var(--dimui-color-border, #334155));
        flex-shrink: 0;
      }

      .header-info {
        flex: 1;
        min-width: 0;
      }

      .header-name {
        font-weight: 600;
        font-size: 1rem;
      }

      .header-status {
        font-size: 0.75rem;
        color: var(--app-text-secondary, var(--dimui-color-text-muted, #94a3b8));
      }

      .header-actions {
        display: flex;
        gap: 0.15rem;
      }

      .header-avatar-btn {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
      }

      .messages {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        -webkit-overflow-scrolling: touch;
      }
    `);

    if (!conversation) {
      return html`<div class="chat-view">No conversation selected</div>`;
    }

    const keys = sharedKeys(conversation.id);
    const headerStatus = conversation.isOnline
      ? "Online"
      : conversation.isGroup
        ? `${conversation.members || 0} members`
        : "Offline";

    const initials = String(conversation.name || "?")
      .split(/\s+/)
      .map((p) => p[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

    const kitMessages = messages.map(toKitMessage).filter(Boolean);

    return html`
      <div class="chat-view">
        <header class="chat-header">
          <dimui-icon-button
            .props="${{
              name: "arrowLeft",
              label: "Back",
              onClick: () => onBack && onBack(),
            }}"
          />
          <button
            class="header-avatar-btn"
            @click="${() => onAvatarClick && onAvatarClick(conversation.id)}"
          >
            <div class="avatar-wrap" data-vt-shared="${keys.avatar}">
              <dimui-avatar
                .props="${{
                  label: initials,
                  size: "sm",
                  online: Boolean(conversation.isOnline),
                }}"
              />
            </div>
          </button>
          <div class="header-info">
            <div class="header-name" data-vt-shared="${keys.name}">${conversation.name}</div>
            <div class="header-status" data-vt-shared="${keys.status}">${headerStatus}</div>
          </div>
          <div class="header-actions">
            <dimui-icon-button
              .props="${{ name: "video", label: "Video call" }}"
            />
            <dimui-icon-button
              .props="${{ name: "call", label: "Voice call" }}"
            />
          </div>
        </header>

        <div class="messages">
          ${kitMessages.map((msg) => html`
            <dimui-message-bubble .props="${{ message: msg }}" />
          `)}
        </div>

        <dimui-composer
          .props="${{
            enabled: true,
            onSend: (text) => {
              if (typeof onSend === "function") onSend(text);
            },
            onAttach: () => {},
            onTyping: () => {},
          }}"
        />
      </div>
    `;
  };

  define({ tag: "dimui-chat-view", component: ChatView });
  const __default = ChatView;
  return { default: __default };
  },
);
