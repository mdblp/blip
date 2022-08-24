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

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import PatientDataPage from '../components/patient-data'
import { PatientProvider } from '../lib/patient/hook'
import DashboardLayout from '../components/layouts/dashboard-layout'
import HomePage from './home-page'
import InvalidRoute from '../components/invalid-route'
import ProfilePage from './profile'
import NotificationsPage from './notifications'

export function CaregiverLayout(): JSX.Element {
  return (
    <PatientProvider>
      <DashboardLayout>
        <Switch>
          <Route exact path="/not-found" component={InvalidRoute} />
          <Route exact path="/preferences" component={ProfilePage} />
          <Route exact path="/notifications" component={NotificationsPage} />
          <Route exact path="/home" component={HomePage} />
          <Route path="/patient/:patientId" component={PatientDataPage} />
          <Redirect exact from="/" to="/home" />
          <Redirect to="/not-found" />
        </Switch>
      </DashboardLayout>
    </PatientProvider>
  )
}
