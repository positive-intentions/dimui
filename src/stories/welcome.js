BP.module(
  "dimui/stories/welcome",
  ["dimui/components/atoms/kbd","dimui/components/atoms/badge"],
  function (__dep0, __dep1) {
  const { define, html, css, useStyle, useScope } = Dim;
  const { Kbd } = __dep0;
  const { Badge } = __dep1;
  const styles = css`
    :host {
      display: block;
      min-height: 100%;
      font-family: "Segoe UI", system-ui, sans-serif;
      color: #0f172a;
      background: #f8fafc;
    }
    .page {
      max-width: 640px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 3rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.85rem;
      letter-spacing: -0.02em;
    }
    .lead {
      margin: 0 0 1.5rem;
      color: #475569;
      line-height: 1.55;
      font-size: 1.05rem;
    }
    .card {
      padding: 1.25rem 1.35rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #fff;
      margin-bottom: 1rem;
    }
    .card h2 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    .card p,
    .card li {
      margin: 0;
      color: #475569;
      line-height: 1.5;
      font-size: 0.95rem;
    }
    ul {
      margin: 0.5rem 0 0;
      padding-left: 1.1rem;
    }
    li + li {
      margin-top: 0.35rem;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      margin-top: 0.75rem;
    }
    .hint {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: #64748b;
      font-size: 0.85rem;
    }
  `;

  const WelcomePage = define({
    tag: "dimui-welcome",
    component: (_, { html: tpl, useStyle: style, useScope: scope }) => {
      style(styles);
      scope({ Kbd, Badge });

      return tpl`
        <div class="page">
          <dimui-badge .props="${{ label: "dimui" }}" />
          <h1>Welcome</h1>
          <p class="lead">
            dimui is a Material-inspired component library built with
            <strong>@positive-intentions/dim</strong>. This custom explorer
            mirrors Storybook’s layout without depending on Storybook itself.
          </p>

          <div class="card">
            <h2>What’s here</h2>
            <ul>
              <li>Atomic explorer chrome (atoms + molecules)</li>
              <li>Story registry ready for a fuller catalog</li>
              <li>Encrypted notes demo as a sample story</li>
            </ul>
          </div>

          <div class="card">
            <h2>Shortcuts</h2>
            <div class="row">
              <span class="hint"><dimui-kbd .props="${{ keys: "/" }}" /> Search</span>
              <span class="hint"><dimui-kbd .props="${{ keys: "S" }}" /> Sidebar</span>
              <span class="hint"><dimui-kbd .props="${{ keys: "D" }}" /> Addons</span>
              <span class="hint"><dimui-kbd .props="${{ keys: "T" }}" /> Theme</span>
              <span class="hint"><dimui-kbd .props="${{ keys: "F" }}" /> Fullscreen</span>
            </div>
          </div>
        </div>
      `;
    },
  });
  const __default = {
    title: "Introduction/Welcome",
    render: () => html`<dimui-welcome />`,
  };

  // Ensure the welcome element is registered when the story module loads.
  void WelcomePage;
  return { default: __default };
  },
);
