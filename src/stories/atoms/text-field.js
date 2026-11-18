BP.module(
  "dimui/stories/atoms/text-field",
  ["dimui/components/atoms/text-field","dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html, define, useState, useScope } = Dim;
  const { TextField } = __dep0;
  const { StoryPad } = __dep1;
  void TextField;
  void StoryPad;

  const TextDemo = define({
    tag: "dimui-story-text-demo",
    component: (_, { html: tpl, useState: state, useScope: scope }) => {
      scope({ TextField, StoryPad });
      const [value, setValue] = state("Shopping list");
      return tpl`
        <dimui-story-pad
          .props="${{
            content: tpl`
              <dimui-text-field
                .props="${{
                  id: "story-text",
                  label: "Title",
                  value,
                  onInput: setValue,
                }}"
              />
            `,
          }}"
              />
      `;
    },
  });

  const PasswordDemo = define({
    tag: "dimui-story-password-demo",
    component: (_, { html: tpl, useState: state, useScope: scope }) => {
      scope({ TextField, StoryPad });
      const [value, setValue] = state("");
      return tpl`
        <dimui-story-pad
          .props="${{
            content: tpl`
              <dimui-text-field
                .props="${{
                  id: "story-password",
                  label: "Password",
                  type: "password",
                  autocomplete: "current-password",
                  value,
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
    title: "Atoms/TextField",
  };
  const Text = {
    render: () => html`<dimui-story-text-demo />`,
  };
  const Password = {
    render: () => html`<dimui-story-password-demo />`,
  };

  void TextDemo;
  void PasswordDemo;
  return { Text, Password, default: __default };
  },
);
