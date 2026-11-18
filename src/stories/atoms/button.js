BP.module(
  "dimui/stories/atoms/button",
  ["dimui/components/atoms/button","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { Button } = __dep0;
  const { StoryPad } = __dep1;
  void Button;
  void StoryPad;
  const __default = {
    title: "Atoms/Button",
  };
  const Contained = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`<dimui-button
            .props="${{ label: "New", variant: "contained" }}"
          />`,
        }}"
      />`,
  };
  const Outlined = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`<dimui-button
            .props="${{ label: "Lock", variant: "outlined" }}"
          />`,
        }}"
      />`,
  };
  const Danger = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`<dimui-button
            .props="${{ label: "Delete", variant: "danger" }}"
          />`,
        }}"
      />`,
  };
  const Sizes = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`
            <dimui-button .props="${{ label: "Small", size: "sm" }}" />
            <dimui-button .props="${{ label: "Medium", size: "md" }}" />
            <dimui-button .props="${{ label: "Large", size: "lg" }}" />
          `,
        }}"
      />`,
  };
  return { Contained, Outlined, Danger, Sizes, default: __default };
  },
);
