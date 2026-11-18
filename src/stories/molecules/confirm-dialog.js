BP.module(
  "dimui/stories/molecules/confirm-dialog",
  ["dimui/components/molecules/confirm-dialog", "dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { ConfirmDialog } = __dep0;
  const { StoryPad } = __dep1;
  void ConfirmDialog;
  void StoryPad;
  const __default = {
    title: "Molecules/Confirm dialog",
  };
  const Open = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "stack full",
          content: html`<dimui-confirm-dialog
            .props="${{
              open: true,
              title: "Delete note?",
              body: "This cannot be undone.",
              confirmLabel: "Delete",
              onConfirm: () => {},
              onCancel: () => {},
            }}"
          />`,
        }}"
      />`,
  };
  return { Open, default: __default };
  },
);
