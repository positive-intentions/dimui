/** Querystring helpers aligned with Storybook-style URL flags. */

export function readQuery(search = window.location.search) {
  return new URLSearchParams(search);
}

export function getStoryIdFromPath(search = window.location.search) {
  const params = readQuery(search);
  const path = params.get("path") || "";
  const match = path.match(/^\/?story\/(.+)$/);
  if (match) return decodeURIComponent(match[1]);
  return params.get("id") || "";
}

export function getLayoutFlags(search = window.location.search) {
  const params = readQuery(search);
  const nav = params.get("nav");
  const panel = params.get("panel");
  const full = params.get("full");
  return {
    showNav: nav !== "false",
    showPanel: panel !== "false",
    panelPosition: panel === "right" || panel === "bottom" ? panel : null,
    fullscreen: full === "true",
  };
}

export function buildManagerUrl({
  storyId,
  showNav = true,
  showPanel = true,
  panelPosition = "bottom",
  fullscreen = false,
} = {}) {
  const params = new URLSearchParams();
  if (storyId) params.set("path", `/story/${storyId}`);
  if (!showNav) params.set("nav", "false");
  if (!showPanel) params.set("panel", "false");
  else if (panelPosition === "right") params.set("panel", "right");
  if (fullscreen) params.set("full", "true");
  const qs = params.toString();
  return `${window.location.pathname}${qs ? `?${qs}` : ""}`;
}

export function buildPreviewUrl(storyId) {
  const params = new URLSearchParams();
  if (storyId) params.set("id", storyId);
  const qs = params.toString();
  return `preview.html${qs ? `?${qs}` : ""}`;
}

export function replaceUrl(url) {
  if (window.location.href.endsWith(url) || window.location.pathname + window.location.search === url) {
    return;
  }
  window.history.replaceState({}, "", url);
}

export function pushUrl(url) {
  window.history.pushState({}, "", url);
}
