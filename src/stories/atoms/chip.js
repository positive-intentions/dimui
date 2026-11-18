BP.module(
  "dimui/stories/atoms/chip",
  ["dimui/components/atoms/chip","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html, define, useState, useScope } = Dim;
  const { Chip } = __dep0;
  const { StoryPad } = __dep1;
  void Chip;
  void StoryPad;

  const ChipDemo = define({
    tag: "dimui-story-chip-demo",
    component: (_, { html: tpl, useState: state, useScope: scope }) => {
      scope({ Chip, StoryPad });
      const [selected, setSelected] = state("All");
      const items = ["All", "Groups", "Direct"];
      return tpl`
        <dimui-story-pad
          .props="${{
            layout: "row",
            content: tpl`${items.map(
              (label) => tpl`
                <dimui-chip
                  .props="${{
                    label,
                    selected: selected === label,
                    onClick: () => setSelected(label),
                  }}"
                />
              `,
            )}`,
          }}"
                />
      `;
    },
  });
  const __default = {
    title: "Atoms/Chip",
  };
  const Default = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "row",
          content: html`<dimui-chip .props="${{ label: "Electronics" }}" />`,
        }}"
      />`,
  };
  const Selected = {
    render: () => html`<dimui-story-chip-demo />`,
  };

  void ChipDemo;
  return { Default, Selected, default: __default };
  },
);
