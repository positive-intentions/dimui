import { html, define, useState, useScope } from "@positive-intentions/dim";
import { QtyStepper } from "../../components/atoms/qty-stepper.js";
import { StoryPad } from "../pad.js";

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

export default {
  title: "Atoms/QtyStepper",
};

export const Default = {
  render: () => html`<dimui-story-qty-demo />`,
};

void QtyDemo;
