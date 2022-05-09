/**
 * Copyright (c) 2021, Diabeloop
 * Auth API tests
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

import HttpStatus from "../../../lib/http-status-codes";
import { HttpHeaderKeys, HttpHeaderValues } from "../../../models/api";
import { IUser, Preferences, Profile, Settings, UserRoles } from "../../../models/shoreline";
import { Session } from "../../../lib/auth";
import api from "../../../lib/auth/api";
import User from "../../../lib/auth/user";

describe("Auth API", () => {
  const fetchMock = jest.fn();

  afterEach(() => {
    fetchMock.mockReset();
    delete global.fetch;
  });

  describe("signup", () => {
    it("should throw if username is empty", async () => {
      let error = null;
      try {
        await api.signup("", "abcd", UserRoles.caregiver, "abcd");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("no-username");
    });

    it("should throw if password is empty", async () => {
      let error = null;
      try {
        await api.signup("abcd", "", UserRoles.hcp, "abcd");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("no-password");
    });

    it("should throw if the API response is not ok", async () => {
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
      } as Response;

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.signup("abcd", "abcd", UserRoles.hcp, "abcd");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("should return the created user if ok", async () => {
      const user: IUser = {
        userid: "abcd",
        username: "abcd@example.com",
        roles: [UserRoles.caregiver],
        emails: ["abcd@example.com"],
        emailVerified: false,
      } as IUser;
      const resolveSignup: Response = {
        ok: true,
        status: HttpStatus.StatusOK,
        statusText: "OK",
        type: "basic",
        redirected: false,
        headers: new Headers({
          [HttpHeaderKeys.sessionToken]: "the-token",
          [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
        }),
        json: jest.fn().mockResolvedValue(user),
      } as unknown as Response;

      fetchMock.mockResolvedValue(resolveSignup);
      global.fetch = fetchMock;
      let error = null;
      let session: Session | null = null;
      try {
        session = await api.signup(user.username, "abcd", user.roles[0], "abcd");
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
      expect(session).not.toBeNull();
      expect(session.sessionToken).toBe("the-token");
      expect(session.traceToken).toBe("abcd");
      expect(typeof session.user).toBe("object");
      const expected = {
        ...user,
      };
      delete expected.roles;
      expect(session.user).toMatchObject(expected);
    });
  });

  describe("resendSignup", () => {
    it("should throw an error if no username", async () => {
      let error = null;
      try {
        await api.resendSignup("", "trace-token");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("should return false if the reply is not OK", async () => {
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
      } as Response;
      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        const result = await api.resendSignup("abcd", "trace-token");
        expect(result).toBe(false);
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/confirm/resend/signup/abcd",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.language]: "en",
          },
        },
      ]);
    });

    it("should resolve with no error when the API reply OK", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
      } as Response;
      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      try {
        const result = await api.resendSignup("abcd", "trace-token", "fr");
        expect(result).toBe(true);
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/confirm/resend/signup/abcd",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.language]: "fr",
          },
        },
      ]);
    });
  });

  describe("sendAccountValidation", () => {
    let unvalidatedUser: User;
    beforeAll(() => {
      unvalidatedUser = new User({
        userid: "abcd",
        username: "abcd@example.com",
        role: UserRoles.unverified,
      });
    });

    it("should throw an error if the API reply is not OK", async () => {
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
      } as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(unvalidatedUser),
      };
      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.sendAccountValidation(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/confirm/send/signup/abcd",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: session.traceToken,
            [HttpHeaderKeys.sessionToken]: session.sessionToken,
            [HttpHeaderKeys.language]: "en",
          },
        },
      ]);
      expect(error.message).toBe("error-http-500");
    });

    it("should resolve with no error when the API reply OK", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
      } as Response;
      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(unvalidatedUser),
      };

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.sendAccountValidation(session, "fr");
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/confirm/send/signup/abcd",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: session.traceToken,
            [HttpHeaderKeys.sessionToken]: session.sessionToken,
            [HttpHeaderKeys.language]: "fr",
          },
        },
      ]);
    });
  });

  describe("confirmAccount", () => {
    it("should throw an error if the key is missing", async () => {
      let error = null;
      try {
        await api.accountConfirmed("", "abcd");
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeNull();
      expect(error.message).toBe("error-http-40x");
    });

    it("should throw an error if the API reply is not OK", async () => {
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
      } as Response;

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.accountConfirmed("abcd", "trace-token");
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/confirm/accept/signup/abcd",
        {
          method: "PUT",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: "trace-token",
          },
        },
      ]);
      expect(error.message).toBe("error-http-500");
    });

    it("should resolve with no error when the API reply OK", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
      } as Response;

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      let result: boolean | null = null;
      try {
        result = await api.accountConfirmed("abcd", "trace-token");
      } catch (e) {
        error = e;
      }

      expect(error).toBeNull();
      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/confirm/accept/signup/abcd",
        {
          method: "PUT",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: "trace-token",
          },
        },
      ]);
    });
  });

  describe("updateProfile", () => {
    let userToUpdate: User;
    beforeAll(() => {
      userToUpdate = new User({
        userid: "abcd",
        username: "abcd@example.com",
        role: UserRoles.caregiver,
      });
    });

    it("should throw an error if the API reply is not OK", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("Not a JSON"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updateProfile(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/profile",
        {
          method: "PUT",
          cache: "no-store",
          body: "{}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
      expect(error.message).toBe("error-http-500");
      expect(jsonResponse).toHaveBeenCalledTimes(1);
    });

    it("should throw the reason if the update from seagull failed", async () => {
      const jsonResponse = jest.fn().mockResolvedValue({ code: 1, reason: "Invalid input JSON" });
      const resolveError: Response = {
        status: HttpStatus.StatusBadRequest,
        ok: false,
        statusText: "BadRequest",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updateProfile(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/profile",
        {
          method: "PUT",
          cache: "no-store",
          body: "{}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
      expect(error.message).toBe("Invalid input JSON");
      expect(jsonResponse).toHaveBeenCalledTimes(1);
    });

    it("should return the updated profile on success", async () => {
      const profile: Profile = {
        fullName: "Test Example",
        firstName: "Text",
        lastName: "Example",
      };
      const jsonResponse = jest.fn().mockResolvedValue(profile);
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      session.user.profile = profile;

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      let updatedProfile: Profile | null = null;
      try {
        updatedProfile = await api.updateProfile(session);
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
      expect(updatedProfile).toEqual(profile);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/profile",
        {
          method: "PUT",
          cache: "no-store",
          body: JSON.stringify(profile),
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
    });
  });

  describe("updatePreferences", () => {
    let userToUpdate: User;
    beforeAll(() => {
      userToUpdate = new User({
        userid: "abcd",
        username: "abcd@example.com",
        role: UserRoles.hcp,
      });
    });

    it("should throw an error if the API reply is not OK", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("Not a JSON"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updatePreferences(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/preferences",
        {
          method: "PUT",
          cache: "no-store",
          body: "{}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
      expect(error.message).toBe("error-http-500");
      expect(jsonResponse).toHaveBeenCalledTimes(1);
    });

    it("should throw the reason if the update from seagull failed", async () => {
      const jsonResponse = jest.fn().mockResolvedValue({ code: 1, reason: "Invalid input JSON" });
      const resolveError: Response = {
        status: HttpStatus.StatusBadRequest,
        ok: false,
        statusText: "BadRequest",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updatePreferences(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/preferences",
        {
          method: "PUT",
          cache: "no-store",
          body: "{}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
      expect(error.message).toBe("Invalid input JSON");
      expect(jsonResponse).toHaveBeenCalledTimes(1);
    });

    it("should return the updated preferences on success", async () => {
      const preferences: Preferences = {
        displayLanguageCode: "de",
      };
      const jsonResponse = jest.fn().mockResolvedValue(preferences);
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      session.user.preferences = preferences;

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      let updatedPreferences: Preferences | null = null;
      try {
        updatedPreferences = await api.updatePreferences(session);
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
      expect(updatedPreferences).toEqual(preferences);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/preferences",
        {
          method: "PUT",
          cache: "no-store",
          body: JSON.stringify(preferences),
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
    });
  });

  describe("updateSettings", () => {
    let userToUpdate: User;
    beforeAll(() => {
      userToUpdate = new User({
        userid: "abcd",
        username: "abcd@example.com",
        role: UserRoles.patient,
      });
    });

    it("should throw an error if the API reply is not OK", async () => {
      const jsonResponse = jest.fn().mockRejectedValue(new Error("Not a JSON"));
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updateSettings(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/settings",
        {
          method: "PUT",
          cache: "no-store",
          body: "{}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
      expect(error.message).toBe("error-http-500");
      expect(jsonResponse).toHaveBeenCalledTimes(1);
    });

    it("should throw the reason if the update from seagull failed", async () => {
      const jsonResponse = jest.fn().mockResolvedValue({ code: 1, reason: "Invalid input JSON" });
      const resolveError: Response = {
        status: HttpStatus.StatusBadRequest,
        ok: false,
        statusText: "BadRequest",
        type: "error",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updateSettings(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/settings",
        {
          method: "PUT",
          cache: "no-store",
          body: "{}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
      expect(error.message).toBe("Invalid input JSON");
      expect(jsonResponse).toHaveBeenCalledTimes(1);
    });

    it("should return the updated settings on success", async () => {
      const settings: Settings = {
        country: "FR",
      };
      const jsonResponse = jest.fn().mockResolvedValue(settings);
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        json: jsonResponse,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      session.user.settings = settings;

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      let updatedSettings: Settings | null = null;
      try {
        updatedSettings = await api.updateSettings(session);
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
      expect(updatedSettings).toEqual(settings);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/metadata/abcd/settings",
        {
          method: "PUT",
          cache: "no-store",
          body: JSON.stringify(settings),
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: "trace-token",
            [HttpHeaderKeys.sessionToken]: "session-token",
          },
        },
      ]);
    });
  });

  describe("updateUser", () => {
    let userToUpdate: User;
    beforeAll(() => {
      userToUpdate = new User({
        userid: "abcd",
        username: "abcd@example.com",
        role: UserRoles.hcp,
      });
    });

    it("should throw an error if the API reply is not OK", async () => {
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updateUser(session, {});
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/auth/user",
        {
          method: "PUT",
          cache: "no-store",
          body: "{\"updates\":{}}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: session.traceToken,
            [HttpHeaderKeys.sessionToken]: session.sessionToken,
          },
        },
      ]);
      expect(error.message).toBe("error-http-500");
    });

    it("should resolve with no error when the API reply OK", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
      } as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.updateUser(session, { roles: [UserRoles.hcp] });
      } catch (e) {
        error = e;
      }

      expect(error).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/auth/user",
        {
          method: "PUT",
          cache: "no-store",
          body: "{\"updates\":{\"roles\":[\"hcp\"]}}",
          headers: {
            [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
            [HttpHeaderKeys.traceToken]: session.traceToken,
            [HttpHeaderKeys.sessionToken]: session.sessionToken,
          },
        },
      ]);
    });
  });

  describe("refreshToken", () => {
    let userToUpdate: User;
    beforeAll(() => {
      userToUpdate = new User({
        userid: "abcd",
        username: "abcd@example.com",
        role: UserRoles.caregiver,
      });
    });

    it("should throw an error if the API reply is not OK", async () => {
      const resolveError: Response = {
        status: HttpStatus.StatusInternalServerError,
        ok: false,
        statusText: "InternalServerError",
        type: "error",
        redirected: false,
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveError);
      global.fetch = fetchMock;
      let error = null;
      try {
        await api.refreshToken(session);
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/auth/login",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: session.traceToken,
            [HttpHeaderKeys.sessionToken]: session.sessionToken,
          },
        },
      ]);
      console.log(error);
      expect(error.message).toBe("error-http-500");
    });

    it("should throw an error if the reply do not have a token", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        headers: new Headers({}),
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      let newToken: string | null = null;
      try {
        newToken = await api.refreshToken(session);
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
      expect(error.message).toBe("missing-token");
      expect(newToken).toBeNull();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/auth/login",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: session.traceToken,
            [HttpHeaderKeys.sessionToken]: session.sessionToken,
          },
        },
      ]);
    });

    it("should resolve with no error when the API reply OK", async () => {
      const resolveOK: Response = {
        status: HttpStatus.StatusOK,
        ok: true,
        statusText: "OK",
        type: "basic",
        redirected: false,
        headers: new Headers({
          [HttpHeaderKeys.sessionToken]: "updated-token",
        }),
      } as unknown as Response;

      const session: Session = {
        sessionToken: "session-token",
        traceToken: "trace-token",
        user: new User(userToUpdate),
      };

      fetchMock.mockResolvedValue(resolveOK);
      global.fetch = fetchMock;
      let error = null;
      let newToken: string | null = null;
      try {
        newToken = await api.refreshToken(session);
      } catch (e) {
        error = e;
      }

      expect(error).toBeNull();
      expect(newToken).toBe("updated-token");
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]).toEqual([
        "http://localhost:8009/auth/login",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            [HttpHeaderKeys.traceToken]: session.traceToken,
            [HttpHeaderKeys.sessionToken]: session.sessionToken,
          },
        },
      ]);
    });
  });
});

