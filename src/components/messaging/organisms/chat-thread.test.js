(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  test("chat-thread empty and with messages", async function () {
    await BP.require("dimui/components/messaging/organisms/chat-thread");
    var empty = await mount("dimui-chat-thread", {
      theme: "dark",
      peer: { displayName: "Alex Rivera" },
      connected: false,
      messages: [],
    });
    expect(empty.shadowRoot.querySelector("dimui-empty-state")).toBeTruthy();
    expect(empty.shadowRoot.querySelector("dimui-composer")).toBeTruthy();
    expect(shadowText(empty.shadowRoot.querySelector("dimui-composer"))).toContain(
      "Wait for connection",
    );

    var sent = null;
    var cancelled = false;
    var accepted = false;
    var declined = false;
    var filled = await mount("dimui-chat-thread", {
      theme: "light",
      peer: { displayName: "Alex Rivera" },
      connected: true,
      online: true,
      typing: false,
      incomingOpen: true,
      incomingKind: "voice",
      messages: [
        {
          id: "1",
          direction: "in",
          kind: "text",
          body: "Hello",
          status: "read",
          createdAt: new Date().toISOString(),
        },
      ],
      onSend: function (text) {
        sent = text;
      },
      onCancelFile: function () {
        cancelled = true;
      },
      onAcceptIncoming: function () {
        accepted = true;
      },
      onDeclineIncoming: function () {
        declined = true;
      },
    });
    expect(
      shadowText(filled.shadowRoot.querySelector("dimui-message-bubble")),
    ).toContain("Hello");
    expect(
      shadowText(filled.shadowRoot.querySelector("dimui-chat-header")),
    ).toContain("Alex Rivera");
    var banner = filled.shadowRoot.querySelector("dimui-incoming-call-banner");
    var buttons = banner.shadowRoot.querySelectorAll("dimui-button");
    buttons[0].shadowRoot.querySelector("button").click();
    buttons[1].shadowRoot.querySelector("button").click();
    expect(declined).toBe(true);
    expect(accepted).toBe(true);
    void cancelled;

    var composer = filled.shadowRoot.querySelector("dimui-composer");
    var ta = composer.shadowRoot.querySelector("textarea");
    ta.value = "ping";
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(0);
    composer.shadowRoot
      .querySelectorAll("dimui-icon-button")[1]
      .shadowRoot.querySelector("button")
      .click();
    expect(sent).toBe("ping");
  });
})();
