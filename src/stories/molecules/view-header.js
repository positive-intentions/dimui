BP.module(
  "dimui/stories/molecules/view-header",
  ["dimui/components/molecules/view-header","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { ViewHeader } = __dep0;
  const { StoryPad } = __dep1;
  void ViewHeader;
  void StoryPad;
  const __default = {
    title: "Molecules/View header",
  };
  const Default = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "stack full",
          content: html`<dimui-view-header
            .props="${{ title: "Product detail", onBack: () => {} }}"
          />`,
        }}"
      />`,
  };
  return { Default, default: __default };
  },
);
