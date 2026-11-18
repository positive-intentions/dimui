BP.module("dimui/lib/notes/mockData", [], function () {
  /** Seed content for a newly created vault. */

  const FOLDER_PERSONAL = "folder-personal";
  const FOLDER_WORK = "folder-work";
  const FOLDER_IDEAS = "folder-ideas";

  const SEED_FOLDERS = [
    { id: FOLDER_PERSONAL, name: "Personal" },
    { id: FOLDER_WORK, name: "Work" },
    { id: FOLDER_IDEAS, name: "Ideas" },
  ];

  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };

  const hoursAgo = (n) => {
    const d = new Date();
    d.setHours(d.getHours() - n);
    return d.toISOString();
  };

  const SEED_NOTES = [
    {
      id: "note-welcome",
      title: "Welcome to Notes",
      body: "Your notes are encrypted in this browser. Create folders, pin important notes, and move old ones to Recently Deleted.",
      folderId: FOLDER_PERSONAL,
      pinned: true,
      trashed: false,
      createdAt: daysAgo(5),
      updatedAt: hoursAgo(1),
    },
    {
      id: "note-groceries",
      title: "Grocery list",
      body: "Milk\nSourdough\nEggs\nSpinach\nCoffee beans\nOlive oil",
      folderId: FOLDER_PERSONAL,
      pinned: false,
      trashed: false,
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(3),
    },
    {
      id: "note-standup",
      title: "Standup talking points",
      body: "• Ship notes search\n• Review folder UX\n• Pair on vault encryption edge cases\n• Demo for Friday",
      folderId: FOLDER_WORK,
      pinned: true,
      trashed: false,
      createdAt: daysAgo(1),
      updatedAt: hoursAgo(0),
    },
    {
      id: "note-retro",
      title: "Sprint retro notes",
      body: "What went well: faster unlock flow.\nImprove: empty states felt sparse.\nIdeas: pin + trash next.",
      folderId: FOLDER_WORK,
      pinned: false,
      trashed: false,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(3),
    },
    {
      id: "note-app-ideas",
      title: "App ideas",
      body: "Encrypted notes with folders\nShared whiteboards\nOffline-first todo with sync later",
      folderId: FOLDER_IDEAS,
      pinned: false,
      trashed: false,
      createdAt: daysAgo(10),
      updatedAt: daysAgo(6),
    },
    {
      id: "note-quotes",
      title: "Quotes to remember",
      body: "\"Simplicity is the ultimate sophistication.\"\n\"Make it work, make it right, make it fast.\"",
      folderId: FOLDER_IDEAS,
      pinned: false,
      trashed: false,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(7),
    },
    {
      id: "note-old-draft",
      title: "Old draft",
      body: "This was moved to the trash as an example. Restore it anytime, or delete forever.",
      folderId: FOLDER_PERSONAL,
      pinned: false,
      trashed: true,
      createdAt: daysAgo(20),
      updatedAt: daysAgo(12),
    },
  ];

  /** Normalize legacy notes missing newer fields. */
  function normalizeNote(note) {
    if (!note || typeof note !== "object") return null;
    const now = new Date().toISOString();
    return {
      id: note.id || crypto.randomUUID(),
      title: typeof note.title === "string" ? note.title : "",
      body: typeof note.body === "string" ? note.body : "",
      folderId: note.folderId ?? null,
      pinned: Boolean(note.pinned),
      trashed: Boolean(note.trashed),
      createdAt: note.createdAt || note.updatedAt || now,
      updatedAt: note.updatedAt || now,
    };
  }

  function normalizeFolder(folder) {
    if (!folder || typeof folder !== "object") return null;
    return {
      id: folder.id || crypto.randomUUID(),
      name: typeof folder.name === "string" ? folder.name : "Untitled",
    };
  }

  function snippetFromBody(body, max = 80) {
    const text = String(body || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "No additional text";
    return text.length > max ? `${text.slice(0, max)}…` : text;
  }

  function formatRelativeTime(iso) {
    if (!iso) return "";
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const diff = Date.now() - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }

  const SMART_FOLDERS = {
    all: "all",
    pinned: "pinned",
    trash: "trash",
  };
  return { FOLDER_PERSONAL, FOLDER_WORK, FOLDER_IDEAS, SEED_FOLDERS, SEED_NOTES, normalizeNote, normalizeFolder, snippetFromBody, formatRelativeTime, SMART_FOLDERS };
});
