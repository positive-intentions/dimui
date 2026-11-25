/**
 * Shared notes schemas for contracts / formal verification.
 */
BP.module("dimui/lib/notes/types", [], function () {
  const { t } = Dim;

  const Note = t.record({
    id: t.id(),
    title: t.string({ trim: true, max: 200, onInvalid: "coerce", default: "" }),
    body: t.string({ max: 100000, onInvalid: "coerce", default: "" }),
    trashed: t.bool({ onInvalid: "coerce", default: false }),
    pinned: t.bool({ onInvalid: "coerce", default: false }),
    folderId: t.id({ onInvalid: "coerce", default: "inbox" }),
    updatedAt: t.optional(t.string({ max: 64 })),
    createdAt: t.optional(t.string({ max: 64 })),
  }, { onInvalid: "coerce", default: {
    id: "unknown",
    title: "",
    body: "",
    trashed: false,
    pinned: false,
    folderId: "inbox",
  }});

  const Folder = t.record({
    id: t.id(),
    name: t.string({ trim: true, max: 100, onInvalid: "coerce", default: "" }),
  });

  const FolderFilter = t.string({ min: 1, max: 128, chars: "id" });

  const SMART = t.enum(["all", "pinned", "trash"]);

  return { Note, Folder, FolderFilter, SMART };
});
