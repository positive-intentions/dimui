BP.module(
  "dimui/stories/atoms/qty-stepper",
  ["dimui/components/atoms/qty-stepper","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html, define, useState, useScope } = Dim;
  const { QtyStepper } = __dep0;
  const { StoryPad } = __dep1;
  void QtyStepper;
  void StoryPad;

  const QtyDemo = define({
    tag: "dimui-story-qty-demo",
    component: (_, { html: tpl, useState: state, useScope: scope }) => {
      scope({ QtyStepper, StoryPad });
      const [value, setValue] = state(2);
      return tpl`
        <dimui-story-pad
          .props="${{
            layout: "row",
            content: tpl`<dimui-qty-stepper .props="${{ value, onChange: setValue }}" />`,
          }}"
        />
      `;
    },
  });
  const __default = {
    title: "Atoms/QtyStepper",
  };
  const Default = {
    render: () => html`<dimui-story-qty-demo />`,
  };

  void QtyDemo;
  return { Default, default: __default };
  },
);
