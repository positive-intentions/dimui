BP.module(
  "dimui/components/atoms/qr-code",
  ["dimui/theme", "dimui/lib/qrcode-encoder"],
  function (__dep0, __dep1) {
    const { define, css, unsafeHTML } = Dim;
    const { themeTokens } = __dep0;
    const { encode } = __dep1;

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
      svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .mod {
        fill: var(--dimui-color-text, #0f172a);
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
      component: (props, { html: tpl, useStyle: style }) => {
        style(styles);
        const value = props.value || "";
        const size = props.size || 192;
        const level = props.level || "M";
        const alt = props.alt || (value ? "QR code" : "Empty QR code");
        const built = buildSvg(value, size, level);

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

        return tpl`
          <div class="wrap" style="width:${built.px + 16}px" aria-label="${alt}">
            ${unsafeHTML(built.markup)}
          </div>
        `;
      },
    });

    return { QrCode };
  },
);
