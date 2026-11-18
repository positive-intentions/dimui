BP.module(
  "dimui/theme",
  [],
  function () {
  const { css } = Dim;
  /** Structural tokens (safe to apply on every :host). Colors come from documentElement. */
  const themeTokens = css`
    :host {
      --dimui-font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      --dimui-font-mono: ui-monospace, "Cascadia Code", "SF Mono", Menlo, monospace;
      --dimui-radius-sm: 4px;
      --dimui-radius: 8px;
      --dimui-radius-lg: 12px;
      --dimui-space-1: 0.25rem;
      --dimui-space-2: 0.5rem;
      --dimui-space-3: 0.75rem;
      --dimui-space-4: 1rem;
      --dimui-space-5: 1.25rem;
      --dimui-space-6: 1.5rem;
      --dimui-touch: 44px;
      --dimui-sidebar-width: 280px;
      --dimui-panel-height: 280px;
      --dimui-panel-width: 320px;
      --dimui-toolbar-height: 40px;
      --dimui-z-overlay: 1000;
      --dimui-z-drawer: 1001;
      --dimui-transition: 150ms ease;

      /* Fallbacks if document theme not applied yet */
      --dimui-color-primary: var(--dimui-doc-primary, #029cfd);
      --dimui-color-primary-hover: var(--dimui-doc-primary-hover, #0284d4);
      --dimui-color-on-primary: var(--dimui-doc-on-primary, #ffffff);
      --dimui-color-danger: var(--dimui-doc-danger, #ef4444);
      --dimui-color-danger-bg: var(--dimui-doc-danger-bg, #7f1d1d);
      --dimui-color-bg: var(--dimui-doc-bg, #0f172a);
      --dimui-color-surface: var(--dimui-doc-surface, #1e293b);
      --dimui-color-surface-2: var(--dimui-doc-surface-2, #0b1220);
      --dimui-color-surface-hover: var(--dimui-doc-surface-hover, #334155);
      --dimui-color-border: var(--dimui-doc-border, #334155);
      --dimui-color-border-subtle: var(--dimui-doc-border-subtle, #1e293b);
      --dimui-color-text: var(--dimui-doc-text, #e2e8f0);
      --dimui-color-text-muted: var(--dimui-doc-text-muted, #94a3b8);
      --dimui-color-text-faint: var(--dimui-doc-text-faint, #64748b);
      --dimui-color-focus: var(--dimui-doc-focus, #029cfd);
      --dimui-shadow: var(--dimui-doc-shadow, 0 8px 24px rgba(0, 0, 0, 0.35));

      /* Messaging kit */
      --dimui-bubble-out: var(--dimui-doc-bubble-out, #029cfd);
      --dimui-bubble-out-text: var(--dimui-doc-bubble-out-text, #0f172a);
      --dimui-bubble-in: var(--dimui-doc-bubble-in, #1e293b);
      --dimui-bubble-in-text: var(--dimui-doc-bubble-in-text, #e2e8f0);
      --dimui-color-ok: var(--dimui-doc-ok, #4ade80);
    }
  `;
  const STORAGE_KEYS = {
    theme: "dimui-explorer-theme",
    sidebarWidth: "dimui-explorer-sidebar-width",
    panelHeight: "dimui-explorer-panel-height",
    panelWidth: "dimui-explorer-panel-width",
    panelPosition: "dimui-explorer-panel-position",
    collapsedRoots: "dimui-explorer-collapsed-roots",
  };

  /** postMessage type: manager → preview iframe */
  const THEME_MESSAGE = "dimui:theme";
  function normalizeTheme(value) {
    return value === "light" ? "light" : "dark";
  }
  function getStoredTheme() {
    return normalizeTheme(readStorage(STORAGE_KEYS.theme, "dark"));
  }

  /** Subscribe to explorer theme changes (postMessage + same-window event). */
  function subscribeExplorerTheme(callback) {
    const onMessage = (event) => {
      const data = event.data;
      if (!data || data.type !== THEME_MESSAGE) return;
      callback(normalizeTheme(data.theme));
    };
    const onLocal = (event) => {
      if (event?.detail?.theme) callback(normalizeTheme(event.detail.theme));
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("dimui-theme-change", onLocal);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("dimui-theme-change", onLocal);
    };
  }
  const MOBILE_BREAKPOINT = 900;

  const DARK = {
    "--dimui-doc-primary": "#029cfd",
    "--dimui-doc-primary-hover": "#0284d4",
    "--dimui-doc-on-primary": "#ffffff",
    "--dimui-doc-danger": "#ef4444",
    "--dimui-doc-danger-bg": "#7f1d1d",
    "--dimui-doc-bg": "#0f172a",
    "--dimui-doc-surface": "#1e293b",
    "--dimui-doc-surface-2": "#0b1220",
    "--dimui-doc-surface-hover": "#334155",
    "--dimui-doc-border": "#334155",
    "--dimui-doc-border-subtle": "#1e293b",
    "--dimui-doc-text": "#e2e8f0",
    "--dimui-doc-text-muted": "#94a3b8",
    "--dimui-doc-text-faint": "#64748b",
    "--dimui-doc-focus": "#029cfd",
    "--dimui-doc-shadow": "0 8px 24px rgba(0, 0, 0, 0.35)",
    "--dimui-doc-bubble-out": "#029cfd",
    "--dimui-doc-bubble-out-text": "#0f172a",
    "--dimui-doc-bubble-in": "#1e293b",
    "--dimui-doc-bubble-in-text": "#e2e8f0",
    "--dimui-doc-ok": "#4ade80",
  };

  const LIGHT = {
    "--dimui-doc-primary": "#0284d4",
    "--dimui-doc-primary-hover": "#0369a1",
    "--dimui-doc-on-primary": "#ffffff",
    "--dimui-doc-danger": "#dc2626",
    "--dimui-doc-danger-bg": "#fecaca",
    "--dimui-doc-bg": "#f8fafc",
    "--dimui-doc-surface": "#ffffff",
    "--dimui-doc-surface-2": "#f1f5f9",
    "--dimui-doc-surface-hover": "#e2e8f0",
    "--dimui-doc-border": "#cbd5e1",
    "--dimui-doc-border-subtle": "#e2e8f0",
    "--dimui-doc-text": "#0f172a",
    "--dimui-doc-text-muted": "#475569",
    "--dimui-doc-text-faint": "#94a3b8",
    "--dimui-doc-focus": "#0284d4",
    "--dimui-doc-shadow": "0 8px 24px rgba(15, 23, 42, 0.12)",
    "--dimui-doc-bubble-out": "#0284d4",
    "--dimui-doc-bubble-out-text": "#ffffff",
    "--dimui-doc-bubble-in": "#e2e8f0",
    "--dimui-doc-bubble-in-text": "#0f172a",
    "--dimui-doc-ok": "#16a34a",
  };
  function applyDocumentTheme(theme) {
    const root = document.documentElement;
    const vars = theme === "light" ? LIGHT : DARK;
    root.dataset.theme = theme === "light" ? "light" : "dark";
    const entries = Object.entries(vars);
    for (let i = 0; i < entries.length; i++) {
      root.style.setProperty(entries[i][0], entries[i][1]);
    }
    root.style.background = vars["--dimui-doc-bg"];
    root.style.color = vars["--dimui-doc-text"];
  }
  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : raw;
    } catch {
      return fallback;
    }
  }
  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      /* ignore */
    }
  }
  function readJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  function writeJsonStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }
  return { themeTokens, STORAGE_KEYS, THEME_MESSAGE, normalizeTheme, getStoredTheme, subscribeExplorerTheme, MOBILE_BREAKPOINT, applyDocumentTheme, readStorage, writeStorage, readJsonStorage, writeJsonStorage };
  },
);
