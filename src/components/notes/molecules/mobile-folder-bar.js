BP.module(
  "dimui/components/notes/molecules/mobile-folder-bar",
  ["dimui/components/atoms/chip"],
  function (chip) {
    const { define, css } = Dim;
    const { Chip } = chip;

    const styles = css`
      :host {
        display: none;
        flex-shrink: 0;
        background: var(--notes-surface, #0b1220);
        border-bottom: 1px solid var(--notes-border, #334155);
      }

      .bar {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        overflow-x: auto;
      }

      @media (max-width: 768px) {
        :host {
          display: block;
        }
      }
    `;

    const MobileFolderBar = define({
      tag: "dimui-mobile-folder-bar",
      component: (props, { html: tpl, useStyle: style, useScope: scope }) => {
        style(styles);
        scope({ Chip });

        const items = Array.isArray(props.items) ? props.items : [];
        const selectedId = props.selectedId || null;
        const onSelect =
          typeof props.onSelect === "function" ? props.onSelect : () => {};

        return tpl`
          <div class="bar" role="tablist" aria-label="Folders">
            ${items.map(
              (item) => tpl`
                <dimui-chip
                  .props="${{
                    label: item.name,
                    selected: selectedId === item.id,
                    onClick: () => onSelect(item.id),
                  }}"
                />
              `,
            )}
          </div>
        `;
      },
    });

    return { MobileFolderBar };
  },
);
