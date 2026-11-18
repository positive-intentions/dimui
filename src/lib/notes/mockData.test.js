(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;

  test("normalizeNote fills defaults", async function () {
    var mock = await BP.require("dimui/lib/notes/mockData");
    var note = mock.normalizeNote({
      id: "n1",
      title: "Hello",
      body: "World",
      folderId: "f1",
    });
    expect(note).toBeTruthy();
    expect(note.id).toBe("n1");
    expect(note.title).toBe("Hello");
    expect(note.body).toBe("World");
    expect(note.folderId).toBe("f1");
    expect(note.pinned).toBe(false);
    expect(note.trashed).toBe(false);
    expect(note.createdAt).toBeTruthy();
    expect(note.updatedAt).toBeTruthy();
  });

  test("normalizeNote rejects non-objects and fills missing fields", async function () {
    var mock = await BP.require("dimui/lib/notes/mockData");
    expect(mock.normalizeNote(null)).toBe(null);
    expect(mock.normalizeNote("x")).toBe(null);
    var sparse = mock.normalizeNote({ pinned: 1, trashed: 0 });
    expect(sparse).toBeTruthy();
    expect(sparse.id).toBeTruthy();
    expect(sparse.title).toBe("");
    expect(sparse.body).toBe("");
    expect(sparse.folderId).toBe(null);
    expect(sparse.pinned).toBe(true);
    expect(sparse.trashed).toBe(false);
    var withUpdatedOnly = mock.normalizeNote({
      id: "n2",
      updatedAt: "2020-01-02T00:00:00.000Z",
    });
    expect(withUpdatedOnly.createdAt).toBe("2020-01-02T00:00:00.000Z");
  });

  test("normalizeFolder null Untitled and id", async function () {
    var mock = await BP.require("dimui/lib/notes/mockData");
    expect(mock.normalizeFolder(null)).toBe(null);
    expect(mock.normalizeFolder("x")).toBe(null);
    var untitled = mock.normalizeFolder({ id: "f1" });
    expect(untitled.name).toBe("Untitled");
    expect(untitled.id).toBe("f1");
    var generated = mock.normalizeFolder({ name: "Work" });
    expect(generated.id).toBeTruthy();
    expect(generated.name).toBe("Work");
  });

  test("snippetFromBody truncates and handles empty", async function () {
    var mock = await BP.require("dimui/lib/notes/mockData");
    expect(mock.snippetFromBody("")).toBe("No additional text");
    expect(mock.snippetFromBody(null)).toBe("No additional text");
    expect(mock.snippetFromBody("  short  ")).toBe("short");
    var long = new Array(100).join("x");
    var snip = mock.snippetFromBody(long, 10);
    expect(snip.length).toBeGreaterThan(10);
    expect(snip).toContain("…");
  });

  test("formatRelativeTime buckets", async function () {
    var mock = await BP.require("dimui/lib/notes/mockData");
    expect(mock.formatRelativeTime("")).toBe("");
    expect(mock.formatRelativeTime(null)).toBe("");
    expect(mock.formatRelativeTime("not-a-date")).toBe("");

    var now = Date.now();
    expect(mock.formatRelativeTime(new Date(now).toISOString())).toBe(
      "just now",
    );
    expect(
      mock.formatRelativeTime(new Date(now - 5 * 60000).toISOString()),
    ).toBe("5 min ago");
    expect(
      mock.formatRelativeTime(new Date(now - 3 * 3600000).toISOString()),
    ).toBe("3h ago");
    expect(
      mock.formatRelativeTime(new Date(now - 2 * 86400000).toISOString()),
    ).toBe("2d ago");
    var older = mock.formatRelativeTime(
      new Date(now - 20 * 86400000).toISOString(),
    );
    expect(older).toBeTruthy();
    expect(older.indexOf("ago") < 0).toBeTruthy();

    var orig = Date.prototype.toLocaleDateString;
    Date.prototype.toLocaleDateString = function () {
      throw new Error("locale fail");
    };
    try {
      expect(
        mock.formatRelativeTime(new Date(now - 20 * 86400000).toISOString()),
      ).toBe("");
    } finally {
      Date.prototype.toLocaleDateString = orig;
    }
  });

  test("seed constants exist", async function () {
    var mock = await BP.require("dimui/lib/notes/mockData");
    expect(mock.SEED_FOLDERS.length).toBeGreaterThan(0);
    expect(mock.SEED_NOTES.length).toBeGreaterThan(0);
    expect(mock.SMART_FOLDERS.all).toBe("all");
    expect(mock.FOLDER_PERSONAL).toBeTruthy();
  });
})();
