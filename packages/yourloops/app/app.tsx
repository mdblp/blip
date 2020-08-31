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
import { Router, globalHistory } from "@reach/router";
import bows from 'bows';

import { initI18n } from '../lib/language';
import Login from '../pages/login';

class Yourloops {
  private log: Console;

  constructor() {
    this.log = bows('Yourloops');
  }

  public async init(): Promise<void> {
    this.log.info('Init');

    await initI18n();
    this.log.debug("i18next initialized");

    globalHistory.listen(({ location, action }) => {
      this.log.info({ location, action });
    });
  }

  public render(): void {
    const router = this.router();
    console.log(router);
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    renderDOM(router, div);
  }

  private router(): JSX.Element {
    return (
      <Router>
        <Login path="/" />
      </Router>
    );
  }
}

export default Yourloops;
