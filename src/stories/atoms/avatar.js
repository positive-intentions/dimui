BP.module(
  "dimui/stories/atoms/avatar",
  ["dimui/components/atoms/avatar","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { Avatar } = __dep0;
  const { StoryPad } = __dep1;
  void Avatar;
  void StoryPad;
  const __default = {
    title: "Atoms/Avatar",
  };
  const Default = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`<dimui-avatar .props="${{ label: "AM", size: "md" }}" />`,
        }}"
      />`,
  };
  const Online = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`<dimui-avatar .props="${{ label: "🤖", size: "lg", online: true }}" />`,
        }}"
      />`,
  };
  return { Default, Online, default: __default };
  },
);
