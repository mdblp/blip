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
import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import _ from "lodash";

import { SignUpFormStateProvider } from "../../../pages/signup/signup-formstate-context";
import SignupAccountSelector from "../../../pages/signup/signup-account-selector";
import { UserRoles } from "../../../models/shoreline";

function TestSignupAccountForm(): void {

  const signupForm = (): JSX.Element => {
    return (
      <SignUpFormStateProvider>
        <SignupAccountSelector handleBack={_.noop} handleNext={_.noop} />
      </SignUpFormStateProvider>);
  };

  let wrapper: ReactWrapper;

  beforeEach(async () => {
    wrapper = await mount(signupForm());
  });

  afterEach(() => {
    wrapper.unmount();
  });

  const nextButtonDisabled = (wrapper: ReactWrapper) => {
    expect(wrapper.find("button#button-signup-steppers-next").prop("disabled")).to.be.true;
  };

  const nextButtonEnabled = (wrapper: ReactWrapper) => {
    expect(wrapper.find("button#button-signup-steppers-next").prop("disabled")).to.be.false;
  };

  it("should disable next button when nothing is selected", async () => {
    nextButtonDisabled(wrapper);
  });

  it("should disable next button when patient is selected", async () => {
    wrapper.find("input#signup-account-selector-radio-patient").simulate("change", { target: { value: UserRoles.patient } });
    nextButtonDisabled(wrapper);
  });

  it("should enable next button when hcp or caregiver is selected", async () => {
    wrapper.find("input#signup-account-selector-radio-hcp").simulate("change", { target: { value: UserRoles.hcp } });
    nextButtonEnabled(wrapper);
    wrapper.find("input#signup-account-selector-radio-caregiver").simulate("change", { target: { value: UserRoles.caregiver } });
    nextButtonEnabled(wrapper);
  });
}

export default TestSignupAccountForm;
