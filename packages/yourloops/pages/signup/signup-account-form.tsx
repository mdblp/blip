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

interface Errors {
  userName: boolean;
  newPassword: boolean;
  confirmNewPassword: boolean;
}

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
    userName: false,
    newPassword: false,
    confirmNewPassword: false,
  };
  const [errors, setErrors] = React.useState<Errors>(defaultErr);
  const [newPassword, setNewPassword] = useState("");
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

  const isUserNameValid = (): boolean => {
    let err = false;

    if (_.isEmpty(state.formValues?.accountUsername.trim())) {
      err = true;
    }

    if (!REGEX_EMAIL.test(state.formValues?.accountUsername)) {
      err = true;
    }

    setErrors({ ...errors, userName: err });
    return !err;
  };

  const isPasswordValid = (): boolean => {
    const err =
      _.isEmpty(newPassword?.trim()) ||
      newPassword?.length < appConfig.PASSWORD_MIN_LENGTH;
    setErrors({ ...errors, newPassword: err });
    return !err;
  };

  const isConfirmNewPasswordValid = (): boolean => {
    const err =
      _.isEmpty(state.formValues?.accountPassword.trim()) ||
      state.formValues?.accountPassword !== newPassword;
    setErrors({ ...errors, confirmNewPassword: err });
    return !err;
  };

  const isErrorSeen: boolean = React.useMemo(() => _.some(errors), [errors]);

  const onNext = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (
      isUserNameValid() &&
      isPasswordValid() &&
      isConfirmNewPasswordValid()) {
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
        label={t("email")}
        variant="outlined"
        value={state.formValues.accountUsername}
        required
        error={errors.userName}
        onBlur={() => isUserNameValid()}
        onChange={(e) => onChange(e, "accountUsername")}
        helperText={errors.userName && t("invalid-email")}
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
        onBlur={() => isPasswordValid()}
        onChange={(e) => onChange(e, "", setNewPassword)}
        helperText={
          errors.newPassword &&
          t("password-too-weak", {
            minLength: appConfig.PASSWORD_MIN_LENGTH,
          })
        }
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
        label={t("confirm-new-password")}
        variant="outlined"
        type={showConfirmNewPassword ? "text" : "password"}
        value={state.formValues.accountPassword}
        required
        error={errors.confirmNewPassword}
        onBlur={() => isConfirmNewPasswordValid()}
        onChange={(e) => onChange(e, "accountPassword")}
        helperText={errors.confirmNewPassword && t("password-dont-match")}
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
          disabled={isErrorSeen}
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
