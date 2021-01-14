/**
 * Copyright (c) 2020, Diabeloop
 * Health care pro nav bar
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

import * as React from "react";
import { globalHistory } from "@reach/router";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { t } from "../lib/language";
import HeaderBar from './header-bar';

function clickPatients() {
  globalHistory.navigate("/hcp/patients");
}

function clickCareTeams() {
  globalHistory.navigate("/hcp/careteams");
}

function HcpNavBar() : JSX.Element {
  const isPatientsPath = globalHistory.location.pathname.startsWith("/hcp/patient");

  return (
    <HeaderBar>
      <Tabs value={isPatientsPath ? 0 : 1} indicatorColor="primary" textColor="primary" centered>
        <Tab label={t("Patients")} onClick={clickPatients} />
        <Tab label={t("Care teams")} onClick={clickCareTeams} />
      </Tabs>
    </HeaderBar>
  );
}

export default HcpNavBar;
