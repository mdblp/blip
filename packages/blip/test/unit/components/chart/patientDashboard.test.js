/**
 * Copyright (c) 2022, Diabeloop
 * Tests for Patient Dashboard
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
import { shallow } from "enzyme";
import moment from "moment-timezone";
import * as sinon from "sinon";
import chai from "chai";

import { MGDL_UNITS, MS_IN_DAY } from "tideline";

import DataUtilStub from "../../../helpers/DataUtil";
import { PatientDashboard } from "../../../../app/components/chart";

const expect = chai.expect;

const PatientInfoWidget = () => <div id="patient-info-widget"/>;
const ChatWidget = () => <div id="chat-widget"/>;

describe("PatientDashboard", () => {
  const bgPrefs = {
    bgClasses: {
      "very-low": {
        boundary: 60
      },
      "low": {
        boundary: 80
      },
      "target": {
        boundary: 180
      },
      "high": {
        boundary: 200
      },
      "very-high": {
        boundary: 300
      }
    },
    bgUnits: MGDL_UNITS
  };
  const date1 = new Date(Date.now() - 60*60*1000);
  const date2 = new Date();
  const smbgs = [
    { type: "smbg", normalTime: date1.toISOString(), epoch: date1.valueOf() },
    { type: "smbg", normalTime: date2.toISOString(), epoch: date2.valueOf() }
  ];

  const baseProps = {
    tidelineData: {
      grouped: {
        smbg: smbgs,
        cbg: [],
      },
      data: smbgs,
      basicsData: {
        nData: 1,
        dateRange: [date1.toISOString(), date2.toISOString()],
        data: {
          smbg: {
            data: smbgs,
          },
          cbg: [],
        },
        days: [
          {
            type: "mostRecent",
          },
        ],
      },
    },
    bgPrefs,
    timePrefs: {
      timezoneAware: false,
      timezoneName: "US/Pacific",
    },
    chartPrefs: {
      daily: {},
    },
    permsOfLoggedInUser: {},
    trackMetric: sinon.stub(),
    user: { id: "fakeUser"},
    users: [],
    isUserHCP: false,
    onClickNavigationBack: sinon.stub(),
    onSwitchToTrends: sinon.stub(),
    onSwitchToDaily: sinon.stub(),
    onSwitchPatient: sinon.stub(),
    onClickBack: sinon.stub(),
    chatWidget: ChatWidget,
    patientInfoWidget: PatientInfoWidget,
    patientMonitored: null,
    dataUtil: new DataUtilStub(),
    profileDialog: sinon.stub().returns(<div id="profile-dialog" />),
    epochLocation: moment.utc("2014-03-13T12:00:00.000Z").valueOf(),
    msRange: MS_IN_DAY, // ['2014-03-13T00:00:00.000Z', '2014-03-13T23:59:59.999Z'],
    loading: false,
    prefixURL: "test",
    patient: {
      profile: {
        fullName: "Jane Doe"
      },
      permissions: {
        note: {},
        view: {}
      }
    },
    onSwitchToDaily: sinon.stub(),
  };

  let wrapper;

  beforeEach(() => {
    baseProps.dataUtil = new DataUtilStub();
  });

  describe("render", () => {
    before(() => {
      sinon.spy(console, "error");
      wrapper = shallow(<PatientDashboard {...baseProps} />);
    });

    after(() => {
      console.error.restore();
    });

    it("should render without errors when provided all required props", () => {
      expect(wrapper.find("#patient-dashboard")).to.have.length(1);
      expect(console.error.callCount).to.equal(0);
    });

    it("should show header", () => {
      const header = wrapper.find("#dashboard-header");
      expect(header).to.have.length(1);
    });

    it("should not show chat widget when patient is not monitored", () => {
      expect(ChatWidget).to.have.length(0);
    });

    it("should show chat widget when patient is monitored", () => {
      baseProps.patientMonitored = {userId: "1"};
      wrapper = shallow(<PatientDashboard {...baseProps} />);
      expect(wrapper.find(ChatWidget)).to.have.length(1);
    });

    it("should show patient info widget", () => {
      expect(wrapper.find(PatientInfoWidget)).to.have.length(1);
    });

    it("should show patient statistics", () => {
      const statisticsWidget = wrapper.find("#dashboard-patient-statistics");
      expect(statisticsWidget).to.have.length(1);
    });
  });
});
