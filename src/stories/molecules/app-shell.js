BP.module(
  "dimui/stories/molecules/app-shell",
  ["dimui/components/molecules/app-shell"],
  function (__dep0) {
  const { html } = Dim;
  const { AppShell } = __dep0;
  void AppShell;
  const __default = {
    title: "Molecules/App shell",
  };
  const Default = {
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
  return { Default, default: __default };
  },
);
