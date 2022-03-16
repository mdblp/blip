/**
 * Copyright (c) 2021, Diabeloop
 * cookies-manager tests
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

/* eslint-disable no-underscore-dangle */

import config from "../../lib/config";
import metrics from "../../lib/metrics";
import { isZendeskAllowCookies } from "../../lib/zendesk";
import initCookiesConcentListener from "../../lib/cookies-manager";

type AxceptIOCallback = (a: AxeptIO) => void;

describe("Cookie manager", () => {
  let sendMetrics: jest.SpyInstance;
  let loadStonlyWidgetMock: jest.Mock;

  beforeAll(() => {
    sendMetrics = jest.spyOn(metrics, "send");
    loadStonlyWidgetMock = jest.fn();
    window.loadStonlyWidget = loadStonlyWidgetMock;
  });
  afterAll(() => {
    sendMetrics.mockRestore();
    loadStonlyWidgetMock.mockRestore();
    delete window.loadStonlyWidget;
  });
  afterEach(() => {
    sendMetrics.mockReset();
    loadStonlyWidgetMock.mockReset();
  });

  it("should do nothing if axeptio is not available", () => {
    window._axcb = undefined;
    config.COOKIE_BANNER_CLIENT_ID = "ok";
    initCookiesConcentListener();
    expect(sendMetrics).toHaveBeenCalledTimes(0);
  });

  it("should accept all if axeptio is disabled", () => {
    config.COOKIE_BANNER_CLIENT_ID = "disabled";
    initCookiesConcentListener();
    expect((window.loadStonlyWidget as jest.Mock)).toHaveBeenCalledTimes(1);
    expect(sendMetrics).toHaveBeenCalledTimes(1);
    expect(sendMetrics).toHaveBeenCalledWith("metrics", "enabled");
    expect(isZendeskAllowCookies()).toBe(true);
  });

  it("should add the axeptio callback when configuration is set", () => {
    const pushSpy = jest.fn();
    window._axcb = { push: pushSpy };
    config.COOKIE_BANNER_CLIENT_ID = "abcdef";
    initCookiesConcentListener();
    expect(pushSpy).toHaveBeenCalledTimes(1);
  });

  it("should perform the change on axeptio callback", () => {
    let callbackFn: AxceptIOCallback | null = null;
    const axeptIO: AxeptIO = {
      on: (event: string, callback: (c: CookiesComplete) => void) => {
        expect(event).toBe("cookies:complete");
        callback({ matomo: false, stonly: false, zendesk: false });
      },
    };
    window._axcb = {
      push: (f: AxceptIOCallback) => {
        callbackFn = f;
      },
    };

    config.COOKIE_BANNER_CLIENT_ID = "abcdef";
    initCookiesConcentListener();
    expect(callbackFn).toBeInstanceOf(Function);
    (callbackFn as unknown as AxceptIOCallback)(axeptIO);

    expect(sendMetrics).toHaveBeenCalledTimes(1);
    expect(sendMetrics).toHaveBeenCalledWith("metrics", "disabled");
    expect((window.loadStonlyWidget as jest.Mock)).toHaveBeenCalledTimes(0);
    expect(isZendeskAllowCookies()).toBe(false);
  });
});

