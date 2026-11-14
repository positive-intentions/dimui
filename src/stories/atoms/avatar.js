import { html } from "@positive-intentions/dim";
import { Avatar } from "../../components/atoms/avatar.js";
import { StoryPad } from "../pad.js";

void Avatar;
void StoryPad;

export default {
  title: "Atoms/Avatar",
};

export const Default = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`<dimui-avatar .props="${{ label: "AM", size: "md" }}"></dimui-avatar>`,
      }}"
    ></dimui-story-pad>`,
};

export const Online = {
  render: () =>
    html`<dimui-story-pad
      .props="${{
        layout: "row",
        content: html`<dimui-avatar .props="${{ label: "🤖", size: "lg", online: true }}"></dimui-avatar>`,
      }}"
    ></dimui-story-pad>`,
};
