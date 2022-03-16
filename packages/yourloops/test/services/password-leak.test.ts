/**
 * Copyright (c) 2022, Diabeloop
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

import { AxiosResponse } from "axios";

import EncoderService from "../../services/encoder";
import HttpService from "../../services/http";
import PasswordLeakService from "../../services/password-leak";

describe("Password leak service", () => {

  let httpGetStub : jest.SpyInstance;
  let encodeSHA1Stub : jest.SpyInstance;
  const hashToReturn = "8EF80F372246EBBB93B988437EB9B43E7B93DE62";
  const password = "Bienveillant";

  beforeEach(() => {
    encodeSHA1Stub = jest.spyOn(EncoderService, "encodeSHA1").mockResolvedValue(hashToReturn);
  });

  afterEach(() => {
    encodeSHA1Stub.mockRestore();
    httpGetStub.mockRestore();
  });

  describe("verifyPassword", () => {
    it("should return that the password has leaked", async () => {
      //given
      const expected = { hasLeaked: true };
      httpGetStub = jest.spyOn(HttpService, "get").mockResolvedValue({ data: "F372246EBBB93B988437EB9B43E7B93DE62" } as AxiosResponse);

      //when
      const actual = await PasswordLeakService.verifyPassword(password);

      //then
      expect(actual).toStrictEqual(expected);
    });

    it("should return that the password has not leaked", async () => {
      //given
      const expected = { hasLeaked: false };
      httpGetStub = jest.spyOn(HttpService, "get").mockResolvedValue({ data: "fakeHash" } as AxiosResponse);

      //when
      const actual = await PasswordLeakService.verifyPassword(password);

      //then
      expect(actual).toStrictEqual(expected);
    });

    it("should return that the service is unavailable when http get fails", async () => {
      //given
      const expected: { hasLeaked?: string } = { hasLeaked: undefined };
      httpGetStub = jest.spyOn(HttpService, "get").mockRejectedValue(new Error());

      //when
      const actual = await PasswordLeakService.verifyPassword(password);

      //then
      expect(actual).toStrictEqual(expected);
    });
  });
});
