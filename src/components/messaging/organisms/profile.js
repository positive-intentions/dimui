BP.module(
  "dimui/components/messaging/organisms/profile",
  [
    "dimui/lib/messaging/tokens",
    "dimui/components/atoms/avatar",
    "dimui/components/atoms/button",
    "dimui/components/atoms/icon-button",
    "dimui/components/atoms/text-field",
  ],
  function (tokens, avatar, button, iconButton, textField) {
    const { define, css } = Dim;
    const { messagingTokens } = tokens;
    const { Avatar } = avatar;
    const { Button } = button;
    const { IconButton } = iconButton;
    const { TextField } = textField;

    const styles = css`
      ${messagingTokens}

      :host {
        display: block;
        height: 100%;
        min-height: 0;
      }

      .page {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: var(--dimui-color-bg);
        color: var(--dimui-color-text);
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 0.75rem;
        border-bottom: 1px solid var(--dimui-color-border);
        background: var(--dimui-color-surface-2);
        flex-shrink: 0;
      }

      .toolbar-title {
        flex: 1;
        font-weight: 650;
        font-size: 1rem;
      }

      .body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 1.25rem;
      }

      .hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }

      .field {
        margin-bottom: 0.9rem;
      }

      .label {
        display: block;
        font-size: 0.8rem;
        color: var(--dimui-color-text-muted);
        margin-bottom: 0.35rem;
      }

      select {
        width: 100%;
        min-height: 40px;
        border-radius: 10px;
        border: 1px solid var(--dimui-color-border);
        background: var(--dimui-color-surface);
        color: var(--dimui-color-text);
        font: inherit;
        padding: 0.45rem 0.65rem;
      }

      .error {
        margin: 0 0 0.85rem;
        padding: 0.55rem 0.7rem;
        border-radius: 10px;
        background: color-mix(in srgb, var(--dimui-color-danger) 18%, transparent);
        color: var(--dimui-color-text);
        font-size: 0.85rem;
      }

      .actions {
        margin-top: 0.5rem;
      }
    `;

    function initialsFrom(name) {
      const title = String(name || "").trim() || "?";
      return (
        title
          .split(/\s+/)
          .map((p) => p[0] || "")
          .join("")
          .slice(0, 2)
          .toUpperCase() || "?"
      );
    }

    const Profile = define({
      tag: "dimui-profile",
      component: (
        props,
        { html: tpl, useState: state, useStyle: style, useScope: scope },
      ) => {
        style(styles);
        scope({ Avatar, Button, IconButton, TextField });

        const theme = props.theme === "light" ? "light" : "dark";
        const profile = props.profile || {};
        const icePresets = Array.isArray(props.icePresets)
          ? props.icePresets
          : [];
        const error = props.error ? String(props.error) : "";
        const onBack =
          typeof props.onBack === "function" ? props.onBack : () => {};
        const onSave =
          typeof props.onSave === "function" ? props.onSave : () => {};

        const [displayName, setDisplayName] = state(
          String(profile.displayName || ""),
        );
        const [handle, setHandle] = state(String(profile.handle || ""));
        const [icePreset, setIcePreset] = state(
          String(profile.icePreset || (icePresets[0] && icePresets[0].id) || ""),
        );

        const save = () => {
          onSave({
            displayName: String(displayName || "").trim(),
            handle: String(handle || "")
              .trim()
              .replace(/^@/, "")
              .toLowerCase(),
            icePreset: String(icePreset || ""),
          });
        };

        return tpl`
          <div class="page frame" data-theme="${theme}">
            <div class="toolbar">
              <dimui-icon-button
                .props="${{
                  name: "arrowLeft",
                  label: "Back",
                  onClick: onBack,
                }}"
              />
              <div class="toolbar-title">My profile</div>
            </div>
            <div class="body">
              <div class="hero">
                <dimui-avatar
                  .props="${{
                    label: initialsFrom(displayName),
                    size: "xl",
                  }}"
                />
              </div>
              <div class="field">
                <dimui-text-field
                  .props="${{
                    id: "profile-displayName",
                    label: "Display name",
                    value: displayName,
                    onInput: setDisplayName,
                  }}"
                />
              </div>
              <div class="field">
                <dimui-text-field
                  .props="${{
                    id: "profile-handle",
                    label: "Handle",
                    value: handle,
                    onInput: setHandle,
                  }}"
                />
              </div>
              ${
                icePresets.length
                  ? tpl`
                      <div class="field">
                        <label class="label" for="profile-ice">Relay servers</label>
                        <select
                          id="profile-ice"
                          .value="${icePreset}"
                          @change="${(e) => setIcePreset(e.target.value)}"
                        >
                          ${icePresets.map(
                            (p) =>
                              tpl`<option value="${p.id}">${p.label}</option>`,
                          )}
                        </select>
                      </div>
                    `
                  : null
              }
              ${error ? tpl`<p class="error" role="alert">${error}</p>` : null}
              <div class="actions">
                <dimui-button
                  .props="${{
                    label: "Save",
                    onClick: save,
                  }}"
                />
              </div>
            </div>
          </div>
        `;
      },
    });

    return { Profile };
  },
);
