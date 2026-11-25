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
    expect(el.shadowRoot.querySelector("button.peer.clickable")).toBe(null);
    var buttons = el.shadowRoot.querySelectorAll("dimui-icon-button");
    buttons[0].shadowRoot.querySelector("button").click();
    buttons[1].shadowRoot.querySelector("button").click();
    buttons[buttons.length - 1].shadowRoot.querySelector("button").click();
    expect(voice).toBe(true);
    expect(video).toBe(true);
    expect(locked).toBe(true);
  });

  test("chat-header onPeerClick opens contact", async function () {
    await BP.require("dimui/components/messaging/molecules/chat-header");
    var peerClicked = false;
    var el = await mount("dimui-chat-header", {
      peer: { displayName: "Bo", handle: "bo" },
      online: false,
      onPeerClick: function () {
        peerClicked = true;
      },
    });
    var peerBtn = el.shadowRoot.querySelector("button.peer.clickable");
    expect(peerBtn).toBeTruthy();
    peerBtn.click();
    expect(peerClicked).toBe(true);
  });
})();
