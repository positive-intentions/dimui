import {
  define,
  html,
  useState,
  useEffect,
  useStore,
  useRef,
  useScope,
  useStyle,
} from "@positive-intentions/dim";
import { appStyles, VAULT_FLAG, VAULT_SENTINEL } from "./styles.js";
import {
  SEED_FOLDERS,
  SEED_NOTES,
  SMART_FOLDERS,
  normalizeNote,
  normalizeFolder,
} from "./mockData.js";
import { IconButton } from "../../components/atoms/icon-button.js";
import { Icon } from "../../components/atoms/icon.js";
import { Chip } from "../../components/atoms/chip.js";
import { Button } from "../../components/atoms/button.js";
import "./NavigationView.js";

const LIST_VIEW_ID = "10";

const idToOffset = (id, base) => {
  const num = parseInt(id, 10);
  if (!isNaN(num)) return base + num;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 50;
  }
  return base + 50 + hash;
};

const computeViewId = (navStack) => {
  const top = navStack[navStack.length - 1] || "list";
  if (top.startsWith("note:")) {
    return String(idToOffset(top.slice(5), 200));
  }
  return LIST_VIEW_ID;
};

const filterNotes = (notes, folderFilter) => {
  const list = Array.isArray(notes) ? notes : [];
  if (folderFilter === SMART_FOLDERS.trash) {
    return list.filter((n) => n.trashed);
  }
  if (folderFilter === SMART_FOLDERS.pinned) {
    return list.filter((n) => n.pinned && !n.trashed);
  }
  if (folderFilter === SMART_FOLDERS.all) {
    return list.filter((n) => !n.trashed);
  }
  return list.filter((n) => !n.trashed && n.folderId === folderFilter);
};

const folderLabelFor = (folderFilter, folders) => {
  if (folderFilter === SMART_FOLDERS.all) return "All Notes";
  if (folderFilter === SMART_FOLDERS.pinned) return "Pinned";
  if (folderFilter === SMART_FOLDERS.trash) return "Recently Deleted";
  const found = folders.find((f) => f.id === folderFilter);
  return found?.name || "Notes";
};

