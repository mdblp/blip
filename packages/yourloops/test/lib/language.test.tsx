/**
 * Copyright (c) 2021, Diabeloop
 * language manager tests
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

import i18n from "i18next";
import moment from "moment-timezone";

import config from "../../lib/config";
import { getCurrentLang, getLangName, init as i18nInit } from "../../lib/language";

describe("Language", () => {
  const zeSpy = jest.fn();

  beforeAll(() => {
    i18nInit();
    window.zE = zeSpy;
    config.METRICS_SERVICE = "matomo";
  });

  afterAll(async () => {
    delete window.zE;
    await i18n.changeLanguage("en");
    delete window._paq;
    config.METRICS_SERVICE = "disabled";
  });

  beforeEach(() => {
    zeSpy.mockReset();
    window._paq = [];
  });

  it("should update zendesk & moment locale on change", async () => {
    await i18n.changeLanguage("fr");
    expect(zeSpy).toHaveBeenCalledTimes(1);
    expect(moment.locale()).toBe("fr");
    expect(localStorage.getItem("lang")).toBe("fr");
    expect(getCurrentLang()).toBe("fr");
    expect(window._paq).toEqual([["setCustomVariable", 1, "UserLang", "fr", "visit"]]);
  });

  it("getLangName should return the language name", () => {
    expect(getLangName("en")).toBe("English");
    expect(getLangName("fr")).toBe("Français");
    expect(getLangName("de")).toBe("Deutsch");
    expect(getLangName("es")).toBe("Español");
    expect(getLangName("it")).toBe("Italiano");
    expect(getLangName("nl")).toBe("Nederlands");
  });
});

