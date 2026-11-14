import * as welcomeStory from "./stories/welcome.js";
import * as buttonStories from "./stories/atoms/button.js";
import * as textFieldStories from "./stories/atoms/text-field.js";
import * as textAreaStories from "./stories/atoms/text-area.js";
import * as avatarStories from "./stories/atoms/avatar.js";
import * as chipStories from "./stories/atoms/chip.js";
import * as fabStories from "./stories/atoms/fab.js";
import * as emptyStateStories from "./stories/atoms/empty-state.js";
import * as qtyStepperStories from "./stories/atoms/qty-stepper.js";
import * as unlockStories from "./stories/molecules/unlock-screen.js";
import * as noteItemStories from "./stories/molecules/note-item.js";
import * as noteListStories from "./stories/molecules/note-list.js";
import * as noteEditorStories from "./stories/molecules/note-editor.js";
import * as viewHeaderStories from "./stories/molecules/view-header.js";
import * as appShellStories from "./stories/molecules/app-shell.js";
import * as productCardStories from "./stories/molecules/product-card.js";
import * as notesShellStories from "./stories/organisms/notes-shell.js";
import * as notesStory from "./stories/notes.js";
import * as messagingStory from "./stories/messaging.js";
import * as shoppingStory from "./stories/shopping.js";

const modules = [
  welcomeStory,
  buttonStories,
  textFieldStories,
  textAreaStories,
  avatarStories,
  chipStories,
  fabStories,
  emptyStateStories,
  qtyStepperStories,
  unlockStories,
  noteItemStories,
  noteListStories,
  noteEditorStories,
  viewHeaderStories,
  appShellStories,
  productCardStories,
  notesShellStories,
  notesStory,
  messagingStory,
  shoppingStory,
];

function titleToId(title) {
  return String(title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleToName(title) {
  const parts = String(title).split("/");
  return parts[parts.length - 1] || title;
}

export function normalizeStory(mod) {
  const title = mod.title || "Untitled";
  const id = mod.id || titleToId(title);
  return {
    id,
    title,
    name: mod.name || titleToName(title),
    render: mod.render,
  };
}

/** Expand a CSF module (default meta + named story exports) into story entries. */
export function expandModule(mod) {
  if (!mod || typeof mod !== "object") return [];

  const named = Object.entries(mod).filter(
    ([key, value]) =>
      key !== "default" &&
      value &&
      typeof value === "object" &&
      typeof value.render === "function",
  );

  const meta = mod.default && typeof mod.default === "object" ? mod.default : {};
  const baseTitle = meta.title || "";

  if (named.length === 0) {
    if (typeof meta.render === "function" && baseTitle) {
      return [normalizeStory(meta)];
    }
    return [];
  }

  return named.map(([exportName, story]) => {
    const name = story.name || exportName;
    const title = story.title || (baseTitle ? `${baseTitle}/${name}` : name);
    return normalizeStory({
      ...meta,
      ...story,
      title,
      name,
      id: story.id,
    });
  });
}

export const stories = modules.flatMap(expandModule);

export const storiesById = Object.fromEntries(
  stories.map((story) => [story.id, story]),
);

export function getStory(id) {
  return storiesById[id] || stories[0] || null;
}

export function getDefaultStoryId() {
  return stories[0]?.id || "";
}

/** Build nested tree nodes from "Group/Sub/Name" titles. */
export function buildStoryTree(list = stories) {
  const root = { children: [] };

  for (const story of list) {
    const parts = story.title.split("/").map((p) => p.trim()).filter(Boolean);
    let cursor = root;
    let path = "";

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      path = path ? `${path}/${part}` : part;
      const isLeaf = i === parts.length - 1;

      if (isLeaf) {
        cursor.children.push({
          type: "story",
          id: story.id,
          name: part,
          story,
        });
      } else {
        let group = cursor.children.find(
          (c) => c.type === "group" && c.name === part,
        );
        if (!group) {
          group = {
            type: "group",
            id: `group-${titleToId(path)}`,
            name: part,
            children: [],
          };
          cursor.children.push(group);
        }
        cursor = group;
      }
    }
  }

  return root.children;
}
