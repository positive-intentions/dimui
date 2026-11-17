import {
  define,
  html,
  useState,
  useStyle,
  useScope,
} from "@positive-intentions/dim";
import { appStyles, VAULT_FLAG } from "./styles.js";
import { Button } from "../../components/atoms/button.js";
import { TextField } from "../../components/atoms/text-field.js";

export const UnlockScreen = define({
  tag: "dimui-unlock",
  component: (
    props,
    { html: tpl, useState: state, useStyle: style, useScope: scope },
  ) => {
    style(appStyles);
    scope({ Button, TextField });

    const hasVault =
      typeof props.hasVault === "boolean"
        ? props.hasVault
        : typeof localStorage !== "undefined" &&
          localStorage.getItem(VAULT_FLAG) === "1";

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

    const theme = props.theme === "light" ? "light" : "dark";

    return tpl`
      <div class="frame" data-theme="${theme}">
        <div class="unlock">
          <div class="unlock-panel">
            <h1>Notes</h1>
            <p>
              ${hasVault
                ? "Enter your password to decrypt notes stored in this browser."
                : "Choose a password to encrypt your notes. There is no recovery if you forget it."}
            </p>

            <div class="field-gap">
              <dimui-text-field
                .props="${{
                  id: "password",
                  label: hasVault ? "Password" : "Create password",
                  type: "password",
                  autocomplete: hasVault ? "current-password" : "new-password",
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

            ${displayError ? tpl`<p class="error">${displayError}</p>` : null}

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
