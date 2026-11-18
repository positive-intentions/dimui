BP.module("dimui/lib/notes/tokens", ["dimui/theme"], function (theme) {
  const { css } = Dim;
  const { themeTokens } = theme;

  /**
   * Notes kit aliases onto canonical dimui palette.
   * Prefer --dimui-color-* in new code; --notes-* kept for kit styles.
   */
  const notesTokens = css`
    ${themeTokens}

    :host {
      display: block;
      width: 100%;
      min-height: 100%;
      height: 100%;
      color: var(--notes-text);
      font-family: var(--dimui-font-family, "Segoe UI", system-ui, sans-serif);

      --notes-bg: var(--dimui-color-bg);
      --notes-surface: var(--dimui-color-surface-2);
      --notes-surface-2: var(--dimui-color-surface);
      --notes-surface-hover: var(--dimui-color-surface-hover);
      --notes-border: var(--dimui-color-border);
      --notes-text: var(--dimui-color-text);
      --notes-text-muted: var(--dimui-color-text-muted);
      --notes-text-faint: var(--dimui-color-text-faint);
      --notes-danger: var(--dimui-color-danger);
      --notes-primary: var(--dimui-color-primary);
      --notes-primary-soft: color-mix(
        in srgb,
        var(--dimui-color-primary) 18%,
        transparent
      );
    }

    * {
      box-sizing: border-box;
    }
  `;

  return { notesTokens };
});
