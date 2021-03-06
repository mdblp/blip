/**
 * Copyright (c) 2021, Diabeloop
 * useSnackbar hook tests
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

import * as React from "react";
import sinon from "sinon";
import { expect } from "chai";
import { shallow } from "enzyme";

import { renderHook, act } from "@testing-library/react-hooks/dom";

import { SnackbarContext, Snackbar, DefaultSnackbarContext } from "../../../components/utils/snackbar";

function testSnackbar(): void {
  const spies = {
    error: sinon.spy(),
    warning: sinon.spy(),
    info: sinon.spy(),
    success: sinon.spy(),
    clearAlerts: sinon.spy(),
    removeAlert: sinon.spy(),
  };
  const context: SnackbarContext = {
    error: spies.error,
    warning: spies.warning,
    info: spies.info,
    success: spies.success,
    clearAlerts: spies.clearAlerts,
    removeAlert: spies.removeAlert,
    alerts: [],
  };

  beforeEach(() => {
    spies.error.resetHistory();
    spies.warning.resetHistory();
    spies.info.resetHistory();
    spies.success.resetHistory();
    spies.clearAlerts.resetHistory();
    spies.removeAlert.resetHistory();
    context.alerts = [];
  });

  it("should renders without crashing", () => {
    const { result } = renderHook(() => <Snackbar {...context} />);
    expect(result).to.exist;
  });

  it("hook should return the needed functions", () => {
    // eslint-disable-next-line new-cap
    const hook = renderHook(DefaultSnackbarContext);

    expect(hook.result.current.error).to.be.a("function");
    expect(hook.result.current.warning).to.be.a("function");
    expect(hook.result.current.info).to.be.a("function");
    expect(hook.result.current.success).to.be.a("function");
    expect(hook.result.current.clearAlerts).to.be.a("function");
    expect(hook.result.current.removeAlert).to.be.a("function");
    expect(hook.result.current.alerts).to.be.an("array");
  });

  it("shoud render the alert if any", () => {
    // eslint-disable-next-line new-cap
    const hook = renderHook(DefaultSnackbarContext);
    act(() => {
      hook.result.current.info("test");
    });
    const wrapper = shallow(<Snackbar {...hook.result.current} />);
    wrapper.update();
    expect(wrapper.exists("#alert-message")).to.be.true;
  });
}

export default testSnackbar;
