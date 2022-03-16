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

import React from "react";
import enzyme, { mount, ReactWrapper, MountRendererProps } from "enzyme";

import { ITeam } from "../../../models/team";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { NotificationContextProvider } from "../../../lib/notifications";
import { TeamContextProvider } from "../../../lib/team";
import { waitTimeout } from "../../../lib/utils";
import TeamsPage from "../../../pages/hcp/teams-page";

import { loggedInUsers, teams } from "../../common";
import Adapter from "enzyme-adapter-react-16";
import { resetTeamAPIStubs, teamAPI } from "../../lib/team/utils";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { stubNotificationContextValue } from "../../lib/notifications/utils";

describe("Team page", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const apiTimeout = 50;
  const mountOptions: MountRendererProps = {
    attachTo: null,
  };
  let component: ReactWrapper | null = null;

  function TestTeamsPageComponent(): JSX.Element {
    return (
      <AuthContextProvider value={authHookHcp}>
        <NotificationContextProvider value={stubNotificationContextValue}>
          <TeamContextProvider teamAPI={teamAPI}>
            <TeamsPage />
          </TeamContextProvider>
        </NotificationContextProvider>
      </AuthContextProvider>
    );
  }

  async function createComponent(): Promise<ReactWrapper> {
    const page = mount(<TestTeamsPageComponent />, mountOptions);

    expect(document.getElementById("team-page-loading-progress")).not.toBeNull();
    expect((teamAPI.fetchPatients as jest.Mock)).toHaveBeenCalledTimes(1);
    expect((teamAPI.fetchTeams as jest.Mock)).toHaveBeenCalledTimes(1);
    page.update();
    await waitTimeout(apiTimeout);
    return page;
  }

  beforeAll(() => {
    enzyme.configure({
      adapter: new Adapter(),
      disableLifecycleMethods: true,
    });
    mountOptions.attachTo = document.getElementById("app");
    if (mountOptions.attachTo === null) {
      mountOptions.attachTo = document.createElement("div");
      mountOptions.attachTo.id = "app";
      document.body.appendChild(mountOptions.attachTo);
    }
  });
  afterAll(() => {
    const { attachTo } = mountOptions;
    if (attachTo instanceof HTMLElement) {
      document.body.removeChild(attachTo);
    }
  });

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
      expect(document.getElementById("team-page-loading-progress")).toBeNull();
      expect(document.getElementById("div-api-error-message")).toBeNull();
      expect(document.getElementById("team-page-grid-list")).toBeNull();
    }
    resetTeamAPIStubs();
  });

  it("should show the loading progress when mounting", async () => {
    const longWaitPromise = async (): Promise<ITeam[]> => {
      await waitTimeout(apiTimeout);
      return [];
    };
    (teamAPI.fetchTeams as jest.Mock).mockReturnValue(longWaitPromise());
    component = await createComponent();
    await waitTimeout(3 * apiTimeout);
    expect(document.getElementById("team-page-loading-progress")).toBeNull();
    expect(document.getElementById("team-page-grid-list")).not.toBeNull();
  });

  it("should display an error message if loading failed", async () => {
    (teamAPI.fetchTeams as jest.Mock).mockRejectedValue(new Error("Test error"));

    component = await createComponent();
    expect(document.getElementById("team-page-loading-progress")).toBeNull();
    expect(document.getElementById("div-api-error-message")).not.toBeNull();
  });

  it("should display the team list on successful loading", async () => {
    component = await createComponent();
    expect(document.getElementById("team-page-grid-list")).not.toBeNull();
  });

  describe("onShowLeaveTeamDialog", () => {
    const leaveTeamStub = teamAPI.leaveTeam as jest.Mock;
    const deleteTeam = teamAPI.deleteTeam as jest.Mock;

    it(
      "should display the leave dialog, and call deleteTeam api on validate if the member is the only member",
      async () => {
        component = await createComponent();
        expect(document.getElementById("team-leave-dialog-title")).toBeNull();
        expect(document.getElementById("team-page-alert")).toBeNull();

        let buttonId = `team-card-${teams[2].id}-button-leave-team`;
        const button = document.getElementById(buttonId) as HTMLButtonElement;
        expect(button).not.toBeNull();

        button.click();

        await waitTimeout(apiTimeout);
        component.update();

        expect(component.exists("#team-leave-dialog-title")).toBe(true);

        buttonId = "#team-leave-dialog-button-leave";
        expect(component.exists(buttonId)).toBe(true);
        component.find(buttonId).last().simulate("click");

        component.update();
        await waitTimeout(apiTimeout);

        expect(deleteTeam).toHaveBeenCalledTimes(1);
        expect(document.getElementById("team-leave-dialog-title")).toBeNull();
      }
    );

    it(
      "should display the leave dialog, and not call the api on cancel",
      async () => {
        component = await createComponent();
        expect(document.getElementById("team-leave-dialog-title")).toBeNull();
        expect(document.getElementById("team-page-alert")).toBeNull();

        let buttonId = `team-card-${teams[2].id}-button-leave-team`;
        const button = document.getElementById(buttonId) as HTMLButtonElement;
        expect(button).not.toBeNull();

        button.click();

        await waitTimeout(apiTimeout);
        component.update();

        expect(component.exists("#team-leave-dialog-title")).toBe(true);

        buttonId = "#team-leave-dialog-button-cancel";
        expect(component.exists(buttonId)).toBe(true);
        component.find(buttonId).last().simulate("click");

        component.update();
        await waitTimeout(apiTimeout);

        expect(leaveTeamStub).toHaveBeenCalledTimes(0);
        expect(document.getElementById("team-page-alert")).toBeNull();
        expect(document.getElementById("team-leave-dialog-title")).toBeNull();
      }
    );

    it("should display an error alert if the api call failed", async () => {
      const errorMessage = "API error message";
      leaveTeamStub.mockRejectedValue(new Error(errorMessage));

      component = await createComponent();
      expect(document.getElementById("team-leave-dialog-title")).toBeNull();
      expect(document.getElementById("team-page-alert")).toBeNull();

      let buttonId = `team-card-${teams[1].id}-button-leave-team`;
      const button = document.getElementById(buttonId) as HTMLButtonElement;
      expect(button).not.toBeNull();

      button.click();

      await waitTimeout(apiTimeout);
      component.update();

      expect(component.exists("#team-leave-dialog-title")).toBe(true);

      buttonId = "#team-leave-dialog-button-leave";
      expect(component.exists(buttonId)).toBe(true);
      component.find(buttonId).last().simulate("click");

      component.update();
      await waitTimeout(apiTimeout);

      expect(leaveTeamStub).toHaveBeenCalledTimes(1);
      expect(document.getElementById("team-leave-dialog-title")).toBeNull();
    });
  });
});

