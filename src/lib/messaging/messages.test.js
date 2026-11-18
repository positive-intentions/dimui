(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;

  test("messages normalize create and helpers", async function () {
    var m = await BP.require("dimui/lib/messaging/messages");
    expect(m.normalizeMessage(null)).toBe(null);
    expect(m.normalizeMessages(null).length).toBe(0);

    var text = m.createTextMessage(" hello ", "out");
    expect(text.kind).toBe("text");
    expect(text.body).toBe("hello");
    expect(text.status).toBe("sent");
    expect(m.tickMarks("sent")).toBe("✓");
    expect(m.tickMarks("delivered")).toBe("✓✓");
    expect(m.tickMarks("read")).toBe("✓✓");
    expect(m.advanceStatus("sent")).toBe("delivered");
    expect(m.advanceStatus("read")).toBe("read");
    expect(m.advanceStatus("nope")).toBe("nope");

    var inbound = m.createTextMessage("hi", "in");
    expect(inbound.status).toBe("delivered");

    var file = m.createFileMessage(
      { name: "a.png", size: 12, mime: "image/png" },
      "out",
    );
    expect(file.kind).toBe("file");
    expect(file.attachment.phase).toBe("encrypting");
    var sending = m.updateAttachmentPhase(file, "sending", 40);
    expect(sending.attachment.progress).toBe(40);
    var done = m.updateAttachmentPhase(sending, "complete");
    expect(done.attachment.progress).toBe(100);
    expect(done.status).toBe("delivered");
    var cancelled = m.updateAttachmentPhase(file, "cancelled", 0);
    expect(cancelled.attachment.phase).toBe("cancelled");
    expect(m.updateAttachmentPhase(text, "sending")).toBeTruthy();

    var badIso = m.formatTime("nope");
    expect(badIso).toBe("");
    expect(m.formatTime(new Date().toISOString()).length).toBeGreaterThan(0);
    expect(m.dateChipLabel(new Date().toISOString())).toBe("Today");
    var y = new Date();
    y.setDate(y.getDate() - 1);
    expect(m.dateChipLabel(y.toISOString())).toBe("Yesterday");
    expect(m.dateChipLabel("bad")).toBe("");

    var older = new Date();
    older.setDate(older.getDate() - 5);
    var rows = m.withDateChips([
      {
        id: "1",
        direction: "out",
        kind: "text",
        body: "a",
        status: "sent",
        createdAt: older.toISOString(),
      },
      text,
    ]);
    expect(rows.some(function (r) {
      return r.type === "chip";
    })).toBe(true);
    expect(rows.some(function (r) {
      return r.type === "message";
    })).toBe(true);

    var weird = m.normalizeMessage({
      direction: "x",
      kind: "file",
      status: "z",
    });
    expect(weird.direction).toBe("out");
    expect(weird.attachment.name).toBe("file.bin");
    expect(typeof m.newId()).toBe("string");

    // Force newId fallback when crypto exists without randomUUID
    var realCrypto = globalThis.crypto;
    try {
      Object.defineProperty(globalThis, "crypto", {
        value: {},
        configurable: true,
      });
      expect(String(m.newId()).indexOf("msg-")).toBe(0);
    } finally {
      Object.defineProperty(globalThis, "crypto", {
        value: realCrypto,
        configurable: true,
      });
    }

    // Catch branches: Date construction throws
    var evil = {
      valueOf: function () {
        throw new Error("boom");
      },
      toString: function () {
        throw new Error("boom");
      },
    };
    expect(m.formatTime(evil)).toBe("");
    expect(m.dateChipLabel(evil)).toBe("");
  });
})();


