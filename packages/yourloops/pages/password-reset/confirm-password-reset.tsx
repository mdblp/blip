/* eslint-disable no-unused-vars */
/**
 * Copyright (c) 2021, Diabeloop
 * COnfirm Password Reset page
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

import { t } from "../../lib/language";
import { REGEX_EMAIL } from "../../lib/utils";
import appConfig from "../../lib/config";
import brandingLogo from "branding/logo.png";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ConfirmPasswordResetProps extends RouteComponentProps {
}

const formStyle = makeStyles(( /* theme: Theme */) => {
  return {
    mainContainer: { margin: "auto" },
    Button: {
      marginLeft: "auto",
    },
  };
});

/**
 * ConfirmPasswordReset page
 */
function ConfirmPasswordResetPage(props: ConfirmPasswordResetProps) : JSX.Element {
  const [username, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors ] = useState({ username: false, newPassword: false, confirmNewPassword: false });
  const [userNameHelperTextValue, setUserNameHelperTextValue ] = useState("");
  const [newPasswordChangeHelperTextValue, setNewPasswordChangeHelperTextValue ] = useState("");
  const [confirmNewPasswordChangeHelperTextValue, setConfirmNewPasswordChangeHelperTextValue ] = useState("");
  const emptyUsername = _.isEmpty(username);
  const defaultErr = { username: false, newPassword: false, confirmNewPassword: false };
  const classes = formStyle();

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
    setErrors(defaultErr);
    setUserNameHelperTextValue("");
    setNewPasswordChangeHelperTextValue("");
    setConfirmNewPasswordChangeHelperTextValue("");
  };

  const validateForm = (): void => {
    // for now duplicated blip validation logic
    // Is there a better way to handle errors...
    if (_.isEmpty(username)) {
      setErrors(Object.assign(defaultErr,{ username: true }));
    }

    const IS_REQUIRED = t('This field is required.');

    if (!username) {
      setUserNameHelperTextValue(IS_REQUIRED);
      setErrors(Object.assign(defaultErr,{ username: true }));
    }

    if (username && !REGEX_EMAIL.test(username)) {
      setUserNameHelperTextValue(t('Invalid email address.'));
      setErrors(Object.assign(defaultErr,{ username: true }));
    }

    if (!newPassword) {
      setNewPasswordChangeHelperTextValue(IS_REQUIRED);
      setErrors(Object.assign(defaultErr,{ newPassword: true }));
    }

    if (newPassword && newPassword.length < appConfig.PASSWORD_MIN_LENGTH) {
      setNewPasswordChangeHelperTextValue(t('Password must be at least {{minLength}} characters long.', { minLength: appConfig.PASSWORD_MIN_LENGTH }));
      setErrors(Object.assign(defaultErr,{ newPassword: true }));
    }
    
    if (newPassword) {
      if (!confirmNewPassword) {
        setConfirmNewPasswordChangeHelperTextValue(IS_REQUIRED);
        setErrors(Object.assign(defaultErr,{ confirmNewPassword: true }));
      } else if (confirmNewPassword !== newPassword) {
        setConfirmNewPasswordChangeHelperTextValue(t('Passwords don\'t match.'));
        setErrors(Object.assign(defaultErr,{ confirmNewPassword: true }));
      }
    }

  };

  const onSendResetPassword = (): void => {
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
                  error={errors.username}
                  onChange={onUsernameChange}
                  helperText={userNameHelperTextValue}
                />
                <TextField
                  id="password"
                  label={t("New password")}
                  value={newPassword}
                  required
                  error={errors.newPassword}
                  onChange={onNewPasswordChange}
                  helperText={newPasswordChangeHelperTextValue}
                />
                <TextField
                  id="confirm-password"
                  label={t("confirm new password")}
                  value={confirmNewPassword}
                  required
                  error={errors.confirmNewPassword}
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
                className={classes.Button}
              >
                {t('Cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onSendResetPassword}
                disabled={emptyUsername}
                className={classes.Button}
              >
                {t('Save')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ConfirmPasswordResetPage;
