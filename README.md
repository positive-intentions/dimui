<p align="center">
  <img src="public/dim.png" alt="Dim Framework Logo" width="200" />
</p>

<h1 align="center">dimui</h1>

<p align="center">
  <strong>Material-inspired component library for Dim — plus a Storybook-like explorer</strong>
</p>

<p align="center">
  No bundler, no TypeScript, no Dim npm install. Classic scripts + a tiny
  <code>BP</code> registry; Dim loads from the CDN at runtime.
</p>

<div align="center">

[**Live**](https://positive-intentions.github.io/dimui/) | [**dim**](https://github.com/positive-intentions/dim) | [**dim-boilerplate**](https://github.com/positive-intentions/dim-boilerplate) | [**dimim**](https://github.com/positive-intentions/dimim)

</div>

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/positive-intentions/dimui?style=social)
![GitHub forks](https://img.shields.io/github/forks/positive-intentions/dimui?style=social)
![GitHub issues](https://img.shields.io/github/issues/positive-intentions/dimui)
![License](https://img.shields.io/badge/License-GPLv3-blue.svg)
![Deploy](https://github.com/positive-intentions/dimui/actions/workflows/deploy-pages.yml/badge.svg)
[![gh-pages-build-deployment](https://github.com/positive-intentions/dimui/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/positive-intentions/dimui/actions/workflows/pages/pages-build-deployment)

</div>

---

Atoms and molecules live under `src/components/`. The explorer (sidebar, canvas
iframe, addons) is a custom Storybook-like shell with **no Storybook dependency**.
Components register with `BP.module("dimui/…", deps, factory)` and use
`window.Dim`. Dim itself loads from the
[GitHub Pages CDN](https://positive-intentions.github.io/dim/lib/) (same model as
[dim-boilerplate](https://github.com/positive-intentions/dim-boilerplate)).

## What it is

- **Explorer** — sidebar story tree, canvas iframe, addon panel, mobile bottom sheets, theme toggle, viewport presets, and keyboard shortcuts.
- **Atomic chrome** — atoms and molecules under `src/components/` used by the explorer (and consumers like dim-boilerplate / dimim).
- **Stories** — CSF-inspired modules in `src/stories/` registered via `src/registry.js`.
- **Demos** — encrypted notes, messaging, and shopping apps under `src/demos/` (messaging/shopping keep `transitionId` + `data-vt-shared` view transitions).

## Dim security notes

When using current Dim from the CDN:

- `renderChildren(string)` renders **text**, not HTML. Pass template results / slots for composition; use `unsafeHTML` only for trusted markup.
- Do not bind `onclick=` / `srcdoc=` / `.innerHTML=` — use `@click` and text/`unsafeHTML` instead.
- URL attributes (`href`, `src`, …) are sanitized (`javascript:` → `about:invalid#dim`).

See dim’s [MIGRATION.md](https://github.com/positive-intentions/dim/blob/staging/MIGRATION.md) and [SECURITY.md](https://github.com/positive-intentions/dim/blob/staging/SECURITY.md).

## Setup

Clone this repo. No Dim npm install or sibling build is required — the explorer fetches Dim over the network.

```bash
git clone https://github.com/positive-intentions/dimui.git
cd dimui
```

## Run

Serve the directory over HTTP (browsers need a real origin for multi-script pages and the Dim CDN):

```bash
python3 -m http.server 5173
```

Or optionally:

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173).

- Manager: `index.html` → `<dimui-manager>`
- Canvas iframe: `preview.html` → `<dimui-preview>`

Network is required for the Dim CDN. If port 5173 is busy, pick another port.

## Runtime: JS or Rust/WASM

Dim ships interchangeable runtimes with the same API. dimui picks one per page load via `?impl=` (inline boot script loads the classic CDN IIFE; classic `src/**/*.js` scripts use `Dim.*`):

| URL | Runtime | Loads |
|-----|---------|-------|
| `/` or `?impl=js` | Pure JS (default) | `dim/lib/dim.global.js` |
| `?impl=wasm` | Rust core, wasm inlined | `dim/lib/dim.wasm.global.js` |

No component code changes between runtimes. The flag is carried into the canvas iframe (`preview.html` inherits the manager's runtime when clean-URL servers drop its query string).

## URL flags

| Flag | Example | Meaning |
|------|---------|---------|
| `path` | `?path=/story/introduction-welcome` | Selected story |
| `nav` | `?nav=false` | Hide sidebar |
| `panel` | `?panel=false` / `?panel=right` | Hide panel or dock right |
| `full` | `?full=true` | Fullscreen canvas |
| `impl` | `?impl=wasm` | Dim runtime: `js` (default) or `wasm` |

Open a story canvas alone: `preview.html?id=demos-encrypted-notes`.

## Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `S` | Toggle sidebar |
| `D` | Toggle addons |
| `T` | Toggle theme |
| `F` | Toggle fullscreen |
| `Esc` | Close mobile sheet / exit fullscreen |

## Layout

```
dimui/
  index.html              # manager shell (CDN Dim + classic scripts)
  preview.html            # story canvas iframe
  runtime.js              # BP module registry
  app.js / preview.js     # BP.require explorer entries
  src/
    theme.js              # dimui/theme
    registry.js
    router.js
    components/
      atoms/
      molecules/
    explorer/
      manager.js
      preview-root.js
      shortcuts.js
    demos/
      notes/
    stories/
      welcome.js
```

## Consuming from dim-boilerplate / dimim

Apps load remote classic scripts, e.g. `dimui/components/atoms/button` →
`https://positive-intentions.github.io/dimui/src/components/atoms/button.js`,
which calls `BP.module` into the page registry. Override the base while
developing with `?dimuiSrc=http://127.0.0.1:5173/src/`.

## Adding a story

1. Create `src/stories/my-component.js` as `BP.module("dimui/stories/my-component", deps, factory)` returning CSF `{ default: { title }, NamedStory: { render } }`.
2. Add the module id to `src/registry.js` deps and the `modules` array.
3. Add `<script src="./src/stories/my-component.js">` to `index.html` / `preview.html` (before registry).
4. Refresh the explorer.
