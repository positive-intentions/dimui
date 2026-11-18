(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;

  function clickHost(host) {
    if (!host) return;
    var btn =
      (host.shadowRoot && host.shadowRoot.querySelector("button")) || host;
    btn.click();
  }

  test("folder-rail lists items and opens new folder form", async function () {
    await BP.require("dimui/components/notes/organisms/folder-rail");
    var selected = null;
    var open = false;
    var name = "";
    var created = 0;
    var cancelled = 0;
    var el = await mount("dimui-folder-rail", {
      smartItems: [{ id: "all", name: "All Notes", icon: "book" }],
      folders: [{ id: "f1", name: "Personal" }],
      trashItem: { id: "trash", name: "Recently Deleted", icon: "trash" },
      folderFilter: "all",
      countFor: function () {
        return 2;
      },
      onSelectFolder: function (id) {
        selected = id;
      },
      newFolderOpen: false,
      newFolderName: "",
      onNewFolderOpen: function (v) {
        open = v;
      },
      onNewFolderName: function (v) {
        name = v;
      },
      onCreateFolder: function () {
        created += 1;
      },
      onCancelNewFolder: function () {
        cancelled += 1;
      },
    });

    expect(el.shadowRoot.querySelectorAll("dimui-folder-item").length).toBe(3);

    var item = el.shadowRoot.querySelector("dimui-folder-item");
    item.shadowRoot.querySelector("button").click();
    expect(selected).toBe("all");

    var newBtn = el.shadowRoot.querySelector(".new-folder-btn");
    newBtn.click();
    expect(open).toBe(true);

    el = await mount("dimui-folder-rail", {
      smartItems: [],
      folders: [],
      trashItem: null,
      newFolderOpen: true,
      newFolderName: "Ideas",
      onNewFolderName: function (v) {
        name = v;
      },
      onCreateFolder: function () {
        created += 1;
      },
      onCancelNewFolder: function () {
        cancelled += 1;
      },
    });
    var input = el.shadowRoot.querySelector("input.folder-select");
    input.value = "Ideas2";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(name).toBe("Ideas2");
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(created).toBeGreaterThan(0);
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(cancelled).toBeGreaterThan(0);
    clickHost(el.shadowRoot.querySelector("dimui-button"));
  });
})();
