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

import _ from "lodash";
import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import "@fontsource/roboto";
import "branding/theme.css";

import metrics from "../lib/metrics";
import { AuthContextProvider } from "../lib/auth";
import { MainLayout } from "./main-layout";

/** Tell matomo the page is changed, but with a little delay, because of some async stuff */
const trackPageView = _.debounce(() => {
  metrics.send("metrics", "trackPageView");
}, 1000);
const RE_PATIENT_URL = /^\/[0-9a-f]+\/?(.*)/;
const RE_CAREGIVER_URL = /^\/patient\/[0-9a-f]+\/?(.*)/;
const RE_HCP_URL = /^\/patient\/[0-9a-f]+\/?(.*)/;
const CONFIDENTIALS_PARAMS = ["signupEmail", "signupKey", "resetKey", "login"];

function MetricsLocationListener(): null {
  const location = useLocation();
  const locPathname = location.pathname;
  const locSearch = location.search;

  React.useEffect(() => {
    let pathname: string | null = null;
    let match = locPathname.match(RE_PATIENT_URL);
    if (match !== null) {
      pathname = `/userid/${match[1]}`;
    }
    match = pathname === null ? locPathname.match(RE_CAREGIVER_URL) : null;
    if (match !== null) {
      pathname = `/patient/userid/${match.length > 1 ? match[1] : ""}`;
    }
    match = pathname === null ? locPathname.match(RE_HCP_URL) : null;
    if (match !== null) {
      pathname = `/patient/userid/${match.length > 1 ? match[1] : ""}`;
    }

    if (pathname === null) {
      pathname = locPathname;
    }

    const searchParams = new URLSearchParams(locSearch);
    let nParams = 0;
    searchParams.forEach((value: string, key: string) => {
      if (CONFIDENTIALS_PARAMS.includes(key)) {
        pathname = `${pathname}${nParams > 0 ? "&" : "?"}${key}=confidential`;
      } else {
        pathname = `${pathname}${nParams > 0 ? "&" : "?"}${key}=${value}`;
      }
      nParams++;
    });

    metrics.send("metrics", "setCustomUrl", pathname);
    trackPageView();
  }, [locPathname, locSearch]);
  return null;
}

const Yourloops = (): JSX.Element => {
  return (
    <Router>
      <MetricsLocationListener />
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </Router>
  );
};

export default Yourloops;
