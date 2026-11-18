BP.module(
  "dimui/stories/atoms/empty-state",
  ["dimui/components/atoms/empty-state","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { EmptyState } = __dep0;
  const { StoryPad } = __dep1;
  void EmptyState;
  void StoryPad;
  const __default = {
    title: "Atoms/EmptyState",
  };
  const Default = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          content: html`<dimui-empty-state
            .props="${{
              title: "Your cart is empty",
              hint: "Browse the shop and add something you like.",
            }}"
          />`,
        }}"
      />`,
  };
  return { Default, default: __default };
  },
);
