/* eslint-disable no-unused-vars */
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
import { Link, RouteComponentProps } from "react-router-dom";

import { makeStyles /*, Theme */ } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Checkbox from "@material-ui/core/Checkbox";

import { t } from "../../lib/language";
import { REGEX_EMAIL } from "../../lib/utils";
import appConfig from "../../lib/config";
import brandingLogo from "branding/logo.png";
import { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SignUpProps extends RouteComponentProps {}

const formStyle = makeStyles((/* theme: Theme */) => {
  return {
    mainContainer: { margin: "auto" },
    Button: {
      marginLeft: "auto",
    },
  };
});

/**
 * Signup page
 */

function SignUpPage(_props: SignUpProps): JSX.Element {
  const defaultErr = {
    username: false,
    newPassword: false,
    confirmNewPassword: false,
  };
  const [username, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
  const emptyUsername = _.isEmpty(username);
  const classes = formStyle();

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setState(event.target.value);
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

  const validateForm = (): void => {
    // for now duplicated blip validation logic
    // Is there a better way to handle errors...
    if (_.isEmpty(username)) {
      setErrors({ ...defaultErr, username: true });
    }

    const IS_REQUIRED = t("This field is required.");

    if (!username) {
      setUserNameHelperTextValue(IS_REQUIRED);
      setErrors({ ...defaultErr, username: true });
    }

    if (username && !REGEX_EMAIL.test(username)) {
      setUserNameHelperTextValue(t("Invalid email address."));
      setErrors({ ...defaultErr, username: true });
    }

    if (!newPassword) {
      setNewPasswordChangeHelperTextValue(IS_REQUIRED);
      setErrors({ ...defaultErr, newPassword: true });
    }

    if (newPassword && newPassword.length < appConfig.PASSWORD_MIN_LENGTH) {
      setNewPasswordChangeHelperTextValue(
        t("Password must be at least {{minLength}} characters long.", {
          minLength: appConfig.PASSWORD_MIN_LENGTH,
        })
      );
      setErrors({ ...defaultErr, newPassword: true });
    }

    if (newPassword) {
      if (!confirmNewPassword) {
        setConfirmNewPasswordChangeHelperTextValue(IS_REQUIRED);
        setErrors({ ...defaultErr, confirmNewPassword: true });
      } else if (confirmNewPassword !== newPassword) {
        setConfirmNewPasswordChangeHelperTextValue(t("Passwords don't match."));
        setErrors({ ...defaultErr, confirmNewPassword: true });
      }
    }
  };

  const onSignUp = (): void => {
    resetFormState();
    validateForm();
    // next to come the api call
  };

  return (
    <Container maxWidth="sm" className={classes.mainContainer}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Card>
            <CardMedia
              style={{
                display: "flex",
                paddingTop: "1em",
                paddingBottom: "1em",
              }}
            >
              <img
                src={brandingLogo}
                style={{
                  height: "60px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                alt={t("Login Branding Logo")}
              />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t("signup-create-information-message")}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {t("signup-owner-information-message")}
              </Typography>
              <form
                style={{ display: "flex", flexDirection: "column" }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="username"
                  label={t("Email")}
                  variant="outlined"
                  value={username}
                  required
                  error={errors.username}
                  onChange={(e) => onChange(e, setUserName)}
                  helperText={userNameHelperTextValue}
                />
                <TextField
                  id="password"
                  label={t("New password")}
                  variant="outlined"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  required
                  error={errors.newPassword}
                  onChange={(e) => onChange(e, setNewPassword)}
                  helperText={newPasswordChangeHelperTextValue}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={t("aria-toggle-password-visibility")}
                          onClick={(e) =>
                            onClick(e, showNewPassword, setShowNewPassword)
                          }
                        >
                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="confirm-password"
                  label={t("confirm new password")}
                  variant="outlined"
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  required
                  error={errors.confirmNewPassword}
                  onChange={(e) => onChange(e, setConfirmNewPassword)}
                  helperText={confirmNewPasswordChangeHelperTextValue}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={t("aria-toggle-password-visibility")}
                          onClick={(e) =>
                            onClick(
                              e,
                              showConfirmNewPassword,
                              setShowConfirmNewPassword
                            )
                          }
                        >
                          {showConfirmNewPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      color="default"
                      inputProps={{
                        "aria-label": "checkbox with default color",
                      }}
                    />
                  }
                  label="I accept ..."
                />
              </form>
            </CardContent>
            <CardActions>
              <Link to="/">{t("Log in instead")}</Link>
              <Button
                variant="contained"
                color="primary"
                onClick={onSignUp}
                disabled={emptyUsername}
                className={classes.Button}
              >
                {t("Sign Up")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignUpPage;
