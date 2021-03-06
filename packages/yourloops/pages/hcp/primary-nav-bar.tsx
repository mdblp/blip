/**
 * Copyright (c) 2021, Diabeloop
 * Health care pro nav bar
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

import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import HeaderBar from "../../components/header-bars/primary";

const tabStyle: React.CSSProperties = { color: "black" };

function HcpNavBar(): JSX.Element {
  const historyHook = useHistory();
  const { t } = useTranslation("yourloops");
  const location = historyHook.location.pathname;

  let currentTab: number | boolean = false;
  if (location.startsWith("/professional/patients")) {
    currentTab = 0;
  } else if (location.startsWith("/professional/teams")) {
    currentTab = 1;
  }

  return (
    <HeaderBar>
      <Tabs id="hcp-tabs" value={currentTab} indicatorColor="primary" textColor="primary" centered>
        <Tab id="hcp-tab-patients" style={tabStyle} label={t("hcp-tab-patients")} component={Link} to="/professional/patients" />
        <Tab id="hcp-tab-teams" style={tabStyle} label={t("hcp-tab-teams")} component={Link} to="/professional/teams" />
      </Tabs>
    </HeaderBar>
  );
}

export default HcpNavBar;
