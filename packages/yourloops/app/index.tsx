/**
 * Copyright (c) 2021, Diabeloop
<<<<<<< HEAD
 * Main App file
=======
 * Patient nav bar
>>>>>>> Set up i18n with hooks
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

<<<<<<< HEAD
import * as React from "react";
import ReactDOM from "react-dom";
import Yourloops from "./app";

import { init as i18nInit } from "../lib/language";

// TODO: window.onerror

i18nInit().then(() => {
  let div = document.getElementById("app");
  if (div === null) {
    div = document.createElement("div");
    div.id = "app";
    document.body.appendChild(div);
  }
  ReactDOM.render(<Yourloops />, div);
});
=======
<<<<<<< HEAD:packages/yourloops/components/patient-nav-bar.tsx
import * as React from "react";

import HeaderBar from "./header-bar";

function PatientNavBar(): JSX.Element {
  return <HeaderBar />;
}

export default PatientNavBar;
=======
import '../lib/language';

import React from 'react';
import ReactDOM from 'react-dom';
import Yourloops from './app';

// TODO: window.onerror

let div = document.getElementById('app');
if (div === null) {
  div = document.createElement('div');
  div.id = 'app';
  document.body.appendChild(div);
}
ReactDOM.render(<Yourloops />, div);
>>>>>>> Set up i18n with hooks:packages/yourloops/app/index.tsx
>>>>>>> Set up i18n with hooks
