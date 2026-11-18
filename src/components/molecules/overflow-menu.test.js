(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  test("overflow-menu opens and invokes item", async function () {
    await BP.require("dimui/components/molecules/overflow-menu");
    var clicked = false;
    var el = await mount("dimui-overflow-menu", {
      items: [
        {
          label: "Do it",
          onClick: function () {
            clicked = true;
          },
        },
        { label: "Danger", danger: true },
      ],
    });
    var toggle = el.shadowRoot.querySelector("dimui-icon-button");
    toggle.shadowRoot.querySelector("button").click();
    await sleep(0);
    var item = el.shadowRoot.querySelector('[role="menuitem"]');
    expect(Boolean(item)).toBe(true);
    item.click();
    expect(clicked).toBe(true);
  });
})();
