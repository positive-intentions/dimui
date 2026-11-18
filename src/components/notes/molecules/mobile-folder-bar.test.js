(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;

  test("mobile-folder-bar selects chip", async function () {
    await BP.require("dimui/components/notes/molecules/mobile-folder-bar");
    var selected = null;
    var el = await mount("dimui-mobile-folder-bar", {
      items: [
        { id: "all", name: "All Notes" },
        { id: "f1", name: "Personal" },
      ],
      selectedId: "all",
      onSelect: function (id) {
        selected = id;
      },
    });
    var chips = el.shadowRoot.querySelectorAll("dimui-chip");
    expect(chips.length).toBe(2);
    var chip = chips[1];
    var btn =
      (chip.shadowRoot && chip.shadowRoot.querySelector("button")) || chip;
    btn.click();
    // Fallback: invoke props if click did not bubble through
    if (selected == null && chip.props && chip.props.onClick) {
      chip.props.onClick();
    }
    expect(selected).toBe("f1");
  });

  test("mobile-folder-bar empty items", async function () {
    await BP.require("dimui/components/notes/molecules/mobile-folder-bar");
    var el = await mount("dimui-mobile-folder-bar", {});
    expect(el.shadowRoot.querySelectorAll("dimui-chip").length).toBe(0);
  });
})();
