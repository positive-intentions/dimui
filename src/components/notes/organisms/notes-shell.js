BP.module(
  "dimui/components/notes/organisms/notes-shell",
  [
    "dimui/lib/notes/tokens",
    "dimui/lib/notes/vault",
    "dimui/lib/notes/mockData",
    "dimui/lib/notes/note-filters",
    "dimui/components/notes/templates/notes-layout",
    "dimurl/notes",
    "dimurl/components/router",
    "dimurl/components/route",
    "dimurl/hooks/use-params",
  ],
  function (
    tokens,
    vault,
    mock,
    filters,
    layout,
    notesUrl,
    routerMod,
    routeMod,
    paramsMod,
  ) {
    const { define, css } = Dim;
    const { notesTokens } = tokens;
    const { VAULT_FLAG, VAULT_SENTINEL } = vault;
    const {
      SEED_FOLDERS,
      SEED_NOTES,
      SMART_FOLDERS,
      normalizeNote,
      normalizeFolder,
    } = mock;
    const { computeViewId, filterNotes, folderLabelFor } = filters;
    const { NotesLayout } = layout;
    const { Router } = routerMod;
    const { Route } = routeMod;
    const { useParams, useNavigate, useLocation } = paramsMod;

    const shellStyles = css`
      ${notesTokens}

      .frame {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--notes-bg);
        color: var(--notes-text);
      }

      .status {
        padding: 2rem;
        text-align: center;
        color: var(--notes-text-muted);
      }
    `;

    const NotesShell = define({
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
        style(shellStyles);
        scope({ NotesLayout, Router, Route });

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

        const [vaultValue, setVault, vaultLoading, , vaultSaving] = store.vault;
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
        // Skip writing URL while applying an inbound hash (avoid push loops).
        const applyingUrlRef = ref(false);
        const listRef = ref([]);
        const hostRef = ref();

        const urlParams = useParams({
          useState: state,
          useEffect: effect,
          useRef: ref,
        });
        const navigate = useNavigate({ useRef: ref });
        const loc = useLocation({
          useState: state,
          useEffect: effect,
          useRef: ref,
        });

        const rawNotes = Array.isArray(notes) ? notes : [];
        const rawFolders = Array.isArray(folders) ? folders : [];
        const list = rawNotes.map(normalizeNote).filter(Boolean);
        const folderList = rawFolders.map(normalizeFolder).filter(Boolean);
        listRef.current = list;

        // Don't block vault unlock on foldersLoading — a new key can lag behind
        // vault/notes on first open of an upgraded store shape.
        void foldersLoading;
        const loading = vaultLoading || notesLoading;
        const isSaving = Boolean(vaultSaving || notesSaving || foldersSaving);

        const writeUrl = (folder, noteId, mode) => {
          // Always write on user/UI actions. applyFromParams uses navigate()
          // directly and sets applyingUrlRef so inbound apply does not loop
          // through writeUrl — blocking here dropped rail/folder navigations
          // when an apply was in flight (hash stayed on the previous folder).
          const path = notesUrl.toLocation({
            folderFilter: folder,
            noteId: noteId || null,
          });
          if (mode === "replace") navigate(path, { replace: true });
          else navigate(path);
        };

        const applyFromParams = (params, pathname, allNotes) => {
          // Pathname is source of truth for the hash. Route params can lag a
          // tick behind navigate(); preferring stale folderId was resetting
          // the URL back to the previous folder after rail clicks.
          const parsed = notesUrl.fromLocation(pathname || "/");
          const folder =
            parsed.folderFilter ||
            params.folderId ||
            SMART_FOLDERS.all;
          const noteId =
            parsed.noteId ||
            (params.noteId != null && params.noteId !== ""
              ? params.noteId
              : null);
          const pool = Array.isArray(allNotes) ? allNotes : list;

          applyingUrlRef.current = true;
          setFolderFilter(folder);

          if (noteId) {
            const found = pool.some((n) => n && n.id === noteId);
            if (found) {
              setSelectedId(noteId);
              setNavStack(["list", `note:${noteId}`]);
              applyingUrlRef.current = false;
              return;
            }
            // Invalid / missing note → list for that folder.
            setSelectedId(null);
            setNavStack(["list"]);
            applyingUrlRef.current = false;
            navigate(
              notesUrl.toLocation({ folderFilter: folder, noteId: null }),
              { replace: true },
            );
            return;
          }

          setSelectedId(null);
          setNavStack(["list"]);
          applyingUrlRef.current = false;

          // Normalize empty / alternate shapes to the canonical list hash.
          const expected = notesUrl.toLocation({
            folderFilter: folder,
            noteId: null,
          });
          if ((pathname || "/") !== expected) {
            navigate(expected, { replace: true });
          }
        };

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

          if (vaultValue === VAULT_SENTINEL) {
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
        }, [loading, vaultValue, create, checked]);

        const visibleNotes = filterNotes(list, folderFilter);

        // Drive navStack / selection from router params (hash → UI).
        effect(() => {
          if (!ready || loading) return undefined;
          if (applyingUrlRef.current) return undefined;
          applyFromParams(
            {
              folderId: urlParams.folderId,
              noteId: urlParams.noteId,
            },
            loc.pathname,
            listRef.current,
          );
          return undefined;
        }, [
          ready,
          loading,
          loc.pathname,
          urlParams.folderId,
          urlParams.noteId,
        ]);

        effect(() => {
          if (!ready) return;
          const top = navStack[navStack.length - 1] || "list";
          const openId = top.startsWith("note:") ? top.slice(5) : null;
          const focusId = openId || selectedId;
          if (!focusId) return;
          if (visibleNotes.some((n) => n.id === focusId)) return;
          // Note left the current filter (e.g. moved folder while open).
          setSelectedId(null);
          if (openId) {
            setNavStack(["list"]);
            writeUrl(folderFilter, null, "replace");
          }
        }, [ready, visibleNotes, navStack, selectedId]);

        const persistNotes = (next) =>
          setNotes(next.map(normalizeNote).filter(Boolean));

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
          writeUrl(folderFilter, id, "push");
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
          writeUrl(folderFilter, null, "replace");
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
          writeUrl(folderFilter, null, "replace");
        };

        const emptyTrash = () => {
          persistNotes(list.filter((n) => !n.trashed));
          setConfirmEmpty(false);
          setNavStack(["list"]);
          setSelectedId(null);
          writeUrl(folderFilter, null, "replace");
        };

        const selectNote = (id) => {
          setSelectedId(id);
          setNavStack(["list", `note:${id}`]);
          writeUrl(folderFilter, id, "push");
        };

        const goBack = () => {
          setNavStack(["list"]);
          writeUrl(folderFilter, null, "push");
        };

        const selectFolder = (id) => {
          setFolderFilter(id);
          setNavStack(["list"]);
          setSelectedId(null);
          writeUrl(id, null, "push");
        };

        const createFolder = () => {
          const name = newFolderName.trim();
          if (!name) return;
          const id = crypto.randomUUID();
          setFolders([...folderList, { id, name }]);
          setNewFolderName("");
          setNewFolderOpen(false);
          setFolderFilter(id);
          writeUrl(id, null, "push");
        };

        const countFor = (filterId) => filterNotes(list, filterId).length;
        const viewId = computeViewId(navStack);
        const noteOpen = (navStack[navStack.length - 1] || "").startsWith(
          "note:",
        );
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
        const mobileItems = [
          ...smartItems,
          ...folderList.map((f) => ({ id: f.id, name: f.name })),
          trashItem,
        ];

        if (!ready) {
          return tpl`
            <div class="frame" data-theme="${theme}">
              <div class="status">
                ${loading ? "Decrypting…" : "Opening vault…"}
              </div>
            </div>
          `;
        }

        const layoutProps = {
          theme,
          noteOpen,
          viewId,
          folderRail: {
            smartItems,
            folders: folderList,
            trashItem,
            folderFilter,
            countFor,
            onSelectFolder: selectFolder,
            newFolderOpen,
            newFolderName,
            onNewFolderOpen: setNewFolderOpen,
            onNewFolderName: setNewFolderName,
            onCreateFolder: createFolder,
            onCancelNewFolder: () => setNewFolderOpen(false),
          },
          header: {
            title: "Notes",
            onLock,
          },
          mobileBar: {
            items: mobileItems,
            selectedId: folderFilter,
            onSelect: selectFolder,
          },
          nav: {
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
          },
          confirm: {
            open: confirmEmpty,
            title: "Empty Trash?",
            body: "All notes in Recently Deleted will be permanently removed.",
            confirmLabel: "Empty Trash",
            onConfirm: emptyTrash,
            onCancel: () => setConfirmEmpty(false),
          },
        };

        return tpl`
          <dimurl-router>
            <dimurl-route path="/"></dimurl-route>
            <dimurl-route path="/folder/:folderId"></dimurl-route>
            <dimurl-route path="/note/:noteId"></dimurl-route>
            <dimurl-route path="/folder/:folderId/note/:noteId"></dimurl-route>
            <dimui-notes-layout .props="${layoutProps}" />
          </dimurl-router>
        `;
      },
    });
    return { NotesShell };
  },
);
