BP.module(
  "dimui/components/molecules/qr-scanner",
  [
    "dimui/theme",
    "dimui/lib/qr-decode",
    "dimui/components/atoms/button",
    "dimui/components/atoms/icon-button",
  ],
  function (__dep0, __dep1, __dep2, __dep3) {
    const { define, css } = Dim;
    const { themeTokens } = __dep0;
    const { Button } = __dep2;
    const { IconButton } = __dep3;

    function qrDecodeApi() {
      return (
        globalThis.__DIMUI_QR_DECODE__ ||
        __dep1 || {
          decodeImageFile: async function () {
            return null;
          },
          startCameraScan: function () {
            return { stop: function () {} };
          },
        }
      );
    }

    const styles = css`
      ${themeTokens}
      :host {
        display: contents;
      }
      .overlay {
        position: fixed;
        inset: 0;
        z-index: var(--dimui-z-overlay, 1200);
        background: rgba(2, 6, 23, 0.92);
        color: var(--dimui-color-text, #e2e8f0);
        display: none;
        flex-direction: column;
      }
      .overlay.open {
        display: flex;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        gap: 0.75rem;
      }
      .stage {
        flex: 1;
        margin: 0 1rem 1rem;
        border: 2px dashed var(--dimui-color-border, #64748b);
        border-radius: 16px;
        display: grid;
        place-items: center;
        position: relative;
        overflow: hidden;
        min-height: 220px;
        background: #020617;
      }
      .stage.drag {
        border-color: var(--dimui-color-primary, #38bdf8);
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        inset: 0;
      }
      .hint {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 1.5rem;
        color: var(--dimui-color-text-muted, #94a3b8);
        pointer-events: none;
      }
      .status {
        padding: 0 1rem 0.5rem;
        min-height: 1.25rem;
        font-size: 0.85rem;
        color: #fbbf24;
      }
      .actions {
        padding: 0 1rem 1rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
      }
      .file-input {
        display: none;
      }
    `;

    const QrScanner = define({
      tag: "dimui-qr-scanner",
      component: (
        props,
        {
          html: tpl,
          useStyle: style,
          useScope: scope,
          useState: state,
          useRef: ref,
          useEffect: effect,
        },
      ) => {
        style(styles);
        scope({ Button, IconButton });

        const open = Boolean(props.open);
        const title = props.title || "Scan QR code";
        const onClose =
          typeof props.onClose === "function" ? props.onClose : function () {};
        const onDetect =
          typeof props.onDetect === "function" ? props.onDetect : function () {};

        const [status, setStatus] = state("");
        const [dragOver, setDragOver] = state(false);
        const videoRef = ref();
        const fileRef = ref();
        const sessionRef = ref({ stop: null, handled: false });

        const finish = (text) => {
          if (sessionRef.current.handled) return;
          sessionRef.current.handled = true;
          if (sessionRef.current.stop) {
            try {
              sessionRef.current.stop();
            } catch (e) {}
            sessionRef.current.stop = null;
          }
          onDetect(String(text || ""));
          onClose();
        };

        const close = () => {
          if (sessionRef.current.stop) {
            try {
              sessionRef.current.stop();
            } catch (e) {}
            sessionRef.current.stop = null;
          }
          sessionRef.current.handled = false;
          setStatus("");
          onClose();
        };

        effect(() => {
          if (!open) {
            if (sessionRef.current.stop) {
              try {
                sessionRef.current.stop();
              } catch (e) {}
              sessionRef.current.stop = null;
            }
            sessionRef.current.handled = false;
            return undefined;
          }

          sessionRef.current.handled = false;
          setStatus("Starting camera…");
          var cancelled = false;
          // Dim runs useEffect during render; defer so the <video> ref is bound.
          var timer = setTimeout(function () {
            if (cancelled) return;
            var video = videoRef.current;
            if (!video) {
              setStatus("Camera preview unavailable — choose an image instead.");
              return;
            }

            var session = qrDecodeApi().startCameraScan({
              videoEl: video,
              onReady: function () {
                setStatus("Point at a QR code, or choose an image.");
              },
              onValue: function (text) {
                finish(text);
              },
              onError: function (code) {
                var msg = "Camera unavailable.";
                if (code === "insecure") {
                  msg = "Camera needs a secure context (HTTPS or localhost).";
                } else if (code === "no-decoder") {
                  msg = "No QR decoder available in this browser.";
                } else if (
                  code === "NotAllowedError" ||
                  code === "SecurityError"
                ) {
                  msg = "Camera permission denied — choose an image instead.";
                } else if (code === "missing-video") {
                  msg = "Camera preview missing — choose an image instead.";
                }
                setStatus(msg);
              },
            });
            sessionRef.current.stop = session.stop;
          }, 0);

          return function () {
            cancelled = true;
            clearTimeout(timer);
            if (sessionRef.current.stop) {
              try {
                sessionRef.current.stop();
              } catch (e) {}
              sessionRef.current.stop = null;
            }
          };
        }, [open]);

        const handleFile = async (file) => {
          if (!file) return;
          setStatus("Decoding image…");
          var text = null;
          try {
            text = await qrDecodeApi().decodeImageFile(file);
          } catch (e) {
            text = null;
          }
          if (text) {
            finish(text);
            return;
          }
          setStatus("No QR code found in that image.");
        };

        const onFileChange = (ev) => {
          var file = ev.target && ev.target.files && ev.target.files[0];
          handleFile(file);
          if (ev.target) ev.target.value = "";
        };

        const onDrop = (ev) => {
          ev.preventDefault();
          setDragOver(false);
          var file =
            ev.dataTransfer &&
            ev.dataTransfer.files &&
            ev.dataTransfer.files[0];
          handleFile(file);
        };

        return tpl`
          <div
            class="overlay ${open ? "open" : ""}"
            role="dialog"
            aria-modal="true"
            aria-label="${title}"
          >
            <div class="top">
              <strong>${title}</strong>
              <dimui-icon-button
                .props="${{
                  name: "close",
                  label: "Close scanner",
                  onClick: close,
                }}"
              />
            </div>
            <div
              class="stage ${dragOver ? "drag" : ""}"
              @dragover=${(ev) => {
                ev.preventDefault();
                setDragOver(true);
              }}
              @dragleave=${() => setDragOver(false)}
              @drop=${onDrop}
            >
              <video ref=${videoRef} muted playsinline></video>
              <div class="hint">Live preview · drop an image here</div>
            </div>
            <div class="status">${status}</div>
            <div class="actions">
              <input
                class="file-input"
                type="file"
                accept="image/*"
                ref=${fileRef}
                @change=${onFileChange}
              />
              <dimui-button
                .props="${{
                  label: "Choose image",
                  variant: "outlined",
                  onClick: () => {
                    var input = fileRef.current;
                    if (input) input.click();
                  },
                }}"
              />
              <dimui-button
                .props="${{
                  label: "Close",
                  onClick: close,
                }}"
              />
            </div>
          </div>
        `;
      },
    });

    return { QrScanner };
  },
);
