import { html } from "@positive-intentions/dim";
import { EmptyState } from "../../components/atoms/empty-state.js";
import { StoryPad } from "../pad.js";

void EmptyState;
void StoryPad;

export default {
  title: "Atoms/EmptyState",
};

export const Default = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        content: html`<dimui-empty-state
          .props="${{
            title: "Your cart is empty",
            hint: "Browse the shop and add something you like.",
          }}"
        />`,
      }}"
    />`,
};
