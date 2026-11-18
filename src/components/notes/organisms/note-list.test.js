(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  function sampleNotes() {
    return [
      {
        id: "a",
        title: "Alpha",
        body: "first",
        pinned: true,
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: "b",
        title: "Beta",
        body: "second",
        pinned: false,
        updatedAt: "2024-01-03T00:00:00.000Z",
      },
    ];
  }

  function clickHost(host) {
    if (!host) return;
    var btn =
      (host.shadowRoot && host.shadowRoot.querySelector("button")) || host;
    btn.click();
  }

  test("note-list renders notes and create fab", async function () {
    await BP.require("dimui/components/notes/organisms/note-list");
    var created = 0;
    var selected = null;
    var el = await mount("dimui-note-list", {
      notes: sampleNotes(),
      selectedId: "a",
      folderFilter: "all",
      folderLabel: "All Notes",
      onSelect: function (id) {
        selected = id;
      },
      onCreate: function () {
        created += 1;
      },
    });
    expect(shadowText(el)).toContain("All Notes");
    expect(el.shadowRoot.querySelectorAll("dimui-note-item").length).toBe(2);
    var fab = el.shadowRoot.querySelector("dimui-fab");
    expect(fab).toBeTruthy();
    clickHost(fab);
    expect(created).toBe(1);

    var item = el.shadowRoot.querySelector("dimui-note-item");
    item.shadowRoot.querySelector("button").click();
    expect(selected).toBeTruthy();
  });

  test("note-list empty and trash empty-trash", async function () {
    await BP.require("dimui/components/notes/organisms/note-list");
    var mock = await BP.require("dimui/lib/notes/mockData");
    var emptied = 0;
    var empty = await mount("dimui-note-list", {
      notes: [],
      folderFilter: mock.SMART_FOLDERS.all,
      folderLabel: "All Notes",
    });
    expect(empty.shadowRoot.querySelector("dimui-empty-state")).toBeTruthy();

    var trash = await mount("dimui-note-list", {
      notes: sampleNotes(),
      folderFilter: mock.SMART_FOLDERS.trash,
      folderLabel: "Recently Deleted",
      onEmptyTrash: function () {
        emptied += 1;
      },
    });
    expect(shadowText(trash)).toContain("Recently Deleted");
    var emptyBtn = trash.shadowRoot.querySelector("dimui-button");
    expect(emptyBtn).toBeTruthy();
    clickHost(emptyBtn);
    expect(emptied).toBe(1);
  });

  test("note-list search filters to empty match", async function () {
    await BP.require("dimui/components/notes/organisms/note-list");
    var el = await mount("dimui-note-list", {
      notes: sampleNotes(),
      folderLabel: "All Notes",
    });
    var search = el.shadowRoot.querySelector("dimui-search-field");
    expect(search).toBeTruthy();
    var input =
      search.shadowRoot && search.shadowRoot.querySelector("input");
    if (input) {
      input.value = "zzzz-no-match";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await el.updateComplete;
      await new Promise(function (r) {
        requestAnimationFrame(r);
      });
    }
    expect(el.shadowRoot.querySelector("dimui-empty-state")).toBeTruthy();
  });
})();
