BP.module(
  "dimui/components/notes/organisms/notes-shell",
  [
    "dimui/lib/notes/tokens",
    "dimui/lib/notes/vault",
    "dimui/lib/notes/mockData",
    "dimui/lib/notes/note-filters",
    "dimui/components/notes/templates/notes-layout",
  ],
  function (tokens, vault, mock, filters, layout) {
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
        scope({ NotesLayout });

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
        const hostRef = ref();

        const rawNotes = Array.isArray(notes) ? notes : [];
        const rawFolders = Array.isArray(folders) ? folders : [];
        const list = rawNotes.map(normalizeNote).filter(Boolean);
        const folderList = rawFolders.map(normalizeFolder).filter(Boolean);

        // Don't block vault unlock on foldersLoading — a new key can lag behind
        // vault/notes on first open of an upgraded store shape.
        void foldersLoading;
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

        return tpl`
          <dimui-notes-layout
            .props="${{
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
            }}"
          />
        `;
      },
    });
    return { NotesShell };
  },
);
