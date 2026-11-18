BP.module(
  "dimui/stories/molecules/qr-scanner",
  [
    "dimui/components/molecules/qr-scanner",
    "dimui/components/atoms/qr-code",
    "dimui/components/atoms/button",
    "dimui/lib/qrcode-encoder",
    "dimui/lib/qr-decode",
    "dimui/stories/pad",
  ],
  function (__dep0, __dep1, __dep2, __dep3, __dep4, __dep5) {
    const { html } = Dim;
    const { QrScanner } = __dep0;
    const { QrCode } = __dep1;
    const { Button } = __dep2;
    const { encode } = __dep3;
    const { decodeCanvas } = __dep4;
    const { StoryPad } = __dep5;
    void QrScanner;
    void QrCode;
    void Button;
    void StoryPad;

    const SAMPLE = "wu1:story-roundtrip";

    const __default = {
      title: "Molecules/QrScanner",
    };

    const Live = {
      render: () => {
        const Demo = Dim.define({
          tag: "dimui-story-qr-scanner-live",
          component: (props, { html: tpl, useState: state, useScope: scope }) => {
            scope({ QrScanner, Button, QrCode });
            const [open, setOpen] = state(false);
            const [detected, setDetected] = state("");
            return tpl`
              <div style="display:flex;flex-direction:column;gap:0.75rem;align-items:flex-start">
                <dimui-qr-code .props="${{ value: SAMPLE, size: 160 }}" />
                <dimui-button
                  .props="${{
                    label: open ? "Scanner open…" : "Open scanner",
                    onClick: () => setOpen(true),
                  }}"
                />
                <div style="font-family:monospace;font-size:0.85rem">
                  ${detected ? "Detected: " + detected : "No detection yet"}
                </div>
                <dimui-qr-scanner
                  .props="${{
                    open,
                    title: "Scan sample QR",
                    onClose: () => setOpen(false),
                    onDetect: (text) => {
                      setDetected(text);
                      setOpen(false);
                    },
                  }}"
                />
              </div>
            `;
          },
        });
        void Demo;
        return html`<dimui-story-pad
          .props="${{
            layout: "column",
            content: html`<dimui-story-qr-scanner-live />`,
          }}"
        />`;
      },
    };

    const RoundTrip = {
      render: () => {
        const Demo = Dim.define({
          tag: "dimui-story-qr-roundtrip",
          component: (props, { html: tpl, useState: state, useEffect: effect }) => {
            const [result, setResult] = state("decoding…");
            effect(() => {
              var matrix = encode(SAMPLE, { level: "M" });
              var n = matrix.moduleCount;
              var scale = 4;
              var canvas = document.createElement("canvas");
              canvas.width = n * scale;
              canvas.height = n * scale;
              var ctx = canvas.getContext("2d");
              ctx.fillStyle = "#fff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = "#000";
              for (var r = 0; r < n; r += 1) {
                for (var c = 0; c < n; c += 1) {
                  if (matrix.isDark(r, c)) {
                    ctx.fillRect(c * scale, r * scale, scale, scale);
                  }
                }
              }
              decodeCanvas(canvas).then(function (text) {
                setResult(text || "(null)");
              });
            }, []);
            return tpl`
              <div style="font-family:monospace;font-size:0.9rem">
                Encode → canvas → decode: <strong>${result}</strong>
              </div>
            `;
          },
        });
        void Demo;
        return html`<dimui-story-pad
          .props="${{
            layout: "column",
            content: html`<dimui-story-qr-roundtrip />`,
          }}"
        />`;
      },
    };

    return { Live, RoundTrip, default: __default };
  },
);
