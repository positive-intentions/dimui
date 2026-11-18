(function () {
  var test = DimTest.test;
  var expect = DimTest.expect;

  test("vault exports flag and sentinel", async function () {
    var vault = await BP.require("dimui/lib/notes/vault");
    expect(vault.VAULT_FLAG).toBe("dimui-vault");
    expect(vault.VAULT_SENTINEL).toBe("dimui");
  });
})();
