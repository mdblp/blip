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
 * not, you can obtain one from Tidepoorol Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import _ from "lodash";
import moment from "moment-timezone";
import { expect } from "chai";

import { TidelineData } from "tideline";

import { types } from "../../../data/types";
import * as dataUtils from "../../../src/utils/print/data";

describe("print data utils", () => {

  /** @type {TidelineData} */
  let tidelineData;
  beforeEach(async () => {
    const bolus = new types.Bolus({ deviceTime: "2019-05-26T11:00:01", timezone: "Europe/Paris" });
    bolus.wizard = new types.Wizard({ deviceTime: "2019-05-26T11:00:01", timezone: "Europe/Paris" });
    const data = [
      new types.Upload({ deviceTime: "2019-05-20T08:59:37", timezone: "Europe/Paris" }),
      new types.CBG({ deviceTime: "2019-05-20T08:59:38", timezone: "Europe/Paris" }),
      new types.Wizard({ deviceTime: "2019-05-22T14:33:15", timezone: "Europe/Paris" }),
      bolus,
      new types.SMBG({ deviceTime: "2019-05-26T11:20:27", timezone: "Europe/Paris" }),
      new types.Basal({ deviceTime: "2019-05-26T10:20:27", timezone: "Europe/Paris" }),
      new types.Basal({ deviceTime: "2019-05-26T11:20:27", timezone: "Europe/Paris", deliveryType: "automated" }),
      new types.Food({ deviceTime: "2019-05-26T10:00:01", timezone: "Europe/Paris" }),
      new types.PumpSettings({ deviceTime: "2019-05-26T08:59:38", timezone: "Europe/Paris" }),
      new types.CBG({ deviceTime: "2019-05-26T08:59:38", timezone: "Europe/Paris" }),
      new types.CBG({ deviceTime: "2019-05-27T08:59:38", timezone: "Europe/Paris" }), // Should be left over
    ];

    tidelineData = new TidelineData({ timePrefs: { timezoneAware: true, timezoneName: "Europe/Paris" } });
    await tidelineData.addData(data);
  });

  describe("selectDailyViewData", () => {
    let filtered;
    let latestFilteredData;
    let latestFilteredDate;

    beforeEach(() => {
      const startDate = moment.tz("2019-05-20", "Europe/Paris").locale("fr").startOf("week");
      const endDate = moment.tz("2019-05-20", "Europe/Paris").locale("fr").endOf("week");
      filtered = dataUtils.selectDailyViewData(tidelineData, startDate, endDate);
      latestFilteredDate = _.last(_.keys(filtered.dataByDate));
      latestFilteredData = filtered.dataByDate[latestFilteredDate];
    });

    it("should export a selectDailyViewData function", () => {
      expect(dataUtils.selectDailyViewData).to.be.a("function");
    });

    it("should return the most recent data available", () => {
      const expectDates = ["2019-05-20", "2019-05-21", "2019-05-22", "2019-05-23", "2019-05-24", "2019-05-25", "2019-05-26"];
      expect(latestFilteredDate).to.be.equal("2019-05-26");
      const dataByDate = _.keys(filtered.dataByDate);
      expect(dataByDate, JSON.stringify(dataByDate)).to.be.deep.equal(expectDates);
      expect(latestFilteredData.bounds).to.be.deep.equal([1558821600000, 1558907999999]);
    });

    it("should return basal data by date", () => {
      expect(latestFilteredData.data.basal).to.be.an("array");
      expect(latestFilteredData.data.basal.length > 0).to.be.true;
    });

    it("should return basal sequence data by date", () => {
      expect(latestFilteredData.data.basalSequences).to.be.an("array");
      expect(latestFilteredData.data.basalSequences.length > 0).to.be.true;
    });

    it("should return time in loop mode data by date", () => {
      expect(latestFilteredData.data.timeInAutoRatio).to.be.an("object");
      expect(latestFilteredData.data.timeInAutoRatio).to.have.all.keys(["automated", "manual"]);
    });

    it("should return bolus data by date", () => {
      expect(latestFilteredData.data.bolus).to.be.an("array");
      expect(latestFilteredData.data.bolus.length > 0).to.be.true;
    });

    it("should return cbg data by date", () => {
      expect(latestFilteredData.data.cbg).to.be.an("array");
      expect(latestFilteredData.data.cbg.length > 0).to.be.true;
    });

    it("should return smbg data by date", () => {
      expect(latestFilteredData.data.smbg).to.be.an("array");
      expect(latestFilteredData.data.smbg.length > 0).to.be.true;
    });

    it("should return the bg range", () => {
      expect(filtered.bgRange).to.be.an("array");
      expect(filtered.bgRange.length).to.equal(2);
    });

    it("should return the bolus range", () => {
      expect(filtered.bolusRange).to.be.an("array");
      expect(filtered.bolusRange.length).to.equal(2);
    });

    it("should return the basal range", () => {
      expect(filtered.basalRange).to.be.an("array");
      expect(filtered.basalRange.length).to.equal(2);
    });

    it("should return the latest pump upload", () => {
      expect(filtered.latestPumpUpload).to.be.an("object");
      expect(filtered.latestPumpUpload).to.equal(tidelineData.grouped.upload[0]);
    });
  });
});
