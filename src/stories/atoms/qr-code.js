BP.module(
  "dimui/stories/atoms/qr-code",
  ["dimui/components/atoms/qr-code", "dimui/stories/pad"],
  function (__dep0, __dep1) {
    const { html } = Dim;
    const { QrCode } = __dep0;
    const { StoryPad } = __dep1;
    void QrCode;
    void StoryPad;

    const __default = {
      title: "Atoms/QrCode",
    };

    const Default = {
      render: () =>
        html`<dimui-story-pad
          .props="${{
            layout: "row",
            content: html`<div>
              <p style="margin:0 0 0.5rem;font-size:0.85rem;opacity:0.75">
                Tap the QR to enlarge
              </p>
              <dimui-qr-code
                .props="${{ value: 'wu1:hello-dimui', size: 192, level: 'M' }}"
              />
            </div>`,
          }}"
        />`,
    };

    const HighEcc = {
      render: () =>
        html`<dimui-story-pad
          .props="${{
            layout: "row",
            content: html`<dimui-qr-code
              .props="${{
                value: 'https://positive-intentions.com',
                size: 220,
                level: 'H',
                alt: 'Site QR',
              }}"
            />`,
          }}"
        />`,
    };

    const Empty = {
      render: () =>
        html`<dimui-story-pad
          .props="${{
            layout: "row",
            content: html`<dimui-qr-code .props="${{ value: '', size: 160 }}" />`,
          }}"
        />`,
    };

    return { Default, HighEcc, Empty, default: __default };
  },
);
