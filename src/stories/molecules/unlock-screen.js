import { html } from "@positive-intentions/dim";
import { UnlockScreen } from "../../demos/notes/unlock-screen.js";

void UnlockScreen;

export default {
  title: "Molecules/Unlock screen",
};

export const CreateVault = {
  name: "Create vault",
  render: () =>
    html`<dimui-unlock
      .props="${{
        hasVault: false,
        onUnlock: () => {},
      }}"
    />`,
};

export const Unlock = {
  render: () =>
    html`<dimui-unlock
      .props="${{
        hasVault: true,
        onUnlock: () => {},
      }}"
    />`,
};

export const Error = {
  render: () =>
    html`<dimui-unlock
      .props="${{
        hasVault: true,
        error: "Wrong password.",
        onUnlock: () => {},
      }}"
    />`,
};
