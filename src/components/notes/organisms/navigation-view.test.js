(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;

  test("navigation-view list and note-open modes", async function () {
    await BP.require("dimui/components/notes/organisms/navigation-view");
    var mock = await BP.require("dimui/lib/notes/mockData");
    var notes = [
      {
        id: "n1",
        title: "One",
        body: "body",
        pinned: false,
        updatedAt: new Date().toISOString(),
      },
    ];
    var el = await mount("dimui-notes-nav", {
      notes: notes,
      folders: [{ id: "f1", name: "Personal" }],
      selectedId: null,
      folderFilter: mock.SMART_FOLDERS.all,
      folderLabel: "All Notes",
      navStack: ["list"],
      saveStatus: "",
      onSelect: function () {},
      onCreate: function () {},
      onBack: function () {},
      onChange: function () {},
      onTogglePin: function () {},
      onMoveFolder: function () {},
      onTrash: function () {},
      onRestore: function () {},
      onDeleteForever: function () {},
      onEmptyTrash: function () {},
    });
    expect(el.shadowRoot.querySelector("dimui-note-list")).toBeTruthy();
    expect(el.shadowRoot.querySelector("dimui-note-editor")).toBeTruthy();
    expect(
      el.shadowRoot.querySelector(".nav-view-root.note-open"),
    ).toBe(null);

    el = await mount("dimui-notes-nav", {
      notes: notes,
      folders: [],
      selectedId: "n1",
      folderFilter: mock.SMART_FOLDERS.all,
      folderLabel: "All Notes",
      navStack: ["list", "note:n1"],
      saveStatus: "Saving…",
    });
    expect(
      el.shadowRoot.querySelector(".nav-view-root.note-open"),
    ).toBeTruthy();
  });
})();
