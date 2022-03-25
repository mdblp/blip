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

import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bows from "bows";

import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useAuth } from "../../lib/auth";
import {
  ShareUser,
  SharedUserContextProvider,
  getDirectShares,
  sharedUserInitialState,
  sharedUserReducer,
} from "../../lib/share";
import { DataContextProvider, DefaultDataContext } from "../../lib/data";
import { setPageTitle } from "../../lib/utils";
import PrimaryNavBar from "../../components/header-bars/primary";
import ProfilePage from "../profile";
import NotificationsPage from "../notifications";
import PatientDataPage from "./patient-data";
import PatientListPage from "./patients/page";

const log = bows("CaregiverPage");

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

const CaregiverRoutes = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/preferences" exact component={ProfilePage} />
      <Route path="/notifications" exact component={NotificationsPage} />
      <Route path="/patient/:patientId" component={PatientDataPage} />
      <Route path="/patients" component={PatientListPage} />
      <Route path="/">
        <Redirect to="/patients" />
      </Route>
    </Switch>
  );
};

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

  const session = authHook.session();
  const { errorMessage, sharedUsers } = sharedUsersState;
  const { pathname } = historyHook.location;

  const handleRefresh = (): void => {
    sharedUsersDispatch({ type: "reset" });
  };

  React.useEffect(() => {
    if (session === null) {
      throw new Error("User must be looged-in");
    }
    if (sharedUsers === null && errorMessage === null && !loading) {
      setPageTitle();
      setLoading(true);
      getDirectShares(session)
        .then((result: ShareUser[]): void => {
          sharedUsersDispatch({ type: "set-users", sharedUsers: result });
        })
        .catch((reason: unknown) => {
          log.error(reason);
          sharedUsersDispatch({ type: "set-error", message: t("error-failed-display-patients") });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [historyHook, pathname, session, t, errorMessage, sharedUsers, loading]);

  let content: JSX.Element;
  if (errorMessage !== null) {
    content = (
      <div id="div-api-error-message" className="api-error-message">
        <Alert id="alert-api-error-message" severity="error" style={{ marginBottom: "1em" }}>
          {errorMessage}
        </Alert>
        <Button id="button-api-error-message" variant="contained" color="secondary" onClick={() => handleRefresh()}>
          {t("button-refresh-page-on-error")}
        </Button>
      </div>
    );
  } else if (session === null || sharedUsersState.sharedUsers === null || loading) {
    content = <CircularProgress disableShrink className={classes.loadingProgress} />;
  } else {
    content = <CaregiverRoutes />;
  }

  return (
    <SharedUserContextProvider value={[sharedUsersState, sharedUsersDispatch]}>
      <DataContextProvider context={DefaultDataContext}>
        <PrimaryNavBar />
        {content}
      </DataContextProvider>
    </SharedUserContextProvider>
  );
};

export default CaregiverPage;
