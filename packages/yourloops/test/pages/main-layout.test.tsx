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
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import * as auth0Mock from "@auth0/auth0-react";
import { Auth0Provider } from "@auth0/auth0-react";

import { AuthContext, AuthContextProvider } from "../../lib/auth";
import { loggedInUsers } from "../common";
import { createAuthHookStubs } from "../lib/auth/utils";
import { MainLayout } from "../../pages/main-layout";
import PatientDataPage from "../../components/patient-data";
import HomePage from "../../pages/home-page";
import * as shareLib from "../../lib/share";

jest.mock("../../lib/share");

jest.mock("@auth0/auth0-react");

describe("Main layout", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authCaregiver = loggedInUsers.caregiverSession;
  const authPatient = loggedInUsers.patientSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const authHookCaregiver: AuthContext = createAuthHookStubs(authCaregiver);
  const authHookPatient: AuthContext = createAuthHookStubs(authPatient);

  function renderMainPageLayout(authContext: AuthContext) {
    return renderer.create(
      <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
        <BrowserRouter>
          <AuthContextProvider value={authContext}>
            <MainLayout />
          </AuthContextProvider>
        </BrowserRouter>
      </Auth0Provider>
    );
  }

  beforeAll(() => {
    jest.spyOn(shareLib, "getDirectShares").mockResolvedValue([]);
  });

  beforeEach(() => {
    (auth0Mock.withAuthenticationRequired as jest.Mock) = jest.fn().mockImplementation((component) => {
      return component;
    });
    (auth0Mock.Auth0Provider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("should render HomePage when current user has hcp role", () => {
    const component = renderMainPageLayout(authHookHcp);
    const hcpPage = component.root.findByType(HomePage);
    expect(hcpPage).toBeDefined();
  });

  it("should render HomePage when current user has caregiver role", () => {
    const component = renderMainPageLayout(authHookCaregiver);
    const caregiverPage = component.root.findByType(HomePage);
    expect(caregiverPage).toBeDefined();
  });

  it("should render PatientPage when current user has patient role", () => {
    const component = renderMainPageLayout(authHookPatient);
    const patientPage = component.root.findByType(PatientDataPage);
    expect(patientPage).toBeDefined();
  });
});

