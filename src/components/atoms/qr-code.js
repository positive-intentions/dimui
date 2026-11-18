BP.module(
  "dimui/components/atoms/qr-code",
  [
    "dimui/theme",
    "dimui/lib/qrcode-encoder",
    "dimui/components/atoms/icon-button",
  ],
  function (__dep0, __dep1, __dep2) {
    const { define, css, unsafeHTML } = Dim;
    const { themeTokens } = __dep0;
    const { encode } = __dep1;
    const { IconButton } = __dep2;

    const styles = css`
      ${themeTokens}
      :host {
        display: inline-block;
        line-height: 0;
      }
      .wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--dimui-color-surface, #fff);
        border-radius: var(--dimui-radius-md, 8px);
        padding: 0.5rem;
        box-sizing: border-box;
      }
      .wrap.empty {
        color: var(--dimui-color-text-muted, #94a3b8);
        font-size: 0.85rem;
        line-height: 1.3;
        padding: 1rem;
        text-align: center;
      }
      button.trigger {
        appearance: none;
        border: none;
        background: transparent;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: inline-flex;
        line-height: 0;
        border-radius: var(--dimui-radius-md, 8px);
      }
      button.trigger:focus-visible {
        outline: 2px solid var(--dimui-color-focus, #029cfd);
        outline-offset: 2px;
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .mod {
        fill: var(--dimui-color-text, #0f172a);
      }
      .fs {
        position: fixed;
        inset: 0;
        z-index: 1300;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.85);
        padding: 1rem;
        box-sizing: border-box;
      }
      .fs-close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        z-index: 1;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.4);
        color: #fff;
      }
      .fs-card {
        appearance: none;
        border: none;
        cursor: pointer;
        aspect-ratio: 1;
        width: 100%;
        max-width: min(90vw, 90vh);
        max-height: min(90vw, 90vh);
        overflow: hidden;
        border-radius: var(--dimui-radius-lg, 12px);
        background: #fff;
        padding: 1.5rem;
        box-sizing: border-box;
        line-height: 0;
      }
      .fs-card svg {
        width: 100%;
        height: 100%;
      }
    `;

    function buildSvg(value, size, level) {
      const text = String(value == null ? "" : value);
      if (!text) return { empty: true };
      const levels = [];
      const preferred = level || "M";
      levels.push(preferred);
      ["L", "M", "Q", "H"].forEach(function (lv) {
        if (levels.indexOf(lv) < 0) levels.push(lv);
      });
      let matrix = null;
      let lastErr = null;
      for (let i = 0; i < levels.length; i += 1) {
        try {
          matrix = encode(text, { level: levels[i] });
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
        }
      }
      if (!matrix) {
        return {
          overflow: true,
          error: lastErr && lastErr.message ? lastErr.message : "overflow",
        };
      }
      const n = matrix.moduleCount;
      if (!n) return { empty: true };
      let d = "";
      for (let row = 0; row < n; row += 1) {
        for (let col = 0; col < n; col += 1) {
          if (matrix.isDark(row, col)) {
            d += "M" + col + "," + row + "h1v1h-1z";
          }
        }
      }
      const px = Math.max(64, Number(size) || 192);
      return {
        px,
        markup:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
          n +
          " " +
          n +
          '" width="' +
          px +
          '" height="' +
          px +
          '" role="img"><path class="mod" d="' +
          d +
          '"/></svg>',
      };
    }

    const QrCode = define({
      tag: "dimui-qr-code",
      component: (
        props,
        {
          html: tpl,
          useStyle: style,
          useState: state,
          useEffect: effect,
          useRef: ref,
          useScope: scope,
        },
      ) => {
        style(styles);
        scope({ IconButton });

        const value = props.value || "";
        const size = props.size || 192;
        const level = props.level || "M";
        const alt = props.alt || (value ? "QR code" : "Empty QR code");
        const built = buildSvg(value, size, level);
        const [fullscreen, setFullscreen] = state(false);
        const dialogRef = ref();

        effect(() => {
          if (!fullscreen) return undefined;
          var node = dialogRef.current;
          if (node && typeof node.focus === "function") {
            try {
              node.focus();
            } catch (e) {}
          }
          var onKey = function (ev) {
            if (ev.key === "Escape") {
              ev.preventDefault();
              setFullscreen(false);
            }
          };
          document.addEventListener("keydown", onKey);
          return function () {
            document.removeEventListener("keydown", onKey);
          };
        }, [fullscreen]);

        if (!built || built.empty || built.overflow) {
          const px = Math.max(64, Number(size) || 192);
          const msg = !value
            ? "No value"
            : built && built.overflow
              ? "Too long for one QR"
              : "No value";
          return tpl`
            <div
              class="wrap empty"
              style="width:${px}px;height:${px}px"
              role="img"
              aria-label="${alt}"
            >
              ${msg}
            </div>
          `;
        }

        const closeFs = (ev) => {
          if (ev && typeof ev.stopPropagation === "function") {
            ev.stopPropagation();
          }
          setFullscreen(false);
        };

        return tpl`
          <button
            type="button"
            class="trigger"
            title="Tap to enlarge"
            aria-label="Tap to enlarge QR code"
            @click=${() => setFullscreen(true)}
          >
            <div class="wrap" style="width:${built.px + 16}px" aria-label="${alt}">
              ${unsafeHTML(built.markup)}
            </div>
          </button>
          ${
            fullscreen
              ? tpl`
                  <div
                    class="fs"
                    role="dialog"
                    aria-modal="true"
                    aria-label="QR code fullscreen"
                    tabindex="0"
                    ref=${dialogRef}
                    @click=${() => setFullscreen(false)}
                  >
                    <div class="fs-close" @click=${closeFs}>
                      <dimui-icon-button
                        .props="${{
                          name: "close",
                          label: "Close",
                          title: "Close",
                          onClick: closeFs,
                        }}"
                      />
                    </div>
                    <button
                      type="button"
                      class="fs-card"
                      title="Tap to close"
                      aria-label="Tap to close QR code"
                      @click=${closeFs}
                    >
                      ${unsafeHTML(built.markup)}
                    </button>
                  </div>
                `
              : null
          }
        `;
      },
    });

    return { QrCode };
  },
);
