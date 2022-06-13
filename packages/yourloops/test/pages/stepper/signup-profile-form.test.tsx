/**
 * Copyright (c) 2021, Diabeloop
 * password strength meter component tests
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
import _ from "lodash";

import { SignUpFormStateProvider } from "../../../pages/signup/signup-formstate-context";
import SignUpProfileForm from "../../../pages/signup/signup-profile-form";
import * as authHookMock from "../../../lib/auth";
import User from "../../../lib/auth/user";
import { UserRoles } from "../../../models/shoreline";

jest.mock("../../../lib/auth");
describe("Signup profile form", () => {
  let container: HTMLElement | null = null;

  const mountComponent = (): void => {
    act(() => {
      render(
        <SignUpFormStateProvider>
          <SignUpProfileForm handleBack={_.noop} handleNext={_.noop} />
        </SignUpFormStateProvider>, container);
    });
  };

  beforeAll(() => {
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
        } as User,
      };
    });
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it("should not render the drop down list when caregiver", () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.caregiver,
        } as User,
      };
    });
    mountComponent();
    const dropDownList = document.querySelector("#hcp-profession-selector");
    expect(dropDownList).toBeNull();
  });

  it("should render the drop down list when HCP", () => {
    mountComponent();
    const dropDownList = document.querySelector("#hcp-profession-selector");
    expect(dropDownList).not.toBeNull();
  });
});

