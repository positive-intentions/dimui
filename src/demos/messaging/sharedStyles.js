BP.module(
  "dimui/demos/messaging/sharedStyles",
  [],
  function () {
  const { css } = Dim;
  const appVariables = css`
    :host {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: var(--app-text);
    }

    /*
     * Theme tokens only on the messaging app root (host[data-theme] /
     * .messaging-app). Nested views include this sheet too — a bare :host
     * light block would reset vars and wipe inherited dark mode.
     */
    :host([data-theme="light"]),
    .messaging-app[data-theme="light"],
    .messaging-app:not([data-theme]) {
      --app-primary: #1976d2;
      --app-primary-light: #e3f2fd;
      --app-bg: #f5f5f5;
      --app-surface: #ffffff;
      --app-surface-hover: #fafafa;
      --app-text: #212121;
      --app-text-secondary: #757575;
      --app-border: #e0e0e0;
      --app-online: #4caf50;
      --app-sent: #1976d2;
      --app-received: #ffffff;
      --app-sidebar-width: 72px;
      --app-radius: 12px;
    }

    :host([data-theme="dark"]),
    .messaging-app[data-theme="dark"] {
      --app-primary: #029cfd;
      --app-primary-light: #1a3a5c;
      --app-bg: #0f172a;
      --app-surface: #1e293b;
      --app-surface-hover: #334155;
      --app-text: #e2e8f0;
      --app-text-secondary: #94a3b8;
      --app-border: #334155;
      --app-received: #334155;
      --app-online: #4caf50;
      --app-sent: #1976d2;
      --app-sidebar-width: 72px;
      --app-radius: 12px;
    }
  `;
  const avatarStyles = css`
    .avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--app-primary-light);
      display: block;
    }

    .avatar.avatar-sm {
      width: 32px;
      height: 32px;
    }

    .avatar.avatar-lg {
      width: 56px;
      height: 56px;
    }

    .avatar.emoji-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      background: var(--app-primary-light);
    }

    .online-dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--app-online);
      border: 2px solid var(--app-surface);
    }
  `;
  return { appVariables, avatarStyles };
  },
);
