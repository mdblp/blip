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

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  TextField,
  Grid,
  Button,
  Typography,
} from "@material-ui/core";

import { t } from "../../lib/language";
import brandingLogo from "branding/logo.png";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RequestPasswordResetProps extends RouteComponentProps {
}

/**
 * ConfirmPasswordReset page
 */
function ConfirmPasswordReset(props: RequestPasswordResetProps) : JSX.Element {
  const [username, setUserName] = useState("");
  const [validateError, setValidateError ] = useState(false);
  const [helperTextValue, setHelperTextValue ] = useState("");

  const emptyUsername = _.isEmpty(username);
  function onUsernameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setUserName(event.target.value);
  }

  function onUsernameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setUserName(event.target.value);
  }

  function onUsernameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setUserName(event.target.value);
  }
  
  function onGotoLogin() {
    console.log("on back", props.history);
    // requires two back for going to login page
    props.history.push("/");
  }

  function onSendResetPassword() {
    if (_.isEmpty(username)) {
      setValidateError(true);
      return;
    }
    setValidateError(false);
  }

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
                  error={validateError || emptyUsername}
                  onChange={onUsernameChange}
                  helperText={helperTextValue}
                />
                <TextField
                  id="password"
                  label={t("New password")}
                  value={username}
                  required
                  error={validateError || emptyUsername}
                  onChange={onNewPasswordChange}
                  helperText={helperTextValue}
                />
                <TextField
                  id="confirm-password"
                  label={t("confirm new password")}
                  value={username}
                  required
                  error={validateError || emptyUsername}
                  onChange={onConfirmNewPasswordChange}
                  helperText={helperTextValue}
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

export default ConfirmPasswordReset;
