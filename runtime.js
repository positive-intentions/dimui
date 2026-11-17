/**
 * Classic (non-module) script: must run after the Dim CDN IIFE and before any
 * module script so the import map is in place when `@positive-intentions/dim`
 * resolves. Maps the bare specifier to a data: shim over globalThis.Dim
 * (same pattern as dim-boilerplate).
 */
(function () {
  if (!globalThis.Dim) {
    throw new Error(
      "Dim global missing. The inline script in index.html / preview.html " +
        "should have loaded https://positive-intentions.github.io/dim/lib/" +
        "dim.global.js (or dim.wasm.global.js).",
    );
  }

  var keys = Object.keys(globalThis.Dim).join(",");
  var shim = "const D=globalThis.Dim;export const{" + keys + "}=D;";
  var map = document.createElement("script");
  map.type = "importmap";
  map.textContent = JSON.stringify({
    imports: {
      "@positive-intentions/dim":
        "data:text/javascript," + encodeURIComponent(shim),
    },
  });
  document.currentScript.after(map);
})();
