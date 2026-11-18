(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;

  test("notes-layout dark list and light note-open", async function () {
    await BP.require("dimui/components/notes/templates/notes-layout");
    var mock = await BP.require("dimui/lib/notes/mockData");

    var el = await mount("dimui-notes-layout", {
      theme: "dark",
      noteOpen: false,
      viewId: "10",
      folderRail: {
        smartItems: [{ id: mock.SMART_FOLDERS.all, name: "All Notes", icon: "book" }],
        folders: [],
        trashItem: {
          id: mock.SMART_FOLDERS.trash,
          name: "Recently Deleted",
          icon: "trash",
        },
        folderFilter: mock.SMART_FOLDERS.all,
        countFor: function () {
          return 0;
        },
        onSelectFolder: function () {},
        newFolderOpen: false,
        newFolderName: "",
        onNewFolderOpen: function () {},
        onNewFolderName: function () {},
        onCreateFolder: function () {},
        onCancelNewFolder: function () {},
      },
      header: { title: "Notes", onLock: function () {} },
      mobileBar: {
        items: [{ id: "all", name: "All Notes" }],
        selectedId: "all",
        onSelect: function () {},
      },
      nav: {
        notes: [],
        folders: [],
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
      },
      confirm: {
        open: false,
        title: "Empty Trash?",
        body: "body",
        confirmLabel: "Empty Trash",
        onConfirm: function () {},
        onCancel: function () {},
      },
    });

    expect(el.shadowRoot.querySelector("dimui-folder-rail")).toBeTruthy();
    expect(el.shadowRoot.querySelector("dimui-notes-header")).toBeTruthy();
    expect(el.shadowRoot.querySelector("dimui-notes-nav")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".main-column.note-open-mobile")).toBe(
      null,
    );

    el = await mount("dimui-notes-layout", {
      theme: "light",
      noteOpen: true,
      viewId: "201",
      folderRail: {},
      header: {},
      mobileBar: {},
      nav: { notes: [], navStack: ["list", "note:x"] },
      confirm: { open: true, title: "Sure?", body: "y", onConfirm: function () {}, onCancel: function () {} },
    });
    expect(
      el.shadowRoot.querySelector(".main-column.note-open-mobile"),
    ).toBeTruthy();
    expect(
      el.shadowRoot.querySelector(".notes-app").getAttribute("data-theme"),
    ).toBe("light");
  });
})();
