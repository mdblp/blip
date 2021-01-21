/* eslint-disable no-unused-vars */
/**
 * Copyright (c) 2021, Diabeloop
 * RequestPasswordReset page
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import _ from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { t } from "../../lib/language";
import { REGEX_EMAIL } from "../../lib/utils";
import appConfig from "../../lib/config";
import brandingLogo from "branding/logo.png";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RequestPasswordResetProps extends RouteComponentProps {
}

/**
 * ConfirmPasswordReset page
 */
function ConfirmPasswordResetPage(props: RequestPasswordResetProps) : JSX.Element {
  const [username, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [validateError, setValidateError ] = useState(false);
  const [userNameHelperTextValue, setUserNameHelperTextValue ] = useState("");
  const [newPasswordChangeHelperTextValue, setNewPasswordChangeHelperTextValue ] = useState("");
  const [confirmNewPasswordChangeHelperTextValue, setConfirmNewPasswordChangeHelperTextValue ] = useState("");
  const emptyUsername = _.isEmpty(username);

  const onUsernameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setUserName(event.target.value);
  };

  const onNewPasswordChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setNewPassword(event.target.value);
  };

  const onConfirmNewPasswordChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setConfirmNewPassword(event.target.value);
  };
  
  const onGotoLogin = (): void => {
    props.history.push("/");
  };

  const resetFormState = (): void => {
    setValidateError(false);
    setUserNameHelperTextValue("");
    setNewPasswordChangeHelperTextValue("");
    setConfirmNewPasswordChangeHelperTextValue("");
  };

  const validateForm = (): void => {
    
    if (_.isEmpty(username)) {
      setValidateError(true);
      return;
    }

    const IS_REQUIRED = t('This field is required.');

    if (!username) {
      setUserNameHelperTextValue(IS_REQUIRED);
      setValidateError(true);
    }

    if (username && !REGEX_EMAIL.test(username)) {
      setUserNameHelperTextValue(t('Invalid email address.'));
      setValidateError(true);
    }

    if (!newPassword) {
      setNewPasswordChangeHelperTextValue(IS_REQUIRED);
      setValidateError(true);
    }

    if (newPassword && newPassword.length < appConfig.PASSWORD_MIN_LENGTH) {
      setNewPasswordChangeHelperTextValue(t('Password must be at least {{minLength}} characters long.', { minLength: appConfig.PASSWORD_MIN_LENGTH }));
      setValidateError(true);
    }
    if (newPassword) {
      if (!confirmNewPassword) {
        setConfirmNewPasswordChangeHelperTextValue(IS_REQUIRED);
        setValidateError(true);
      } else if (confirmNewPassword !== newPassword) {
        setConfirmNewPasswordChangeHelperTextValue(t('Passwords don\'t match.'));
        setValidateError(true);
      }
    }

  };

  const onSendResetPassword = (): void => {

    resetFormState();

    validateForm();

  };

  return (
    <Container maxWidth="sm" style={{ margin: "auto" }}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <Card>
            <CardMedia style={{ display: "flex", paddingTop: "1em", paddingBottom: "1em" }}>
              <img src={brandingLogo} style={{ height: "60px", marginLeft: "auto", marginRight: "auto" }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('Change your password')}
              </Typography>
              <form style={{ display: "flex", flexDirection: "column" }} noValidate autoComplete="off">
                <TextField
                  id="username"
                  label={t("Email")}
                  value={username}
                  required
                  error={validateError}
                  onChange={onUsernameChange}
                  helperText={userNameHelperTextValue}
                />
                <TextField
                  id="password"
                  label={t("New password")}
                  value={newPassword}
                  required
                  error={validateError}
                  onChange={onNewPasswordChange}
                  helperText={newPasswordChangeHelperTextValue}
                />
                <TextField
                  id="confirm-password"
                  label={t("confirm new password")}
                  value={confirmNewPassword}
                  required
                  error={validateError}
                  onChange={onConfirmNewPasswordChange}
                  helperText={confirmNewPasswordChangeHelperTextValue}
                />
              </form>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={onGotoLogin}
              >
                {t('button-cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onSendResetPassword}
                disabled={emptyUsername}
              >
                {t('button-save')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ConfirmPasswordResetPage;
