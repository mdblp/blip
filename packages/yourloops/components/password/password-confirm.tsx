/**
 * Copyright (c) 2022, Diabeloop
 * Password confirm component
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, { useCallback } from "react";
import _ from "lodash";

import { makeStyles, Theme } from "@material-ui/core";

import { t } from "../../lib/language";
import { checkPasswordStrength } from "../../lib/auth/helpers";
import PasswordLeakService from "../../services/password-leak";
import { PasswordStrengthMeter } from "./password-strength-meter";
import Password from "./password";

interface Errors {
  newPassword: boolean;
  confirmNewPassword: boolean;
  passwordLeaked: boolean;
}

interface PasswordConfirmProps {
  onError: () => void;
  onSucces: (password: string) => void;
}

const styles = makeStyles((theme: Theme) => ({
  weakColor: { color: theme.palette.error.main },
}));


export function PasswordConfirm({ onError, onSucces }: PasswordConfirmProps): JSX.Element {
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [passwordState, setPasswordState] = React.useState({
    newPassword: "",
    hasLeaked: false,
    hasBeenCheckedForLeak: false,
  });

  const { weakColor } = styles();

  const passwordCheck = checkPasswordStrength(passwordState.newPassword);

  const checkPasswordLeak = useCallback(() => {
    PasswordLeakService.verifyPassword(passwordState.newPassword).then(passwordLeakResponse => {
      setPasswordState({
        ...passwordState,
        hasLeaked: !!passwordLeakResponse.hasLeaked,
        hasBeenCheckedForLeak: true,
      });
    });
  }, [passwordState]);

  const errors: Errors = React.useMemo(
    () => {
      const err = {
        newPassword: passwordCheck.onError,
        confirmNewPassword: _.isEmpty(confirmNewPassword.trim()) || confirmNewPassword !== passwordState.newPassword,
        passwordLeaked: passwordState.hasLeaked,
      };
      if (_.some(err)) {
        onError();
      } else if (!passwordState.hasBeenCheckedForLeak) {
        checkPasswordLeak();
      } else {
        onSucces(passwordState.newPassword);
      }
      return err;
    }, [confirmNewPassword, passwordCheck.onError, passwordState, checkPasswordLeak, onError, onSucces]
  );

  return (
    <React.Fragment>
      <Password
        id="password"
        label={t("new-password")}
        value={passwordState.newPassword}
        onChange={(password) => setPasswordState({
          newPassword: password,
          hasBeenCheckedForLeak: false,
          hasLeaked: false,
        })}
        error={errors.newPassword && passwordState.newPassword.length > 0 || errors.passwordLeaked}
        autoComplete="new-password"
        variant="outlined"
        margin="normal"
        checkStrength
        required
        onBlur={() => {
          if (!errors.newPassword && !errors.passwordLeaked) {
            checkPasswordLeak();
          }
        }}
        helperText={
          <div>
            {passwordState.newPassword.length > 0 && !errors.passwordLeaked &&
              <PasswordStrengthMeter
                force={passwordCheck.score}
                error={errors.newPassword}
                helperText={passwordCheck.helperText}
              />
            }
            {passwordState.hasLeaked &&
              <div id="password-leaked-error-message" className={weakColor}>
                {t("password-leaked")}
              </div>
            }
          </div>
        }
      />
      <Password
        id="confirm-password"
        label={t("confirm-new-password")}
        value={confirmNewPassword}
        onChange={(password) => setConfirmNewPassword(password)}
        error={errors.confirmNewPassword && confirmNewPassword.length > 0}
        helperText={errors.confirmNewPassword && t("password-dont-match")}
        autoComplete="new-password"
        variant="outlined"
        margin="normal"
        required
      />
    </React.Fragment>
  );
}

