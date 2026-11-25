BP.module(
  "dimui/components/messaging/organisms/chat-thread",
  [
    "dimui/lib/messaging/tokens",
    "dimui/lib/messaging/messages",
    "dimui/components/messaging/molecules/chat-header",
    "dimui/components/messaging/molecules/composer",
    "dimui/components/messaging/molecules/message-bubble",
    "dimui/components/messaging/molecules/incoming-call-banner",
    "dimui/components/atoms/empty-state",
  ],
  function (tokens, messagesLib, header, composer, bubble, banner, empty) {
    const { define, css } = Dim;
    const { messagingTokens } = tokens;
    const { withDateChips } = messagesLib;
    const { ChatHeader } = header;
    const { Composer } = composer;
    const { MessageBubble } = bubble;
    const { IncomingCallBanner } = banner;
    const { EmptyState } = empty;

    const styles = css`
      ${messagingTokens}

      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
      }

      .thread {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: var(--dimui-color-bg);
        color: var(--dimui-color-text);
      }

      .messages {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
      }

      .chip {
        align-self: center;
        margin: 0.5rem 0;
        padding: 0.2rem 0.65rem;
        border-radius: 999px;
        background: var(--dimui-color-surface);
        color: var(--dimui-color-text-muted);
        font-size: 0.75rem;
      }
    `;

    const ChatThread = define({
      tag: "dimui-chat-thread",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({
          ChatHeader,
          Composer,
          MessageBubble,
          IncomingCallBanner,
          EmptyState,
        });

        const theme = props.theme === "light" ? "light" : "dark";
        const peer = props.peer || {};
        const connected = Boolean(props.connected);
        const online = Boolean(props.online);
        const typing = Boolean(props.typing);
        const list = Array.isArray(props.messages) ? props.messages : [];
        const rows = withDateChips(list);
        const incomingOpen = Boolean(props.incomingOpen);
        const incomingKind = props.incomingKind || "voice";

        const onSend =
          typeof props.onSend === "function" ? props.onSend : () => {};
        const onAttach =
          typeof props.onAttach === "function" ? props.onAttach : () => {};
        const onTyping =
          typeof props.onTyping === "function" ? props.onTyping : () => {};
        const onVoice =
          typeof props.onVoice === "function" ? props.onVoice : () => {};
        const onVideo =
          typeof props.onVideo === "function" ? props.onVideo : () => {};
        const onLock =
          typeof props.onLock === "function" ? props.onLock : () => {};
        const onPeerClick =
          typeof props.onPeerClick === "function" ? props.onPeerClick : null;
        const onCancelFile =
          typeof props.onCancelFile === "function"
            ? props.onCancelFile
            : () => {};
        const onAcceptIncoming =
          typeof props.onAcceptIncoming === "function"
            ? props.onAcceptIncoming
            : () => {};
        const onDeclineIncoming =
          typeof props.onDeclineIncoming === "function"
            ? props.onDeclineIncoming
            : () => {};
        const menuItems = Array.isArray(props.menuItems) ? props.menuItems : [];

        return tpl`
          <div class="thread frame" data-theme="${theme}">
            <dimui-chat-header
              .props="${{
                peer,
                online,
                typing,
                onVoice,
                onVideo,
                onLock,
                onPeerClick,
                menuItems,
              }}"
            />
            <dimui-incoming-call-banner
              .props="${{
                open: incomingOpen,
                peer,
                kind: incomingKind,
                onAccept: onAcceptIncoming,
                onDecline: onDeclineIncoming,
              }}"
            />
            <div class="messages">
              ${
                rows.length
                  ? rows.map((row) => {
                      if (row.type === "chip") {
                        return tpl`<div class="chip">${row.label}</div>`;
                      }
                      return tpl`
                        <dimui-message-bubble
                          .props="${{
                            message: row.message,
                            onCancelFile,
                          }}"
                        />
                      `;
                    })
                  : tpl`
                      <dimui-empty-state
                        .props="${{
                          title: "No messages yet",
                          hint: "Say hello once you are connected.",
                        }}"
                      />
                    `
              }
            </div>
            <dimui-composer
              .props="${{
                enabled: connected,
                disabledHint: connected
                  ? "Waiting for peer…"
                  : "Wait for connection",
                onSend,
                onAttach,
                onTyping,
              }}"
            />
          </div>
        `;
      },
    });

    return { ChatThread };
  },
);
