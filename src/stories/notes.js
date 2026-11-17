import { html } from "@positive-intentions/dim";
import { NotesApp } from "../demos/notes/app.js";

export default {
  title: "Demos/Encrypted notes",
  render: () => html`<dimui-notes-app />`,
};

void NotesApp;
