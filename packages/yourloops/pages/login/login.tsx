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
import { Link } from "react-router-dom";

import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import appConfig from "../../lib/config";

const loginStyle = makeStyles((theme: Theme) => {
  return {
    card: {
      textAlign: "center",
      padding: theme.spacing(4),
    },
    cardActions: {
      justifyContent: "center",
    },
  };
}, { name: "login-page-styles" });

function Login(): JSX.Element {
  const { loginWithRedirect } = useAuth0();
  const { t } = useTranslation("yourloops");
  const theme = useTheme();
  const classes = loginStyle();
  const isXSBreakpoint: boolean = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Container maxWidth="sm">
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Card className={classes.card}>
            <Box py="1em">
              <CardMedia>
                <img
                  src={`/branding_${appConfig.BRANDING}_logo.svg`}
                  height={isXSBreakpoint ? 50 : 60}
                  alt={t("alt-img-logo")}
                />
              </CardMedia>
            </Box>
            <CardContent>
              <Typography>
                {t("welcome-message")}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button
                id="login-button"
                variant="contained"
                color="primary"
                disableElevation
                onClick={loginWithRedirect}
              >
                {t("login")}
              </Button>
              <Link to="/signup">
                <Button
                  id="signup-button"
                  variant="contained"
                  color="primary"
                >
                  {t("signup-steppers-create-account")}
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
