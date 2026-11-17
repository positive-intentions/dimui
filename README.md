# dimui

Material-inspired component library built with [`@positive-intentions/dim`](https://www.npmjs.com/package/@positive-intentions/dim), plus a **custom Storybook-like explorer** (no Storybook dependency).

Uses native ES modules and an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — no bundler, no TypeScript.

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

See dim’s [MIGRATION.md](../dim/MIGRATION.md) and [SECURITY.md](../dim/SECURITY.md).

## Setup

This project depends on the local Dim package (`file:../dim`). Build Dim first:

```bash
cd ../dim
npm run build:lib
cd ../dimui
npm install
```

## Run

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173).

- Manager: `index.html` → `<dimui-manager>`
- Canvas iframe: `preview.html` → `<dimui-preview>`

You must use a static file server — `file://` will not resolve `node_modules` imports. If port 5173 is busy: change the port in `package.json` or free it with `fuser -k 5173/tcp`.

## Runtime: JS or Rust/WASM

Dim ships two interchangeable runtimes with the same API. dimui picks one per page load via `?impl=` (handled by `runtime.js`, which writes the import map before any module loads):

| URL | Runtime | Loads |
|-----|---------|-------|
| `/` or `?impl=js` | Pure JS (default) | `dist/index.mjs` |
| `?impl=wasm` | Rust core, wasm inlined in one file | `dist/wasm/index.mjs` |
| `?impl=wasm-split` | Rust core, streamed `.wasm` | `dist/wasm/split/index.mjs` + `dim_core_bg.wasm` |

No component code changes between runtimes. The flag is carried into the canvas iframe (`preview.html` inherits the manager's runtime, since clean-URL servers drop its query string). Build the WASM runtime in Dim first with `npm run build:lib` (needs Rust + `wasm-pack`).

## URL flags

| Flag | Example | Meaning |
|------|---------|---------|
| `path` | `?path=/story/introduction-welcome` | Selected story |
| `nav` | `?nav=false` | Hide sidebar |
| `panel` | `?panel=false` / `?panel=right` | Hide panel or dock right |
| `full` | `?full=true` | Fullscreen canvas |
| `impl` | `?impl=wasm` | Dim runtime: `js` (default), `wasm`, `wasm-split` |

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
  index.html              # manager shell
  preview.html            # story canvas iframe
  runtime.js              # ?impl= → import map (JS or WASM Dim runtime)
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
