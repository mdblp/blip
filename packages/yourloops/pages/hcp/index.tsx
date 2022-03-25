/**
 * Copyright (c) 2021, Diabeloop
 * HCPs main page
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
import { Redirect, Route, Switch } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { TeamContextProvider } from "../../lib/team";
import { DataContextProvider, DefaultDataContext } from "../../lib/data";
import PatientDataPage from "../../components/patient-data";
import ProfilePage from "../profile";
import NotificationsPage from "../notifications";
import PrimaryNavBar from "./primary-nav-bar";
import PatientListPage from "./patients/page";
import TeamsPage from "./teams-page";
import CertifyAccountPage from "./certify-account-page";

/**
 * Health care professional page
 */
function HcpPage(): JSX.Element {
  const authHook = useAuth();

  const user = authHook.user;

  if (user === null) {
    throw new Error("User must be looged-in");
  }

  return (
    <TeamContextProvider>
      <PrimaryNavBar />
      <Switch>
        <Route path="/teams" component={TeamsPage} />
        <Route path="/preferences" exact component={ProfilePage} />
        <Route path="/notifications" exact component={NotificationsPage} />
        <Route path={"/certify"} component={CertifyAccountPage} />
        <Route path="/patient/:patientId">
          <DataContextProvider context={DefaultDataContext}>
            <PatientDataPage />
          </DataContextProvider>
        </Route>
        <Route path="/patients" component={PatientListPage} />
        <Route path="/">
          <Redirect to={"/patients"} />
        </Route>
      </Switch>
    </TeamContextProvider>
  );
}

export default HcpPage;
