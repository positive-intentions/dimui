BP.module(
  "dimui/demos/notes/app",
  [
    "dimui/lib/notes/tokens",
    "dimui/components/molecules/unlock-screen",
    "dimui/components/notes/organisms/notes-shell",
    "dimui/theme",
  ],
  function (tokens, unlock, shell, theme) {
  const { define, useState, useEffect, useRef, useScope, useStyle } = Dim;
  const { notesTokens } = tokens;
  const { UnlockScreen } = unlock;
  const { NotesShell } = shell;
  const { getStoredTheme, subscribeExplorerTheme } = theme;
  const NotesApp = define({
    tag: "dimui-notes-app",
    component: (
      _,
      {
        html: tpl,
        useState: state,
        useEffect: effect,
        useRef: ref,
        useScope: scope,
        useStyle: style,
      },
    ) => {
      style(notesTokens);
      scope({ UnlockScreen, NotesShell });

      const [password, setPassword] = state(null);
      const [creating, setCreating] = state(false);
      const [error, setError] = state("");
      const [themeMode, setTheme] = state(getStoredTheme());
      const hostRef = ref();

      effect(() => subscribeExplorerTheme(setTheme), []);

      effect(() => {
        const host = hostRef.current;
        if (host?.setAttribute) host.setAttribute("data-theme", themeMode);
      }, [themeMode]);

      const unlockVault = (value, { create }) => {
        setError("");
        setCreating(Boolean(create));
        setPassword(value);
      };

      const lock = () => {
        setPassword(null);
        setCreating(false);
        setError("");
      };

      const unlockFailed = (message) => {
        setPassword(null);
        setCreating(false);
        setError(message || "Wrong password.");
      };

      if (!password) {
        return tpl`
          <dimui-unlock
            .props="${{
              title: "Notes",
              unlockHint:
                "Enter your password to decrypt notes stored in this browser.",
              createHint:
                "Choose a password to encrypt your notes. There is no recovery if you forget it.",
              vaultFlag: "dimui-vault",
              onUnlock: unlockVault,
              error,
              theme: themeMode,
            }}"
          />
        `;
      }

      return tpl`
        <dimui-notes-shell
          .props="${{
            password,
            create: creating,
            onLock: lock,
            onUnlockFailed: unlockFailed,
            theme: themeMode,
          }}"
        />
      `;
    },
  });
  return { NotesApp };
  },
);
