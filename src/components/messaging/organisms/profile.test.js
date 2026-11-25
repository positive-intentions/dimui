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

  function setTextField(field, value) {
    var input = field.shadowRoot.querySelector("input");
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  test("profile renders fields and save/back", async function () {
    await BP.require("dimui/components/messaging/organisms/profile");
    var saved = null;
    var back = false;
    var el = await mount("dimui-profile", {
      theme: "dark",
      profile: {
        displayName: "Ada",
        handle: "ada",
        icePreset: "public",
      },
      icePresets: [
        { id: "public", label: "Public STUN" },
        { id: "google", label: "Google STUN" },
      ],
      onBack: function () {
        back = true;
      },
      onSave: function (next) {
        saved = next;
      },
    });
    expect(shadowText(el)).toContain("My profile");
    expect(el.shadowRoot.querySelector("#profile-ice")).toBeTruthy();

    var fields = el.shadowRoot.querySelectorAll("dimui-text-field");
    setTextField(fields[0], "Ada Lovelace");
    setTextField(fields[1], "@Ada");
    await sleep(0);

    el.shadowRoot
      .querySelector("dimui-button")
      .shadowRoot.querySelector("button")
      .click();
    expect(saved).toBeTruthy();
    expect(saved.displayName).toBe("Ada Lovelace");
    expect(saved.handle).toBe("ada");
    expect(saved.icePreset).toBe("public");

    el.shadowRoot
      .querySelector("dimui-icon-button")
      .shadowRoot.querySelector("button")
      .click();
    expect(back).toBe(true);
  });

  test("profile hides ICE select without presets and shows error", async function () {
    await BP.require("dimui/components/messaging/organisms/profile");
    var el = await mount("dimui-profile", {
      theme: "light",
      profile: { displayName: "Bo", handle: "bo" },
      icePresets: [],
      error: "Enter a display name and handle.",
      onBack: function () {},
      onSave: function () {},
    });
    expect(el.shadowRoot.querySelector("#profile-ice")).toBe(null);
    expect(shadowText(el)).toContain("Enter a display name and handle.");
  });
})();
