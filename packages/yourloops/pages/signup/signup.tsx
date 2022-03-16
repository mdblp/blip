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

import React from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SignUpStepper from "./signup-stepper";
import { SignUpFormStateProvider } from "./signup-formstate-context";
import appConfig from "../../lib/config";

const formStyle = makeStyles((theme: Theme) => {
  return {
    mainContainer: { margin: "auto" },
    Button: {
      marginLeft: "auto !important",
    },
    Typography: {
      alignItems: "center",
    },
    Card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      paddingTop: theme.spacing(4),
      paddingBottom: 0,
      marginTop: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
      },
    },
    CardContent: {
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(2),
      },
    },
    logoHeader: {
      [theme.breakpoints.up("sm")]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
    },
  };
}, { name: "signup-page-styles" });

/**
 * Signup page
 */
function SignUpPage(): JSX.Element {
  const { t } = useTranslation("yourloops");
  const classes = formStyle();
  const theme = useTheme();
  const isXSBreakpoint: boolean = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Container maxWidth="sm" className={classes.mainContainer}>
      <Grid container spacing={0} alignItems="center" justify="center">
        <Grid item xs={12}>
          <SignUpFormStateProvider>
            <Card id="card-signup" className={classes.Card}>
              <CardMedia className={classes.logoHeader}>
                <img src={`/branding_${appConfig.BRANDING}_logo.svg`} height={isXSBreakpoint ? 50 : 60} alt={t("alt-img-logo")} />
              </CardMedia>
              <CardContent className={classes.CardContent}>
                <SignUpStepper />
              </CardContent>
            </Card>
          </SignUpFormStateProvider>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignUpPage;
