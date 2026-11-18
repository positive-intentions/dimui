(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;
  var mount = DimTest.mount;
  var shadowText = DimTest.shadowText;

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function waitFor(fn, label, timeoutMs) {
    var timeout = timeoutMs || 20000;
    var start = Date.now();
    while (Date.now() - start < timeout) {
      var value = fn();
      if (value) return value;
      await sleep(50);
    }
    throw new Error("timeout waiting for " + (label || "condition"));
  }

  function clickHost(host) {
    if (!host) return;
    var btn =
      (host.shadowRoot && host.shadowRoot.querySelector("button")) || host;
    btn.click();
  }

  async function waitShellReady(el) {
    await waitFor(function () {
      var text = shadowText(el);
      return (
        text.indexOf("Decrypting") < 0 &&
        text.indexOf("Opening vault") < 0 &&
        el.shadowRoot &&
        el.shadowRoot.querySelector("dimui-notes-layout")
      );
    }, "shell ready");
    var layout = el.shadowRoot.querySelector("dimui-notes-layout");
    if (layout && layout.updateComplete) await layout.updateComplete;
    await waitFor(function () {
      var nav = layout.shadowRoot.querySelector("dimui-notes-nav");
      if (!nav || !nav.shadowRoot) return null;
      var list = nav.shadowRoot.querySelector("dimui-note-list");
      if (!list || !list.shadowRoot) return null;
      return list.shadowRoot.querySelector("dimui-note-item");
    }, "seed notes visible");
    return layout;
  }

  function layoutParts(layout) {
    var root = layout.shadowRoot;
    return {
      rail: root.querySelector("dimui-folder-rail"),
      header: root.querySelector("dimui-notes-header"),
      mobile: root.querySelector("dimui-mobile-folder-bar"),
      nav: root.querySelector("dimui-notes-nav"),
      confirm: root.querySelector("dimui-confirm-dialog"),
    };
  }

  function navParts(nav) {
    var root = nav.shadowRoot;
    return {
      list: root.querySelector("dimui-note-list"),
      editor: root.querySelector("dimui-note-editor"),
    };
  }

  test("notes-shell create vault seeds notes and CRUD", async function () {
    var vault = await BP.require("dimui/lib/notes/vault");
    try {
      localStorage.removeItem(vault.VAULT_FLAG);
    } catch (e) {}

    await BP.require("dimui/components/notes/organisms/notes-shell");
    var locked = 0;
    var el = await mount("dimui-notes-shell", {
      password: "test-pass-1",
      create: true,
      theme: "light",
      onLock: function () {
        locked += 1;
      },
      onUnlockFailed: function () {},
    });

    var layout = await waitShellReady(el);
    var parts = layoutParts(layout);
    var nav = navParts(parts.nav);
    expect(nav.list.shadowRoot.querySelectorAll("dimui-note-item").length).toBeGreaterThan(
      0,
    );

    // Create note via FAB
    clickHost(nav.list.shadowRoot.querySelector("dimui-fab"));
    await waitFor(function () {
      layout = el.shadowRoot.querySelector("dimui-notes-layout");
      parts = layoutParts(layout);
      nav = navParts(parts.nav);
      return nav.editor && nav.editor.shadowRoot.querySelector(".title-input");
    }, "editor after create");

    var title = nav.editor.shadowRoot.querySelector(".title-input");
    title.value = "Coverage note";
    title.dispatchEvent(new Event("input", { bubbles: true }));
    var body = nav.editor.shadowRoot.querySelector(".body-input");
    body.value = "Hello coverage";
    body.dispatchEvent(new Event("input", { bubbles: true }));

    var icons = nav.editor.shadowRoot.querySelectorAll("dimui-icon-button");
    for (var i = 0; i < icons.length; i++) {
      var sr = icons[i].shadowRoot && icons[i].shadowRoot.querySelector("button");
      var al = (sr && sr.getAttribute("aria-label")) || "";
      if (/pin/i.test(al)) clickHost(icons[i]);
    }

    var select = nav.editor.shadowRoot.querySelector(".folder-select");
    if (select && select.options.length > 1) {
      select.value = select.options[1].value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    icons = nav.editor.shadowRoot.querySelectorAll("dimui-icon-button");
    for (var j = 0; j < icons.length; j++) {
      var sr2 = icons[j].shadowRoot && icons[j].shadowRoot.querySelector("button");
      var al2 = (sr2 && sr2.getAttribute("aria-label")) || "";
      if (/trash/i.test(al2)) {
        clickHost(icons[j]);
        break;
      }
    }
    await sleep(80);
    var dialog = nav.editor.shadowRoot.querySelector("dimui-confirm-dialog");
    if (dialog) {
      clickHost(dialog.shadowRoot.querySelectorAll("dimui-button")[1]);
    }

    await sleep(120);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    var railItems = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    railItems[railItems.length - 1].shadowRoot.querySelector("button").click();
    await sleep(120);

    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    var noteItem = nav.list.shadowRoot.querySelector("dimui-note-item");
    if (noteItem) {
      noteItem.shadowRoot.querySelector("button").click();
      await sleep(100);
      layout = el.shadowRoot.querySelector("dimui-notes-layout");
      parts = layoutParts(layout);
      nav = navParts(parts.nav);
      var restore = nav.editor.shadowRoot.querySelector("dimui-icon-button");
      if (restore) clickHost(restore);
      await sleep(80);
    }

    // New folder
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    var newBtn = parts.rail.shadowRoot.querySelector(".new-folder-btn");
    if (newBtn) {
      newBtn.click();
      await waitFor(function () {
        layout = el.shadowRoot.querySelector("dimui-notes-layout");
        parts = layoutParts(layout);
        return parts.rail.shadowRoot.querySelector("input.folder-select");
      }, "new folder input");
      var input = parts.rail.shadowRoot.querySelector("input.folder-select");
      input.value = "   ";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(30);
      clickHost(parts.rail.shadowRoot.querySelector("dimui-button"));
      await sleep(30);
      input = parts.rail.shadowRoot.querySelector("input.folder-select");
      if (input) {
        input.value = "Coverage Folder";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(30);
        clickHost(parts.rail.shadowRoot.querySelector("dimui-button"));
        await sleep(100);
      }
    }

    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    clickHost(parts.header.shadowRoot.querySelector("dimui-icon-button"));
    expect(locked).toBe(1);

    window.dispatchEvent(new Event("beforeunload"));
  });

  test("notes-shell wrong password calls onUnlockFailed", async function () {
    var vault = await BP.require("dimui/lib/notes/vault");
    try {
      localStorage.setItem(vault.VAULT_FLAG, "1");
    } catch (e) {}

    await BP.require("dimui/components/notes/organisms/notes-shell");
    var failed = null;
    await mount("dimui-notes-shell", {
      password: "definitely-wrong-password-xyz",
      create: false,
      theme: "dark",
      onLock: function () {},
      onUnlockFailed: function (msg) {
        failed = msg;
      },
    });

    await waitFor(function () {
      return failed;
    }, "unlock failed");
    expect(String(failed)).toContain("Wrong password");
  });

  function clickIconByLabel(root, re) {
    var icons = root.querySelectorAll("dimui-icon-button");
    for (var i = 0; i < icons.length; i++) {
      var sr = icons[i].shadowRoot && icons[i].shadowRoot.querySelector("button");
      var al = (sr && sr.getAttribute("aria-label")) || "";
      if (re.test(al)) {
        clickHost(icons[i]);
        return true;
      }
    }
    return false;
  }

  test("notes-shell reopen vault restore deleteForever and nav clear", async function () {
    var vault = await BP.require("dimui/lib/notes/vault");
    try {
      localStorage.removeItem(vault.VAULT_FLAG);
    } catch (e) {}

    await BP.require("dimui/components/notes/organisms/notes-shell");
    var password = "reopen-pass-99";
    var el = await mount("dimui-notes-shell", {
      password: password,
      create: true,
      theme: "dark",
      onLock: function () {},
      onUnlockFailed: function () {},
    });
    var layout = await waitShellReady(el);

    // Remount with same password → VAULT_SENTINEL success path
    el = await mount("dimui-notes-shell", {
      password: password,
      create: false,
      theme: "light",
      onLock: function () {},
      onUnlockFailed: function () {},
    });
    layout = await waitShellReady(el);
    var parts = layoutParts(layout);
    var nav = navParts(parts.nav);

    // Select Personal folder, open a note, move it to Work while still open
    // (selectFolder resets stack; moveFolder does not → hits nav clear effect).
    var railItems = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    // smart: all, pinned, then folders…, trash
    railItems[2].shadowRoot.querySelector("button").click();
    await sleep(120);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    var item = nav.list.shadowRoot.querySelector("dimui-note-item");
    expect(item).toBeTruthy();
    item.shadowRoot.querySelector("button").click();
    await sleep(120);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    var select = nav.editor.shadowRoot.querySelector(".folder-select");
    expect(select).toBeTruthy();
    // Choose a different folder option
    var other = null;
    for (var oi = 0; oi < select.options.length; oi++) {
      if (select.options[oi].value && select.options[oi].value !== select.value) {
        other = select.options[oi].value;
        break;
      }
    }
    expect(other).toBeTruthy();
    select.value = other;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(150);

    // Trash: open seeded trashed note → Restore (not Back)
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    railItems = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    railItems[railItems.length - 1].shadowRoot.querySelector("button").click();
    await sleep(120);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    item = nav.list.shadowRoot.querySelector("dimui-note-item");
    expect(item).toBeTruthy();
    item.shadowRoot.querySelector("button").click();
    await sleep(120);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    expect(
      clickIconByLabel(nav.editor.shadowRoot, /restore/i),
    ).toBeTruthy();
    await sleep(120);

    // Trash another note from All, open in trash, delete forever
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    railItems = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    railItems[0].shadowRoot.querySelector("button").click();
    await sleep(100);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    item = nav.list.shadowRoot.querySelector("dimui-note-item");
    item.shadowRoot.querySelector("button").click();
    await sleep(100);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    expect(clickIconByLabel(nav.editor.shadowRoot, /trash/i)).toBeTruthy();
    await sleep(80);
    var dialog = nav.editor.shadowRoot.querySelector("dimui-confirm-dialog");
    clickHost(dialog.shadowRoot.querySelectorAll("dimui-button")[1]);
    await sleep(120);

    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    railItems = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    railItems[railItems.length - 1].shadowRoot.querySelector("button").click();
    await sleep(120);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    item = nav.list.shadowRoot.querySelector("dimui-note-item");
    expect(item).toBeTruthy();
    item.shadowRoot.querySelector("button").click();
    await sleep(120);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    clickHost(nav.editor.shadowRoot.querySelector("dimui-button"));
    await sleep(80);
    dialog = nav.editor.shadowRoot.querySelector("dimui-confirm-dialog");
    clickHost(dialog.shadowRoot.querySelectorAll("dimui-button")[1]);
    await sleep(120);
  });

  test("notes-shell folders trash empty and mobile", async function () {
    var vault = await BP.require("dimui/lib/notes/vault");
    try {
      localStorage.removeItem(vault.VAULT_FLAG);
    } catch (e) {}

    await BP.require("dimui/components/notes/organisms/notes-shell");
    var el = await mount("dimui-notes-shell", {
      password: "test-pass-2",
      create: true,
      theme: "dark",
      onLock: function () {},
      onUnlockFailed: function () {},
    });
    var layout = await waitShellReady(el);
    var parts = layoutParts(layout);

    var items = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    if (items.length > 1) {
      items[1].shadowRoot.querySelector("button").click();
      await sleep(80);
    }

    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    items = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    items[0].shadowRoot.querySelector("button").click();
    await sleep(50);
    items[items.length - 1].shadowRoot.querySelector("button").click();
    await sleep(100);

    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    var nav = navParts(parts.nav);
    var emptyBtn = nav.list.shadowRoot.querySelector("dimui-button");
    if (emptyBtn) {
      clickHost(emptyBtn);
      await sleep(80);
      layout = el.shadowRoot.querySelector("dimui-notes-layout");
      parts = layoutParts(layout);
      var btns = parts.confirm.shadowRoot.querySelectorAll("dimui-button");
      clickHost(btns[0]);
      await sleep(50);
      layout = el.shadowRoot.querySelector("dimui-notes-layout");
      parts = layoutParts(layout);
      nav = navParts(parts.nav);
      emptyBtn = nav.list.shadowRoot.querySelector("dimui-button");
      if (emptyBtn) {
        clickHost(emptyBtn);
        await sleep(50);
        layout = el.shadowRoot.querySelector("dimui-notes-layout");
        parts = layoutParts(layout);
        btns = parts.confirm.shadowRoot.querySelectorAll("dimui-button");
        clickHost(btns[1]);
        await sleep(100);
      }
    }

    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    var chip = parts.mobile.shadowRoot.querySelector("dimui-chip");
    if (chip) clickHost(chip);

    // Select a note then go back
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    items = parts.rail.shadowRoot.querySelectorAll("dimui-folder-item");
    items[0].shadowRoot.querySelector("button").click();
    await sleep(80);
    layout = el.shadowRoot.querySelector("dimui-notes-layout");
    parts = layoutParts(layout);
    nav = navParts(parts.nav);
    var item = nav.list.shadowRoot.querySelector("dimui-note-item");
    if (item) {
      item.shadowRoot.querySelector("button").click();
      await sleep(100);
      layout = el.shadowRoot.querySelector("dimui-notes-layout");
      parts = layoutParts(layout);
      nav = navParts(parts.nav);
      var back = nav.editor.shadowRoot.querySelector("dimui-icon-button");
      if (back) clickHost(back);
    }
  });
})();
