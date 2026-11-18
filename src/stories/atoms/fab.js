BP.module(
  "dimui/stories/atoms/fab",
  ["dimui/components/atoms/fab","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { Fab } = __dep0;
  const { StoryPad } = __dep1;
  void Fab;
  void StoryPad;
  const __default = {
    title: "Atoms/Fab",
  };
  const Default = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`<dimui-fab .props="${{ name: "pencil", label: "New chat" }}" />`,
        }}"
      />`,
  };
  return { Default, default: __default };
  },
);
