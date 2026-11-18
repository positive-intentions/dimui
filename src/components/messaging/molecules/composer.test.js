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

  test("composer disabled and send", async function () {
    await BP.require("dimui/components/messaging/molecules/composer");
    var disabled = await mount("dimui-composer", {
      enabled: false,
      disabledHint: "Wait for connection",
    });
    expect(shadowText(disabled)).toContain("Wait for connection");

    var sent = null;
    var typing = null;
    var attached = null;
    var el = await mount("dimui-composer", {
      enabled: true,
      onSend: function (text) {
        sent = text;
      },
      onTyping: function (v) {
        typing = v;
      },
      onAttach: function (meta) {
        attached = meta;
      },
    });
    var ta = el.shadowRoot.querySelector("textarea");
    ta.value = "hi there";
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(0);
    expect(typing).toBe(true);
    var sendBtn = el.shadowRoot.querySelectorAll("dimui-icon-button")[1];
    sendBtn.shadowRoot.querySelector("button").click();
    await sleep(0);
    expect(sent).toBe("hi there");

    ta.value = "enter send";
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(0);
    ta.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );
    await sleep(0);
    expect(sent).toBe("enter send");

    var attachBtn = el.shadowRoot.querySelectorAll("dimui-icon-button")[0];
    // Force file chooser path by stubbing click to mark, then change event
    var fileInput = el.shadowRoot.querySelector('input[type="file"]');
    var clicked = false;
    fileInput.click = function () {
      clicked = true;
    };
    attachBtn.shadowRoot.querySelector("button").click();
    await sleep(0);
    expect(clicked).toBe(true);

    var file = new File(["x"], "note.txt", { type: "text/plain" });
    Object.defineProperty(fileInput, "files", {
      value: [file],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(0);
    expect(attached && attached.name).toBe("note.txt");
  });
})();

