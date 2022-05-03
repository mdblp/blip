/**
 * Copyright (c) 2022, Diabeloop
 * Tests for Device Usage widget component
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
import * as sinon from "sinon";
import chai from "chai";

import { MGDL_UNITS , BasicsChart } from "tideline";

import DataUtilStub from "../../../helpers/DataUtil";
import DeviceUsage from "../../../../app/components/chart/deviceUsage";

import Stats from "../../../../app/components/chart/stats";

const expect = chai.expect;

describe("DeviceUsage", () => {
  const baseProps = {
    bgPrefs: {
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
    },
    bgSource: "cbg",
    chartPrefs: {
      basics: {},
      daily: {},
      trends: {
        activeDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        extentSize: 14,
        showingCbg: true,
        showingSmbg: false,
        boxOverlay: true,
        grouped: true,
        showingLines: false
      },
      bgLog: {},
    },
    chartType: "basics",
    dataUtil: new DataUtilStub(),
    endpoints: [
      "2018-01-15T00:00:00.000Z",
      "2018-01-31T00:00:00.000Z",
    ],
    loading: false,
    timePrefs: {
      timezoneAware: false,
      timezoneName: "UTC",
    },
    patient:{ userid: "1234" },
    tidelineData: {
      data: [],
      grouped: {
        cbg: [],
        pumpSettings: [{
          payload: {
            device: {
              manufacturer: "test-device"
            },
            pump: {
              manufacturer: "test-pump"
            },
            cgm: {
              manufacturer: "test-cgm",
              name: "test-cgmName"
            },
            history: [
              {
                parameters:[
                  {
                    changeType: "added",
                    level:1,
                    name: "test",
                    value: "12",
                    unit: "%",
                    effectiveDate:"2020-01-01T00:00:00Z"
                  }
                ]
              },
              {
                parameters:[
                  {
                    changeType: "updated",
                    level:1,
                    name: "test",
                    value: "10",
                    unit: "%",
                    effectiveDate:"2020-01-02T00:00:00Z"
                  }
                ],
              },
            ]
          }
        }]
      },
      endpoints: [
        "2018-01-01T00:00:00.000Z",
        "2021-06-20T00:00:00.000Z"
      ],
      getTimezoneAt: sinon.stub().returns("UTC"),
    },
    permsOfLoggedInUser: {
      root: true,
    },
    trackMetric: sinon.stub(),
  };

  let wrapper;

  beforeEach(() => {
    baseProps.dataUtil = new DataUtilStub();
  });

  describe("render", () => {
    before(() => {
      sinon.spy(console, "error");
      wrapper = shallow(<DeviceUsage {...baseProps} />);
    });

    after(() => {
      console.error.restore();
    });

    it("should render without errors when provided all required props", () => {
      expect(wrapper.find("#device-usage")).to.have.length(1);
      expect(console.error.callCount).to.equal(0);
    });

    it("should show card header", () => {
      const header = wrapper.find("#device-usage-header");
      expect(header).to.have.length(1);
    });

    it("should show card content", () => {
      expect(wrapper.find("#device-usage-content")).to.have.length(1);
    });

    it("should show devices info", () => {
      const deviceSection = wrapper.find("#device-usage-device");
      expect(deviceSection).to.have.length(1);
      const deviceLabels = wrapper.find(".device-label");
      expect(deviceLabels).to.have.length(3);
      expect(deviceLabels.at(0).text()).to.equal("dbl:");
      expect(deviceLabels.at(1).text()).to.equal("Pump:");
      expect(deviceLabels.at(2).text()).to.equal("CGM:");
      const deviceValues = wrapper.find(".device-value");
      expect(deviceValues).to.have.length(3);
      expect(deviceValues.at(0).text()).to.equal("test-device");
      expect(deviceValues.at(1).text()).to.equal("test-pump");
      expect(deviceValues.at(2).text()).to.equal("test-cgm test-cgmName");
    });

    it("should show parameters updates", () => {
      const parametersSection = wrapper.find("#device-usage-updates");
      expect(parametersSection).to.have.length(1);
      const parameterUpdates = wrapper.find(".parameter-update");
      expect(parameterUpdates).to.have.length(2);
      const parameterDates = wrapper.find(".parameter-date");
      expect(parameterDates).to.have.length(2);
      expect(parameterDates.at(0).text()).to.equal("Jan 2, 2020 12:00 am");
      expect(parameterDates.at(1).text()).to.equal("Jan 1, 2020 12:00 am");
      const parameterChange = wrapper.find(".parameter-value");
      expect(parameterChange).to.have.length(2);
      expect(parameterChange.at(0).text()).to.equal("test (12 % -> 10 %)");
      expect(parameterChange.at(1).text()).to.equal("test (12 %)");
    });

    it("should show sensor usage statistics", () => {
      expect(wrapper.find(Stats)).to.have.length(1);
    });

    it("should show Cartridge changes", () => {
      expect(wrapper.find(BasicsChart)).to.have.length(1);
    });

  });
});
