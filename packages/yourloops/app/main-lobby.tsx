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

import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { makeStyles, Theme, ThemeProvider, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { SessionTimeout, useAuth } from "../lib/auth";
import { getTheme } from "../components/theme";
import { DefaultSnackbarContext, SnackbarContextProvider } from "../components/utils/snackbar";
import Footer from "../components/footer/footer";
import PatientConsentPage from "../pages/patient/patient-consent";
import { ConsentPage, LoginPage } from "../pages/login";
import { SignUpPage } from "../pages/signup";
import { MainLayout } from "../pages/main-layout";
import InvalidRoute from "../components/invalid-route";

const RENEW_CONSENT_PATH = "/renew-consent";
const NEW_CONSENT_PATH = "/new-consent";
const PUBLIC_ROUTES = ["/login", "/signup"];
const EXTERNAL_THEME_ROUTES = [NEW_CONSENT_PATH, RENEW_CONSENT_PATH, ...PUBLIC_ROUTES];

interface StyleProps {
  color: string;
}

const routeStyle = makeStyles<Theme, StyleProps>(() => {
  return {
    "@global": {
      body: {
        backgroundColor: ({ color }) => color,
      },
    },
    "public": {
      flex: "1 0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "private": {
      flex: "1 0 auto",
    },
  };
});

export function MainLobby(): JSX.Element {
  const { isLoading, isAuthenticated } = useAuth0();
  const { user } = useAuth();
  const location = useLocation();
  const currentRoute = location.pathname;
  const isCurrentRoutePublic = PUBLIC_ROUTES.includes(currentRoute);
  const theme = getTheme();
  const { palette } = useTheme();
  const classes = routeStyle({
    color: EXTERNAL_THEME_ROUTES.includes(currentRoute) ? palette.background.default : palette.background.paper,
  });
  const style = isCurrentRoutePublic ? classes.public : classes.private;
  const renewConsentPath = currentRoute === RENEW_CONSENT_PATH || currentRoute === NEW_CONSENT_PATH;
  let redirectTo = null;

  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    if (firstLoading && !isLoading) {
      setFirstLoading(false);
    }
  }, [firstLoading, isAuthenticated, isLoading]);

  if (!isCurrentRoutePublic && isLoading) {
    return <React.Fragment />;
  }

  if (isCurrentRoutePublic && isAuthenticated) {
    redirectTo = "/";
  } else if (!isAuthenticated && !isCurrentRoutePublic) {
    redirectTo = "/login";
  } else if (!renewConsentPath && user && user.isUserPatient() && user.shouldAcceptConsent()) {
    redirectTo = "/new-consent";
  } else if (!renewConsentPath && user && user.shouldRenewConsent()) {
    redirectTo = "/renew-consent";
  }

  return (
    <React.Fragment>
      {redirectTo ? <Redirect to={redirectTo} /> : (
        !firstLoading &&
        <ThemeProvider theme={theme}>
          <SessionTimeout />
          <CssBaseline />
          <SnackbarContextProvider context={DefaultSnackbarContext}>
            <div className={style}>
              <Switch>
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={SignUpPage} />
                <Route exact path="/renew-consent" component={ConsentPage} />
                <Route exact path="/new-consent" component={PatientConsentPage} />
                <Route exact path="/not-found" component={InvalidRoute} />
                <Route component={MainLayout} />
              </Switch>
            </div>
          </SnackbarContextProvider>
          <Footer />
        </ThemeProvider>
      )}
    </React.Fragment>
  );
}
