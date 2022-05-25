/**
 * Copyright (c) 2021, Diabeloop
 * Main App file
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
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import "@fontsource/roboto";
import "branding/theme.css";

import appConfig from "../lib/config";
import { AuthContextProvider } from "../lib/auth";
import { MainLobby } from "./main-lobby";
import MetricsLocationListener from "../components/MetricsLocationListener";

const Yourloops = (): JSX.Element => {
  return (
    <Auth0Provider
      domain={appConfig.AUTH0_DOMAIN}
      clientId={appConfig.AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      useRefreshTokens
      audience="http://api-public:3000"
    >
      <BrowserRouter>
        <MetricsLocationListener />
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </BrowserRouter>
    </Auth0Provider>
  );
};

export default Yourloops;
