import { html } from "@positive-intentions/dim";
import { NotesShell } from "../../demos/notes/notes-shell.js";
import { getStoredTheme } from "../../theme.js";

void NotesShell;

/** Story password for a throwaway vault — shares IndexedDB with the demo when reused. */
const STORY_PASSWORD = "dimui-story-shell";

export default {
  title: "Organisms/Notes shell",
};

export const Default = {
  render: () =>
    html`<dimui-notes-shell
      .props="${{
        password: STORY_PASSWORD,
        create: true,
        theme: getStoredTheme(),
        onLock: () => {},
        onUnlockFailed: () => {},
      }}"
    ></dimui-notes-shell>`,
};
