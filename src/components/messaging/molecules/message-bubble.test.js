(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  test("message-bubble text and file", async function () {
    await BP.require("dimui/components/messaging/molecules/message-bubble");
    var textEl = await mount("dimui-message-bubble", {
      message: {
        id: "1",
        direction: "out",
        kind: "text",
        body: "Hello",
        status: "delivered",
        createdAt: new Date().toISOString(),
      },
    });
    expect(shadowText(textEl)).toContain("Hello");

    var cancelled = false;
    var fileEl = await mount("dimui-message-bubble", {
      message: {
        id: "2",
        direction: "out",
        kind: "file",
        body: "a.bin",
        status: "sent",
        createdAt: new Date().toISOString(),
        attachment: {
          name: "a.bin",
          mime: "application/octet-stream",
          size: 10,
          phase: "sending",
          progress: 40,
        },
      },
      onCancelFile: function () {
        cancelled = true;
      },
    });
    expect(shadowText(fileEl)).toContain("a.bin");
    var btn = fileEl.shadowRoot.querySelector("dimui-button");
    btn.shadowRoot.querySelector("button").click();
    expect(cancelled).toBe(true);

    var empty = await mount("dimui-message-bubble", { message: null });
    expect(shadowText(empty)).toBe("");
  });
})();
