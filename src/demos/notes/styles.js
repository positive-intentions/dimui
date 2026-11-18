BP.module(
  "dimui/demos/notes/styles",
  [],
  function () {
  const { css } = Dim;
  const VAULT_FLAG = "dimui-vault";
  const VAULT_SENTINEL = "dimui";
  const appStyles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
      height: 100%;
      color: var(--notes-text);
      font-family: "Segoe UI", system-ui, sans-serif;
    }

    /*
     * Tokens only on themed roots. Nested hosts include this sheet —
     * a bare :host light block would wipe inherited dark mode.
     */
    :host([data-theme="light"]),
    .notes-app[data-theme="light"],
    .frame[data-theme="light"],
    .notes-app:not([data-theme]),
    .frame:not([data-theme]) {
      --notes-bg: #f8fafc;
      --notes-surface: #ffffff;
      --notes-surface-2: #f1f5f9;
      --notes-surface-hover: #e2e8f0;
      --notes-border: #e2e8f0;
      --notes-text: #0f172a;
      --notes-text-muted: #475569;
      --notes-text-faint: #94a3b8;
      --notes-danger: #dc2626;
      --notes-primary: #0284d4;
      --notes-primary-soft: #e0f2fe;
    }

    :host([data-theme="dark"]),
    .notes-app[data-theme="dark"],
    .frame[data-theme="dark"] {
      --notes-bg: #0f172a;
      --notes-surface: #0b1220;
      --notes-surface-2: #1e293b;
      --notes-surface-hover: #334155;
      --notes-border: #334155;
      --notes-text: #e2e8f0;
      --notes-text-muted: #94a3b8;
      --notes-text-faint: #64748b;
      --notes-danger: #f87171;
      --notes-primary: #029cfd;
      --notes-primary-soft: #1a3a5c;
    }

    * {
      box-sizing: border-box;
    }

    .frame,
    .notes-app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      height: 100%;
      background: var(--notes-bg);
      color: var(--notes-text);
    }

    .notes-app {
      flex-direction: row;
      overflow: hidden;
      position: relative;
    }

    .unlock {
      flex: 1;
      display: grid;
      place-items: center;
      padding: 2rem 1.25rem;
    }

    .unlock-panel {
      width: min(360px, 100%);
    }

    .unlock-panel h1 {
      margin: 0 0 0.35rem;
      font-size: 1.75rem;
      font-weight: 650;
      letter-spacing: -0.02em;
      color: var(--notes-text);
    }

    .unlock-panel p {
      margin: 0 0 1.5rem;
      color: var(--notes-text-muted);
      line-height: 1.45;
    }

    .field-gap {
      margin: 0 0 1rem;
    }

    .field-gap.grow {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .error {
      margin: 0 0 1rem;
      color: var(--notes-danger);
      font-size: 0.9rem;
    }

    .muted {
      color: var(--notes-text-muted);
      font-size: 0.9rem;
    }

    .status {
      padding: 2rem;
      text-align: center;
      color: var(--notes-text-muted);
    }

    /* —— Folder rail —— */
    .folder-rail {
      width: 200px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background: var(--notes-surface);
      border-right: 1px solid var(--notes-border);
      min-height: 0;
    }

    .folder-rail-header {
      padding: 1rem 1rem 0.5rem;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--notes-text-faint);
    }

    .folder-list {
      list-style: none;
      margin: 0;
      padding: 0.25rem 0.5rem;
      flex: 1;
      overflow: auto;
    }

    .folder-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem 0.65rem;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--notes-text);
      font: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      text-align: left;
    }

    .folder-item:hover {
      background: var(--notes-surface-hover);
    }

    .folder-item.active {
      background: var(--notes-primary-soft);
      color: var(--notes-primary);
      font-weight: 600;
    }

    .folder-item .count {
      margin-left: auto;
      font-size: 0.75rem;
      color: var(--notes-text-faint);
    }

    .folder-item.active .count {
      color: var(--notes-primary);
    }

    .folder-rail-footer {
      padding: 0.75rem;
      border-top: 1px solid var(--notes-border);
    }

    .new-folder-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.65rem;
      border: 1px dashed var(--notes-border);
      border-radius: 8px;
      background: transparent;
      color: var(--notes-text-muted);
      font: inherit;
      font-size: 0.8125rem;
      cursor: pointer;
    }

    .new-folder-btn:hover {
      border-color: var(--notes-primary);
      color: var(--notes-primary);
    }

    /* —— Main column —— */
    .main-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 0;
    }

    .main-column.note-open-mobile .app-header {
      display: none;
    }

    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--notes-surface);
      border-bottom: 1px solid var(--notes-border);
      flex-shrink: 0;
    }

    .app-header-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 650;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .mobile-folder-bar {
      display: none;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      overflow-x: auto;
      background: var(--notes-surface);
      border-bottom: 1px solid var(--notes-border);
      flex-shrink: 0;
    }

    .content-area {
      flex: 1;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    /* —— Nav / split —— */
    .nav-view-root {
      display: flex;
      height: 100%;
      width: 100%;
      min-height: 0;
    }

    .list-pane {
      width: 320px;
      flex-shrink: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--notes-border);
      background: var(--notes-surface);
    }

    .editor-pane {
      flex: 1;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      background: var(--notes-bg);
    }

    .auto-transition-wrapper,
    .view-transition-item,
    .vt-layer {
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .vt-layer:not(.vt-incoming) {
      pointer-events: none;
    }

    /* —— Note list —— */
    .note-list-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      position: relative;
    }

    .list-toolbar {
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .list-heading {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 650;
      color: var(--notes-text);
    }

    .note-list {
      list-style: none;
      margin: 0;
      padding: 0.25rem 0.5rem 4.5rem;
      overflow: auto;
      flex: 1;
    }

    .note-list li {
      margin: 0 0 0.25rem;
    }

    .list-fab {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      z-index: 2;
    }

    .trash-actions {
      padding: 0.5rem 0.75rem;
      border-top: 1px solid var(--notes-border);
      flex-shrink: 0;
    }

    /* —— Note item —— */
    .note-row {
      width: 100%;
      text-align: left;
      background: transparent;
      color: var(--notes-text);
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 0.65rem 0.75rem;
      font: inherit;
      cursor: pointer;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.25rem 0.5rem;
    }

    .note-row:hover {
      background: var(--notes-surface-hover);
    }

    .note-row.active {
      background: var(--notes-primary-soft);
      border-color: color-mix(in srgb, var(--notes-primary) 35%, transparent);
    }

    .note-row:focus-visible {
      outline: 2px solid var(--notes-primary);
      outline-offset: 1px;
    }

    .note-row-title {
      font-weight: 600;
      font-size: 0.9375rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .note-row-title .pin-mark {
      color: var(--notes-primary);
      flex-shrink: 0;
    }

    .note-row-time {
      font-size: 0.7rem;
      color: var(--notes-text-faint);
      white-space: nowrap;
      align-self: start;
      padding-top: 0.15rem;
    }

    .note-row-snippet {
      grid-column: 1 / -1;
      font-size: 0.8125rem;
      color: var(--notes-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* —— Editor —— */
    .editor {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      padding: 0;
      background: var(--notes-bg);
    }

    .editor.empty {
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--notes-border);
      background: var(--notes-surface);
      flex-shrink: 0;
    }

    .editor-toolbar .save-status {
      margin-right: auto;
      margin-left: 0.5rem;
      color: var(--notes-text-faint);
      font-size: 0.8rem;
    }

    .editor-back {
      display: none;
    }

    .editor-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      padding: 1rem 1.25rem 1.5rem;
    }

    .title-input {
      width: 100%;
      border: none;
      background: transparent;
      color: var(--notes-text);
      font: inherit;
      font-size: 1.5rem;
      font-weight: 650;
      letter-spacing: -0.02em;
      padding: 0.25rem 0;
      outline: none;
      margin-bottom: 0.75rem;
    }

    .title-input::placeholder {
      color: var(--notes-text-faint);
    }

    .editor-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 0.75rem;
      align-items: baseline;
      margin: 0 0 0.85rem;
      font-size: 0.75rem;
      color: var(--notes-text-faint);
    }

    .editor-snippet {
      color: var(--notes-text-muted);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .body-input {
      flex: 1;
      width: 100%;
      min-height: 200px;
      border: none;
      background: transparent;
      color: var(--notes-text);
      font: inherit;
      font-size: 1rem;
      line-height: 1.55;
      resize: none;
      outline: none;
    }

    .body-input::placeholder {
      color: var(--notes-text-faint);
    }

    .folder-select {
      appearance: none;
      border: 1px solid var(--notes-border);
      border-radius: 8px;
      background: var(--notes-bg);
      color: var(--notes-text);
      font: inherit;
      font-size: 0.8125rem;
      padding: 0.35rem 0.6rem;
      max-width: 140px;
    }

    /* —— Confirm dialog —— */
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
      background: var(--notes-surface);
      border: 1px solid var(--notes-border);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    }

    .confirm-panel h3 {
      margin: 0 0 0.5rem;
      font-size: 1.0625rem;
    }

    .confirm-panel p {
      margin: 0 0 1.25rem;
      color: var(--notes-text-muted);
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .folder-rail {
        display: none;
      }

      .mobile-folder-bar {
        display: flex;
      }

      .list-pane {
        width: 100%;
        border-right: none;
      }

      .nav-view-root:not(.note-open) .editor-pane {
        display: none;
      }

      .nav-view-root.note-open .list-pane {
        display: none;
      }

      .editor-back {
        display: inline-flex;
      }

      .main-column.note-open-mobile .mobile-folder-bar {
        display: none;
      }
    }
  `;
  return { VAULT_FLAG, VAULT_SENTINEL, appStyles };
  },
);
