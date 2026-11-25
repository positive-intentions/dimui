BP.module(
  "dimui/lib/notes/note-filters",
  ["dimui/lib/notes/mockData", "dimui/lib/notes/types"],
  function (mock, types) {
    const { contract, t } = Dim;
    const { SMART_FOLDERS } = mock;
    const { Note, Folder, FolderFilter } = types;

    const LIST_VIEW_ID = "10";

    const isDigit = contract(
      {
        name: "isDigit",
        args: [t.string({ min: 1, max: 1 })],
        returns: t.bool(),
      },
      (ch) =>
        ch === "0" ||
        ch === "1" ||
        ch === "2" ||
        ch === "3" ||
        ch === "4" ||
        ch === "5" ||
        ch === "6" ||
        ch === "7" ||
        ch === "8" ||
        ch === "9",
    );

    const digitVal = contract(
      {
        name: "digitVal",
        args: [t.string({ min: 1, max: 1 })],
        returns: t.int({ min: 0, max: 9 }),
      },
      (ch) => {
        if (ch === "0") return 0;
        if (ch === "1") return 1;
        if (ch === "2") return 2;
        if (ch === "3") return 3;
        if (ch === "4") return 4;
        if (ch === "5") return 5;
        if (ch === "6") return 6;
        if (ch === "7") return 7;
        if (ch === "8") return 8;
        return 9;
      },
    );

    const isAllDigits = contract(
      {
        name: "isAllDigits",
        args: [t.id()],
        returns: t.bool(),
      },
      (id) => {
        if (id.length === 0) return false;
        const first = id.slice(0, 1);
        const rest = id.slice(1);
        if (!isDigit(first)) return false;
        if (rest.length === 0) return true;
        return isAllDigits(rest);
      },
    );

    const parseNumericId = contract(
      {
        name: "parseNumericId",
        args: [t.id()],
        returns: t.nullable(t.int({ min: 0, max: 1000000000 })),
      },
      (id) => {
        if (!isAllDigits(id)) return null;
        const go = (s, n) => {
          if (s.length === 0) return n;
          const ch = s.slice(0, 1);
          const rest = s.slice(1);
          return go(rest, n * 10 + digitVal(ch));
        };
        return go(id, 0);
      },
    );

    const hashId = contract(
      {
        name: "hashId",
        args: [t.id()],
        returns: t.int({ min: 0, max: 49 }),
      },
      (id) => {
        const go = (s, acc) => {
          if (s.length === 0) return acc;
          const rest = s.slice(1);
          const next = (acc * 31 + s.length) % 50;
          return go(rest, next);
        };
        return go(id, 0);
      },
    );

    const idToOffset = contract(
      {
        name: "idToOffset",
        args: [t.id(), t.int({ min: 0, max: 10000 })],
        returns: t.int({ min: 0, max: 2000000000 }),
      },
      (id, base) => {
        const num = parseNumericId(id);
        if (num !== null) return base + num;
        return base + 50 + hashId(id);
      },
    );

    const computeViewId = contract(
      {
        name: "computeViewId",
        args: [t.array(t.string({ max: 200 }), { max: 100 })],
        returns: t.string({ min: 1, max: 32 }),
      },
      (navStack) => {
        const top = navStack.reduce((_acc, x) => x, "list");
        if (top.startsWith("note:")) {
          const id = top.slice(5);
          return String(idToOffset(id, 200));
        }
        return LIST_VIEW_ID;
      },
    );

    const filterNotes = contract(
      {
        name: "filterNotes",
        args: [
          t.array(Note, {
            max: 10000,
            onInvalid: "coerce",
            default: [],
          }),
          FolderFilter,
        ],
        returns: t.array(Note, { max: 10000 }),
        ensures: (r, _notes, f) =>
          f === SMART_FOLDERS.trash || r.every((n) => !n.trashed),
      },
      (notes, folderFilter) => {
        if (folderFilter === SMART_FOLDERS.trash) {
          return notes.filter((n) => n.trashed);
        }
        if (folderFilter === SMART_FOLDERS.pinned) {
          return notes.filter((n) => n.pinned && !n.trashed);
        }
        if (folderFilter === SMART_FOLDERS.all) {
          return notes.filter((n) => !n.trashed);
        }
        return notes.filter(
          (n) => !n.trashed && n.folderId === folderFilter,
        );
      },
    );

    const folderLabelFor = contract(
      {
        name: "folderLabelFor",
        args: [FolderFilter, t.array(Folder, { max: 1000 })],
        returns: t.string({ min: 1, max: 100 }),
      },
      (folderFilter, folders) => {
        if (folderFilter === SMART_FOLDERS.all) return "All Notes";
        if (folderFilter === SMART_FOLDERS.pinned) return "Pinned";
        if (folderFilter === SMART_FOLDERS.trash) return "Recently Deleted";
        const found = folders.find((f) => f.id === folderFilter);
        if (found) return found.name;
        return "Notes";
      },
    );

    return { computeViewId, filterNotes, folderLabelFor, LIST_VIEW_ID };
  },
);
