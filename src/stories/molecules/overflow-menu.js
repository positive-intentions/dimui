BP.module(
  "dimui/stories/molecules/overflow-menu",
  ["dimui/components/molecules/overflow-menu", "dimui/stories/pad"],
  function (__dep0, __dep1) {
  const { html } = Dim;
  const { OverflowMenu } = __dep0;
  const { StoryPad } = __dep1;
  void OverflowMenu;
  void StoryPad;
  const __default = {
    title: "Molecules/Overflow menu",
  };
  const Default = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "stack",
          content: html`<div style="display:flex;justify-content:flex-end;padding:1rem">
            <dimui-overflow-menu
              .props="${{
                items: [
                  { label: "Rename", onClick: () => {} },
                  { label: "Delete", danger: true, onClick: () => {} },
                ],
              }}"
            />
          </div>`,
        }}"
      />`,
  };
  return { Default, default: __default };
  },
);
