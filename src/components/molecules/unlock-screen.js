BP.module(
  "dimui/components/molecules/unlock-screen",
  [
    "dimui/theme",
    "dimui/components/atoms/button",
    "dimui/components/atoms/text-field",
  ],
  function (theme, button, textField) {
    const { define, css, useStyle, useScope, useState } = Dim;
    const { themeTokens } = theme;
    const { Button } = button;
    const { TextField } = textField;

    const styles = css`
      ${themeTokens}

      :host {
        display: block;
        width: 100%;
        min-height: 100%;
        height: 100%;
        color: var(--dimui-color-text);
        font-family: var(--dimui-font-family);
      }

      .frame {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--dimui-color-bg);
        color: var(--dimui-color-text);
      }

      .unlock {
        flex: 1;
        display: grid;
        place-items: center;
        padding: 2rem 1.25rem;
      }

      .unlock-panel {
        width: min(360px, 100%);
      }

      .unlock-panel h1 {
        margin: 0 0 0.35rem;
        font-size: 1.75rem;
        font-weight: 650;
        letter-spacing: -0.02em;
        color: var(--dimui-color-text);
      }

      .unlock-panel p {
        margin: 0 0 1.5rem;
        color: var(--dimui-color-text-muted);
        line-height: 1.45;
      }

      .field-gap {
        margin: 0 0 1rem;
      }

      .error {
        margin: 0 0 1rem;
        color: var(--dimui-color-danger);
        font-size: 0.9rem;
      }
    `;

    const UnlockScreen = define({
      tag: "dimui-unlock",
      component: (
        props,
        { html: tpl, useState: state, useStyle: style, useScope: scope },
      ) => {
        style(styles);
        scope({ Button, TextField });

        const title = props.title || "Unlock";
        const unlockHint =
          props.unlockHint ||
          "Enter your password to decrypt data stored in this browser.";
        const createHint =
          props.createHint ||
          "Choose a password to encrypt your data. There is no recovery if you forget it.";
        const vaultFlag = props.vaultFlag || "dimui-vault";

        const hasVault =
          typeof props.hasVault === "boolean"
            ? props.hasVault
            : typeof localStorage !== "undefined" &&
              localStorage.getItem(vaultFlag) === "1";

        const [password, setPassword] = state("");
        const [confirm, setConfirm] = state("");
        const [error, setError] = state("");
        const displayError = error || props.error || "";

        const onUnlock =
          typeof props.onUnlock === "function" ? props.onUnlock : () => {};

        const submit = () => {
          setError("");
          if (!password) {
            setError("Enter a password.");
            return;
          }
          if (!hasVault) {
            if (password.length < 4) {
              setError("Use at least 4 characters.");
              return;
            }
            if (password !== confirm) {
              setError("Passwords do not match.");
              return;
            }
            onUnlock(password, { create: true });
            return;
          }
          onUnlock(password, { create: false });
        };

        const onKeydown = (e) => {
          if (e.key === "Enter") submit();
        };

        const themeMode = props.theme === "light" ? "light" : "dark";

        return tpl`
          <div class="frame" data-theme="${themeMode}">
            <div class="unlock">
              <div class="unlock-panel">
                <h1>${title}</h1>
                <p>${hasVault ? unlockHint : createHint}</p>

                <div class="field-gap">
                  <dimui-text-field
                    .props="${{
                      id: "password",
                      label: hasVault ? "Password" : "Create password",
                      type: "password",
                      autocomplete: hasVault
                        ? "current-password"
                        : "new-password",
                      value: password,
                      onInput: setPassword,
                      onKeydown,
                    }}"
                  />
                </div>

                ${!hasVault
                  ? tpl`
                      <div class="field-gap">
                        <dimui-text-field
                          .props="${{
                            id: "confirm",
                            label: "Confirm password",
                            type: "password",
                            autocomplete: "new-password",
                            value: confirm,
                            onInput: setConfirm,
                            onKeydown,
                          }}"
                        />
                      </div>
                    `
                  : null}

                ${displayError
                  ? tpl`<p class="error">${displayError}</p>`
                  : null}

                <dimui-button
                  .props="${{
                    label: hasVault ? "Unlock" : "Create vault",
                    onClick: submit,
                  }}"
                />
              </div>
            </div>
          </div>
        `;
      },
    });
    return { UnlockScreen };
  },
);
