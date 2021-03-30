/**
 * Copyright (c) 2021, Diabeloop
 * Caregiver page index
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

import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bows from "bows";

import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { UserRoles } from "../../models/shoreline";
import { useAuth } from "../../lib/auth";
import { ShareUser, SharedUserContextProvider, getDirectShares, sharedUserInitialState, sharedUserReducer } from "../../lib/share";
import { DataContextProvider, DefaultDataContext } from "../../lib/data";
import InvalidRoute from "../../components/invalid-route";
import PrimaryNavBar from "../../components/header-bars/primary";
import PatientDataPage from "./patient-data";
import PatientListPage from "./patients/page";

const log = bows("CaregiverPage");
const defaultURL = "/caregiver/patients";

const pageStyles = makeStyles(
  (/* theme: Theme */) => {
    return {
      loadingProgress: {
        position: "absolute",
        top: "calc(50vh - 20px)",
        left: "calc(50vw - 20px)",
      },
    };
  },
  { name: "ylp-caregiver-page" }
);

/**
 * Health care professional page
 */
const CaregiverPage = (): JSX.Element => {
  const { t } = useTranslation("yourloops");
  const historyHook = useHistory();
  const authHook = useAuth();
  const classes = pageStyles();
  const [loading, setLoading] = React.useState(false);
  const [sharedUsersState, sharedUsersDispatch] = React.useReducer(sharedUserReducer, sharedUserInitialState);

  const pathname = historyHook.location.pathname;
  const userRole = authHook.user?.role;
  const session = authHook.session();
  const { errorMessage, sharedUsers } = sharedUsersState;

  const handleRefresh = (): void => {
    sharedUsersDispatch({ type: "reset" });
  };

  useEffect(() => {
    log.info("useEffect", { pathname, userRole });
    if (userRole !== UserRoles.caregiver) {
      // Only allow caregivers for this route
      document.title = t("brand-name");
      setTimeout(() => historyHook.push("/"), 1);
    } else if (/^\/caregiver\/?$/.test(pathname)) {
      log.info("Redirecting to the patients list", { from: pathname, to: defaultURL });
      document.title = t("brand-name");
      setTimeout(() => historyHook.push(defaultURL), 1);
    } else if (sharedUsers === null && session !== null && errorMessage === null && loading === false) {
      document.title = t("brand-name");
      setLoading(true);
      sharedUsersDispatch({ type: "set-session", session });
      getDirectShares(session)
        .then((result: ShareUser[]): void => {
          sharedUsersDispatch({ type: "set-users", sharedUsers: result });
        })
        .catch((reason: unknown) => {
          log.error(reason);
          sharedUsersDispatch({ type: "set-error", message: t("error-failed-display-patients") });
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [pathname, historyHook, userRole, session, t, errorMessage, sharedUsers, sharedUsersState, loading]);

  if (errorMessage !== null) {
    return (
      <div id="div-api-error-message" className="api-error-message">
        <Alert id="alert-api-error-message" severity="error" style={{ marginBottom: "1em" }}>
          {errorMessage}
        </Alert>
        <Button id="button-api-error-message" variant="contained" color="secondary" onClick={() => handleRefresh()}>
          {t("button-refresh-page-on-error")}
        </Button>
      </div>
    );
  }

  if (session === null || sharedUsersState.sharedUsers === null || loading) {
    return <CircularProgress disableShrink className={classes.loadingProgress} />;
  }

  return (
    <SharedUserContextProvider value={[sharedUsersState, sharedUsersDispatch]}>
      <DataContextProvider context={DefaultDataContext}>
        <PrimaryNavBar headerLogoURL={defaultURL} />
        <Switch>
          <Route path={defaultURL} exact={true} component={PatientListPage} />
          <Route path="/caregiver/patient/:patientId" component={PatientDataPage} />
          <Route path="/caregiver" exact={true} />
          <Route>
            <InvalidRoute defaultURL={defaultURL} />
          </Route>
        </Switch>
      </DataContextProvider>
    </SharedUserContextProvider>
  );
};

export default CaregiverPage;
