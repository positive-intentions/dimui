(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  test("note-item registers and shows title/snippet", async function () {
    await BP.require("dimui/components/notes/molecules/note-item");
    expect(customElements.get("dimui-note-item")).toBeTruthy();

    var el = await mount("dimui-note-item", {
      note: {
        id: "note-1",
        title: "Grocery list",
        body: "Milk and eggs",
        updatedAt: new Date().toISOString(),
        pinned: false,
      },
      selected: false,
    });

    expect(el.shadowRoot).toBeTruthy();
    var text = shadowText(el);
    expect(text).toContain("Grocery list");
    expect(text).toContain("Milk and eggs");
  });

  test("note-item click calls onSelect", async function () {
    await BP.require("dimui/components/notes/molecules/note-item");
    var selectedId = null;
    var el = await mount("dimui-note-item", {
      note: {
        id: "note-42",
        title: "Click me",
        body: "body",
        updatedAt: new Date().toISOString(),
      },
      onSelect: function (id) {
        selectedId = id;
      },
    });

    var btn = el.shadowRoot.querySelector("button");
    expect(btn).toBeTruthy();
    btn.click();
    expect(selectedId).toBe("note-42");
  });

  test("note-item pinned selected shareTransition untitled", async function () {
    await BP.require("dimui/components/notes/molecules/note-item");
    var el = await mount("dimui-note-item", {
      note: {
        id: "note-p",
        title: "  ",
        body: "",
        updatedAt: new Date().toISOString(),
        pinned: true,
      },
      selected: true,
      shareTransition: true,
    });
    expect(shadowText(el)).toContain("Untitled");
    expect(el.shadowRoot.querySelector(".pin-mark")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".note-row.active")).toBeTruthy();
  });
})();
