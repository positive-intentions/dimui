import { define, html, css, useStyle } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";

const styles = css`
  ${themeTokens}
  :host {
    display: inline-flex;
    position: relative;
    flex-shrink: 0;
  }
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: color-mix(in srgb, var(--dimui-color-primary) 18%, transparent);
    color: var(--dimui-color-primary);
    font-weight: 600;
    overflow: hidden;
    user-select: none;
  }
  .sm {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
  .md {
    width: 40px;
    height: 40px;
    font-size: 0.95rem;
  }
  .lg {
    width: 56px;
    height: 56px;
    font-size: 1.25rem;
  }
  .xl {
    width: 72px;
    height: 72px;
    font-size: 1.5rem;
  }
  .online {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid var(--dimui-color-surface);
  }
`;

export const Avatar = define({
  tag: "dimui-avatar",
  component: (props, { html: tpl, useStyle: style }) => {
    style(styles);
    const size = props.size || "md";
    const label = props.label || props.children || "?";
    const online = Boolean(props.online);
    const shared = props.shared || "";
    return tpl`
      <div
        class="avatar ${size}"
        data-vt-shared="${shared}"
        aria-hidden="true"
      >
        ${label}
      </div>
      ${online ? tpl`<span class="online"></span>` : null}
    `;
  },
});
