/**
 * QR decode helpers: prefer BarcodeDetector, fall back to vendored jsQR.
 * Camera/file UI lives in dimui-qr-scanner — this module is pure decode + scan loop.
 */
BP.module("dimui/lib/qr-decode", [], function () {
  function vendorBase() {
    if (globalThis.__DIMIM__ && globalThis.__DIMIM__.dimuiSrc) {
      return globalThis.__DIMIM__.dimuiSrc;
    }
    if (globalThis.__DIMUI__ && globalThis.__DIMUI__.srcRoot) {
      return globalThis.__DIMUI__.srcRoot;
    }
    return "./src/";
  }

  var jsQRPromise = null;

  function ensureJsQR() {
    if (typeof globalThis.jsQR === "function") {
      return Promise.resolve(globalThis.jsQR);
    }
    if (jsQRPromise) return jsQRPromise;
    jsQRPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = vendorBase() + "vendor/jsQR.js";
      s.async = true;
      s.onload = function () {
        if (typeof globalThis.jsQR === "function") {
          resolve(globalThis.jsQR);
        } else {
          reject(new Error("jsQR missing after load"));
        }
      };
      s.onerror = function () {
        jsQRPromise = null;
        reject(new Error("jsQR load failed"));
      };
      (document.head || document.documentElement).appendChild(s);
    });
    return jsQRPromise;
  }

  function decodeWithJsQR(imageData) {
    var decode = globalThis.jsQR;
    if (typeof decode !== "function" || !imageData) return null;
    try {
      var code = decode(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      return code && code.data ? String(code.data) : null;
    } catch (e) {
      return null;
    }
  }

  function readCanvasImageData(canvas) {
    if (!canvas || typeof canvas.getContext !== "function") return null;
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    try {
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
      return null;
    }
  }

  function decodeCanvasSync(canvas) {
    var imageData = readCanvasImageData(canvas);
    if (!imageData) return null;
    return decodeWithJsQR(imageData);
  }

  async function decodeWithBarcodeDetector(source) {
    if (typeof globalThis.BarcodeDetector !== "function") return null;
    var detector;
    try {
      detector = new globalThis.BarcodeDetector({ formats: ["qr_code"] });
    } catch (e) {
      return null;
    }
    try {
      var codes = await detector.detect(source);
      if (codes && codes[0] && codes[0].rawValue) {
        return String(codes[0].rawValue);
      }
    } catch (e) {}
    return null;
  }

  async function decodeCanvas(canvas) {
    if (!canvas) return null;
    var fromDetector = await decodeWithBarcodeDetector(canvas);
    if (fromDetector) return fromDetector;
    if (typeof globalThis.jsQR !== "function") {
      try {
        await ensureJsQR();
      } catch (e) {
        return null;
      }
    }
    return decodeCanvasSync(canvas);
  }

  function loadImageFromFile(file) {
    return new Promise(function (resolve, reject) {
      if (!file) {
        reject(new Error("empty file"));
        return;
      }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("image load failed"));
      };
      img.src = url;
    });
  }

  async function decodeImageFile(file) {
    var img;
    try {
      img = await loadImageFromFile(file);
    } catch (e) {
      return null;
    }
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    if (!canvas.width || !canvas.height) return null;
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return decodeCanvas(canvas);
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function withTimeout(promise, ms, name) {
    var timer;
    var timeout = new Promise(function (_, reject) {
      timer = setTimeout(function () {
        var err = new Error(name || "TimeoutError");
        err.name = "TimeoutError";
        reject(err);
      }, ms);
    });
    return Promise.race([promise, timeout]).finally(function () {
      clearTimeout(timer);
    });
  }

  /**
   * Live camera scan loop.
   * @returns {{ stop: function(): void }}
   */
  function startCameraScan(opts) {
    opts = opts || {};
    var onValue = typeof opts.onValue === "function" ? opts.onValue : function () {};
    var onError = typeof opts.onError === "function" ? opts.onError : function () {};
    var onReady = typeof opts.onReady === "function" ? opts.onReady : function () {};
    var videoEl = opts.videoEl;
    var win = opts.window || globalThis;
    var nav = opts.navigator || globalThis.navigator;
    var stopped = false;
    var stream = null;
    var rafId = 0;

    function stop() {
      stopped = true;
      if (rafId) {
        try {
          (win.cancelAnimationFrame || globalThis.cancelAnimationFrame)(rafId);
        } catch (e) {}
        rafId = 0;
      }
      if (stream) {
        try {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        } catch (e) {}
        stream = null;
      }
      if (videoEl) {
        try {
          videoEl.srcObject = null;
        } catch (e) {}
      }
    }

    (async function run() {
      if (!videoEl) {
        onError("missing-video");
        return;
      }
      var gum = nav.mediaDevices && nav.mediaDevices.getUserMedia;
      if (typeof gum !== "function") {
        onError("insecure");
        return;
      }

      try {
        try {
          stream = await withTimeout(
            nav.mediaDevices.getUserMedia({
              video: { facingMode: "environment" },
              audio: false,
            }),
            5000,
            "TimeoutError",
          );
        } catch (e1) {
          stream = await withTimeout(
            nav.mediaDevices.getUserMedia({ video: true, audio: false }),
            5000,
            "TimeoutError",
          );
        }
      } catch (e) {
        onError(
          String(e && e.name ? e.name : "camera"),
          String(e && e.message ? e.message : e),
        );
        return;
      }

      if (stopped) {
        stop();
        return;
      }

      try {
        videoEl.srcObject = stream;
      } catch (eSrc) {
        onError(
          "camera",
          String(eSrc && eSrc.message ? eSrc.message : eSrc),
        );
        stop();
        return;
      }
      videoEl.muted = true;
      videoEl.setAttribute("playsinline", "");
      onReady();
      try {
        await withTimeout(Promise.resolve(videoEl.play()), 2000, "TimeoutError");
      } catch (e) {}

      try {
        await ensureJsQR();
      } catch (e) {
        if (typeof globalThis.BarcodeDetector !== "function") {
          onError("no-decoder");
          stop();
          return;
        }
      }

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d", { willReadFrequently: true });
      var detector = null;
      if (typeof globalThis.BarcodeDetector === "function") {
        try {
          detector = new globalThis.BarcodeDetector({ formats: ["qr_code"] });
        } catch (e) {}
      }

      async function tick() {
        if (stopped) return;
        if (videoEl.readyState >= 2 && videoEl.videoWidth > 0 && ctx) {
          canvas.width = videoEl.videoWidth;
          canvas.height = videoEl.videoHeight;
          ctx.drawImage(videoEl, 0, 0);
          var value = null;
          if (detector) {
            try {
              var codes = await detector.detect(canvas);
              if (codes && codes[0] && codes[0].rawValue) {
                value = String(codes[0].rawValue);
              }
            } catch (e) {}
          }
          if (!value) value = decodeCanvasSync(canvas);
          if (value) {
            onValue(value);
            stop();
            return;
          }
        }
        var raf = win.requestAnimationFrame || globalThis.requestAnimationFrame;
        rafId = raf(function () {
          tick();
        });
      }

      tick();
    })();

    return { stop: stop };
  }

  var api = {
    decodeCanvas: decodeCanvas,
    decodeImageFile: decodeImageFile,
    startCameraScan: startCameraScan,
    ensureJsQR: ensureJsQR,
  };
  // Shared mutable surface so tests can stub without fighting module identity.
  globalThis.__DIMUI_QR_DECODE__ = api;
  return api;
});
