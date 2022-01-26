/**
 * Copyright (c) 2021, Diabeloop
 * Lib tests
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

import testsSoup from "./soup";
import testCookiesManager from "./cookies-manager.test";
import testLanguage from "./language.test";
import testMetrics from "./metrics.test";
import testZendesk from "./zendesk.test";
import testAuth from "./auth";
import testNotifications from "./notifications";
import testRegex from "./regex.test";
import testTeam from "./team";

function testLib(): void {
  describe("SOUP", testsSoup);
  describe("CookiesManager", testCookiesManager);
  describe("Language", testLanguage);
  describe("Metrics", testMetrics);
  describe("Zendesk", testZendesk);
  describe("Auth", testAuth);
  describe("Team", testTeam);
  describe("Notifications", testNotifications);
  describe("Regex", testRegex);
}

export default testLib;
