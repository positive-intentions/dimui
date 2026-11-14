import { html } from "@positive-intentions/dim";
import { Fab } from "../../components/atoms/fab.js";
import { StoryPad } from "../pad.js";

void Fab;
void StoryPad;

export default {
  title: "Atoms/Fab",
};

export const Default = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`<dimui-fab .props="${{ name: "pencil", label: "New chat" }}"></dimui-fab>`,
      }}"
    ></dimui-story-pad>`,
};
