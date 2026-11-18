BP.module(
  "dimui/demos/notes/app",
  ["dimui/demos/notes/styles","dimui/demos/notes/unlock-screen","dimui/demos/notes/notes-shell","dimui/theme"],
  function (__dep0, __dep1, __dep2, __dep3) {
  const { define, html, useState, useEffect, useRef, useScope, useStyle } = Dim;
  const { appStyles } = __dep0;
  const { UnlockScreen } = __dep1;
  const { NotesShell } = __dep2;
  const { getStoredTheme, subscribeExplorerTheme } = __dep3;
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
      style(appStyles);
      scope({ UnlockScreen, NotesShell });

      const [password, setPassword] = state(null);
      const [creating, setCreating] = state(false);
      const [error, setError] = state("");
      const [theme, setTheme] = state(getStoredTheme());
      const hostRef = ref();

      effect(() => subscribeExplorerTheme(setTheme), []);

      effect(() => {
        const host = hostRef.current;
        if (host?.setAttribute) host.setAttribute("data-theme", theme);
      }, [theme]);

      const unlock = (value, { create }) => {
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
            .props="${{ onUnlock: unlock, error, theme }}"
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
            theme,
          }}"
        />
      `;
    },
  });
  return { NotesApp };
  },
);
