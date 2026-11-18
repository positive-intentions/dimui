BP.module("dimui/lib/notes/sharedKeys", [], function () {
  const sharedKeys = (id) => ({
    title: `note-title-${id}`,
    snippet: `note-snippet-${id}`,
    time: `note-time-${id}`,
  });
  return { sharedKeys };
});
