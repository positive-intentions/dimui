BP.module(
  "dimui/demos/notes/note-item",
  ["dimui/components/atoms/icon","dimui/demos/notes/sharedKeys","dimui/demos/notes/mockData"],
  function (__dep0, __dep1, __dep2) {
  const { define, html, css, useStyle, useScope } = Dim;
  const { Icon } = __dep0;
  const { sharedKeys } = __dep1;
  const { snippetFromBody, formatRelativeTime } = __dep2;
  const styles = css`
    :host {
      display: block;
      width: 100%;
      color: var(--notes-text, #e2e8f0);
    }

    .note-row {
      width: 100%;
      text-align: left;
      background: transparent;
      color: inherit;
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
      background: var(--notes-surface-hover, #334155);
    }

    .note-row.active {
      background: var(--notes-primary-soft, #1a3a5c);
      border-color: color-mix(
        in srgb,
        var(--notes-primary, #029cfd) 35%,
        transparent
      );
    }

    .note-row:focus-visible {
      outline: 2px solid var(--notes-primary, #029cfd);
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
      color: var(--notes-text, inherit);
    }

    .note-row-title .pin-mark {
      color: var(--notes-primary, #029cfd);
      flex-shrink: 0;
      display: inline-flex;
      width: 0.85rem;
      height: 0.85rem;
    }

    .note-row-title .pin-mark dimui-icon {
      width: 100%;
      height: 100%;
    }

    .note-row-time {
      font-size: 0.7rem;
      color: var(--notes-text-faint, #64748b);
      white-space: nowrap;
      align-self: start;
      padding-top: 0.15rem;
    }

    .note-row-snippet {
      grid-column: 1 / -1;
      font-size: 0.8125rem;
      color: var(--notes-text-muted, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  const NoteItem = define({
    tag: "dimui-note-item",
    component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
      style(styles);
      scope({ Icon });

      const note = props.note || {};
      const selected = Boolean(props.selected);
      const shareTransition = Boolean(props.shareTransition);
      const onSelect =
        typeof props.onSelect === "function" ? props.onSelect : () => {};

      const id = note.id || "unknown";
      const keys = sharedKeys(id);
      const title = (note.title || "").trim() || "Untitled";
      const snippet = snippetFromBody(note.body);
      const time = formatRelativeTime(note.updatedAt);
      const className = selected ? "note-row active" : "note-row";

      const titleAttr = shareTransition ? keys.title : "";
      const timeAttr = shareTransition ? keys.time : "";
      const snippetAttr = shareTransition ? keys.snippet : "";

      return tpl`
        <button
          type="button"
          class="${className}"
          @click="${() => onSelect(note.id)}"
        >
          <span class="note-row-title" data-vt-shared="${titleAttr}">
            ${note.pinned
              ? tpl`<span class="pin-mark" aria-hidden="true"
                  ><dimui-icon .props="${{ name: "pin" }}" /></span>`
              : null}
            ${title}
          </span>
          <span class="note-row-time" data-vt-shared="${timeAttr}">${time}</span>
          <span class="note-row-snippet" data-vt-shared="${snippetAttr}"
            >${snippet}</span
          >
        </button>
      `;
    },
  });
  return { NoteItem };
  },
);
