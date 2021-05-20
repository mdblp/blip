/**
 * Copyright (c) 2021, Diabeloop
 * Yourloops utils functions
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

import { IUser } from "../models/shoreline";
import httpStatus from "./http-status-codes";
import { t } from "./language";

export const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const REGEX_BIRTHDATE = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

export const REGEX_PHONE = /^\+(?:[0-9]\x20?){6,14}[0-9]$/;

/**
 * setTimeout() as promised
 * @param timeout in milliseconds
 */
export function waitTimeout(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * Defer the execution on a function
 * @param fn A function
 * @param timeout optional delay to wait
 */
export async function defer(fn: () => void, timeout = 1): Promise<void> {
  try {
    await waitTimeout(timeout);
    fn();
  } catch (err) {
    console.error(err);
  }
}

export function errorTextFromException(reason: unknown): string {
  let errorMessage: string;
  if (reason instanceof Error) {
    errorMessage = reason.message;
  } else {
    const s = new String(reason);
    errorMessage = s.toString();
  }
  return errorMessage;
}

export function errorFromHttpStatus(response: Response, log?: Console): Error {
  if (typeof log === "object") {
    log.error("Server response in error", response.status, response.statusText);
  }

  switch (response.status) {
  case httpStatus.StatusInternalServerError:
    return new Error(t("error-http-500"));
  default:
    return new Error(t("error-http-40x"));
  }
}

/**
 * Return the user first name
 */
export function getUserFirstName(user: IUser): string {
  return user.profile?.firstName ?? "";
}

/**
 * Return the user last name
 */
export function getUserLastName(user: IUser): string {
  return user.profile?.lastName ?? user.profile?.fullName ?? user.username;
}

/**
 * @param user The user to have firstName / lastName
 * @returns The object for "user-name" translation string
 */
export function getUserFirstLastName(user: User): { firstName: string, lastName: string; } {
  return { firstName: getUserFirstName(user), lastName: getUserLastName(user) };
}

export function getUserEmail(user: User): string {
  return Array.isArray(user.emails) ? user.emails[0] : user.username;
}
