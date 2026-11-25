(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  test("contact-details shows peer and back", async function () {
    await BP.require("dimui/components/messaging/organisms/contact-details");
    var back = false;
    var el = await mount("dimui-messaging-contact", {
      theme: "dark",
      contact: { displayName: "Alex Rivera", handle: "alex" },
      online: true,
      onBack: function () {
        back = true;
      },
    });
    expect(shadowText(el)).toContain("Alex Rivera");
    expect(shadowText(el)).toContain("@alex");
    expect(shadowText(el)).toContain("Online");

    el.shadowRoot
      .querySelector("dimui-icon-button")
      .shadowRoot.querySelector("button")
      .click();
    expect(back).toBe(true);
  });

  test("contact-details empty state when missing peer", async function () {
    await BP.require("dimui/components/messaging/organisms/contact-details");
    var el = await mount("dimui-messaging-contact", {
      theme: "light",
      contact: null,
      onBack: function () {},
    });
    expect(el.shadowRoot.querySelector("dimui-empty-state")).toBeTruthy();
    expect(shadowText(el)).toContain("No contact");
  });
})();
