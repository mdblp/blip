/**
 * Copyright (c) 2021, Diabeloop
 * Notification tests
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
import { shallow } from "enzyme";
// import sinon from "sinon";

import { INotification, Notification, NotificationType } from "../../../pages/notifications/notification";
import { Roles } from "../../../models/shoreline";

function testNotification(): void {
  const notif: INotification = {
    date: new Date("2021-02-18T10:00:00").toString(),
    emitter: { firstName: "Jeanne", lastName: "Dubois", role: Roles.patient },
    type: NotificationType.dataShare,
  };

  it("should be exported as a function", () => {
    expect(Notification).to.be.a("function");
  });

  it("should render", () => {
    const wrapper = shallow(<Notification notification={notif} userRole={Roles.caregiver} />);
    expect(wrapper.find("div").length).to.be.ok;
  });
}

export default testNotification;
