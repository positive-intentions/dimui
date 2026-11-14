import { html } from "@positive-intentions/dim";
import { ViewHeader } from "../../components/molecules/view-header.js";
import { StoryPad } from "../pad.js";

void ViewHeader;
void StoryPad;

export default {
  title: "Molecules/View header",
};

export const Default = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "stack full",
        content: html`<dimui-view-header
          .props="${{ title: "Product detail", onBack: () => {} }}"
        ></dimui-view-header>`,
      }}"
    ></dimui-story-pad>`,
};
