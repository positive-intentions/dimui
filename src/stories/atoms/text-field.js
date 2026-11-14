import { html, define, useState, useScope } from "@positive-intentions/dim";
import { TextField } from "../../components/atoms/text-field.js";
import { StoryPad } from "../pad.js";

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
            ></dimui-text-field>
          `,
        }}"
      ></dimui-story-pad>
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
            ></dimui-text-field>
          `,
        }}"
      ></dimui-story-pad>
    `;
  },
});

export default {
  title: "Atoms/TextField",
};

export const Text = {
  render: () => html`<dimui-story-text-demo></dimui-story-text-demo>`,
};

export const Password = {
  render: () => html`<dimui-story-password-demo></dimui-story-password-demo>`,
};

void TextDemo;
void PasswordDemo;
