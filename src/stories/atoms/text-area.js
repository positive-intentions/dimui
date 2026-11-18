BP.module(
  "dimui/stories/atoms/text-area",
  ["dimui/components/atoms/text-area","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html, define, useState, useScope } = Dim;
  const { TextArea } = __dep0;
  const { StoryPad } = __dep1;
  void TextArea;
  void StoryPad;

  const TextAreaDemo = define({
    tag: "dimui-story-textarea-demo",
    component: (_, { html: tpl, useState: state, useScope: scope }) => {
      scope({ TextArea, StoryPad });
      const [value, setValue] = state("Milk, eggs, bread");
      return tpl`
        <dimui-story-pad
          .props="${{
            layout: "stack full",
            content: tpl`
              <dimui-text-area
                .props="${{
                  id: "story-body",
                  label: "Body",
                  value,
                  rows: 8,
                  onInput: setValue,
                }}"
              />
            `,
          }}"
              />
      `;
    },
  });
  const __default = {
    title: "Atoms/TextArea",
  };
  const Default = {
    render: () => html`<dimui-story-textarea-demo />`,
  };

  void TextAreaDemo;
  return { Default, default: __default };
  },
);
