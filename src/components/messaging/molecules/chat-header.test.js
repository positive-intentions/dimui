(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  test("chat-header shows peer and actions", async function () {
    await BP.require("dimui/components/messaging/molecules/chat-header");
    var voice = false;
    var video = false;
    var locked = false;
    var el = await mount("dimui-chat-header", {
      peer: { displayName: "Alex Rivera", handle: "alex" },
      online: true,
      typing: true,
      onVoice: function () {
        voice = true;
      },
      onVideo: function () {
        video = true;
      },
      onLock: function () {
        locked = true;
      },
      menuItems: [{ label: "Clear history" }],
    });
    expect(shadowText(el)).toContain("Alex Rivera");
    expect(shadowText(el)).toContain("typing");
    var buttons = el.shadowRoot.querySelectorAll("dimui-icon-button");
    buttons[0].shadowRoot.querySelector("button").click();
    buttons[1].shadowRoot.querySelector("button").click();
    buttons[buttons.length - 1].shadowRoot.querySelector("button").click();
    expect(voice).toBe(true);
    expect(video).toBe(true);
    expect(locked).toBe(true);
  });
})();
