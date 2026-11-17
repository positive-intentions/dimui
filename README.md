# dimui

Material-inspired component library built with [`@positive-intentions/dim`](https://www.npmjs.com/package/@positive-intentions/dim), plus a **custom Storybook-like explorer** (no Storybook dependency).

Uses native ES modules and an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — no bundler, no TypeScript. Dim loads at runtime from the [GitHub Pages CDN](https://positive-intentions.github.io/dim/lib/) (same model as [dim-boilerplate](https://github.com/positive-intentions/dim-boilerplate)).

## What it is

- **Explorer** — sidebar story tree, canvas iframe, addon panel, mobile bottom sheets, theme toggle, viewport presets, and keyboard shortcuts.
- **Atomic chrome** — atoms and molecules under `src/components/` used by the explorer (and later library surfaces).
- **Stories** — CSF-inspired modules in `src/stories/` registered via `src/registry.js`.
- **Demos** — encrypted notes, messaging, and shopping apps under `src/demos/` (messaging/shopping keep `transitionId` + `data-vt-shared` view transitions).

## Dim 0.1.2 security notes

When upgrading to `@positive-intentions/dim@0.1.2`:

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

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173).

- Manager: `index.html` → `<dimui-manager>`
- Canvas iframe: `preview.html` → `<dimui-preview>`

A static file server is recommended (ES modules). Network is required for the Dim CDN. If port 5173 is busy: change the port in `package.json` or free it with `fuser -k 5173/tcp`.

Live site: https://positive-intentions.github.io/dimui/

## Runtime: JS or Rust/WASM

Dim ships interchangeable runtimes with the same API. dimui picks one per page load via `?impl=` (inline boot script loads the classic CDN IIFE; `runtime.js` installs a `data:` import-map shim over `window.Dim`):

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
  index.html              # manager shell (CDN Dim boot)
  preview.html            # story canvas iframe (CDN Dim boot)
  runtime.js              # data: import-map shim over window.Dim
  app.js
  preview.js
  src/
    theme.js
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
      notes/              # encrypted notes demo
    stories/
      welcome.js
      notes.js
```

## Adding a story (later passes)

1. Create `src/stories/my-component.js` with `{ title, render }`.
2. Import it in `src/registry.js`.
3. Refresh the explorer.
