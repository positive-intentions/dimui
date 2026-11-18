(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;

  test("sharedKeys builds transition keys", async function () {
    var mod = await BP.require("dimui/lib/notes/sharedKeys");
    var keys = mod.sharedKeys("abc");
    expect(keys.title).toBe("note-title-abc");
    expect(keys.snippet).toBe("note-snippet-abc");
    expect(keys.time).toBe("note-time-abc");
  });
})();
