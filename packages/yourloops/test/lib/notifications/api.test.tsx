/**
 * Copyright (c) 2021, Diabeloop
 * API Notification tests
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

/* eslint-disable max-lines */

import { v4 as uuidv4 } from "uuid";

import HttpStatus from "../../../lib/http-status-codes";
import { ErrorMessageStatus } from "../../../services/http";
import { APINotificationType, INotificationAPI } from "../../../models/notification";
import { loggedInUsers } from "../../common";
import axios, { AxiosResponse } from "axios";
import NotificationApi from "../../../lib/notifications/notification-api";
import { INotification, NotificationType } from "../../../lib/notifications/models";

// Mock jest and set the type
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Notification API", () => {
  const userId = "fakeUserId";
  const userId2 = "fakeUserId2";
  const email = "fake@email.com";

  afterEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.put.mockReset();
  });

  describe("getReceivedInvitations", () => {
    const urlArgs = `/confirm/invitations/${userId}`;

    it("should throw an error if the response is not ok", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("Not a JSON"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;
      mockedAxios.get.mockResolvedValue(resolveError);

      let error: Error | null = null;
      try {
        await NotificationApi.getReceivedInvitations(userId);
      } catch (reason) {
        error = reason as Error;
      }
      expect(error).toBeInstanceOf(Error);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything());
    });

    it("should return an empty array, if there is no invitation", async () => {
      mockedAxios.get.mockImplementation(() => {
        throw new Error(ErrorMessageStatus.NotFound);
      });

      const result = await NotificationApi.getReceivedInvitations(userId);
      expect(result).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything());
    });

    it("should return the converted notifications", async () => {
      const apiNotifications: INotificationAPI[] = [
        {
          key: uuidv4(),
          type: APINotificationType.careTeamInvitation,
          creatorId: "abcd",
          created: new Date().toISOString(),
          creator: {
            userid: "abcd",
            profile: {
              fullName: "Test",
              firstName: "Test",
              lastName: "Test",
            },
          },
          shortKey: "abcdef",
          email: loggedInUsers.patient.username,
        },
      ];
      const resolveOK: AxiosResponse<INotificationAPI[]> = {
        headers: {},
        config: {},
        status: HttpStatus.StatusOK,
        statusText: "OK",
        data: apiNotifications,
      };
      mockedAxios.get.mockResolvedValue(resolveOK);

      const result = await NotificationApi.getReceivedInvitations(userId);
      const expectedResult: INotification[] = [
        {
          id: apiNotifications[0].key,
          metricsType: "share_data",
          creatorId: apiNotifications[0].creatorId,
          date: apiNotifications[0].created,
          email: apiNotifications[0].email,
          type: NotificationType.directInvitation,
          creator: apiNotifications[0].creator,
          role: undefined,
          target: undefined,
        },
      ];

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result).toEqual(expectedResult);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything());
    });
  });

  describe("getSentInvitations", () => {
    const urlArgs = `/confirm/invite/${userId}`;

    it("should throw an error if the response is not ok", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("Not a JSON"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;
      mockedAxios.get.mockResolvedValue(resolveError);

      let error: Error | null = null;
      try {
        await NotificationApi.getSentInvitations(userId);
      } catch (reason) {
        error = reason as Error;
      }

      expect(error).toBeInstanceOf(Error);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything());
    });

    it("should return an empty array, if there is no invitation", async () => {
      mockedAxios.get.mockImplementation(() => {
        throw new Error(ErrorMessageStatus.NotFound);
      });

      const result = await NotificationApi.getSentInvitations(userId);

      expect(result).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything());
    });

    it("should return the converted notifications", async () => {
      const apiNotifications: INotificationAPI[] = [
        {
          key: uuidv4(),
          type: APINotificationType.careTeamInvitation,
          creatorId: userId2,
          created: new Date().toISOString(),
          creator: {
            userid: "abcd",
            profile: {
              fullName: "Test",
              firstName: "Test",
              lastName: "Test",
            },
          },
          shortKey: "abcdef",
          email: "patient@yourloops.com",
        },
      ];
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        data: apiNotifications,
      } as unknown as Response;
      mockedAxios.get.mockResolvedValue(resolveOK);

      const result = await NotificationApi.getSentInvitations(userId);
      const expectedResult: INotification[] = [
        {
          id: apiNotifications[0].key,
          metricsType: "share_data",
          creatorId: apiNotifications[0].creatorId,
          date: apiNotifications[0].created,
          email: apiNotifications[0].email,
          type: NotificationType.directInvitation,
          creator: apiNotifications[0].creator,
          role: undefined,
          target: undefined,
        },
      ];

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result).toEqual(expectedResult);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(urlArgs, expect.anything());
    });
  });

  describe("acceptInvitation", () => {
    it("should throw an error if the invitation type is invalid", async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error();
      });

      const notificationTypes = [NotificationType.careTeamDoAdmin, NotificationType.careTeamRemoveMember];
      const user = loggedInUsers.hcpUser;
      const notification: INotification = {
        metricsType: "join_team",
        type: NotificationType.careTeamDoAdmin,
        creator: { userid: userId, profile: user.profile },
        creatorId: userId2,
        date: new Date().toISOString(),
        email,
        id: uuidv4(),
      };
      for (const notificationType of notificationTypes) {
        let err: Error | null = null;
        try {
          await NotificationApi.acceptInvitation(userId, { ...notification, type: notificationType });
        } catch (reason) {
          err = reason as Error;
        }
        expect(err).not.toBeNull();
      }
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });

    it("should throw an error if the reply is not ok (directInvitation)", async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error();
      });

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "share_data",
        type: NotificationType.directInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
      };
      let err: Error | null = null;
      try {
        await NotificationApi.acceptInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      const expectedArgs = `/confirm/accept/invite/${userId}/${patient.userid}`;
      const expectedBody = { key: notification.id };

      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, expect.anything());
    });

    it("should resolve when the reply is ok (directInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
      } as Response;
      mockedAxios.put.mockResolvedValue(resolveOK);

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "share_data",
        type: NotificationType.directInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
      };

      let err: Error | null = null;
      try {
        await NotificationApi.acceptInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = `/confirm/accept/invite/${userId}/${patient.userid}`;
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, expect.anything());
    });

    it("should throw an error if the reply is not ok (careTeamProInvitation)", async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error();
      });

      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.acceptInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = "/confirm/accept/team/invite";
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should resolve when the reply is ok (careTeamProInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        text: jest.fn().mockResolvedValue("OK"),
      } as unknown as Response;
      mockedAxios.put.mockResolvedValue(resolveOK);

      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "share_data",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.acceptInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = "/confirm/accept/team/invite";
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should throw an error if the reply is not ok (careTeamPatientInvitation)", async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error("careTeamPatientInvitations");
      });

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamPatientInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.acceptInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = "/confirm/accept/team/invite";
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should resolve when the reply is ok (careTeamPatientInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        text: jest.fn().mockResolvedValue("OK"),
      } as unknown as Response;
      mockedAxios.put.mockResolvedValue(resolveOK);

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamPatientInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.acceptInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = "/confirm/accept/team/invite";
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    }
    );
  });

  describe("declineInvitation", () => {
    it("should throw an error if the invitation type is invalid", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("test"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;
      mockedAxios.put.mockResolvedValue(resolveError);

      const notificationTypes = [NotificationType.careTeamDoAdmin, NotificationType.careTeamRemoveMember];
      const user = loggedInUsers.hcpUser;
      const notification: INotification = {
        metricsType: "join_team",
        type: NotificationType.careTeamDoAdmin,
        creator: { userid: user.userid, profile: user.profile },
        creatorId: user.userid,
        date: new Date().toISOString(),
        email: user.username,
        id: uuidv4(),
      };
      for (const notificationType of notificationTypes) {
        let err: Error | null = null;
        try {
          await NotificationApi.declineInvitation(userId, { ...notification, type: notificationType });
        } catch (reason) {
          err = reason as Error;
        }
        expect(err).not.toBeNull();
      }
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });

    it("should throw an error if the reply is not ok (directInvitation)", async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error("directInvitation");
      });

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "share_data",
        type: NotificationType.directInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }

      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = `/confirm/dismiss/invite/${userId}/${patient.userid}`;
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should resolve when the reply is ok (directInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        text: jest.fn().mockResolvedValue("OK"),
      } as unknown as Response;
      mockedAxios.put.mockResolvedValue(resolveOK);

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "share_data",
        type: NotificationType.directInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = `/confirm/dismiss/invite/${userId}/${patient.userid}`;
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should throw an error if the teamId is not set (careTeamProInvitation)", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("careTeamProInvitation"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;
      mockedAxios.put.mockResolvedValue(resolveError);

      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email,
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });

    it("should throw an error if the reply is not ok (careTeamProInvitation)", async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error("CareteamProInvitation");
      });

      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = `/confirm/dismiss/team/invite/${notification.target.id}`;
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should resolve when the reply is ok (careTeamProInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        text: jest.fn().mockResolvedValue("OK"),
      } as unknown as Response;

      mockedAxios.put.mockResolvedValue(resolveOK);

      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = `/confirm/dismiss/team/invite/${notification.target.id}`;
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should throw an error if the teamId is not set (careTeamPatientInvitation)", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("careTeamPatientInvitation"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;
      mockedAxios.put.mockResolvedValue(resolveError);

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamPatientInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });

    it("should throw an error if the reply is not ok (careTeamPatientInvitation)", async () => {
      mockedAxios.put.mockImplementation(() => {
        throw new Error("careteamPatienInvitation");
      });

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamPatientInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).not.toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = `/confirm/dismiss/team/invite/${notification.target.id}`;
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should resolve when the reply is ok (careTeamPatientInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        text: jest.fn().mockResolvedValue("OK"),
      } as unknown as Response;
      mockedAxios.put.mockResolvedValue(resolveOK);

      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamPatientInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.declineInvitation(userId, notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const expectedArgs = `/confirm/dismiss/team/invite/${notification.target.id}`;
      const expectedBody = { key: notification.id };
      expect(mockedAxios.put).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    }
    );
  });

  describe("cancelInvitation", () => {
    it("should throw an error if the invitation type is invalid", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("test"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;
      mockedAxios.post.mockResolvedValue(resolveError);

      const notificationTypes = [
        NotificationType.careTeamDoAdmin,
        NotificationType.careTeamRemoveMember,
        NotificationType.careTeamPatientInvitation,
      ];
      const user = loggedInUsers.hcpUser;
      const notification: INotification = {
        metricsType: "join_team",
        type: NotificationType.careTeamDoAdmin,
        creator: { userid: user.userid, profile: user.profile },
        creatorId: user.userid,
        date: new Date().toISOString(),
        email: user.username,
        id: uuidv4(),
      };
      for (const notificationType of notificationTypes) {
        let err: Error | null = null;
        try {
          await NotificationApi.cancelInvitation({ ...notification, type: notificationType });
        } catch (reason) {
          err = reason as Error;
        }
        expect(err).not.toBeNull();
      }
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
    });

    it("should resolve when the reply is ok (directInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        text: jest.fn().mockResolvedValue("OK"),
      } as unknown as Response;
      mockedAxios.post.mockResolvedValue(resolveOK);


      const patient = loggedInUsers.patient;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "share_data",
        type: NotificationType.directInvitation,
        creator: patient,
        creatorId: patient.userid,
        date: new Date().toISOString(),
        email,
      };

      let err: Error | null = null;
      try {
        await NotificationApi.cancelInvitation(notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      const expectedArgs = "/confirm/cancel/invite";
      const expectedBody = { key: notification.id, email };
      expect(mockedAxios.post).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });

    it("should throw an error if the teamId is missing (careTeamProInvitation)", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("careTeamProInvitation"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;
      mockedAxios.post.mockResolvedValue(resolveError);


      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email,
      };

      let err: Error | null = null;
      try {
        await NotificationApi.cancelInvitation(notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).not.toBeNull();
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
    });

    it("should resolve when the reply is ok (careTeamProInvitation)", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        text: jest.fn().mockResolvedValue("OK"),
      } as unknown as Response;

      mockedAxios.post.mockResolvedValue(resolveOK);

      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };

      let err: Error | null = null;
      try {
        await NotificationApi.cancelInvitation(notification);
      } catch (reason) {
        err = reason as Error;
      }
      expect(err).toBeNull();
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      const expectedArgs = "/confirm/cancel/invite";
      const expectedBody = { key: notification.id, target: notification.target };
      expect(mockedAxios.post).toHaveBeenCalledWith(expectedArgs, expectedBody, {});
    });
  });
});

