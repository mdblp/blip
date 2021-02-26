/**
 * Copyright (c) 2021, Diabeloop
 * Request password reset page
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
import { useTranslation } from "react-i18next";
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

import brandingLogo from "branding/logo.png";
import { useAuth } from "../../lib/auth";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { REGEX_EMAIL } from "../../lib/utils";

const loginStyle = makeStyles((theme: Theme) => {
  return {
    mainContainer: { margin: "auto" },
    root: { minHeight: "100vh" },
    loginButton: {
      marginLeft: "auto !important",
    },
    Card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      // eslint-disable-next-line no-magic-numbers
      padding: theme.spacing(4),
    },
    CardContent: {
      textAlign: "start",
      // eslint-disable-next-line no-magic-numbers
      marginLeft: theme.spacing(4),
      // eslint-disable-next-line no-magic-numbers
      marginRight: theme.spacing(4),
    },
    CardActions: {
      // eslint-disable-next-line no-magic-numbers
      marginLeft: theme.spacing(4),
      // eslint-disable-next-line no-magic-numbers
      marginRight: theme.spacing(4),
      padding: theme.spacing(2),
    },
    TextField: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(1),
    },
  };
});

/**
 * Request password page
 */
function RequestPasswordResetPage(props: RouteComponentProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = loginStyle();
  const [username, setUserName] = React.useState("");
  const [validateError, setValidateError] = React.useState(false);
  const [helperTextValue, setHelperTextValue] = React.useState("");
  //const loginFormStyles = useState(["stage-transition-container-variant"]);
  const auth = useAuth();
  const emptyUsername = _.isEmpty(username);

  const onUsernameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setUserName(event.target.value);
  };

  const onBack = (): void => {
    // requires two back for going to login page
    props.history.go(-2); // eslint-disable-line no-magic-numbers
  };

  const isUserNameValid = (): boolean => {
    const err = _.isEmpty(username.trim()) || !REGEX_EMAIL.test(username);
    setValidateError(err);
    if (err) {
      setHelperTextValue("invalid-email");
    }
    return !err;
  };

  const onSendResetLink = (): void => {
    if (isUserNameValid()) {
      auth
        .sendPasswordResetEmail(username)
        .then(() => {
          props.history.push("/password-reset-confirmed");
        })
        .catch((reason: Error) => {
          setValidateError(true);
          setHelperTextValue(reason.message);
        });
    }
  };

  return (
    <Container maxWidth="sm" style={{ margin: "auto" }}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}>
        <Grid item xs={12}>
          <Card className={classes.Card}>
            <CardMedia
              style={{
                display: "flex",
                paddingTop: "1em",
                paddingBottom: "1em",
              }}>
              <img
                src={brandingLogo}
                alt={t("Login Branding Logo")}
                style={{
                  height: "60px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            </CardMedia>
            <CardContent className={classes.CardContent}>
              <Typography variant="h6" gutterBottom>
                {t("Forgot your password?")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("Please enter your email address.")}
              </Typography>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                noValidate
                autoComplete="off">
                <TextField
                  id="username"
                  className={classes.TextField}
                  margin="normal"
                  label={t("email")}
                  variant="outlined"
                  value={username}
                  required
                  error={validateError}
                  onBlur={() => isUserNameValid()}
                  onChange={onUsernameChange}
                  helperText={t(helperTextValue)}
                />
              </form>
            </CardContent>
            <CardActions className={classes.CardActions}>
              <Button variant="contained" color="secondary" onClick={onBack}>
                {t("common-cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onSendResetLink}
                disabled={emptyUsername}>
                {t("Send reset link")}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default RequestPasswordResetPage;
