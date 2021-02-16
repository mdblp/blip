/**
 * Copyright (c) 2021, Diabeloop
 * HCP team page tests
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

// import _ from "lodash";
import * as React from "react";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import { expect } from "chai";
import { mount, ReactWrapper, MountRendererProps } from "enzyme";
import sinon from "sinon";

// import { t } from "../../../lib/language";
import { CustomAuthProvider } from "../../../lib/auth";
import { TeamContextProvider } from "../../../lib/team";
import TeamsPage from "../../../pages/hcp/teams-page";

import { waitTimeout } from "../../../lib/utils";
// import { authHook } from "../../lib/auth/hook.test";
import { teams } from "../../common";
import { TestAuthProviderHCP } from "../../lib/auth/hook.test";
import { teamAPI, resetTeamAPIStubs } from "../../lib/team/hook.test";

function testTeamPage(): void {
  const apiTimeout = 50;
  const mountOptions: MountRendererProps = {
    attachTo: null,
  };
  let component: ReactWrapper | null = null;

  function TestTeamsPageComponent(): JSX.Element {
    return (
      <CustomAuthProvider provider={TestAuthProviderHCP}>
        <TeamContextProvider api={teamAPI} >
          <TeamsPage />
        </TeamContextProvider>
      </CustomAuthProvider>
    );
  }

  async function createComponent(): Promise<ReactWrapper> {
    const page = mount(<TestTeamsPageComponent />, mountOptions);

    expect(document.getElementById("team-page-loading-progress")).to.be.not.null;
    expect((teamAPI.fetchPatients as sinon.SinonStub).calledOnce).to.be.true;
    expect((teamAPI.fetchTeams as sinon.SinonStub).calledOnce).to.be.true;
    page.update();
    await waitTimeout(0);
    return page;
  }

  before(() => {
    mountOptions.attachTo = document.getElementById("app");
    if (mountOptions.attachTo === null) {
      mountOptions.attachTo = document.createElement("div");
      mountOptions.attachTo.id = "app";
      document.body.appendChild(mountOptions.attachTo);
    }
  });
  after(() => {
    const { attachTo } = mountOptions;
    if (attachTo instanceof HTMLElement) {
      document.body.removeChild(attachTo);
    }
  });

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
      expect(document.getElementById("team-page-loading-progress")).to.be.null;
      expect(document.getElementById("div-api-error-message")).to.be.null;
      expect(document.getElementById("team-page-grid-list")).to.be.null;
    }
    resetTeamAPIStubs();
  });

  it("should show the loading progress when mounting", async () => {
    const longWaitPromise = async () => {
      await waitTimeout(apiTimeout);
      return [];
    };
    (teamAPI.fetchTeams as sinon.SinonStub).returns(longWaitPromise());
    component = await createComponent();
    await waitTimeout(2 * apiTimeout);
    expect(document.getElementById("team-page-loading-progress")).to.be.null;
    expect(document.getElementById("team-page-grid-list")).to.be.not.null;
  });

  it("should display an error message if loading failed", async () => {
    (teamAPI.fetchTeams as sinon.SinonStub).rejects(new Error("Test error"));

    component = await createComponent();
    expect(document.getElementById("team-page-loading-progress"), "team-page-loading-progress").to.be.null;
    expect(document.getElementById("div-api-error-message"), "div-api-error-message").to.be.not.null;
  });

  it("should display the team list on successful loading", async () => {
    component = await createComponent();
    expect(document.getElementById("team-page-grid-list")).to.be.not.null;
  });

  describe("onShowLeaveTeamDialog", () => {
    it("should display the leave dialog, and call the api on validate", async () => {
      component = await createComponent();
      expect(component.exists("#team-leave-dialog-title"), "#team-leave-dialog-title not exists").to.be.false;
      expect(component.exists("#team-page-alert"), "#team-page-alert not exists").to.be.false;
      expect(document.getElementById("team-page-alert"), "#team-page-alert exists").to.be.null;

      let buttonId = `team-card-${teams[1].id}-button-leave-team`;
      const button = document.getElementById(buttonId) as HTMLButtonElement;
      expect(button, buttonId).to.be.not.null;

      button.click();

      await waitTimeout(apiTimeout);
      component.update();

      expect(component.exists("#team-leave-dialog-title"), "team-leave-dialog-title exists").to.be.true;

      buttonId = "team-leave-dialog-button-leave";
      expect(component.exists(`#${buttonId}`), buttonId).to.be.true;
      component.find(`#${buttonId}`).last().simulate("click");

      component.update();
      await waitTimeout(apiTimeout);

      expect((teamAPI.leaveTeam as sinon.SinonStub).calledOnce, "leaveTeam calledOnce").to.be.true;
      expect(document.getElementById("team-page-alert"), "#team-page-alert exists").to.be.not.null;
    });

    // it("should display the leave dialog, and call the api on validate", async () => {
    //   const leaveTeamStub = apiClient.leaveTeam as sinon.SinonStub;
    //   const teamUpdates = _.cloneDeep(teams);
    //   teamUpdates.splice(0, 1);
    //   leaveTeamStub.resolves(teamUpdates);

    //   component = await createComponent();
    //   const teamPage = component.find(TeamsPage).instance() as TeamsPage;
    //   const showDialog = teamPage.onShowLeaveTeamDialog(team0);
    //   await waitTimeout(apiTimeout);
    //   component.update();
    //   component.find("#team-leave-dialog-button-leave").last().simulate("click");

    //   await showDialog;
    //   expect(leaveTeamStub.calledOnce, "calledOnce").to.be.true;
    //   expect(leaveTeamStub.calledWith(team0), "calledWith").to.be.true;

    //   expect(teamPage.state.apiReturnAlert).to.be.deep.equal({ message: t("team-page-leave-success"), severity: "success" });
    // });

    // it("should display an error alert if the api call failed", async () => {
    //   const errorMessage = "API error message";
    //   const leaveTeamStub = apiClient.leaveTeam as sinon.SinonStub;
    //   leaveTeamStub.rejects(new Error(errorMessage));

    //   component = await createComponent();
    //   const teamPage = component.find(TeamsPage).instance() as TeamsPage;
    //   const showDialog = teamPage.onShowLeaveTeamDialog(team0);
    //   await waitTimeout(apiTimeout);
    //   component.update();
    //   component.find("#team-leave-dialog-button-leave").last().simulate("click");

    //   await showDialog;
    //   expect(leaveTeamStub.calledOnce, "calledOnce").to.be.true;
    //   expect(leaveTeamStub.calledWith(team0), "calledWith").to.be.true;

    //   const apiReturnAlert = teamPage.state.apiReturnAlert;
    //   const apiReturnAlertExpected = {
    //     message: t("team-page-failed-leave", { errorMessage }),
    //     severity: "error",
    //   };
    //   expect(apiReturnAlert, JSON.stringify({ apiReturnAlert, apiReturnAlertExpected })).to.be.deep.equal(apiReturnAlertExpected);
    // });
  });

  describe("onShowRemoveTeamMemberDialog", () => {
    it("TODO", undefined);
  });
  describe("onShowEditTeamDialog", () => {
    it("TODO", undefined);
  });
  describe("onShowAddMemberDialog", () => {
    it("TODO", undefined);
  });
  describe("onSwitchAdminRole", () => {
    it("TODO", undefined);
  });
}

export default testTeamPage;
