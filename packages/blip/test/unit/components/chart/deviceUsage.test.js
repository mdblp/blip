/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import React from "react";
import _ from "lodash";
import { shallow, mount } from "enzyme";
import * as sinon from "sinon";
import chai from "chai";

import { MGDL_UNITS } from "tideline";
import { utils as vizUtils } from "tidepool-viz";

import DataUtilStub from "../../../helpers/DataUtil";
import DeviceUsage from "../../../../app/components/chart/deviceUsage";

import { BasicsChart } from "tideline";
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
      const header = wrapper.find("#device-usage-header")
      expect(header).to.have.length(1);
    });

    it("should show card content", () => {
      expect(wrapper.find("#device-usage-content")).to.have.length(1);
    });

    it("should show devices info", () => {
      const deviceSection = wrapper.find("#device-usage-device");
      expect(deviceSection).to.have.length(1);
      const deviceLabels = wrapper.find('.device-label');
      expect(deviceLabels).to.have.length(3);
      expect(deviceLabels.at(0).text()).to.equal("DBL:");
      expect(deviceLabels.at(1).text()).to.equal("Pump:");
      expect(deviceLabels.at(2).text()).to.equal("CGM:");
      const deviceValues = wrapper.find('.device-value');
      expect(deviceValues).to.have.length(3);
      expect(deviceValues.at(0).text()).to.equal("test-device");
      expect(deviceValues.at(1).text()).to.equal("test-pump");
      expect(deviceValues.at(2).text()).to.equal("test-cgm test-cgmName");
    });

    it("should show parameters updates", () => {
      const parametersSection = wrapper.find("#device-usage-updates");
      expect(parametersSection).to.have.length(1);
      const parameterUpdates = wrapper.find('.parameter-update');
      expect(parameterUpdates).to.have.length(2);
      const parameterDates = wrapper.find('.parameter-date');
      expect(parameterDates).to.have.length(2);
      expect(parameterDates.at(0).text()).to.equal("Jan 2, 2020 12:00 am");
      expect(parameterDates.at(1).text()).to.equal("Jan 1, 2020 12:00 am");
      const parameterChange = wrapper.find('.parameter-value');
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
