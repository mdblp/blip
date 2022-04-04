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

import { UserRoles } from "../models/shoreline";
import { useAuth } from "../lib/auth";
import { NotificationContextProvider } from "../lib/notifications";
import { TeamContextProvider } from "../lib/team";
import { DataContextProvider, DefaultDataContext } from "../lib/data";
import CaregiverPage from "./caregiver";
import ProfilePage from "./profile";
import { Redirect, Route, Switch } from "react-router-dom";
import NotificationsPage from "./notifications";
import TeamsPage from "./hcp/teams-page";
import CertifyAccountPage from "./hcp/certify-account-page";
import PatientListPage from "./hcp/patients/page";
import CaregiversPage from "./patient/caregivers/page";
import PatientTeamsPage from "./patient/teams/page";
import PatientDataPage from "../components/patient-data";
import MainHeader from "../components/header-bars/main-header";

export function MainLayout(): JSX.Element {
  const authHook = useAuth();
  const session = authHook.session();

  return (
    <React.Fragment>
      {session &&
        <NotificationContextProvider>
          <TeamContextProvider>
            <DataContextProvider context={DefaultDataContext}>
              <MainHeader />
              <Switch>
                <Route exact path="/preferences" component={ProfilePage} />
                <Route exact path="/notifications" component={NotificationsPage} />

                {session.user.role === UserRoles.hcp &&
                  <Switch>
                    <Route exact path="/teams" component={TeamsPage} />
                    <Route exact path="/certify" component={CertifyAccountPage} />
                    <Route path="/patient/:patientId" component={PatientDataPage} />
                    <Route exact path="/patients" component={PatientListPage} />
                    <Redirect exact from="/" to="/patients" />
                    <Redirect to="/not-found" />
                  </Switch>
                }

                {session.user.role === UserRoles.caregiver &&
                  <CaregiverPage>
                    <Switch>
                      <Route path="/patient/:patientId" component={PatientDataPage} />
                      <Route exact path="/patients" component={PatientListPage} />
                      <Redirect exact from="/" to="/patients" />
                      <Redirect to="/not-found" />
                    </Switch>
                  </CaregiverPage>
                }

                {session.user.role === UserRoles.patient &&
                  <Switch>
                    <Route exact path="/caregivers" component={CaregiversPage} />
                    <Route exact path="/teams" component={PatientTeamsPage} />
                    <Redirect exact from="/" to="/daily" />
                    <Route path="/" component={PatientDataPage} />
                  </Switch>
                }
              </Switch>
            </DataContextProvider>
          </TeamContextProvider>
        </NotificationContextProvider>
      }
    </React.Fragment>
  );
}
