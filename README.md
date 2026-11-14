# dimui

Material-inspired component library built with [`@positive-intentions/dim`](https://www.npmjs.com/package/@positive-intentions/dim), plus a **custom Storybook-like explorer** (no Storybook dependency).

Uses native ES modules and an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — no bundler, no TypeScript.

## What it is

- **Explorer** — sidebar story tree, canvas iframe, addon panel, mobile bottom sheets, theme toggle, viewport presets, and keyboard shortcuts.
- **Atomic chrome** — atoms and molecules under `src/components/` used by the explorer (and later library surfaces).
- **Stories** — CSF-inspired modules in `src/stories/` registered via `src/registry.js`.
- **Demos** — encrypted notes, messaging, and shopping apps under `src/demos/` (messaging/shopping keep `transitionId` + `data-vt-shared` view transitions).

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

## URL flags

| Flag | Example | Meaning |
|------|---------|---------|
| `path` | `?path=/story/introduction-welcome` | Selected story |
| `nav` | `?nav=false` | Hide sidebar |
| `panel` | `?panel=false` / `?panel=right` | Hide panel or dock right |
| `full` | `?full=true` | Fullscreen canvas |

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
