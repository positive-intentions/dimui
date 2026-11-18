BP.module(
  "dimui/explorer/manager",
  ["dimui/theme","dimui/registry","dimui/router","dimui/explorer/shortcuts","dimui/components/atoms/icon-button","dimui/explorer/sidebar","dimui/explorer/preview-frame","dimui/explorer/addon-panel","dimui/components/molecules/drawer","dimui/components/molecules/tabs"],
  function (__dep0, __dep1, __dep2, __dep3, __dep4, __dep5, __dep6, __dep7, __dep8, __dep9) {
  const { define, html, css, useState, useEffect, useRef, useStyle, useScope } = Dim;
  const { themeTokens, STORAGE_KEYS, MOBILE_BREAKPOINT, readStorage, writeStorage, readJsonStorage, writeJsonStorage, applyDocumentTheme, THEME_MESSAGE } = __dep0;
  const { stories, getStory, getDefaultStoryId, buildStoryTree } = __dep1;
  const { getStoryIdFromPath, getLayoutFlags, buildManagerUrl, buildPreviewUrl, replaceUrl } = __dep2;
  const { attachShortcuts } = __dep3;
  const { IconButton } = __dep4;
  const { Sidebar } = __dep5;
  const { PreviewFrame } = __dep6;
  const { AddonPanel } = __dep7;
  const { Drawer } = __dep8;
  const { Tabs } = __dep9;
  const styles = css`
    ${themeTokens}
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      font-family: var(--dimui-font-family);
      color: var(--dimui-color-text);
      background: var(--dimui-color-bg);
    }
    * {
      box-sizing: border-box;
    }
    .root {
      height: 100%;
      min-height: 100vh;
      min-height: 100dvh;
    }
    .shell {
      display: grid;
      height: 100%;
      min-height: 0;
      grid-template-columns: var(--sidebar-w, 280px) 6px minmax(0, 1fr);
      grid-template-rows: 1fr;
    }
    .shell.panel-bottom {
      grid-template-rows: 1fr 6px var(--panel-h, 280px);
    }
    .shell.panel-bottom .sidebar {
      grid-row: 1 / span 3;
    }
    .shell.panel-bottom .nav-resizer {
      grid-row: 1 / span 3;
    }
    .shell.panel-bottom .main {
      grid-column: 3;
      grid-row: 1;
    }
    .shell.panel-bottom .panel-resizer {
      grid-column: 3;
      grid-row: 2;
    }
    .shell.panel-bottom .panel {
      grid-column: 3;
      grid-row: 3;
    }
    .shell.panel-right {
      grid-template-columns: var(--sidebar-w, 280px) 6px minmax(0, 1fr) 6px var(--panel-w, 320px);
    }
    .shell.panel-right .main {
      grid-column: 3;
    }
    .shell.panel-right .panel-resizer {
      grid-column: 4;
    }
    .shell.panel-right .panel {
      grid-column: 5;
    }
    .shell.hide-nav {
      --sidebar-w: 0px;
    }
    .shell.hide-nav .nav-resizer {
      display: none;
    }
    .shell.hide-panel.panel-bottom {
      --panel-h: 0px;
    }
    .shell.hide-panel.panel-bottom .panel-resizer,
    .shell.hide-panel.panel-right .panel-resizer {
      display: none;
    }
    .shell.hide-panel.panel-right {
      --panel-w: 0px;
    }
    .shell.fullscreen {
      --sidebar-w: 0px;
      --panel-h: 0px;
      --panel-w: 0px;
    }
    .shell.fullscreen .nav-resizer,
    .shell.fullscreen .panel-resizer {
      display: none;
    }
    .sidebar {
      min-width: 0;
      min-height: 0;
      height: 100%;
      overflow: hidden;
    }
    .sidebar > dimui-sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }
    .main {
      position: relative;
      min-width: 0;
      min-height: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .main > dimui-preview-frame {
      flex: 1;
      min-height: 0;
    }
    .panel {
      min-width: 0;
      min-height: 0;
      height: 100%;
      overflow: hidden;
    }
    .panel > dimui-addon-panel {
      display: block;
      height: 100%;
    }
    .resizer {
      background: var(--dimui-color-border-subtle);
      position: relative;
      z-index: 2;
    }
    .resizer:hover,
    .resizer:active {
      background: var(--dimui-color-primary);
    }
    .resizer.col {
      cursor: col-resize;
    }
    .resizer.row {
      cursor: row-resize;
    }
    .manager-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 2px;
      min-height: 36px;
      padding: 0 var(--dimui-space-2);
      border-bottom: 1px solid var(--dimui-color-border-subtle);
      background: var(--dimui-color-surface-2);
      flex-shrink: 0;
    }
    .mobile-shell {
      display: none;
      height: 100%;
      flex-direction: column;
      min-height: 0;
    }
    .mobile-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .mobile-tools {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
      padding: 4px 6px;
      background: var(--dimui-color-surface);
      border-bottom: 1px solid var(--dimui-color-border-subtle);
    }
    @media (max-width: 900px) {
      .shell {
        display: none;
      }
      .mobile-shell {
        display: flex;
      }
    }
  `;

  function useMediaMobile(effect, state) {
    const [isMobile, setIsMobile] = state(
      typeof window !== "undefined"
        ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
        : false,
    );
    effect(() => {
      const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
      const update = () => setIsMobile(mq.matches);
      update();
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }, []);
    return isMobile;
  }
  const Manager = define({
    tag: "dimui-manager",
    component: (
      _,
      {
        html: tpl,
        useState: state,
        useEffect: effect,
        useRef: refHook,
        useStyle: style,
        useScope: scope,
      },
    ) => {
      style(styles);
      scope({
        IconButton,
        Sidebar,
        PreviewFrame,
        AddonPanel,
        Drawer,
        Tabs,
      });

      const flags = getLayoutFlags();
      const initialStory =
        getStoryIdFromPath() || getDefaultStoryId() || stories[0]?.id || "";

      const [storyId, setStoryId] = state(initialStory);
      const [query, setQuery] = state("");
      const [theme, setTheme] = state(readStorage(STORAGE_KEYS.theme, "dark"));
      const [showNav, setShowNav] = state(flags.showNav);
      const [showPanel, setShowPanel] = state(flags.showPanel);
      const [panelPosition, setPanelPosition] = state(
        flags.panelPosition ||
          readStorage(STORAGE_KEYS.panelPosition, "bottom"),
      );
      const [fullscreen, setFullscreen] = state(flags.fullscreen);
      const [sidebarWidth, setSidebarWidth] = state(
        Number(readStorage(STORAGE_KEYS.sidebarWidth, "280")) || 280,
      );
      const [panelHeight, setPanelHeight] = state(
        Number(readStorage(STORAGE_KEYS.panelHeight, "280")) || 280,
      );
      const [panelWidth, setPanelWidth] = state(
        Number(readStorage(STORAGE_KEYS.panelWidth, "320")) || 320,
      );
      const [collapsed, setCollapsed] = state(
        readJsonStorage(STORAGE_KEYS.collapsedRoots, {}),
      );
      const [addonTab, setAddonTab] = state("controls");
      const [zoom, setZoom] = state(100);
      const [viewport, setViewport] = state("reset");
      const [showGrid, setShowGrid] = state(false);
      const [showOutline, setShowOutline] = state(false);
      const [mobileTab, setMobileTab] = state("canvas");
      const [iframeKey, setIframeKey] = state(0);

      const iframeRef = refHook(null);
      const isMobile = useMediaMobile(effect, state);
      const tree = buildStoryTree(stories);
      const story = getStory(storyId);

      const syncUrl = (next = {}) => {
        const url = buildManagerUrl({
          storyId: next.storyId ?? storyId,
          showNav: next.showNav ?? showNav,
          showPanel: next.showPanel ?? showPanel,
          panelPosition: next.panelPosition ?? panelPosition,
          fullscreen: next.fullscreen ?? fullscreen,
        });
        replaceUrl(url);
      };

      const postSelect = (id) => {
        const frame = iframeRef.current;
        if (frame?.contentWindow) {
          frame.contentWindow.postMessage({ type: "dimui:select", id }, "*");
        }
      };

      const postTheme = (nextTheme = theme) => {
        const frame = iframeRef.current;
        if (frame?.contentWindow) {
          frame.contentWindow.postMessage(
            { type: THEME_MESSAGE, theme: nextTheme },
            "*",
          );
        }
      };

      const selectStory = (id) => {
        setStoryId(id);
        setMobileTab("canvas");
        syncUrl({ storyId: id });
        postSelect(id);
        postTheme();
      };

      effect(() => {
        applyDocumentTheme(theme);
        writeStorage(STORAGE_KEYS.theme, theme);
        postTheme(theme);
      }, [theme]);

      effect(() => {
        const onMessage = (event) => {
          if (event.data?.type === "dimui:preview-ready") {
            postTheme();
            postSelect(storyId);
          }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
      }, [storyId, theme]);

      effect(() => {
        writeStorage(STORAGE_KEYS.sidebarWidth, sidebarWidth);
      }, [sidebarWidth]);

      effect(() => {
        writeStorage(STORAGE_KEYS.panelHeight, panelHeight);
      }, [panelHeight]);

      effect(() => {
        writeStorage(STORAGE_KEYS.panelWidth, panelWidth);
      }, [panelWidth]);

      effect(() => {
        writeStorage(STORAGE_KEYS.panelPosition, panelPosition);
      }, [panelPosition]);

      effect(() => {
        writeJsonStorage(STORAGE_KEYS.collapsedRoots, collapsed);
      }, [collapsed]);

      effect(() => {
        syncUrl();
      }, [showNav, showPanel, panelPosition, fullscreen, storyId]);

      effect(() => {
        const detach = attachShortcuts({
          onSearch: () => {
            if (isMobile) setMobileTab("sidebar");
            else setShowNav(true);
            requestAnimationFrame(() => {
              const input =
                document
                  .querySelector("dimui-manager")
                  ?.shadowRoot?.querySelector("#explorer-search") ||
                document.querySelector("#explorer-search");
              input?.focus?.();
            });
          },
          onToggleSidebar: () => {
            if (isMobile) {
              setMobileTab((t) => (t === "sidebar" ? "canvas" : "sidebar"));
            } else {
              setShowNav((v) => !v);
            }
          },
          onToggleAddons: () => {
            if (isMobile) {
              setMobileTab((t) => (t === "addons" ? "canvas" : "addons"));
            } else {
              setShowPanel((v) => !v);
            }
          },
          onToggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
          onToggleFullscreen: () => setFullscreen((v) => !v),
          onEscape: () => {
            if (isMobile && mobileTab !== "canvas") setMobileTab("canvas");
            else if (fullscreen) setFullscreen(false);
          },
        });
        return detach;
      }, [isMobile, mobileTab, fullscreen]);

      effect(() => {
        const onPop = () => {
          const id = getStoryIdFromPath() || getDefaultStoryId();
          const nextFlags = getLayoutFlags();
          setStoryId(id);
          setShowNav(nextFlags.showNav);
          setShowPanel(nextFlags.showPanel);
          if (nextFlags.panelPosition) setPanelPosition(nextFlags.panelPosition);
          setFullscreen(nextFlags.fullscreen);
          postSelect(id);
        };
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
      }, []);

      const startResize = (axis, event) => {
        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        const startSidebar = sidebarWidth;
        const startPanelH = panelHeight;
        const startPanelW = panelWidth;

        const onMove = (e) => {
          if (axis === "nav") {
            const next = Math.min(480, Math.max(180, startSidebar + (e.clientX - startX)));
            setSidebarWidth(next);
          } else if (axis === "panel-row") {
            const next = Math.min(
              480,
              Math.max(140, startPanelH - (e.clientY - startY)),
            );
            setPanelHeight(next);
          } else if (axis === "panel-col") {
            const next = Math.min(
              560,
              Math.max(200, startPanelW - (e.clientX - startX)),
            );
            setPanelWidth(next);
          }
        };
        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      };

      const basePreview = buildPreviewUrl(storyId);
      const previewSrc = `${basePreview}${basePreview.includes("?") ? "&" : "?"}_k=${iframeKey}`;

      const sidebarProps = {
        nodes: tree,
        selectedId: storyId,
        query,
        collapsed,
        onQuery: setQuery,
        onSelect: selectStory,
        onToggle: (id) =>
          // Default collapsed: missing/true = collapsed, false = expanded.
          setCollapsed((prev) => ({ ...prev, [id]: prev[id] === false })),
      };

      const addonProps = {
        tab: addonTab,
        story,
        onTab: setAddonTab,
      };

      const previewProps = {
        title: story?.title || "Canvas",
        src: previewSrc,
        zoom,
        viewport,
        showGrid,
        showOutline,
        iframeRef,
        onZoom: setZoom,
        onViewport: setViewport,
        onToggleGrid: () => setShowGrid((v) => !v),
        onToggleOutline: () => setShowOutline((v) => !v),
        onReload: () => setIframeKey((k) => k + 1),
        onOpenExternal: () => window.open(buildPreviewUrl(storyId), "_blank"),
        onFullscreen: () => setFullscreen((v) => !v),
      };

      const shellClass = [
        "shell",
        panelPosition === "right" ? "panel-right" : "panel-bottom",
        !showNav ? "hide-nav" : "",
        !showPanel ? "hide-panel" : "",
        fullscreen ? "fullscreen" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const panelResizerClass =
        panelPosition === "right"
          ? "resizer col panel-resizer"
          : "resizer row panel-resizer";
      const panelOrientation =
        panelPosition === "right" ? "vertical" : "horizontal";
      const onPanelResize = (e) =>
        startResize(panelPosition === "right" ? "panel-col" : "panel-row", e);

      const hostStyle = [
        `--sidebar-w: ${showNav && !fullscreen ? sidebarWidth : 0}px`,
        `--panel-h: ${showPanel && !fullscreen && panelPosition === "bottom" ? panelHeight : 0}px`,
        `--panel-w: ${showPanel && !fullscreen && panelPosition === "right" ? panelWidth : 0}px`,
      ].join("; ");

      return tpl`
        <div class="root" style="${hostStyle}">
          <div class="${shellClass}">
            <div class="sidebar">
              <dimui-sidebar .props="${sidebarProps}" />
            </div>
            <div
              class="resizer col nav-resizer"
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize sidebar"
              @pointerdown="${(e) => startResize('nav', e)}"
            ></div>
            <div class="main">
              <div class="manager-bar">
                <dimui-icon-button
                  .props="${{
                    name: theme === "dark" ? "sun" : "moon",
                    label: "Toggle theme",
                    size: "sm",
                    onClick: () =>
                      setTheme((t) => (t === "dark" ? "light" : "dark")),
                  }}"
                />
                <dimui-icon-button
                  .props="${{
                    name: "sidebar",
                    label: "Toggle sidebar",
                    size: "sm",
                    active: showNav,
                    onClick: () => setShowNav((v) => !v),
                  }}"
                />
                <dimui-icon-button
                  .props="${{
                    name: "panel",
                    label: "Toggle addon panel",
                    size: "sm",
                    active: showPanel,
                    onClick: () => setShowPanel((v) => !v),
                  }}"
                />
                <dimui-icon-button
                  .props="${{
                    name: "desktop",
                    label: "Dock panel right",
                    size: "sm",
                    active: panelPosition === "right",
                    onClick: () =>
                      setPanelPosition((p) =>
                        p === "bottom" ? "right" : "bottom",
                      ),
                  }}"
                />
              </div>
              <dimui-preview-frame .props="${previewProps}" />
            </div>
            <div
              class="${panelResizerClass}"
              role="separator"
              aria-orientation="${panelOrientation}"
              aria-label="Resize addon panel"
              @pointerdown="${onPanelResize}"
            ></div>
            <div class="panel" position="${panelPosition}">
              <dimui-addon-panel
                position="${panelPosition}"
                .props="${addonProps}"
              />
            </div>
          </div>

          <div class="mobile-shell">
            <div class="mobile-tools">
              <dimui-icon-button
                .props="${{
                  name: theme === "dark" ? "sun" : "moon",
                  label: "Toggle theme",
                  size: "sm",
                  onClick: () =>
                    setTheme((t) => (t === "dark" ? "light" : "dark")),
                }}"
              />
            </div>
            <div class="mobile-main">
              <dimui-preview-frame .props="${previewProps}" />
            </div>
            <dimui-tabs
              .props="${{
                variant: "bottom-nav",
                "aria-label": "Explorer sections",
                value: mobileTab,
                items: [
                  { id: "sidebar", label: "Sidebar" },
                  { id: "canvas", label: "Canvas" },
                  { id: "addons", label: "Addons" },
                ],
                onChange: setMobileTab,
              }}"
            />
            <dimui-drawer
              .props="${{
                open: mobileTab === "sidebar",
                placement: "bottom",
                "aria-label": "Stories",
                onClose: () => setMobileTab("canvas"),
                content: tpl`<dimui-sidebar .props="${sidebarProps}" />`,
              }}"
            />
            <dimui-drawer
              .props="${{
                open: mobileTab === "addons",
                placement: "bottom",
                "aria-label": "Addons",
                onClose: () => setMobileTab("canvas"),
                content: tpl`<dimui-addon-panel .props="${addonProps}" />`,
              }}"
            />
          </div>
        </div>
      `;
    },
  });
  return { Manager };
  },
);
