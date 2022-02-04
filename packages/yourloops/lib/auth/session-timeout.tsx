/**
 * Copyright (c) 2021, Diabeloop
 * Session timeout manager (auto logout the user when idle for a period)
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
import bows from "bows";
import jwtDecode from "jwt-decode";

import config from "../config";
import { JwtShorelinePayload } from "../../models/shoreline";
import { waitTimeout } from "../utils";
import { useAuth } from "./hook";

interface SessionTimeoutProps {
  /** Interval delay to check for a session timeout (prop useful for the unit tests) */
  sessionTimeoutDelay?: number;
}

/** Check every minute for a session timeout */
const defaultSessionTimeoutDelay = 60000;
const log = bows("SessionTimeout");


const getTokenExpirationTimeout = (token: string): number => {
  const decoded = jwtDecode<JwtShorelinePayload>(token);
  const tokenExpirationDate = Number.isSafeInteger(decoded.exp) ? decoded.exp as number : 0;
  const now = Date.now() / 1000;
  return (tokenExpirationDate - now - config.renewToken.delayBeforeRenew) * 1000;
};

function SessionTimeout({ sessionTimeoutDelay }: SessionTimeoutProps): null {
  const { sessionToken, isAuthInProgress, isAuthHookInitialized, isLoggedIn, logout, refreshToken } = useAuth();
  const intervalTimeout = sessionTimeoutDelay ?? defaultSessionTimeoutDelay;

  // Only setup the timeout session when
  // - user if fully logged in
  // - No authentication is in progress
  // - The authHook is fully initialized
  const setupSessionTimeout = isAuthHookInitialized && isLoggedIn && !isAuthInProgress;

  React.useEffect(() => {
    let sessionTimeoutId = Number.NaN;
    let lastUpdate = Date.now();

    /** Reset the current session timeout */
    const handleUserInputEvent = () => {
      lastUpdate = Date.now();
    };

    const doLogoutIfSessionExpired = () => {
      const now = Date.now();
      if (now - lastUpdate > config.SESSION_TIMEOUT) {
        log.info(`Session timeout: Logout after more than ${config.SESSION_TIMEOUT}ms of inactivity`);
        logout(true);
      }
    };

    const unmount = () => {
      document.removeEventListener("mousemove", handleUserInputEvent);
      document.removeEventListener("keydown", handleUserInputEvent);
      document.removeEventListener("touchstart", handleUserInputEvent);
      if (Number.isFinite(sessionTimeoutId)) {
        window.clearInterval(sessionTimeoutId);
      }
      log.debug(`Session timer "${sessionTimeoutId}" cleared and event listener removed`);
      sessionTimeoutId = Number.NaN;
      delete window.clearSessionTimeout;
    };

    if (setupSessionTimeout) {
      document.addEventListener("mousemove", handleUserInputEvent);
      document.addEventListener("keydown", handleUserInputEvent);
      document.addEventListener("touchstart", handleUserInputEvent);
      sessionTimeoutId = window.setInterval(doLogoutIfSessionExpired, intervalTimeout);

      if (typeof window.clearSessionTimeout === "function") {
        log.warn("Removing previous `window.clearSessionTimeout()` function");
        window.clearSessionTimeout();
        delete window.clearSessionTimeout;
      }
      window.clearSessionTimeout = unmount;
      log.debug(`Session timer "${sessionTimeoutId}" initialized for ${intervalTimeout}ms intervals and event listeners added`);
    }

    return setupSessionTimeout ? unmount : undefined;
  }, [setupSessionTimeout, intervalTimeout, logout]);

  // Manage token expiration by asking a new token (renew)
  // to the auth manager.
  React.useEffect(() => {
    let timeoutCheck: number | null = null;
    const renewToken = async (): Promise<void> => {
      timeoutCheck = null;
      let renewSuccess = false;
      for (let i=0; i<config.renewToken.renewMaxTry && !renewSuccess; i++) {
        try {
          await refreshToken();
          renewSuccess = true;
        } catch (reason) {
          log.error(reason);
          await waitTimeout(config.renewToken.renewFailedInternal); // Wait a little
        }
      }

      if (!renewSuccess) {
        logout(true);
      }
    };
    const stopRenew = () => {
      if (timeoutCheck !== null) {
        log.debug(`Clearing renew timer: ${timeoutCheck}`);
        window.clearTimeout(timeoutCheck);
        timeoutCheck = null;
      }
    };

    const setupSessionRefresh = setupSessionTimeout && sessionToken !== null;
    if (setupSessionRefresh) {
      const willExpireIn = getTokenExpirationTimeout(sessionToken);
      if (willExpireIn < config.renewToken.delayBeforeRenew) {
        log.info("Renewing token immediately");
        timeoutCheck = window.setTimeout(renewToken, 1);
      } else {
        log.info(`Token will be renewed in ${Math.round(willExpireIn/1000)}s`);
        timeoutCheck = window.setTimeout(renewToken, willExpireIn);
      }
      log.debug(`Token renew timer: ${timeoutCheck}`);
    }

    return timeoutCheck === null ? undefined : stopRenew;
  }, [setupSessionTimeout, sessionToken, logout, refreshToken]);

  return null;
}

export default SessionTimeout;
