BP.module(
  "dimui/explorer/addon-panel",
  ["dimui/theme","dimui/components/molecules/tabs"],
  function (__dep0, __dep1) {
  const { define, html, css, useStyle, useScope } = Dim;
  const { themeTokens } = __dep0;
  const { Tabs } = __dep1;
  const styles = css`
    ${themeTokens}
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
      background: var(--dimui-color-surface);
      color: var(--dimui-color-text);
      border-top: 1px solid var(--dimui-color-border-subtle);
    }
    :host([position="right"]) {
      border-top: none;
      border-left: 1px solid var(--dimui-color-border-subtle);
    }
    .body {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: var(--dimui-space-4);
    }
    .placeholder {
      margin: 0;
      color: var(--dimui-color-text-muted);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .meta {
      display: grid;
      gap: var(--dimui-space-3);
    }
    .row {
      display: grid;
      gap: 0.2rem;
    }
    .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--dimui-color-text-faint);
    }
    .value {
      font-family: var(--dimui-font-mono);
      font-size: 0.85rem;
      word-break: break-all;
    }
  `;

  const TABS = [
    { id: "controls", label: "Controls" },
    { id: "actions", label: "Actions" },
    { id: "about", label: "About" },
  ];
  const AddonPanel = define({
    tag: "dimui-addon-panel",
    component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
      style(styles);
      scope({ Tabs });

      const tab = props.tab || "controls";
      const story = props.story || null;
      const onTab =
        typeof props.onTab === "function" ? props.onTab : () => {};

      let body;
      if (tab === "about" && story) {
        body = tpl`
          <div class="meta">
            <div class="row">
              <span class="label">Title</span>
              <span class="value">${story.title}</span>
            </div>
            <div class="row">
              <span class="label">Story id</span>
              <span class="value">${story.id}</span>
            </div>
            <div class="row">
              <span class="label">Name</span>
              <span class="value">${story.name}</span>
            </div>
          </div>
        `;
      } else if (tab === "actions") {
        body = tpl`
          <p class="placeholder">
            Actions will appear here when stories emit events. Wiring lands in a later pass.
          </p>
        `;
      } else {
        body = tpl`
          <p class="placeholder">
            Controls for story args will appear here. ArgTypes binding lands in a later pass.
          </p>
        `;
      }

      return tpl`
        <dimui-tabs
          .props="${{
            items: TABS,
            value: tab,
            onChange: onTab,
            "aria-label": "Addon panels",
          }}"
        />
        <div class="body" role="tabpanel">${body}</div>
      `;
    },
  });
  return { AddonPanel };
  },
);
