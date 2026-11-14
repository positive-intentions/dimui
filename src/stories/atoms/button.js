import { html } from "@positive-intentions/dim";
import { Button } from "../../components/atoms/button.js";
import { StoryPad } from "../pad.js";

void Button;
void StoryPad;

export default {
  title: "Atoms/Button",
};

export const Contained = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`<dimui-button
          .props="${{ label: "New", variant: "contained" }}"
        ></dimui-button>`,
      }}"
    ></dimui-story-pad>`,
};

export const Outlined = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`<dimui-button
          .props="${{ label: "Lock", variant: "outlined" }}"
        ></dimui-button>`,
      }}"
    ></dimui-story-pad>`,
};

export const Danger = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`<dimui-button
          .props="${{ label: "Delete", variant: "danger" }}"
        ></dimui-button>`,
      }}"
    ></dimui-story-pad>`,
};

export const Sizes = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`
          <dimui-button .props="${{ label: "Small", size: "sm" }}"></dimui-button>
          <dimui-button .props="${{ label: "Medium", size: "md" }}"></dimui-button>
          <dimui-button .props="${{ label: "Large", size: "lg" }}"></dimui-button>
        `,
      }}"
    ></dimui-story-pad>`,
};
