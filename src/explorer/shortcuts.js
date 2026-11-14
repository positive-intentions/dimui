function isTypingTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  const root = target.getRootNode?.();
  if (root && root !== document && root.host) {
    return isTypingTarget(root.host);
  }
  return false;
}

/**
 * Attach Storybook-like keyboard shortcuts.
 * Returns an unsubscribe function.
 */
export function attachShortcuts(handlers) {
  const onKeyDown = (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTypingTarget(event.target) && event.key !== "Escape") return;

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === "/" && handlers.onSearch) {
      event.preventDefault();
      handlers.onSearch();
      return;
    }
    if (key === "s" && handlers.onToggleSidebar) {
      event.preventDefault();
      handlers.onToggleSidebar();
      return;
    }
    if (key === "d" && handlers.onToggleAddons) {
      event.preventDefault();
      handlers.onToggleAddons();
      return;
    }
    if (key === "t" && handlers.onToggleTheme) {
      event.preventDefault();
      handlers.onToggleTheme();
      return;
    }
    if (key === "f" && handlers.onToggleFullscreen) {
      event.preventDefault();
      handlers.onToggleFullscreen();
      return;
    }
    if (key === "Escape" && handlers.onEscape) {
      handlers.onEscape();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}
