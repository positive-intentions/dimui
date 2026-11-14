import {
  define,
  html,
  useState,
  useEffect,
  useStyle,
  css,
} from "@positive-intentions/dim";
import { getStory, getDefaultStoryId } from "../registry.js";
import { getStoryIdFromPath } from "../router.js";
import {
  applyDocumentTheme,
  getStoredTheme,
  THEME_MESSAGE,
} from "../theme.js";

const styles = css`
  :host {
    display: block;
    min-height: 100vh;
    width: 100%;
    background: var(--dimui-doc-bg, #0f172a);
    color: var(--dimui-doc-text, #e2e8f0);
  }
  .empty {
    display: grid;
    place-items: center;
    min-height: 100vh;
    margin: 0;
    font-family: "Segoe UI", system-ui, sans-serif;
    color: var(--dimui-doc-text-muted, #64748b);
  }
`;

const MSG_SELECT = "dimui:select";

export const PreviewRoot = define({
  tag: "dimui-preview",
  component: (
    _,
    {
      html: tpl,
      useState: state,
      useEffect: effect,
      useStyle: style,
    },
  ) => {
    style(styles);

    const initialId = getStoryIdFromPath() || getDefaultStoryId();
    const [storyId, setStoryId] = state(initialId);
    const [theme, setTheme] = state(getStoredTheme());

    effect(() => {
      applyDocumentTheme(theme);
      window.dispatchEvent(
        new CustomEvent("dimui-theme-change", { detail: { theme } }),
      );
    }, [theme]);

    effect(() => {
      const onMessage = (event) => {
        const data = event.data;
        if (!data) return;
        if (data.type === MSG_SELECT && typeof data.id === "string" && data.id) {
          setStoryId(data.id);
        }
        if (data.type === THEME_MESSAGE) {
          setTheme(data.theme === "light" ? "light" : "dark");
        }
      };
      window.addEventListener("message", onMessage);
      return () => window.removeEventListener("message", onMessage);
    }, []);

    effect(() => {
      const onPop = () => {
        setStoryId(getStoryIdFromPath() || getDefaultStoryId());
      };
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
    }, []);

    effect(() => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "dimui:preview-ready" }, "*");
      }
    }, []);

    const story = getStory(storyId);
    if (!story || typeof story.render !== "function") {
      return tpl`<p class="empty">No story selected.</p>`;
    }

    return story.render();
  },
});
