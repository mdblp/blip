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
import { shallow } from "enzyme";
import * as sinon from "sinon";
import chai from "chai";

import { MGDL_UNITS } from "tideline";

import DataUtilStub from "../../../helpers/DataUtil";
import PatientStatistics from "../../../../app/components/chart/patientStatistics";
import Stats from "../../../../app/components/chart/stats";

const expect = chai.expect;

describe("PatientStatistics", () => {
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
    dataUtil: new DataUtilStub(),
    endpoints: [
      "2018-01-15T00:00:00.000Z",
      "2018-01-31T00:00:00.000Z",
    ],
    loading: false
  };

  let wrapper;

  beforeEach(() => {
    baseProps.dataUtil = new DataUtilStub();
  });

  describe("render", () => {
    before(() => {
      sinon.spy(console, "error");
      wrapper = shallow(<PatientStatistics {...baseProps} />);
    });

    after(() => {
      console.error.restore();
    });

    it("should render without errors when provided all required props", () => {
        expect(wrapper.find("#patient-statistics")).to.have.length(1);
        expect(console.error.callCount).to.equal(0);
    });

    it("should show card header", () => {
      const header = wrapper.find("#patient-statistics-header")
      expect(header).to.have.length(1);
    });

    it("should show card content", () => {
      expect(wrapper.find("#patient-statistics-content")).to.have.length(1);
    });

    it("should show patient statistics", () => {
      const statsComponent = wrapper.find(Stats);
      expect(statsComponent).to.have.length(1);
      expect(statsComponent.prop('chartType')).to.be.equal("patientStatistics")
    });
  });
});
