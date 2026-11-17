import { define, html, css, useStyle, useScope } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";
import { Badge } from "../atoms/badge.js";

const styles = css`
  ${themeTokens}
  :host {
    display: block;
    height: 100%;
    min-height: 100vh;
  }
  .app {
    display: flex;
    height: 100%;
    min-height: 100vh;
    background: var(--dimui-color-bg);
    color: var(--dimui-color-text);
    overflow: hidden;
    position: relative;
  }
  .sidebar {
    width: 72px;
    background: var(--dimui-color-surface);
    border-right: 1px solid var(--dimui-color-border-subtle);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    flex-shrink: 0;
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--dimui-color-primary) 18%, transparent);
    display: grid;
    place-items: center;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
  }
  .tab {
    position: relative;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 12px;
    background: transparent;
    cursor: pointer;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--dimui-color-text);
  }
  .tab:hover {
    background: var(--dimui-color-surface-hover);
  }
  .tab.active {
    background: color-mix(in srgb, var(--dimui-color-primary) 16%, transparent);
  }
  .tab-badge {
    position: absolute;
    top: 4px;
    right: 4px;
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
  .main.hide-chrome .app-header,
  .main.hide-chrome .bottom-nav {
    display: none;
  }
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 52px;
    padding: 0 1rem;
    border-bottom: 1px solid var(--dimui-color-border-subtle);
    background: var(--dimui-color-surface);
    flex-shrink: 0;
  }
  .app-header h1 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 650;
  }
  .content {
    flex: 1;
    min-height: 0;
    position: relative;
    overflow: hidden;
  }
  .bottom-nav {
    display: none;
    border-top: 1px solid var(--dimui-color-border-subtle);
    background: var(--dimui-color-surface);
    padding-bottom: env(safe-area-inset-bottom, 0);
    flex-shrink: 0;
  }
  .bottom-nav .tabs {
    display: flex;
  }
  .bottom-nav button {
    flex: 1;
    min-height: 52px;
    border: none;
    background: transparent;
    color: var(--dimui-color-text-muted);
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;
    position: relative;
  }
  .bottom-nav button.active {
    color: var(--dimui-color-primary);
  }
  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }
    .bottom-nav {
      display: block;
    }
  }
`;

export const AppShell = define({
  tag: "dimui-app-shell",
  component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
    style(styles);
    scope({ Badge });

    const tabs = Array.isArray(props.tabs) ? props.tabs : [];
    const activeTab = props.activeTab ?? 0;
    const title = props.title || "";
    const hideChrome = Boolean(props.hideChrome);
    const logo = props.logo || "✦";
    const headerEnd = props.headerEnd || null;
    const content = props.content || null;
    const cartBadge = props.cartBadge;
    const onTabChange =
      typeof props.onTabChange === "function" ? props.onTabChange : () => {};

    const mainClass = hideChrome ? "main hide-chrome" : "main";

    return tpl`
      <div class="app">
        <nav class="sidebar" aria-label="Primary">
          <div class="logo">${logo}</div>
          ${tabs.map(
            (tab) => tpl`
              <button
                type="button"
                class="tab${tab.id === activeTab ? " active" : ""}"
                title="${tab.label}"
                aria-label="${tab.label}"
                @click="${() => onTabChange(tab.id)}"
              >
                ${tab.icon}
                ${tab.id === 1 && cartBadge
                  ? tpl`<span class="tab-badge"><dimui-badge .props="${{ label: String(cartBadge) }}" /></span>`
                  : null}
              </button>
            `,
          )}
        </nav>
        <div class="${mainClass}">
          <header class="app-header">
            <h1>${title}</h1>
            <div>${headerEnd}</div>
          </header>
          <div class="content">${content}</div>
          <nav class="bottom-nav" aria-label="Primary mobile">
            <div class="tabs">
              ${tabs.map(
                (tab) => tpl`
                  <button
                    type="button"
                    class="${tab.id === activeTab ? "active" : ""}"
                    @click="${() => onTabChange(tab.id)}"
                  >
                    <span>${tab.icon}</span>
                    <span>${tab.label}</span>
                  </button>
                `,
              )}
            </div>
          </nav>
        </div>
      </div>
    `;
  },
});
