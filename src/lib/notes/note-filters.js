BP.module("dimui/lib/notes/note-filters", ["dimui/lib/notes/mockData"], function (mock) {
  const { SMART_FOLDERS } = mock;

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

  return { computeViewId, filterNotes, folderLabelFor, LIST_VIEW_ID };
});
