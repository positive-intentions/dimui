BP.module(
  "dimui/components/messaging/organisms/contact-details",
  [
    "dimui/lib/messaging/tokens",
    "dimui/components/atoms/avatar",
    "dimui/components/atoms/empty-state",
    "dimui/components/atoms/icon-button",
  ],
  function (tokens, avatar, empty, iconButton) {
    const { define, css } = Dim;
    const { messagingTokens } = tokens;
    const { Avatar } = avatar;
    const { EmptyState } = empty;
    const { IconButton } = iconButton;

    const styles = css`
      ${messagingTokens}

      :host {
        display: block;
        height: 100%;
        min-height: 0;
      }

      .page {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: var(--dimui-color-bg);
        color: var(--dimui-color-text);
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 0.75rem;
        border-bottom: 1px solid var(--dimui-color-border);
        background: var(--dimui-color-surface-2);
        flex-shrink: 0;
      }

      .toolbar-title {
        flex: 1;
        font-weight: 650;
        font-size: 1rem;
      }

      .body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 1.5rem 1.25rem;
      }

      .hero {
        text-align: center;
        padding: 1rem 0 1.5rem;
      }

      .avatar-wrap {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
      }

      .name {
        margin: 0 0 0.25rem;
        font-size: 1.375rem;
        font-weight: 600;
      }

      .status {
        margin: 0;
        color: var(--dimui-color-text-muted);
        font-size: 0.875rem;
      }

      .info {
        padding: 0.5rem 0;
      }

      .info-row {
        padding: 0.875rem 0;
        border-bottom: 1px solid var(--dimui-color-border);
      }

      .info-label {
        font-size: 0.75rem;
        color: var(--dimui-color-text-muted);
        margin-bottom: 0.25rem;
      }

      .info-value {
        font-size: 0.9375rem;
      }
    `;

    function initialsFrom(name) {
      const title = String(name || "").trim() || "?";
      return (
        title
          .split(/\s+/)
          .map((p) => p[0] || "")
          .join("")
          .slice(0, 2)
          .toUpperCase() || "?"
      );
    }

    const ContactDetails = define({
      tag: "dimui-messaging-contact",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Avatar, EmptyState, IconButton });

        const theme = props.theme === "light" ? "light" : "dark";
        const contact = props.contact || null;
        const online = Boolean(props.online);
        const onBack =
          typeof props.onBack === "function" ? props.onBack : () => {};

        if (!contact || (!contact.displayName && !contact.handle)) {
          return tpl`
            <div class="page frame" data-theme="${theme}">
              <div class="toolbar">
                <dimui-icon-button
                  .props="${{
                  name: "arrowLeft",
                  label: "Back",
                  onClick: onBack,
                }}"
              />
              <div class="toolbar-title">Contact</div>
            </div>
            <div class="body">
              <dimui-empty-state
                .props="${{
                  title: "No contact",
                  hint: "Connect with a peer to see their details.",
                }}"
              />
            </div>
          </div>
        `;
      }

      const name = String(contact.displayName || "Peer");
      const handle = String(contact.handle || "").replace(/^@/, "");

      return tpl`
        <div class="page frame" data-theme="${theme}">
          <div class="toolbar">
            <dimui-icon-button
              .props="${{
                name: "arrowLeft",
                label: "Back",
                onClick: onBack,
              }}"
            />
            <div class="toolbar-title">Contact</div>
          </div>
            <div class="body">
              <div class="hero">
                <div class="avatar-wrap">
                  <dimui-avatar
                    .props="${{
                      label: initialsFrom(name),
                      size: "xl",
                      online,
                    }}"
                  />
                </div>
                <h2 class="name">${name}</h2>
                <p class="status">${online ? "Online" : "Offline"}</p>
              </div>
              <div class="info">
                ${
                  handle
                    ? tpl`
                        <div class="info-row">
                          <div class="info-label">Handle</div>
                          <div class="info-value">@${handle}</div>
                        </div>
                      `
                    : null
                }
                <div class="info-row">
                  <div class="info-label">Display name</div>
                  <div class="info-value">${name}</div>
                </div>
              </div>
            </div>
          </div>
        `;
      },
    });

    return { ContactDetails };
  },
);
