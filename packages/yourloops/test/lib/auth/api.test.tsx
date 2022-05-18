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

import HttpStatus from "../../../lib/http-status-codes";
import { HttpHeaderKeys, HttpHeaderValues } from "../../../models/api";
import { Preferences, Profile, Settings, UserRoles } from "../../../models/shoreline";
import { Session } from "../../../lib/auth";
import api from "../../../lib/auth/api";
import User from "../../../lib/auth/user";

describe("Auth API", () => {
  const fetchMock = jest.fn();

  afterEach(() => {
    fetchMock.mockReset();
    delete global.fetch;
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

