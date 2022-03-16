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

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { act } from "@testing-library/react-hooks/dom";

import { PasswordConfirm } from "../../../components/password/password-confirm";
import PasswordLeakService from "../../../services/password-leak";
import { Simulate, SyntheticEventData } from "react-dom/test-utils";

describe("Confirm password", () => {

  let container: HTMLElement | null = null;
  const onErrorStub = jest.fn();
  const onSuccessStub = jest.fn();
  let passwordLeakService: jest.SpyInstance;
  const securedPassword = "ThisPasswordIsSecured:)";

  const mountComponent = async (): Promise<void> => {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <PasswordConfirm
            onError={() => onErrorStub()}
            onSuccess={(passwordToUse) => onSuccessStub(passwordToUse)}
          />, container, resolve);
      });
    });
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  function setPasswords(password: string, confirmPassword: string) {
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement;
    Simulate.change(passwordInput, { target: { value: password } } as unknown as SyntheticEventData);
    Simulate.change(confirmPasswordInput, { target: { value: confirmPassword } } as unknown as SyntheticEventData);
  }

  it("should call onErrorStub when password is too weak", async () => {
    await mountComponent();
    const weakPassword = "IAMWEAK";
    setPasswords(weakPassword, weakPassword);
    expect(onErrorStub).toHaveBeenCalled();
    expect(onSuccessStub).toHaveBeenCalledTimes(0);
  });

  it("should call onErrorStub when passwords don't match", async () => {
    await mountComponent();
    setPasswords(securedPassword, `${securedPassword}?`);
    expect(onErrorStub).toHaveBeenCalled();
    expect(onSuccessStub).toHaveBeenCalledTimes(0);
  });

  it("should call onErrorStub when password has leaked", async () => {
    await mountComponent();
    passwordLeakService = jest.spyOn(PasswordLeakService, "verifyPassword").mockResolvedValue({
      hasLeaked: true,
    });
    setPasswords(securedPassword, securedPassword);
    await Promise.resolve();
    expect(onErrorStub).toHaveBeenCalled();
    expect(onSuccessStub).not.toHaveBeenCalled();
    expect(passwordLeakService).toHaveBeenCalled();
    passwordLeakService.mockRestore();
  });

  it("should call onSuccess when passwords are the same and secured but cannot make sure that is has been leaked", async () => {
    await mountComponent();
    passwordLeakService = jest.spyOn(PasswordLeakService, "verifyPassword").mockResolvedValue({ hasLeaked: undefined });
    setPasswords(securedPassword, securedPassword);
    await Promise.resolve();
    expect(onSuccessStub).toHaveBeenCalled();
    expect(passwordLeakService).toHaveBeenCalledWith(securedPassword);
    passwordLeakService.mockRestore();
  });

  it("should call onSuccess when passwords are the same and secured", async () => {
    await mountComponent();
    passwordLeakService = jest.spyOn(PasswordLeakService, "verifyPassword").mockResolvedValue({
      hasLeaked: false,
    });
    setPasswords(securedPassword, securedPassword);
    await Promise.resolve();
    expect(onSuccessStub).toHaveBeenCalled();
    expect(passwordLeakService).toHaveBeenCalledWith(securedPassword);
    passwordLeakService.mockRestore();
  });
});
