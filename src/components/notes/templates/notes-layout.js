BP.module(
  "dimui/components/notes/templates/notes-layout",
  [
    "dimui/lib/notes/tokens",
    "dimui/components/notes/organisms/folder-rail",
    "dimui/components/notes/molecules/notes-header",
    "dimui/components/notes/molecules/mobile-folder-bar",
    "dimui/components/molecules/confirm-dialog",
    "dimui/components/notes/organisms/navigation-view",
  ],
  function (tokens, folderRail, notesHeader, mobileBar, confirmDialog, nav) {
    const { define, css } = Dim;
    const { notesTokens } = tokens;
    const { FolderRail } = folderRail;
    const { NotesHeader } = notesHeader;
    const { MobileFolderBar } = mobileBar;
    const { ConfirmDialog } = confirmDialog;
    void nav;

    const styles = css`
      ${notesTokens}

      .notes-app {
        display: flex;
        flex-direction: row;
        height: 100%;
        background: var(--notes-bg);
        color: var(--notes-text);
        overflow: hidden;
        position: relative;
      }

      .main-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
      }

      .main-column.note-open-mobile dimui-notes-header {
        display: none;
      }

      .content-area {
        flex: 1;
        min-height: 0;
        position: relative;
        overflow: hidden;
      }

      @media (max-width: 768px) {
        .main-column.note-open-mobile dimui-mobile-folder-bar {
          display: none;
        }
      }
    `;

    const NotesLayout = define({
      tag: "dimui-notes-layout",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({
          FolderRail,
          NotesHeader,
          MobileFolderBar,
          ConfirmDialog,
        });

        const theme = props.theme === "light" ? "light" : "dark";
        const noteOpen = Boolean(props.noteOpen);
        const mainClass = noteOpen
          ? "main-column note-open-mobile"
          : "main-column";

        const folderRailProps = props.folderRail || {};
        const headerProps = props.header || {};
        const mobileBarProps = props.mobileBar || {};
        const navProps = props.nav || {};
        const confirmProps = props.confirm || {};
        const viewId = props.viewId || "10";

        return tpl`
          <div class="notes-app" data-theme="${theme}">
            <dimui-folder-rail .props="${folderRailProps}" />

            <div class="${mainClass}">
              <dimui-notes-header .props="${headerProps}" />
              <dimui-mobile-folder-bar
                .props="${mobileBarProps}"
              />
              <div class="content-area">
                <dimui-notes-nav
                  transitionId="${viewId}"
                  transitionDuration="450"
                  .props="${navProps}"
                />
              </div>
            </div>

            <dimui-confirm-dialog .props="${confirmProps}" />
          </div>
        `;
      },
    });

    return { NotesLayout };
  },
);
