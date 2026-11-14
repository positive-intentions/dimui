import {
  define,
  html,
  useState,
  useEffect,
  useRef,
  useScope,
  useStyle,
} from "@positive-intentions/dim";
import { appStyles } from "./styles.js";
import { UnlockScreen } from "./unlock-screen.js";
import { NotesShell } from "./notes-shell.js";
import {
  getStoredTheme,
  subscribeExplorerTheme,
} from "../../theme.js";

export const NotesApp = define({
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
        ></dimui-unlock>
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
      ></dimui-notes-shell>
    `;
  },
});
