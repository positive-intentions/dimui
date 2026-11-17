import { html } from "@positive-intentions/dim";
import { AppShell } from "../../components/molecules/app-shell.js";

void AppShell;

export default {
  title: "Molecules/App shell",
};

export const Default = {
  render: () =>
    html`<dimui-app-shell
      .props="${{
        title: "Demo shell",
        logo: "🛍️",
        activeTab: 0,
        tabs: [
          { id: 0, label: "Shop", icon: "🛍️" },
          { id: 1, label: "Cart", icon: "🛒" },
          { id: 2, label: "Orders", icon: "📦" },
        ],
        cartBadge: 3,
        onTabChange: () => {},
        content: html`<div style="padding:1.5rem;color:#94a3b8">Content area</div>`,
      }}"
    />`,
};
