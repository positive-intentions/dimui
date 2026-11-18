/**
 * Runs after the inline index.html / preview.html script has sync-loaded
 * window.Dim from https://positive-intentions.github.io/dim/lib/dim*.global.js.
 *
 * Exposes globalThis.BP — AMD-style module registry used by classic-script
 * dimui sources (no import maps, no @positive-intentions/dim npm specifier).
 *
 * Modules register as BP.module("dimui/…", deps, factory). Missing dimui/*
 * ids are loaded by injecting <script src="./src/….js"> then resolving.
 */
(function () {
  var SRC_ROOT = "./src/";

  if (!globalThis.Dim) {
    throw new Error(
      "Dim global missing. The inline script in index.html / preview.html " +
        "should have loaded https://positive-intentions.github.io/dim/lib/" +
        "dim.global.js (or dim.wasm.global.js).",
    );
  }

  globalThis.__DIMUI__ = {
    impl: document.documentElement.dataset.dimRuntime || "js",
    srcRoot: SRC_ROOT,
  };

  var registry = Object.create(null);
  var cache = Object.create(null);
  var loading = Object.create(null);

  function scriptUrlFor(name) {
    // "dimui/theme" → ./src/theme.js
    // "dimui/components/atoms/button" → ./src/components/atoms/button.js
    var path = name.slice("dimui/".length);
    if (!path) {
      return null;
    }
    return SRC_ROOT + path + ".js";
  }

  function loadScript(url) {
    if (loading[url]) return loading[url];
    loading[url] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = url;
      s.async = false;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        delete loading[url];
        reject(new Error("Failed to load script " + url));
      };
      (document.head || document.documentElement).appendChild(s);
    });
    return loading[url];
  }

  function ensureRegistered(name) {
    if (registry[name]) return Promise.resolve();
    if (name.indexOf("dimui/") !== 0) {
      return Promise.reject(
        new Error('BP module "' + name + '" is not registered'),
      );
    }
    var url = scriptUrlFor(name);
    if (!url) {
      return Promise.reject(new Error('Invalid dimui module id "' + name + '"'));
    }
    return loadScript(url).then(function () {
      if (!registry[name]) {
        throw new Error(
          'Script loaded for "' + name + '" but BP.module was not called',
        );
      }
    });
  }

  function resolve(name) {
    if (cache[name]) return cache[name];

    cache[name] = ensureRegistered(name)
      .then(function () {
        var entry = registry[name];
        return Promise.all(
          entry.deps.map(function (dep) {
            return resolve(dep);
          }),
        ).then(function (args) {
          return entry.factory.apply(null, args);
        });
      })
      .catch(function (err) {
        delete cache[name];
        throw err;
      });

    return cache[name];
  }

  globalThis.BP = {
    /**
     * Register a classic-script module.
     * @param {string} name
     * @param {string[]} deps
     * @param {(...exports: any) => any} factory
     */
    module: function (name, deps, factory) {
      if (typeof deps === "function") {
        factory = deps;
        deps = [];
      }
      registry[name] = { deps: deps || [], factory: factory };
      delete cache[name];
    },

    /** @param {string} name @returns {Promise<any>} */
    require: function (name) {
      return resolve(name);
    },

    /** @param {string} name @returns {boolean} */
    has: function (name) {
      return Boolean(registry[name]);
    },
  };
})();
