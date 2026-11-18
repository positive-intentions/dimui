/**
 * Demo unlock — proxies the shared molecule. Apps should use
 * dimui/components/molecules/unlock-screen directly.
 */
BP.module(
  "dimui/demos/notes/unlock-screen",
  ["dimui/components/molecules/unlock-screen"],
  function (mod) {
    return { UnlockScreen: mod.UnlockScreen };
  },
);
