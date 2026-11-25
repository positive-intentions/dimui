/**
 * Pure note-editor reducer + view-model (verifiable subset).
 */
BP.module("dimui/lib/notes/note-editor-logic", ["dimui/lib/notes/types"], function (types) {
  const { contract, t } = Dim;
  const { Note } = types;

  const EditorState = t.record({
    confirm: t.nullable(t.enum(["trash", "delete"])),
  });

  const EditorAction = t.union([
    t.record({ type: t.lit("ask"), kind: t.enum(["trash", "delete"]) }),
    t.record({ type: t.lit("close") }),
    t.record({ type: t.lit("run") }),
  ]);

  const noteEditorReducer = contract(
    {
      name: "noteEditorReducer",
      kind: "reducer",
      args: [EditorState, EditorAction],
      returns: EditorState,
      ensures: (next) =>
        next.confirm === null ||
        next.confirm === "trash" ||
        next.confirm === "delete",
    },
    (state, action) => {
      if (action.type === "ask") {
        return { confirm: action.kind };
      }
      // "close", "run", and any future no-op actions clear confirm.
      return { confirm: null };
    },
  );

  const noteEditorViewModel = contract(
    {
      name: "noteEditorViewModel",
      kind: "viewModel",
      args: [
        t.record({
          note: t.nullable(Note),
          confirm: t.nullable(t.enum(["trash", "delete"])),
        }),
      ],
      returns: t.record({
        empty: t.bool(),
        confirmTitle: t.string({ max: 200 }),
        confirmBody: t.string({ max: 500 }),
        confirmAction: t.string({ max: 64 }),
      }),
      ensures: (vm) => vm.empty === true || vm.empty === false,
    },
    (input) => {
      if (input.note === null) {
        return {
          empty: true,
          confirmTitle: "",
          confirmBody: "",
          confirmAction: "",
        };
      }
      if (input.confirm === "delete") {
        return {
          empty: false,
          confirmTitle: "Delete forever?",
          confirmBody:
            "This note will be permanently removed from this vault.",
          confirmAction: "Delete Forever",
        };
      }
      return {
        empty: false,
        confirmTitle: "Move to Recently Deleted?",
        confirmBody: "You can restore it later from the trash.",
        confirmAction: "Move to Trash",
      };
    },
  );

  return { noteEditorReducer, noteEditorViewModel, EditorState, EditorAction };
});
