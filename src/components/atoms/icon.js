BP.module(
  "dimui/components/atoms/icon",
  ["dimui/theme"],
  function (__dep0) {
  const { define, html, css, useStyle } = Dim;
  const { themeTokens } = __dep0;
  const PATHS = {
    menu: "M3 6h18M3 12h18M3 18h18",
    search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-5.2-5.2",
    close: "M6 6l12 12M18 6 6 18",
    sun: "M12 4V2m0 20v-2m8-8h2M2 12h2m13.66 5.66 1.42 1.42M4.92 4.92l1.42 1.42m0 11.32-1.42 1.42m14.16-14.16-1.42 1.42M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
    moon: "M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z",
    phone: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 17h.01",
    tablet: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 16h.01",
    desktop: "M3 5h18v12H3V5Zm5 16h8M12 17v4",
    reload: "M4 12a8 8 0 0 1 13.66-5.66M20 4v5h-5M20 12a8 8 0 0 1-13.66 5.66M4 20v-5h5",
    expand: "M9 5l7 7-7 7",
    collapse: "M15 5l-7 7 7 7",
    chevronDown: "M6 9l6 6 6-6",
    chevronRight: "M9 6l6 6-6 6",
    grid: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
    outline: "M4 4h16v16H4V4Zm4 4h8v8H8V8Z",
    copy: "M8 8h10v12H8V8Zm-3 3H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1",
    external: "M14 4h6v6M10 14 20 4M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
    zoomIn: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-5.2-5.2M11 8v6M8 11h6",
    zoomOut: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-5.2-5.2M8 11h6",
    panel: "M4 4h16v16H4V4Zm0 10h16",
    sidebar: "M4 4h16v16H4V4Zm6 0v16",
    fullscreen: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
    book: "M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0-2 2V5Zm4 2h8M8 11h8M8 15h5",
    back: "M15 18l-6-6 6-6",
    arrowLeft: "M19 12H5m0 0 6 6M5 12l6-6",
    pencil: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z",
    call: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z",
    video: "M23 7l-7 5 7 5V7ZM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z",
    cart: "M6 6h15l-1.5 9h-12L4 2H1m5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    check: "M20 6 9 17l-5-5",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    package: "M16.5 9.4 7.5 4.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
    more: "M12 12h.01M12 6h.01M12 18h.01",
    send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z",
    pin: "M12 17v5M9 3h6l-1 7h3l-5 6-5-6h3L9 3Z",
    trash: "M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10Z",
    folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z",
    restore: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5",
  };

  const styles = css`
    ${themeTokens}
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      color: inherit;
      flex-shrink: 0;
    }
    svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.75;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;
  const Icon = define({
    tag: "dimui-icon",
    component: (props, { html: tpl, useStyle: style }) => {
      style(styles);
      const name = props.name || "menu";
      const d = PATHS[name] || PATHS.menu;
      const label = props.label || "";
      const hidden = label ? "false" : "true";
      const role = label ? "img" : "presentation";
      return tpl`
        <svg
          viewBox="0 0 24 24"
          aria-hidden="${hidden}"
          role="${role}"
          aria-label="${label}"
        >
          <path d="${d}" />
        </svg>
      `;
    },
  });
  return { Icon };
  },
);
