/**
 * Manager entry — classic script. Dim + BP must already be loaded.
 * Registers run when dependent scripts have executed BP.module; this
 * require() executes factories (define custom elements).
 */
BP.require("dimui/explorer/manager").catch(function (err) {
  console.error(err);
});
