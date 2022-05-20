/**
 * Copyright (c) 2021, Diabeloop
 * Yourloops API client
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

import bows from "bows";
import _ from "lodash";

import { APIErrorResponse } from "../../models/error";
import { IUser, Preferences, Profile, Settings } from "../../models/shoreline";
import { HttpHeaderKeys, HttpHeaderValues } from "../../models/api";

import { errorFromHttpStatus } from "../utils";
import appConfig from "../config";
import { t } from "../language";

import { Session, UpdateUser } from "./models";
import HttpService from "../../services/http";

const log = bows("Auth API");

async function sendAccountValidation(session: Readonly<Session>, language = "en"): Promise<boolean> {
  const confirmURL = new URL(`/confirm/send/signup/${session.user.userid}`, appConfig.API_HOST);

  const response = await fetch(confirmURL.toString(), {
    method: "POST",
    cache: "no-store",
    headers: {
      [HttpHeaderKeys.sessionToken]: session.sessionToken,
      [HttpHeaderKeys.traceToken]: session.traceToken,
      [HttpHeaderKeys.language]: language,
    },
  });

  if (response.ok) {
    return Promise.resolve(true);
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function accountConfirmed(key: string, traceToken: string): Promise<boolean> {
  if (_.isEmpty(key)) {
    log.error("forbidden call to Account confirmation api, key is missing");
    throw new Error("error-http-40x");
  }

  const confirmURL = new URL(`/confirm/accept/signup/${key}`, appConfig.API_HOST);
  const response = await fetch(confirmURL.toString(), {
    method: "PUT",
    cache: "no-store",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
    },
  });

  if (response.ok) {
    return Promise.resolve(true);
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function updateProfile(session: Readonly<Session>): Promise<Profile> {
  const seagullURL = new URL(`/metadata/${session.user.userid}/profile`, appConfig.API_HOST);
  const profile = session.user.profile ?? {};

  const response = await fetch(seagullURL.toString(), {
    method: "PUT",
    cache: "no-store",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: session.traceToken,
      [HttpHeaderKeys.sessionToken]: session.sessionToken,
    },
    body: JSON.stringify(profile),
  });

  if (response.ok) {
    return (await response.json()) as Profile;
  }

  try {
    const responseBody = (await response.json()) as APIErrorResponse;
    return Promise.reject(new Error(t(responseBody.reason)));
  } catch (e) {
    log.error(e);
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function updatePreferences(session: Readonly<Session>): Promise<Preferences> {
  const seagullURL = new URL(`/metadata/${session.user.userid}/preferences`, appConfig.API_HOST);
  const preferences = session.user.preferences ?? {};

  const response = await fetch(seagullURL.toString(), {
    method: "PUT",
    cache: "no-store",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: session.traceToken,
      [HttpHeaderKeys.sessionToken]: session.sessionToken,
    },
    body: JSON.stringify(preferences),
  });

  if (response.ok) {
    return response.json() as Promise<Preferences>;
  }

  try {
    const responseBody = (await response.json()) as APIErrorResponse;
    return Promise.reject(new Error(t(responseBody.reason)));
  } catch (e) {
    log.error(e);
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function updateSettings(auth: Readonly<Session>): Promise<Settings> {
  const seagullURL = new URL(`/metadata/${auth.user.userid}/settings`, appConfig.API_HOST);
  const settings = auth.user.settings ?? {};

  const response = await fetch(seagullURL.toString(), {
    method: "PUT",
    cache: "no-store",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: auth.traceToken,
      [HttpHeaderKeys.sessionToken]: auth.sessionToken,
    },
    body: JSON.stringify(settings),
  });

  if (response.ok) {
    return (await response.json()) as Settings;
  }

  try {
    const responseBody = (await response.json()) as APIErrorResponse;
    return Promise.reject(new Error(t(responseBody.reason)));
  } catch (e) {
    log.error(e);
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function updateUser(session: Readonly<Session>, updates: UpdateUser): Promise<void> {
  const updateURL = new URL("/auth/user", appConfig.API_HOST);

  log.debug("updateUser:", updateURL.toString());
  const response = await fetch(updateURL.toString(), {
    method: "PUT",
    cache: "no-store",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.traceToken]: session.traceToken,
      [HttpHeaderKeys.sessionToken]: session.sessionToken,
    },
    body: JSON.stringify({ updates }),
  });

  if (response.ok) {
    return Promise.resolve();
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function refreshToken(session: Readonly<Session>): Promise<string> {
  const refreshURL = new URL("/auth/login", appConfig.API_HOST);

  log.debug("refreshToken", refreshURL.toString());
  const response = await fetch(refreshURL.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      [HttpHeaderKeys.traceToken]: session.traceToken,
      [HttpHeaderKeys.sessionToken]: session.sessionToken,
    },
  });

  if (response.ok) {
    const sessionToken = response.headers.get(HttpHeaderKeys.sessionToken);
    if (sessionToken === null) {
      log.error("Token not found in response header!");
      return Promise.reject(new Error("missing-token"));
    }
    return sessionToken;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function certifyProfessionalAccount(): Promise<IUser> {
  const { data } = await HttpService.post<IUser>({
    url: "/auth/oauth/merge",
    config: { withCredentials: true },
  });
  return data;
}

export default {
  accountConfirmed,
  certifyProfessionalAccount,
  refreshToken,
  sendAccountValidation,
  updatePreferences,
  updateProfile,
  updateSettings,
  updateUser,
};
