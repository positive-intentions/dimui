import { define, html, css, useStyle, useScope } from "@positive-intentions/dim";
import { themeTokens } from "../../theme.js";
import { IconButton } from "../atoms/icon-button.js";

const styles = css`
  ${themeTokens}
  :host {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    flex: 1;
    background: var(--dimui-color-bg);
  }
  .bar {
    display: flex;
    align-items: center;
    gap: var(--dimui-space-1);
    min-height: var(--dimui-toolbar-height);
    padding: 0 var(--dimui-space-2);
    border-bottom: 1px solid var(--dimui-color-border-subtle);
    background: var(--dimui-color-surface);
    flex-shrink: 0;
  }
  .title {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: 0 var(--dimui-space-2);
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--dimui-color-text);
  }
  .tools {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }
  .zoom-label {
    font-size: 0.75rem;
    color: var(--dimui-color-text-faint);
    min-width: 2.5rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
  .stage {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
    display: grid;
    place-items: start center;
    padding: var(--dimui-space-4);
    background:
      linear-gradient(90deg, var(--dimui-color-border-subtle) 1px, transparent 1px) 0 0 / 16px 16px,
      linear-gradient(var(--dimui-color-border-subtle) 1px, transparent 1px) 0 0 / 16px 16px,
      var(--dimui-color-bg);
  }
  .stage.no-grid {
    background: var(--dimui-color-bg);
  }
  .viewport {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 240px;
    background: var(--dimui-color-surface);
    border: 1px solid var(--dimui-color-border);
    border-radius: var(--dimui-radius);
    overflow: hidden;
    box-shadow: var(--dimui-shadow);
    transform-origin: top center;
  }
  .viewport.outline {
    outline: 2px dashed var(--dimui-color-primary);
    outline-offset: 4px;
  }
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    background: #fff;
  }
`;

export const PreviewFrame = define({
  tag: "dimui-preview-frame",
  component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
    style(styles);
    scope({ IconButton });

    const title = props.title || "Canvas";
    const src = props.src || "preview.html";
    const zoom = Number(props.zoom) || 100;
    const viewport = props.viewport || "reset";
    const showGrid = Boolean(props.showGrid);
    const showOutline = Boolean(props.showOutline);
    const iframeRef = props.iframeRef || null;
    const onZoom =
      typeof props.onZoom === "function" ? props.onZoom : () => {};
    const onViewport =
      typeof props.onViewport === "function" ? props.onViewport : () => {};
    const onToggleGrid =
      typeof props.onToggleGrid === "function" ? props.onToggleGrid : () => {};
    const onToggleOutline =
      typeof props.onToggleOutline === "function"
        ? props.onToggleOutline
        : () => {};
    const onReload =
      typeof props.onReload === "function" ? props.onReload : () => {};
    const onOpenExternal =
      typeof props.onOpenExternal === "function"
        ? props.onOpenExternal
        : () => {};
    const onFullscreen =
      typeof props.onFullscreen === "function" ? props.onFullscreen : () => {};

    const widthMap = {
      reset: "100%",
      phone: "375px",
      tablet: "768px",
      desktop: "1024px",
    };
    const width = widthMap[viewport] || "100%";
    const scale = zoom / 100;

    return tpl`
      <div class="bar">
        <h2 class="title">${title}</h2>
        <div class="tools">
          <dimui-icon-button
            .props="${{
              name: "zoomOut",
              label: "Zoom out",
              size: "sm",
              onClick: () => onZoom(Math.max(50, zoom - 10)),
            }}"
          />
          <span class="zoom-label">${zoom}%</span>
          <dimui-icon-button
            .props="${{
              name: "zoomIn",
              label: "Zoom in",
              size: "sm",
              onClick: () => onZoom(Math.min(200, zoom + 10)),
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "phone",
              label: "Phone viewport",
              size: "sm",
              active: viewport === "phone",
              onClick: () => onViewport(viewport === "phone" ? "reset" : "phone"),
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "tablet",
              label: "Tablet viewport",
              size: "sm",
              active: viewport === "tablet",
              onClick: () =>
                onViewport(viewport === "tablet" ? "reset" : "tablet"),
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "desktop",
              label: "Desktop viewport",
              size: "sm",
              active: viewport === "desktop",
              onClick: () =>
                onViewport(viewport === "desktop" ? "reset" : "desktop"),
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "grid",
              label: "Toggle grid",
              size: "sm",
              active: showGrid,
              onClick: onToggleGrid,
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "outline",
              label: "Toggle outline",
              size: "sm",
              active: showOutline,
              onClick: onToggleOutline,
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "reload",
              label: "Reload canvas",
              size: "sm",
              onClick: onReload,
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "external",
              label: "Open canvas in new tab",
              size: "sm",
              onClick: onOpenExternal,
            }}"
          />
          <dimui-icon-button
            .props="${{
              name: "fullscreen",
              label: "Toggle fullscreen",
              size: "sm",
              onClick: onFullscreen,
            }}"
          />
        </div>
      </div>
      <div class="${showGrid ? "stage" : "stage no-grid"}">
        <div
          class="${showOutline ? "viewport outline" : "viewport"}"
          style="width:${width}; max-width:100%; height:100%; transform:scale(${scale});"
        >
          <iframe
            title="Story preview"
            src="${src}"
            ref="${iframeRef}"
          ></iframe>
        </div>
      </div>
    `;
  },
});
