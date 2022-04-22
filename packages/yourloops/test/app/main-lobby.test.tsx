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
import { createMemoryHistory, MemoryHistory } from "history";
import { Router } from "react-router-dom";

import { AuthContext, AuthContextProvider } from "../../lib/auth";
import { loggedInUsers } from "../common";
import { createAuthHookStubs } from "../lib/auth/utils";
import { MainLobby } from "../../app/main-lobby";
import renderer, { ReactTestRenderer } from "react-test-renderer";
import { Consent } from "../../models/shoreline";
import { ConsentPage, LoginPage } from "../../pages/login";
import PatientConsentPage from "../../pages/patient/patient-consent";
import HcpPatientListPage from "../../pages/hcp/patients/page";
import { SignUpPage } from "../../pages/signup";
import { ConfirmPasswordResetPage, RequestPasswordResetPage } from "../../pages/password-reset";

describe("Main lobby", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const authPatient = loggedInUsers.patientSession;
  const authHookPatient: AuthContext = createAuthHookStubs(authPatient);
  const authHcpWithConsent = loggedInUsers.hcpSession;
  authHcpWithConsent.user.profile.termsOfUse = {
    acceptanceTimestamp: new Date().toString(),
    isAccepted: true,
  } as Consent;
  authHcpWithConsent.user.profile.privacyPolicy = {
    acceptanceTimestamp: new Date().toString(),
    isAccepted: true,
  } as Consent;
  const authHookHcpWithSession: AuthContext = createAuthHookStubs(authHcpWithConsent);

  function renderMainLayout(history: MemoryHistory, authContext: AuthContext) {
    return renderer.create(
      <Router history={history}>
        <AuthContextProvider value={authContext}>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    );
  }
  function checkRenderAndRoute(currentComponent: ReactTestRenderer, history: MemoryHistory, expectedComponent: () => JSX.Element, route: string) {
    const mainPageLayout = currentComponent.root.findByType(expectedComponent);
    expect(mainPageLayout).toBeDefined();
    expect(history.location.pathname).toBe(route);
  }

  it("should display the HcpPatientListPage when hcp is logged in and route is /home", () => {
    const history = createMemoryHistory({ initialEntries: ["/home"] });
    const component = renderMainLayout(history, authHookHcpWithSession);
    checkRenderAndRoute(component, history, HcpPatientListPage, "/home");
  });

  it("should redirect to home page when user is logged in as a hcp and route is '/'", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const component = renderMainLayout(history, authHookHcpWithSession);
    checkRenderAndRoute(component, history, HcpPatientListPage, "/home");
  });

  it("should redirect to home page when user is logged in as a hcp and route is '/login'", () => {
    const history = createMemoryHistory({ initialEntries: ["/login"] });
    const component = renderMainLayout(history, authHookHcpWithSession);
    checkRenderAndRoute(component, history, HcpPatientListPage, "/home");
  });

  it("should render ConsentPage when user is logged in and did not consent and route is '/'", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const component = renderMainLayout(history, authHookHcp);
    checkRenderAndRoute(component, history, ConsentPage, "/renew-consent");
  });

  it("should render PatientConsentPage when user is logged in and did not consent and route is '/' and role is patient", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const component = renderMainLayout(history, authHookPatient);
    checkRenderAndRoute(component, history, PatientConsentPage, "/new-consent");
  });

  it("should render LoginPage when user is not logged in route is '/login'", () => {
    const history = createMemoryHistory({ initialEntries: ["/login"] });
    const component = renderMainLayout(history, null);
    checkRenderAndRoute(component, history, LoginPage, "/login");
  });

  it("should render SignUpPage when user is not logged in route is '/signup'", () => {
    const history = createMemoryHistory({ initialEntries: ["/signup"] });
    const component = renderMainLayout(history, null);
    checkRenderAndRoute(component, history, SignUpPage, "/signup");
  });

  it("should render RequestPasswordResetPage when user is not logged in route is '/request-password-reset'", () => {
    const history = createMemoryHistory({ initialEntries: ["/request-password-reset"] });
    const component = renderMainLayout(history, null);
    checkRenderAndRoute(component, history, RequestPasswordResetPage, "/request-password-reset");
  });

  it("should render ConfirmPasswordResetPage when user is not logged in route is '/confirm-password-reset'", () => {
    const history = createMemoryHistory({ initialEntries: ["/confirm-password-reset"] });
    const component = renderMainLayout(history, null);
    checkRenderAndRoute(component, history, ConfirmPasswordResetPage, "/confirm-password-reset");
  });

});

