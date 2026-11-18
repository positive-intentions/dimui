(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  test("incoming-call-banner accept decline", async function () {
    await BP.require("dimui/components/messaging/molecules/incoming-call-banner");
    var accepted = false;
    var declined = false;
    var el = await mount("dimui-incoming-call-banner", {
      open: true,
      kind: "video",
      peer: { displayName: "Alex Rivera" },
      onAccept: function () {
        accepted = true;
      },
      onDecline: function () {
        declined = true;
      },
    });
    expect(shadowText(el)).toContain("Incoming video call");
    var buttons = el.shadowRoot.querySelectorAll("dimui-button");
    buttons[0].shadowRoot.querySelector("button").click();
    buttons[1].shadowRoot.querySelector("button").click();
    expect(declined).toBe(true);
    expect(accepted).toBe(true);
  });
})();
