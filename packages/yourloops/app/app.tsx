/**
 * Copyright (c) 2020, Diabeloop
 * Main App file
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import * as React from 'react';
import { render as renderDOM } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import bows from 'bows';

import "fontsource-roboto";
import "branding/theme-base.css";
import "branding/theme.css";

import { initI18n } from '../lib/language';
import Login from '../pages/login';
import Main from '../pages/main';

class Yourloops {
  private log: Console;

  constructor() {
    this.log = bows("Yourloops");
  }

  public async init(): Promise<void> {
    this.log.info("Init");

    await initI18n();
    this.log.debug("i18next initialized");

    // globalHistory.listen(({ location, action }) => {
    //   this.log.info({ location, action });
    // });
  }

  public render(): void {
    const router = this.router();
    let div = document.getElementById("app");
    if (div === null) {
      div = document.createElement("div");
      div.id = "app";
      document.body.appendChild(div);
    }
    renderDOM(router, div);
  }

  private router(): JSX.Element {
    return (
      <Router>
        {/* 
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
        <Login path="/" />
        <Login path="/login" />
        <PatientData path="/patient" /> 
        */}
          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
            style={{ height: "100vh", display: "flex", flexDirection: "column" }}
          */}
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/login" component= {Login} />
            <Route path="/home" component={Main} />
          </Switch>
      </Router>
    );
  }
}

export default Yourloops;
