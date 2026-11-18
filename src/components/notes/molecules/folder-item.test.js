(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  test("folder-item renders and selects", async function () {
    await BP.require("dimui/components/notes/molecules/folder-item");
    var selected = null;
    var el = await mount("dimui-folder-item", {
      id: "f1",
      name: "Personal",
      icon: "folder",
      count: 3,
      active: true,
      onSelect: function (id) {
        selected = id;
      },
    });
    expect(shadowText(el)).toContain("Personal");
    expect(shadowText(el)).toContain("3");
    var btn = el.shadowRoot.querySelector("button.folder-item");
    expect(btn.className).toContain("active");
    btn.click();
    expect(selected).toBe("f1");
  });

  test("folder-item defaults without callbacks", async function () {
    await BP.require("dimui/components/notes/molecules/folder-item");
    var el = await mount("dimui-folder-item", {});
    expect(shadowText(el)).toContain("Folder");
    el.shadowRoot.querySelector("button").click();
  });
})();
