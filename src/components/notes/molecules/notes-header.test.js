(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  test("notes-header lock callback", async function () {
    await BP.require("dimui/components/notes/molecules/notes-header");
    var locked = 0;
    var el = await mount("dimui-notes-header", {
      title: "My Notes",
      onLock: function () {
        locked += 1;
      },
    });
    expect(shadowText(el)).toContain("My Notes");
    var iconBtn = el.shadowRoot.querySelector("dimui-icon-button");
    var btn =
      (iconBtn.shadowRoot && iconBtn.shadowRoot.querySelector("button")) ||
      iconBtn;
    btn.click();
    if (!locked && iconBtn.props && iconBtn.props.onClick) {
      iconBtn.props.onClick();
    }
    expect(locked).toBe(1);
  });

  test("notes-header default title and noop lock", async function () {
    await BP.require("dimui/components/notes/molecules/notes-header");
    var el = await mount("dimui-notes-header", {});
    expect(shadowText(el)).toContain("Notes");
    var iconBtn = el.shadowRoot.querySelector("dimui-icon-button");
    var btn =
      (iconBtn.shadowRoot && iconBtn.shadowRoot.querySelector("button")) ||
      iconBtn;
    btn.click();
  });
})();
