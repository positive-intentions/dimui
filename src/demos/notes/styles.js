BP.module(
  "dimui/demos/notes/styles",
  ["dimui/lib/notes/tokens", "dimui/lib/notes/vault"],
  function (tokens, vault) {
    return {
      appStyles: tokens.notesTokens,
      VAULT_FLAG: vault.VAULT_FLAG,
      VAULT_SENTINEL: vault.VAULT_SENTINEL,
    };
  },
);
