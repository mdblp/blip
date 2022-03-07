/**
 * Copyright (c) 2021, Diabeloop
 * Profile page - Authentication part
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

import React from "react";
import { useTranslation } from "react-i18next";

import Assignment from "@material-ui/icons/Assignment";
import { ClassNameMap } from "@material-ui/styles/withStyles";
import TextField from "@material-ui/core/TextField";

import { getUserEmail } from "../../lib/utils";
import { User } from "../../lib/auth";
import Password from "../../components/utils/password";
import { Errors } from "./models";
import { PasswordStrengthMeter } from "../../components/utils/password-strength-meter";
import { CheckPasswordStrengthResults } from "../../lib/auth/helpers";

interface CredentialsFormProps {
  user: User;
  classes: ClassNameMap;
  errors: Errors;
  currentPassword: string;
  setCurrentPassword: React.Dispatch<string>;
  password: string;
  setPassword: React.Dispatch<string>;
  passwordConfirmation: string;
  setPasswordConfirmation: React.Dispatch<string>;
  passwordCheckResults: CheckPasswordStrengthResults;
}

function CredentialsForm(props: CredentialsFormProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const {
    user,
    classes,
    errors,
    currentPassword,
    setCurrentPassword,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    passwordCheckResults,
  } = props;

  return (
    <React.Fragment>
      <div className={classes.categoryLabel}>
        <Assignment color="primary" style={{ margin: "0" }} />
        <strong className={classes.uppercase}>{t("my-credentials")}</strong>
      </div>
      <TextField
        id="profile-textfield-mail"
        label={t("email")}
        value={getUserEmail(user)}
        disabled
        className={classes.formInput}
      />
      <Password
        id="profile-textfield-password-current"
        autoComplete="current-password"
        variant="standard"
        label={t("current-password")}
        value={currentPassword}
        error={errors.currentPassword}
        helperText={t("no-password")}
        onChange={setCurrentPassword}
      />
      <Password
        id="profile-textfield-password"
        autoComplete="new-password"
        variant="standard"
        label={t("new-password")}
        value={password}
        error={errors.password && password.length > 0}
        checkStrength
        helperText={
          <PasswordStrengthMeter
            force={passwordCheckResults.score}
            error={errors.password}
            helperText={passwordCheckResults.helperText}
          />
        }
        onChange={setPassword}
      />
      <Password
        id="profile-textfield-password-confirmation"
        autoComplete="new-password"
        variant="standard"
        label={t("confirm-password")}
        value={passwordConfirmation}
        error={errors.passwordConfirmation}
        helperText={t("not-matching-password")}
        onChange={setPasswordConfirmation}
      />
    </React.Fragment>
  );
}

export default CredentialsForm;
