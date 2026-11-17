import { define, html, css, useStyle, useScope } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";
import { Overlay } from "../atoms/overlay.js";

const styles = css`
  ${themeTokens}
  :host {
    display: contents;
  }
  .sheet {
    position: fixed;
    z-index: var(--dimui-z-drawer);
    background: var(--dimui-color-surface);
    color: var(--dimui-color-text);
    box-shadow: var(--dimui-shadow);
    transition: transform var(--dimui-transition);
  }
  .sheet.bottom {
    left: 0;
    right: 0;
    bottom: 0;
    max-height: min(75vh, 560px);
    border-radius: var(--dimui-radius-lg) var(--dimui-radius-lg) 0 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
    transform: translateY(110%);
  }
  .sheet.left {
    top: 0;
    left: 0;
    bottom: 0;
    width: min(var(--dimui-sidebar-width), 90vw);
    transform: translateX(-110%);
  }
  .sheet.open.bottom {
    transform: translateY(0);
  }
  .sheet.open.left {
    transform: translateX(0);
  }
  .handle {
    width: 36px;
    height: 4px;
    margin: 0.6rem auto 0.4rem;
    border-radius: 999px;
    background: var(--dimui-color-border);
  }
  .body {
    overflow: auto;
    max-height: inherit;
    padding: var(--dimui-space-2) var(--dimui-space-3) var(--dimui-space-4);
  }
`;

export const Drawer = define({
  tag: "dimui-drawer",
  component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
    style(styles);
    scope({ Overlay });

    const open = Boolean(props.open);
    const placement = props.placement || "bottom";
    const labelledBy = props["aria-labelledby"] || "";
    const label = props["aria-label"] || "Panel";
    const onClose =
      typeof props.onClose === "function" ? props.onClose : () => {};
    const content = props.content || null;
    const sheetClass = open ? `sheet ${placement} open` : `sheet ${placement}`;
    const hidden = open ? "false" : "true";

    return tpl`
      <dimui-overlay
        .props="${{ open, onClick: onClose }}"
      />
      <div
        class="${sheetClass}"
        role="dialog"
        aria-modal="true"
        aria-hidden="${hidden}"
        aria-label="${label}"
        aria-labelledby="${labelledBy}"
      >
        ${placement === "bottom" ? tpl`<div class="handle" aria-hidden="true"></div>` : null}
        <div class="body">
          ${content}
        </div>
      </div>
    `;
  },
});
