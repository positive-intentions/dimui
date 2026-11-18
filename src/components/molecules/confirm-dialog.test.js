(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  function clickHost(host) {
    if (!host) return;
    var btn =
      (host.shadowRoot && host.shadowRoot.querySelector("button")) || host;
    btn.click();
  }

  test("confirm-dialog hidden when closed, shows defaults", async function () {
    await BP.require("dimui/components/molecules/confirm-dialog");
    var el = await mount("dimui-confirm-dialog", { open: false });
    var root = el.shadowRoot.querySelector(".confirm-dialog");
    expect(root).toBeTruthy();
    expect(root.hasAttribute("hidden")).toBeTruthy();
    expect(shadowText(el)).toContain("Confirm");
  });

  test("confirm-dialog confirm and cancel callbacks", async function () {
    await BP.require("dimui/components/molecules/confirm-dialog");
    var confirmed = 0;
    var cancelled = 0;
    var el = await mount("dimui-confirm-dialog", {
      open: true,
      title: "Empty Trash?",
      body: "Gone forever",
      confirmLabel: "Empty Trash",
      onConfirm: function () {
        confirmed += 1;
      },
      onCancel: function () {
        cancelled += 1;
      },
    });
    expect(shadowText(el)).toContain("Empty Trash?");
    expect(shadowText(el)).toContain("Gone forever");

    el.shadowRoot.querySelector(".confirm-backdrop").click();
    expect(cancelled).toBe(1);

    var buttons = el.shadowRoot.querySelectorAll("dimui-button");
    expect(buttons.length).toBe(2);
    clickHost(buttons[0]);
    clickHost(buttons[1]);
    expect(cancelled).toBeGreaterThan(1);
    expect(confirmed).toBe(1);
  });
})();