export const NotesShell = define({
  tag: "dimui-notes-shell",
  component: (
    props,
    {
      html: tpl,
      useState: state,
      useEffect: effect,
      useStore: storeHook,
      useRef: ref,
      useScope: scope,
      useStyle: style,
    },
  ) => {
    style(appStyles);
    scope({ IconButton, Icon, Chip, Button });

    const password = props.password || "";
    const create = Boolean(props.create);
    const theme = props.theme === "light" ? "light" : "dark";
    const onLock =
      typeof props.onLock === "function" ? props.onLock : () => {};
    const onUnlockFailed =
      typeof props.onUnlockFailed === "function"
        ? props.onUnlockFailed
        : () => {};

    const store = storeHook(
      {
        vault: state(""),
        notes: state([]),
        folders: state([]),
      },
      { encryptionKey: password },
    );

    const [vault, setVault, vaultLoading, , vaultSaving] = store.vault;
    const [notes, setNotes, notesLoading, , notesSaving] = store.notes;
    const [folders, setFolders, foldersLoading, , foldersSaving] =
      store.folders;

    const [selectedId, setSelectedId] = state(null);
    const [folderFilter, setFolderFilter] = state(SMART_FOLDERS.all);
    const [navStack, setNavStack] = state(["list"]);
    const [ready, setReady] = state(false);
    const [checked, setChecked] = state(false);
    const [hasSaved, setHasSaved] = state(false);
    const [confirmEmpty, setConfirmEmpty] = state(false);
    const [newFolderOpen, setNewFolderOpen] = state(false);
    const [newFolderName, setNewFolderName] = state("");
    const hostRef = ref();

    const rawNotes = Array.isArray(notes) ? notes : [];
    const rawFolders = Array.isArray(folders) ? folders : [];
    const list = rawNotes.map(normalizeNote).filter(Boolean);
    const folderList = rawFolders.map(normalizeFolder).filter(Boolean);

    // Don't block vault unlock on foldersLoading — a new key can lag behind
    // vault/notes on first open of an upgraded store shape.
    const loading = vaultLoading || notesLoading;
    const isSaving = Boolean(vaultSaving || notesSaving || foldersSaving);

    effect(() => {
      const host = hostRef.current;
      if (host?.setAttribute) host.setAttribute("data-theme", theme);
    }, [theme]);

    effect(() => {
      if (isSaving) setHasSaved(true);
    }, [isSaving]);

    effect(() => {
      if (!isSaving) return undefined;
      const onBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "";
      };
      window.addEventListener("beforeunload", onBeforeUnload);
      return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [isSaving]);

    const saveStatus = isSaving ? "Saving…" : hasSaved ? "Saved" : "";

    effect(() => {
      if (loading || checked) return;

      if (vault === VAULT_SENTINEL) {
        setReady(true);
        setChecked(true);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(VAULT_FLAG, "1");
        }
        return;
      }

      if (
        !create &&
        typeof localStorage !== "undefined" &&
        localStorage.getItem(VAULT_FLAG) === "1"
      ) {
        setChecked(true);
        onUnlockFailed("Wrong password.");
        return;
      }

      // First-time vault: sentinel + seed content.
      setVault(VAULT_SENTINEL);
      setFolders(SEED_FOLDERS);
      setNotes(SEED_NOTES);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(VAULT_FLAG, "1");
      }
      setReady(true);
      setChecked(true);
    }, [loading, vault, create, checked]);

    const visibleNotes = filterNotes(list, folderFilter);

    effect(() => {
      if (!ready) return;
      const top = navStack[navStack.length - 1] || "list";
      if (top.startsWith("note:")) {
        const id = top.slice(5);
        const stillThere = visibleNotes.some((n) => n.id === id);
        if (!stillThere) {
          setNavStack(["list"]);
          setSelectedId(null);
        }
        return;
      }
      if (selectedId && !visibleNotes.some((n) => n.id === selectedId)) {
        setSelectedId(null);
      }
    }, [ready, visibleNotes, navStack, selectedId]);

    const persistNotes = (next) => setNotes(next.map(normalizeNote).filter(Boolean));

    const createNote = () => {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const folderId =
        folderFilter === SMART_FOLDERS.all ||
        folderFilter === SMART_FOLDERS.pinned ||
        folderFilter === SMART_FOLDERS.trash
          ? folderList[0]?.id || null
          : folderFilter;
      const nextNote = {
        id,
        title: "",
        body: "",
        folderId,
        pinned: folderFilter === SMART_FOLDERS.pinned,
        trashed: false,
        createdAt: now,
        updatedAt: now,
      };
      persistNotes([nextNote, ...list]);
      setSelectedId(id);
      setNavStack(["list", `note:${id}`]);
    };

    const updateNote = (updated) => {
      persistNotes(list.map((n) => (n.id === updated.id ? updated : n)));
    };

    const togglePin = (id) => {
      persistNotes(
        list.map((n) =>
          n.id === id
            ? {
                ...n,
                pinned: !n.pinned,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      );
    };

    const moveFolder = (id, folderId) => {
      persistNotes(
        list.map((n) =>
          n.id === id
            ? {
                ...n,
                folderId,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      );
    };

    const trashNote = (id) => {
      persistNotes(
        list.map((n) =>
          n.id === id
            ? {
                ...n,
                trashed: true,
                pinned: false,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      );
      setNavStack(["list"]);
      setSelectedId(null);
    };

    const restoreNote = (id) => {
      persistNotes(
        list.map((n) =>
          n.id === id
            ? {
                ...n,
                trashed: false,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      );
    };

    const deleteForever = (id) => {
      persistNotes(list.filter((n) => n.id !== id));
      setNavStack(["list"]);
      setSelectedId(null);
    };

    const emptyTrash = () => {
      persistNotes(list.filter((n) => !n.trashed));
      setConfirmEmpty(false);
      setNavStack(["list"]);
      setSelectedId(null);
    };

    const selectNote = (id) => {
      setSelectedId(id);
      setNavStack(["list", `note:${id}`]);
    };

    const goBack = () => {
      setNavStack(["list"]);
    };

    const selectFolder = (id) => {
      setFolderFilter(id);
      setNavStack(["list"]);
      setSelectedId(null);
    };

    const createFolder = () => {
      const name = newFolderName.trim();
      if (!name) return;
      const id = crypto.randomUUID();
      setFolders([...folderList, { id, name }]);
      setNewFolderName("");
      setNewFolderOpen(false);
      setFolderFilter(id);
    };

    const countFor = (filterId) => filterNotes(list, filterId).length;
    const viewId = computeViewId(navStack);
    const noteOpen = (navStack[navStack.length - 1] || "").startsWith("note:");
    const label = folderLabelFor(folderFilter, folderList);

    const smartItems = [
      { id: SMART_FOLDERS.all, name: "All Notes", icon: "book" },
      { id: SMART_FOLDERS.pinned, name: "Pinned", icon: "pin" },
    ];
    const trashItem = {
      id: SMART_FOLDERS.trash,
      name: "Recently Deleted",
      icon: "trash",
    };

    const renderFolderButton = (item) => {
      const active = folderFilter === item.id;
      return tpl`
        <li>
          <button
            type="button"
            class="folder-item ${active ? "active" : ""}"
            @click="${() => selectFolder(item.id)}"
          >
            <dimui-icon .props="${{ name: item.icon || "folder" }}" />
            <span>${item.name}</span>
            <span class="count">${countFor(item.id)}</span>
          </button>
        </li>
      `;
    };

    if (!ready) {
      return tpl`
        <div class="frame" data-theme="${theme}">
          <div class="status">
            ${loading ? "Decrypting…" : "Opening vault…"}
          </div>
        </div>
      `;
    }

    const mainClass = noteOpen
      ? "main-column note-open-mobile"
      : "main-column";

    return tpl`
      <div class="notes-app" data-theme="${theme}">
        <nav class="folder-rail" aria-label="Folders">
          <div class="folder-rail-header">Folders</div>
          <ul class="folder-list">
            ${smartItems.map(renderFolderButton)}
            ${folderList.map((f) =>
              renderFolderButton({ id: f.id, name: f.name, icon: "folder" }),
            )}
            ${renderFolderButton(trashItem)}
          </ul>
          <div class="folder-rail-footer">
            ${newFolderOpen
              ? tpl`
                  <div style="display:flex;flex-direction:column;gap:0.5rem">
                    <input
                      class="folder-select"
                      style="max-width:none;width:100%"
                      placeholder="Folder name"
                      .value="${newFolderName}"
                      @input="${(e) => setNewFolderName(e.target.value)}"
                      @keydown="${(e) => {
                        if (e.key === "Enter") createFolder();
                        if (e.key === "Escape") setNewFolderOpen(false);
                      }}"
            />
                    <dimui-button
                      .props="${{
                        label: "Add",
                        size: "sm",
                        onClick: createFolder,
                      }}"
                    />
                  </div>
                `
              : tpl`
                  <button
                    type="button"
                    class="new-folder-btn"
                    @click="${() => setNewFolderOpen(true)}"
                  >
                    <dimui-icon .props="${{ name: "plus" }}" />
                    New Folder
                  </button>
                `}
          </div>
        </nav>

        <div class="${mainClass}">
          <header class="app-header">
            <h1 class="app-header-title">Notes</h1>
            <div class="header-actions">
              <dimui-icon-button
                .props="${{
                  name: "lock",
                  label: "Lock vault",
                  onClick: onLock,
                }}"
              />
            </div>
          </header>

          <div class="mobile-folder-bar" role="tablist" aria-label="Folders">
            ${[...smartItems, ...folderList.map((f) => ({ id: f.id, name: f.name })), trashItem].map(
              (item) => tpl`
                <dimui-chip
                  .props="${{
                    label: item.name,
                    selected: folderFilter === item.id,
                    onClick: () => selectFolder(item.id),
                  }}"
                />
              `,
            )}
          </div>

          <div class="content-area">
            <dimui-notes-nav
              transitionId="${viewId}"
              transitionDuration="450"
              .props="${{
                notes: visibleNotes,
                folders: folderList,
                selectedId,
                folderFilter,
                folderLabel: label,
                navStack,
                saveStatus,
                onSelect: selectNote,
                onCreate: createNote,
                onBack: goBack,
                onChange: updateNote,
                onTogglePin: togglePin,
                onMoveFolder: moveFolder,
                onTrash: trashNote,
                onRestore: restoreNote,
                onDeleteForever: deleteForever,
                onEmptyTrash: () => setConfirmEmpty(true),
              }}"
            />
          </div>
        </div>

        <div class="confirm-dialog" ?hidden="${!confirmEmpty}">
          <div
            class="confirm-backdrop"
            @click="${() => setConfirmEmpty(false)}"
          ></div>
          <div class="confirm-panel" role="dialog" aria-modal="true">
            <h3>Empty Trash?</h3>
            <p>All notes in Recently Deleted will be permanently removed.</p>
            <div class="confirm-actions">
              <dimui-button
                .props="${{
                  label: "Cancel",
                  variant: "outlined",
                  size: "sm",
                  onClick: () => setConfirmEmpty(false),
                }}"
              />
              <dimui-button
                .props="${{
                  label: "Empty Trash",
                  variant: "danger",
                  size: "sm",
                  onClick: emptyTrash,
                }}"
              />
            </div>
          </div>
        </div>
      </div>
    `;
  },
});
