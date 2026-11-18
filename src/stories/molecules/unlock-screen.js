BP.module(
  "dimui/stories/molecules/unlock-screen",
  ["dimui/demos/notes/unlock-screen"],
  function (__dep0) {
  const { html } = Dim;
  const { UnlockScreen } = __dep0;
  void UnlockScreen;
  const __default = {
    title: "Molecules/Unlock screen",
  };
  const CreateVault = {
    name: "Create vault",
    render: () =>
      html`<dimui-unlock
        .props="${{
          hasVault: false,
          onUnlock: () => {},
        }}"
      />`,
  };
  const Unlock = {
    render: () =>
      html`<dimui-unlock
        .props="${{
          hasVault: true,
          onUnlock: () => {},
        }}"
      />`,
  };
  const Error = {
    render: () =>
      html`<dimui-unlock
        .props="${{
          hasVault: true,
          error: "Wrong password.",
          onUnlock: () => {},
        }}"
      />`,
  };
  return { CreateVault, Unlock, Error, default: __default };
  },
);
