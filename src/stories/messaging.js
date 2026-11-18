BP.module(
  "dimui/stories/messaging",
  ["dimui/demos/messaging/app"],
  function (__side0) {
  void __side0;
  const { html } = Dim;

  const __default = {
    title: "Demos/Messaging app",
    render: () => html`<dimui-messaging-app />`,
  };
  return { default: __default };
  },
);
