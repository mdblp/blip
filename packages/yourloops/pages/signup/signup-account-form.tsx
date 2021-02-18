/**
 * Copyright (c) 2021, Diabeloop
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

import _ from "lodash";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";

import { useSignUpFormState } from "./signup-formstate-context";
import { REGEX_EMAIL } from "../../lib/utils";
import appConfig from "../../lib/config";

const formStyle = makeStyles((theme: Theme) => {
  return {
    Button: {
      marginRight: theme.spacing(1),
    },
    TextField: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(1),
    },
    Checkbox: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  };
});

/**
 * SignUpAccount Form
 */
function SignUpAccountForm(props: any): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { state, dispatch } = useSignUpFormState();
  const { handleBack, handleNext } = props;
  const defaultErr = {
    username: false,
    newPassword: false,
    confirmNewPassword: false,
  };
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState(defaultErr);
  const [userNameHelperTextValue, setUserNameHelperTextValue] = useState("");
  const [
    newPasswordChangeHelperTextValue,
    setNewPasswordChangeHelperTextValue,
  ] = useState("");
  const [
    confirmNewPasswordChangeHelperTextValue,
    setConfirmNewPasswordChangeHelperTextValue,
  ] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const classes = formStyle();

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    keyField: string,
    setState?: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    if (!setState) {
      dispatch({
        type: "EDIT_FORMVALUE",
        key: keyField,
        value: event.target.value,
      });
    } else {
      setState(event.target.value);
    }
  };

  const onClick = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    showPassword: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
    if (showPassword) {
      setState(false);
    } else {
      setState(true);
    }
  };

  const resetFormState = (): void => {
    setErrors(defaultErr);
    setUserNameHelperTextValue("");
    setNewPasswordChangeHelperTextValue("");
    setConfirmNewPasswordChangeHelperTextValue("");
  };

  const validateForm = (): boolean => {
    let errorSeen = false;
    let username = false;
    let password = false;
    let cfmPassword = false;

    // for now duplicated blip validation logic
    // Is there a better way to handle errors...
    if (_.isEmpty(state.formValues.account_username)) {
      username = true;
      errorSeen = true;
    }

    const IS_REQUIRED = t("This field is required.");

    if (!state.formValues.account_username) {
      setUserNameHelperTextValue(IS_REQUIRED);
      username = true;
      errorSeen = true;
    }

    if (
      state.formValues.account_username &&
      !REGEX_EMAIL.test(state.formValues.account_username)
    ) {
      setUserNameHelperTextValue(t("Invalid email address."));
      username = true;
      errorSeen = true;
    }

    if (!newPassword) {
      setNewPasswordChangeHelperTextValue(IS_REQUIRED);
      password = true;
      errorSeen = true;
    }

    if (newPassword && newPassword.length < appConfig.PASSWORD_MIN_LENGTH) {
      setNewPasswordChangeHelperTextValue(
        t("Password must be at least {{minLength}} characters long.", {
          minLength: appConfig.PASSWORD_MIN_LENGTH,
        })
      );
      password = true;
      errorSeen = true;
    }

    if (newPassword) {
      if (!state.formValues.account_password) {
        setConfirmNewPasswordChangeHelperTextValue(IS_REQUIRED);
        cfmPassword = true;
        errorSeen = true;
      } else if (state.formValues.account_password !== newPassword) {
        setConfirmNewPasswordChangeHelperTextValue(t("password-dont-match"));
        cfmPassword = true;
        errorSeen = true;
      }
    }

    setErrors({
      username: username,
      newPassword: password,
      confirmNewPassword: cfmPassword,
    });
    return !errorSeen;
  };

  const onNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    resetFormState();
    if (validateForm()) {
      // submit to api
      handleNext();
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="username"
        className={classes.TextField}
        margin="normal"
        label={t("Email")}
        variant="outlined"
        value={state.formValues.account_username}
        required
        error={errors.username}
        onChange={(e) => onChange(e, "account_username")}
        helperText={userNameHelperTextValue}
      />
      <TextField
        id="password"
        className={classes.TextField}
        margin="normal"
        label={t("New password")}
        variant="outlined"
        type={showNewPassword ? "text" : "password"}
        value={newPassword}
        required
        error={errors.newPassword}
        onChange={(e) => onChange(e, "", setNewPassword)}
        helperText={newPasswordChangeHelperTextValue}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={t("aria-toggle-password-visibility")}
                onClick={(e) => onClick(e, showNewPassword, setShowNewPassword)}
              >
                {showNewPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        id="confirm-password"
        className={classes.TextField}
        margin="normal"
        label={t("Confirm new password")}
        variant="outlined"
        type={showConfirmNewPassword ? "text" : "password"}
        value={state.formValues.account_password}
        required
        error={errors.confirmNewPassword}
        onChange={(e) => onChange(e, "account_password")}
        helperText={confirmNewPasswordChangeHelperTextValue}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={t("aria-toggle-password-visibility")}
                onClick={(e) =>
                  onClick(e, showConfirmNewPassword, setShowConfirmNewPassword)
                }
              >
                {showConfirmNewPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div id="signup-accountform-button-group">
        <Button
          variant="contained"
          color="secondary"
          className={classes.Button}
          onClick={handleBack}
        >
          {t("signup-steppers-back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.Button}
          onClick={onNext}
        >
          {t("signup-steppers-create-account")}
        </Button>
      </div>
    </form>
  );
}

export default SignUpAccountForm;
