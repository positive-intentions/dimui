BP.module(
  "dimui/stories/fixtures",
  [],
  function () {
  const SAMPLE_NOTES = [
    {
      id: "note-1",
      title: "Shopping list",
      body: "Milk, eggs, bread",
      folderId: "folder-personal",
      pinned: true,
      trashed: false,
      createdAt: "2026-03-10T12:00:00.000Z",
      updatedAt: "2026-03-10T14:30:00.000Z",
    },
    {
      id: "note-2",
      title: "Ideas",
      body: "Atomic design for dimui explorer",
      folderId: "folder-ideas",
      pinned: false,
      trashed: false,
      createdAt: "2026-03-11T08:00:00.000Z",
      updatedAt: "2026-03-11T09:15:00.000Z",
    },
    {
      id: "note-3",
      title: "",
      body: "Untitled draft body",
      folderId: null,
      pinned: false,
      trashed: false,
      createdAt: "2026-03-12T18:00:00.000Z",
      updatedAt: "2026-03-12T18:00:00.000Z",
    },
  ];
  const SAMPLE_NOTE = SAMPLE_NOTES[0];
  const SAMPLE_FOLDERS = [
    { id: "folder-personal", name: "Personal" },
    { id: "folder-ideas", name: "Ideas" },
  ];
  return { SAMPLE_NOTES, SAMPLE_NOTE, SAMPLE_FOLDERS };
  },
);
