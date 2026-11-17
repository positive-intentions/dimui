// Classic (non-module) script: must run before any module script so the
// import map it writes is in place when `@positive-intentions/dim` resolves.
// `?impl=wasm` selects the Rust/WASM runtime (single file, inlined wasm);
// `?impl=wasm-split` selects the streaming variant (needs an HTTP server).
(function () {
  var base = "./node_modules/@positive-intentions/dim/dist/";
  var impl = new URLSearchParams(window.location.search).get("impl");
  // Static servers with clean URLs (e.g. `serve`) redirect preview.html to
  // /preview and drop the query, so the canvas iframe inherits the parent's.
  if (!impl && window.parent !== window) {
    try {
      impl = window.parent.document.documentElement.dataset.dimRuntime;
    } catch (_) {
      impl = null;
    }
  }
  var entry =
    impl === "wasm"
      ? "wasm/index.mjs"
      : impl === "wasm-split"
        ? "wasm/split/index.mjs"
        : "index.mjs";
  var map = document.createElement("script");
  map.type = "importmap";
  map.textContent = JSON.stringify({
    imports: { "@positive-intentions/dim": base + entry },
  });
  document.currentScript.after(map);
  document.documentElement.dataset.dimRuntime = entry === "index.mjs" ? "js" : impl;
})();
