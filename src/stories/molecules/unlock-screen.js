BP.module(
  "dimui/stories/molecules/unlock-screen",
  ["dimui/components/molecules/unlock-screen"],
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
          title: "Notes",
          hasVault: false,
          onUnlock: () => {},
        }}"
      />`,
  };
  const Unlock = {
    render: () =>
      html`<dimui-unlock
        .props="${{
          title: "Notes",
          hasVault: true,
          onUnlock: () => {},
        }}"
      />`,
  };
  const Error = {
    render: () =>
      html`<dimui-unlock
        .props="${{
          title: "Notes",
          hasVault: true,
          error: "Wrong password.",
          onUnlock: () => {},
        }}"
      />`,
  };
  return { CreateVault, Unlock, Error, default: __default };
  },
);
