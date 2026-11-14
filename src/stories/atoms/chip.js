import { html, define, useState, useScope } from "@positive-intentions/dim";
import { Chip } from "../../components/atoms/chip.js";
import { StoryPad } from "../pad.js";

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
              ></dimui-chip>
            `,
          )}`,
        }}"
      ></dimui-story-pad>
    `;
  },
});

export default {
  title: "Atoms/Chip",
};

export const Default = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`<dimui-chip .props="${{ label: "Electronics" }}"></dimui-chip>`,
      }}"
    ></dimui-story-pad>`,
};

export const Selected = {
  render: () => html`<dimui-story-chip-demo></dimui-story-chip-demo>`,
};

void ChipDemo;
