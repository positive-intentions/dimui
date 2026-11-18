BP.module(
  "dimui/registry",
  ["dimui/stories/welcome","dimui/stories/atoms/button","dimui/stories/atoms/text-field","dimui/stories/atoms/text-area","dimui/stories/atoms/avatar","dimui/stories/atoms/chip","dimui/stories/atoms/fab","dimui/stories/atoms/empty-state","dimui/stories/atoms/qty-stepper","dimui/stories/molecules/unlock-screen","dimui/stories/molecules/note-item","dimui/stories/molecules/note-list","dimui/stories/molecules/note-editor","dimui/stories/molecules/view-header","dimui/stories/molecules/app-shell","dimui/stories/molecules/product-card","dimui/stories/organisms/notes-shell","dimui/stories/notes","dimui/stories/messaging","dimui/stories/shopping","dimui/stories/benchmark"],
  function (__dep0, __dep1, __dep2, __dep3, __dep4, __dep5, __dep6, __dep7, __dep8, __dep9, __dep10, __dep11, __dep12, __dep13, __dep14, __dep15, __dep16, __dep17, __dep18, __dep19, __dep20) {
  const welcomeStory = __dep0;
  const buttonStories = __dep1;
  const textFieldStories = __dep2;
  const textAreaStories = __dep3;
  const avatarStories = __dep4;
  const chipStories = __dep5;
  const fabStories = __dep6;
  const emptyStateStories = __dep7;
  const qtyStepperStories = __dep8;
  const unlockStories = __dep9;
  const noteItemStories = __dep10;
  const noteListStories = __dep11;
  const noteEditorStories = __dep12;
  const viewHeaderStories = __dep13;
  const appShellStories = __dep14;
  const productCardStories = __dep15;
  const notesShellStories = __dep16;
  const notesStory = __dep17;
  const messagingStory = __dep18;
  const shoppingStory = __dep19;
  const benchmarkStory = __dep20;
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
    benchmarkStory,
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
  function normalizeStory(mod) {
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
  function expandModule(mod) {
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
  const stories = modules.flatMap(expandModule);
  const storiesById = Object.fromEntries(
    stories.map((story) => [story.id, story]),
  );
  function getStory(id) {
    return storiesById[id] || stories[0] || null;
  }
  function getDefaultStoryId() {
    return stories[0]?.id || "";
  }

  /** Build nested tree nodes from "Group/Sub/Name" titles. */
  function buildStoryTree(list = stories) {
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
  return { normalizeStory, expandModule, stories, storiesById, getStory, getDefaultStoryId, buildStoryTree };
  },
);
