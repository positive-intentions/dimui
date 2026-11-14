import { html, define, useState, useScope } from "@positive-intentions/dim";
import { TextArea } from "../../components/atoms/text-area.js";
import { StoryPad } from "../pad.js";

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
            ></dimui-text-area>
          `,
        }}"
      ></dimui-story-pad>
    `;
  },
});

export default {
  title: "Atoms/TextArea",
};

export const Default = {
  render: () => html`<dimui-story-textarea-demo></dimui-story-textarea-demo>`,
};

void TextAreaDemo;
