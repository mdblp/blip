/**
 * Copyright (c) 2022, Diabeloop
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

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { SessionTimeout, useAuth } from "../lib/auth";
import { UserRoles } from "../models/shoreline";
import { DefaultSnackbarContext, SnackbarContextProvider } from "../components/utils/snackbar";
import { getExternalTheme, getMainTheme } from "../components/theme";
import { makeStyles } from "@material-ui/styles";
import FooterLinks from "../components/footer-links";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import PatientConsentPage from "../pages/patient/patient-consent";
import { ConsentPage, LoginPage } from "../pages/login";
import { SignUpPage } from "../pages/signup";
import { ConfirmPasswordResetPage, RequestPasswordResetPage } from "../pages/password-reset";
import { MainPageLayout } from "../pages/main-page-layout";


const RENEW_CONSENT_PATH = "/renew-consent";
const NEW_CONSENT_PATH = "/new-consent";
const EXTERNAL_THEME_ROUTES = [NEW_CONSENT_PATH, RENEW_CONSENT_PATH, "/login", "/signup", "/request-password-reset", "/confirm-password-reset"];
const PUBLIC_ROUTES = ["/login", "/signup", "/request-password-reset", "/confirm-password-reset"];

const routeStyle = makeStyles(() => {
  return {
    public: {
      flex: "1 0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    private: {
      flex: "1 0 auto",
    },
  };
});

export function MainLayout(): JSX.Element {

  const { isLoggedIn, user } = useAuth();
  const classes = routeStyle();
  const location = useLocation();
  const currentRoute = location.pathname;
  const isCurrentRoutePublic = PUBLIC_ROUTES.includes(currentRoute);
  const style = isCurrentRoutePublic ? classes.public : classes.private;
  const theme = EXTERNAL_THEME_ROUTES.includes(currentRoute) ? getExternalTheme() : getMainTheme();
  let redirectTo = null;

  if (isCurrentRoutePublic && isLoggedIn) {
    redirectTo = "/";
  } else if (!isCurrentRoutePublic && !isLoggedIn) {
    redirectTo = "/login";
  } else if (currentRoute !== NEW_CONSENT_PATH && user && user.role === UserRoles.patient && user.shouldAcceptConsent()) {
    redirectTo = "/new-consent";
  } else if (currentRoute !== RENEW_CONSENT_PATH && currentRoute !== NEW_CONSENT_PATH && user && user.shouldRenewConsent()) {
    redirectTo = "/renew-consent";
  }

  return (
    <React.Fragment>
      {redirectTo ? <Redirect to={redirectTo} /> :
        <ThemeProvider theme={theme}>
          <SessionTimeout />
          <CssBaseline />
          <SnackbarContextProvider context={DefaultSnackbarContext}>
            <div className={style}>
              <Switch>
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={SignUpPage} />
                <Route exact path="/request-password-reset" component={RequestPasswordResetPage} />
                <Route exact path="/confirm-password-reset" component={ConfirmPasswordResetPage} />
                <Route exact path="/renew-consent" component={ConsentPage} />
                <Route exact path="/new-consent" component={PatientConsentPage} />
                <Route component={MainPageLayout} />
              </Switch>
            </div>
          </SnackbarContextProvider>
          <FooterLinks />
        </ThemeProvider>
      }
    </React.Fragment>
  );
}
