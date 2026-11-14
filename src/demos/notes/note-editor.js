import {
  define,
  html,
  useState,
  useStyle,
  useScope,
} from "@positive-intentions/dim";
import { appStyles } from "./styles.js";
import { Button } from "../../components/atoms/button.js";
import { IconButton } from "../../components/atoms/icon-button.js";
import { EmptyState } from "../../components/atoms/empty-state.js";
import { sharedKeys } from "./sharedKeys.js";
import { snippetFromBody, formatRelativeTime } from "./mockData.js";

export const NoteEditor = define({
  tag: "dimui-note-editor",
  component: (
    props,
    { html: tpl, useState: state, useStyle: style, useScope: scope },
  ) => {
    style(appStyles);
    scope({ Button, IconButton, EmptyState });

    const note = props.note || null;
    const folders = Array.isArray(props.folders) ? props.folders : [];
    const saveStatus = props.saveStatus || "";
    const showBack = Boolean(props.showBack);
    const onChange =
      typeof props.onChange === "function" ? props.onChange : () => {};
    const onBack =
      typeof props.onBack === "function" ? props.onBack : () => {};
    const onTogglePin =
      typeof props.onTogglePin === "function" ? props.onTogglePin : () => {};
    const onMoveFolder =
      typeof props.onMoveFolder === "function" ? props.onMoveFolder : () => {};
    const onTrash =
      typeof props.onTrash === "function" ? props.onTrash : () => {};
    const onRestore =
      typeof props.onRestore === "function" ? props.onRestore : () => {};
    const onDeleteForever =
      typeof props.onDeleteForever === "function"
        ? props.onDeleteForever
        : () => {};

    const [confirm, setConfirm] = state(null);

    if (!note) {
      return tpl`
        <section class="editor empty">
          <dimui-empty-state
            .props="${{
              title: "Select a note",
              hint: "Choose a note from the list or create a new one.",
            }}"
          ></dimui-empty-state>
        </section>
      `;
    }

    const keys = sharedKeys(note.id);
    const patch = (partial) =>
      onChange({
        ...note,
        ...partial,
        updatedAt: new Date().toISOString(),
      });

    const askConfirm = (kind) => setConfirm(kind);
    const closeConfirm = () => setConfirm(null);

    const runConfirm = () => {
      if (confirm === "trash") onTrash(note.id);
      if (confirm === "delete") onDeleteForever(note.id);
      closeConfirm();
    };

    const confirmCopy =
      confirm === "delete"
        ? {
            title: "Delete forever?",
            body: "This note will be permanently removed from this vault.",
            action: "Delete Forever",
          }
        : {
            title: "Move to Recently Deleted?",
            body: "You can restore it later from the trash.",
            action: "Move to Trash",
          };

    return tpl`
      <section class="editor">
        <div class="editor-toolbar">
          ${showBack
            ? tpl`
                <dimui-icon-button
                  class="editor-back"
                  .props="${{
                    name: "back",
                    label: "Back to notes",
                    onClick: onBack,
                  }}"
                ></dimui-icon-button>
              `
            : null}

          <span class="save-status" aria-live="polite">${saveStatus}</span>

          ${note.trashed
            ? tpl`
                <dimui-icon-button
                  .props="${{
                    name: "restore",
                    label: "Restore note",
                    onClick: () => onRestore(note.id),
                  }}"
                ></dimui-icon-button>
                <dimui-button
                  .props="${{
                    label: "Delete Forever",
                    variant: "danger",
                    size: "sm",
                    onClick: () => askConfirm("delete"),
                  }}"
                ></dimui-button>
              `
            : tpl`
                <dimui-icon-button
                  .props="${{
                    name: "pin",
                    label: note.pinned ? "Unpin note" : "Pin note",
                    active: Boolean(note.pinned),
                    onClick: () => onTogglePin(note.id),
                  }}"
                ></dimui-icon-button>
                <select
                  class="folder-select"
                  aria-label="Move to folder"
                  .value="${note.folderId || ""}"
                  @change="${(e) =>
                    onMoveFolder(note.id, e.target.value || null)}"
                >
                  <option value="">No folder</option>
                  ${folders.map(
                    (f) =>
                      tpl`<option value="${f.id}">${f.name}</option>`,
                  )}
                </select>
                <dimui-icon-button
                  .props="${{
                    name: "trash",
                    label: "Move to trash",
                    onClick: () => askConfirm("trash"),
                  }}"
                ></dimui-icon-button>
              `}
        </div>

        <div class="editor-body">
          <input
            class="title-input"
            type="text"
            placeholder="Title"
            .value="${note.title || ""}"
            data-vt-shared="${keys.title}"
            @input="${(e) => patch({ title: e.target.value })}"
          />
          <div class="editor-meta">
            <span data-vt-shared="${keys.time}"
              >${formatRelativeTime(note.updatedAt)}</span
            >
            <span data-vt-shared="${keys.snippet}" class="editor-snippet"
              >${snippetFromBody(note.body)}</span
            >
          </div>
          <textarea
            class="body-input"
            placeholder="Start writing…"
            .value="${note.body || ""}"
            @input="${(e) => patch({ body: e.target.value })}"
          ></textarea>
        </div>

        <div class="confirm-dialog" ?hidden="${!confirm}">
          <div class="confirm-backdrop" @click="${closeConfirm}"></div>
          <div class="confirm-panel" role="dialog" aria-modal="true">
            <h3>${confirmCopy.title}</h3>
            <p>${confirmCopy.body}</p>
            <div class="confirm-actions">
              <dimui-button
                .props="${{
                  label: "Cancel",
                  variant: "outlined",
                  size: "sm",
                  onClick: closeConfirm,
                }}"
              ></dimui-button>
              <dimui-button
                .props="${{
                  label: confirmCopy.action,
                  variant: "danger",
                  size: "sm",
                  onClick: runConfirm,
                }}"
              ></dimui-button>
            </div>
          </div>
        </div>
      </section>
    `;
  },
});
