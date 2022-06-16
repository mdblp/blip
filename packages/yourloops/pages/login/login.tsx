/**
 * Copyright (c) 2021, Diabeloop
 * Login page
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
import { useAuth0 } from "@auth0/auth0-react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import appConfig from "../../lib/config";

const loginStyle = makeStyles((theme: Theme) => {
  return {
    card: {
      padding: theme.spacing(2),
    },
    cardContent: {
      textAlign: "center",
      margin: `${theme.spacing(2)}px 0`,
    },
    cardActions: {
      justifyContent: "center",
    },
  };
}, { name: "login-page-styles" });

function Login(): JSX.Element {
  const { loginWithRedirect, error, logout } = useAuth0();
  const { t } = useTranslation("yourloops");
  const { cardContent, card, cardActions } = loginStyle();

  const onClickLogout = async () => {
    await logout({ returnTo: window.location.origin });
  };

  return (
    <Container maxWidth="sm">
      <Card className={card} elevation={4}>
        <CardMedia>
          <img
            src={`/branding_${appConfig.BRANDING}_logo.svg`}
            height={35}
            alt={t("alt-img-logo")}
          />
        </CardMedia>
        <CardContent className={cardContent}>
          {error ?
            <Typography variant="h6">
              {t("valid-email-alert")}
            </Typography>
            :
            <Typography variant="h6">
              {t("welcome-message")}
            </Typography>
          }
        </CardContent>
        <CardActions className={cardActions}>
          <Button
            id="login-button"
            variant="contained"
            color="primary"
            disableElevation
            onClick={loginWithRedirect}
          >
            {t("login")}
          </Button>
          {error &&
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={onClickLogout}
            >
              {t("logout")}
            </Button>
          }
        </CardActions>
      </Card>
    </Container>
  );
}

export default Login;
