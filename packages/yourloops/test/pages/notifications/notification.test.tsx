/**
 * Copyright (c) 2021, Diabeloop
 * Notification tests
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
import moment from "moment-timezone";
import _ from "lodash";
import { getByText, render, screen } from "@testing-library/react";

import { UserRoles } from "../../../models/shoreline";
import { Notification } from "../../../pages/notifications/notification";
import { INotification, NotificationType } from "../../../lib/notifications/models";
import * as notificationHookMock from "../../../lib/notifications/hook";

jest.mock("../../../lib/notifications/hook");
describe("Notification", () => {
  const notif: INotification = {
    id: "11",
    metricsType: "share_data",
    date: "2021-02-18T10:00:00",
    creator: {
      userid: "1",
      profile: {
        fullName: "Jeanne Dubois",
      },
    },
    creatorId: "a",
    email: "a@example.com",
    type: NotificationType.directInvitation,
  };

  const teamNotif: INotification = {
    id: "12",
    metricsType: "share_data",
    date: "2021-02-18T10:00:00",
    creator: {
      userid: "1",
      profile: {
        fullName: "Jeanne Dubois",
      },
    },
    creatorId: "a",
    email: "a@example.com",
    type: NotificationType.careTeamPatientInvitation,
    target: {
      id: "fakeTeamId",
      name: "fakeTeamName",

    },
  };

  const fakeNotification = (
    notification: INotification = notif,
    role: UserRoles = UserRoles.hcp,
    onHelp = () => _.noop
  ): JSX.Element => (
    <Notification
      notification={notification}
      userRole={role}
      onHelp={onHelp}
    />
  );

  describe("wrapped notification", () => {

    it("should display the correct label", () => {
      const { container } = render(fakeNotification());
      expect(getByText(container, "Jeanne Dubois wants to share their diabetes data with you.")).not.toBeNull();
    });

    it("should display medical team join invitation for a member", () => {
      const { container } = render(
        fakeNotification({
          ...notif,
          type: NotificationType.careTeamProInvitation,
          target: { id: "0", name: "target" },
        })
      );
      expect(getByText(container, "Jeanne Dubois invites you to join", { exact : false })).not.toBeNull();
      expect(container.querySelector(`#notification-help-${notif.id}-icon`)).toBeNull();
    });

    it("should display medical team join invitation with more info button for a member having a caregiver role", () => {
      const { container } = render(
        fakeNotification({
          ...notif,
          type: NotificationType.careTeamProInvitation,
          target: { id: "0", name: "target" },
        },
        UserRoles.caregiver,
        )
      );

      expect(getByText(container, "Jeanne Dubois invites you to join", { exact : false })).not.toBeNull();
      expect(container.querySelector(`#notification-help-${notif.id}-icon`)).not.toBeNull();
    });

    it("should display medical team join invitation for a patient", () => {
      const { container } = render(
        fakeNotification({
          ...notif,
          type: NotificationType.careTeamPatientInvitation,
          target: { id: "0", name: "grenoble DIAB service" },
        },
        UserRoles.patient
        )
      );

      expect(getByText(container, "You're invited to share your diabetes data with", { exact : false })).not.toBeNull();
      expect(getByText(container, "grenoble DIAB service", { exact : false })).not.toBeNull();
      expect(container.querySelector(`#notification-help-${notif.id}-icon`)).toBeNull();
    });

    describe("getIconToDisplay", () => {
      it("should display a PersonIcon", () => {
        render(fakeNotification());

        expect(screen.queryByTitle("direct-invitation-icon")).not.toBeNull();
        expect(screen.queryByTitle("default-icon")).toBeNull();
        expect(screen.queryByTitle("care-team-invitation-icon")).toBeNull();
      });

      it("should display a GroupIcon", () => {
        render(fakeNotification({ ...teamNotif, type: NotificationType.careTeamProInvitation }));

        expect(screen.queryByTitle("direct-invitation-icon")).toBeNull();
        expect(screen.queryByTitle("default-icon")).not.toBeNull();
        expect(screen.queryByTitle("care-team-invitation-icon")).toBeNull();
      });

      it("should display a MedicalServiceIcon", () => {
        render(fakeNotification({ ...teamNotif, type: NotificationType.careTeamPatientInvitation }));

        expect(screen.queryByTitle("direct-invitation-icon")).toBeNull();
        expect(screen.queryByTitle("default-icon")).toBeNull();
        expect(screen.queryByTitle("care-team-invitation-icon")).not.toBeNull();
      });
    });

    describe("getDateToDisplay", () => {
      it("should display the given date", () => {
        const { container } = render(fakeNotification());
        const expectedDate = moment.utc(notif.date).utc().format("L");

        expect(getByText(container, expectedDate)).not.toBeNull();
      });

      it("should display today", () => {
        const { container } = render(fakeNotification({ ...notif, date: new Date().toISOString() }));

        expect(getByText(container, "today")).not.toBeNull();
      });

      it("should display yesterday", () => {
        // eslint-disable-next-line no-magic-numbers
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { container } = render(fakeNotification({ ...notif, date: yesterday }));

        expect(getByText(container, "yesterday")).not.toBeNull();
      });
    });
  });

  describe("instanciated notification", () => {

    let container: HTMLElement | null = null;

    const NotificationComponent = (props: { notif: INotification }): JSX.Element => {
      return (
        <Notification
          notification={props.notif}
          userRole={UserRoles.hcp}
          onHelp={_.noop}
        />
      );
    };

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    it("should be able to render", () => {
      render(<NotificationComponent notif={notif} />);
      const component = document.getElementById(`notification-line-${notif.id}`);
      expect(component).not.toBeNull();
    });

    it("should show team code dialog when accepting team invitation", () => {
      render(<NotificationComponent notif={teamNotif} />);
      const acceptButton: HTMLButtonElement = document.getElementById(`notification-button-accept-${teamNotif.id}`) as HTMLButtonElement;
      acceptButton.click();
      const dialog = document.getElementById("team-add-dialog-title");
      expect(dialog).not.toBeNull();
    });


    it("should not show team code dialog when accepting non team invitation", () => {
      (notificationHookMock.NotificationContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
        return children;
      });
      (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => {
        return {
          update: jest.fn(),
        };
      });
      render(<NotificationComponent notif={notif} />);
      const acceptButton: HTMLButtonElement = document.getElementById(`notification-button-accept-${notif.id}`) as HTMLButtonElement;
      acceptButton.click();
      const dialog = document.getElementById("team-add-dialog-title");
      expect(dialog).toBeNull();
    });
  });
});

