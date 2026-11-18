BP.module("dimui/lib/messaging/tokens", ["dimui/theme"], function (theme) {
  const { css } = Dim;
  const { themeTokens } = theme;

  const messagingTokens = css`
    ${themeTokens}

    :host {
      display: block;
      width: 100%;
      min-height: 100%;
      height: 100%;
      color: var(--dimui-color-text);
      font-family: var(--dimui-font-family, "Segoe UI", system-ui, sans-serif);

      --chat-bg: var(--dimui-color-bg);
      --chat-surface: var(--dimui-color-surface-2);
      --chat-surface-2: var(--dimui-color-surface);
      --chat-surface-hover: var(--dimui-color-surface-hover);
      --chat-border: var(--dimui-color-border);
      --chat-text: var(--dimui-color-text);
      --chat-text-muted: var(--dimui-color-text-muted);
      --chat-text-faint: var(--dimui-color-text-faint);
      --chat-danger: var(--dimui-color-danger);
      --chat-primary: var(--dimui-color-primary);
      --chat-primary-soft: color-mix(
        in srgb,
        var(--dimui-color-primary) 18%,
        transparent
      );
      --chat-bubble-out: var(--dimui-bubble-out);
      --chat-bubble-out-text: var(--dimui-bubble-out-text);
      --chat-bubble-in: var(--dimui-bubble-in);
      --chat-bubble-in-text: var(--dimui-bubble-in-text);
      --chat-ok: var(--dimui-color-ok);
    }

    * {
      box-sizing: border-box;
    }
  `;

  return { messagingTokens };
});
