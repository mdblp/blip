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

/* eslint-disable max-len */

import _ from 'lodash';
import * as basals from '../../data/basal/fixtures';
import * as basalUtils from '../../src/utils/basal';
import { Basal } from '../../data/types';
import { addDuration } from '../../src/utils/datetime';

const MS_IN_HOUR = 3600000;
const MS_IN_DAY = 86400000;

describe('basal utilties', () => {
  describe('getBasalSequences', () => {
    it('should be a function', () => {
      assert.isFunction(basalUtils.getBasalSequences);
    });

    it('should return one sequence for scheduled flat-rate basals across midnight', () => {
      expect(basalUtils.getBasalSequences(basals.scheduledFlat))
        .to.deep.equal([basals.scheduledFlat]);
    });

    it('should return one sequence for uninterrupted scheduled basals', () => {
      expect(basalUtils.getBasalSequences(basals.scheduledNonFlat))
        .to.deep.equal([basals.scheduledNonFlat]);
    });

    it(`should return three sequences for scheduled basals interrupted by
       a non-schedule-crossing temp basal (or suspend)`, () => {
      expect(basalUtils.getBasalSequences(basals.simpleNegativeTemp))
        .to.deep.equal([
          basals.simpleNegativeTemp.slice(0, 3),
          basals.simpleNegativeTemp.slice(3, 4),
          basals.simpleNegativeTemp.slice(4),
        ]);
    });

    it(`should return four sequences for scheduled basals interrupted by
      a schedule-crossing temp basal (or suspend)`, () => {
      expect(basalUtils.getBasalSequences(basals.suspendAcrossScheduled))
        .to.deep.equal([
          basals.suspendAcrossScheduled.slice(0, 3),
          basals.suspendAcrossScheduled.slice(3, 4),
          basals.suspendAcrossScheduled.slice(4, 5),
          basals.suspendAcrossScheduled.slice(5),
        ]);
    });
  });

  describe('getBasalPathGroupType', () => {
    it('should be a function', () => {
      assert.isFunction(basalUtils.getBasalPathGroupType);
    });

    it('should return the path group type `automated` for an automated basal', () => {
      expect(basalUtils.getBasalPathGroupType({ subType: 'automated' })).to.equal('automated');
    });

    it('should return the path group type `manual` for a non-automated basal', () => {
      expect(basalUtils.getBasalPathGroupType({ subType: 'scheduled' })).to.equal('manual');
      expect(basalUtils.getBasalPathGroupType({ subType: 'temp' })).to.equal('manual');
      expect(basalUtils.getBasalPathGroupType({ subType: 'suspend' })).to.equal('manual');
    });

    it('should work with old `deliveryType` basal prop if `subType` is not set', () => {
      expect(basalUtils.getBasalPathGroupType({ deliveryType: 'scheduled' })).to.equal('manual');
      expect(basalUtils.getBasalPathGroupType({ deliveryType: 'automated' })).to.equal('automated');
      expect(basalUtils.getBasalPathGroupType({
        subType: 'automated',
        deliveryType: 'scheduled',
      })).to.equal('automated');
    });

    it('should return the path group type `regular` for a suspend suppressing non-automated delivery', () => {
      expect(basalUtils.getBasalPathGroupType({ deliveryType: 'suspend', suppressed: { subType: 'scheduled' } })).to.equal('manual');
      expect(basalUtils.getBasalPathGroupType({ subType: 'suspend', suppressed: { deliveryType: 'temp' } })).to.equal('manual');
    });

    it('should return the path group type `automated` for a suspend suppressing automated delivery', () => {
      expect(basalUtils.getBasalPathGroupType({ deliveryType: 'suspend', suppressed: { subType: 'automated' } })).to.equal('automated');
      expect(basalUtils.getBasalPathGroupType({ subType: 'suspend', suppressed: { deliveryType: 'automated' } })).to.equal('automated');
    });
  });

  describe('getBasalPathGroups', () => {
    it('should be a function', () => {
      assert.isFunction(basalUtils.getBasalPathGroups);
    });

    it('should return an array of groupings of automated and manual data', () => {
      const mixedBasals = basals.automatedAndScheduled;
      const result = basalUtils.getBasalPathGroups(mixedBasals);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(3);

      _.each(result, (group, groupIndex) => {
        expect(group).to.be.an('array');

        const expectedSubType = groupIndex === 1 ? 'scheduled' : 'automated';
        _.each(group, datum => {
          expect(datum.subType).to.equal(expectedSubType);
        });
      });
    });
  });

  describe('getEndpoints', () => {
    const sixHours = MS_IN_HOUR * 6;
    let data;

    beforeEach(() => {
      data = [
        new Basal({ deviceTime: '2018-01-01T00:00:00', duration: sixHours }),
        new Basal({ deviceTime: '2018-01-01T06:00:00', duration: sixHours }),
        new Basal({ deviceTime: '2018-01-01T12:00:00', duration: sixHours }),
        new Basal({ deviceTime: '2018-01-01T18:00:00', duration: sixHours }),
      ];
    });

    it('should return an endpoints object given a start and end time', () => {
      const start = data[0].normalTime;
      const end = addDuration(start, MS_IN_DAY);

      const expected = {
        start: {
          datetime: start,
          index: 0,
        },
        end: {
          datetime: end,
          index: 3,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end)).to.eql(expected);
    });

    // eslint-disable-next-line max-len
    it('should return an endpoints object when a single basal segment contains (is a superset of) the given 24-hour period', () => {
      const basalStart = '2017-12-23T00:00:00';
      data = [
        new Basal({
          deviceTime: basalStart,
          duration: MS_IN_DAY * 2,
        }),
      ];

      const start = addDuration(data[0].normalTime, MS_IN_HOUR);
      const end = addDuration(start, MS_IN_DAY);

      const expected = {
        start: {
          datetime: start,
          index: 0,
        },
        end: {
          datetime: end,
          index: 0,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end)).to.eql(expected);
    });

    // eslint-disable-next-line max-len
    it('should return an endpoints object with a start and end index when basal segments overlap the start and end times', () => {
      const start = data[0].normalTime;
      const end = addDuration(start, MS_IN_DAY);
      data[0].normalTime = addDuration(start, -MS_IN_HOUR);
      data[0].duration = data[0].duration + MS_IN_HOUR;

      data[data.length - 1].normalEnd = addDuration(end, MS_IN_HOUR);
      data[data.length - 1].duration = data[data.length - 1].duration + MS_IN_HOUR;

      const expected = {
        start: {
          datetime: start,
          index: 0,
        },
        end: {
          datetime: end,
          index: 3,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end)).to.eql(expected);
    });

    // eslint-disable-next-line max-len
    it('should return an endpoints object with a start and end index when basal segments overlap the only the start time and `optionalExtents` arg is `true`', () => {
      const start = data[0].normalTime;
      const end = addDuration(start, MS_IN_DAY);
      data[0].normalTime = addDuration(start, -MS_IN_HOUR);
      data[0].duration = data[0].duration + MS_IN_HOUR;

      // remove the last datum
      data.pop();

      const expected = {
        start: {
          datetime: start,
          index: 0,
        },
        end: {
          datetime: end,
          index: 2,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end, true)).to.eql(expected);
    });

    // eslint-disable-next-line max-len
    it('should return an endpoints object with a `-1` end index when basal segments overlap the only the start time and `optionalExtents` arg is `false`', () => {
      const start = data[0].normalTime;
      const end = addDuration(start, MS_IN_DAY);
      data[0].normalTime = addDuration(start, -MS_IN_HOUR);
      data[0].duration = data[0].duration + MS_IN_HOUR;

      // remove the last datum
      data.pop();

      const expected = {
        start: {
          datetime: start,
          index: 0,
        },
        end: {
          datetime: end,
          index: -1,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end, false)).to.eql(expected);
    });

    // eslint-disable-next-line max-len
    it('should return an endpoints object with a `-1` end index when basal segments overlap the only the start time and `optionalExtents` arg is omitted', () => {
      const start = data[0].normalTime;
      const end = addDuration(start, MS_IN_DAY);
      data[0].normalTime = addDuration(start, -MS_IN_HOUR);
      data[0].duration = data[0].duration + MS_IN_HOUR;

      // remove the last datum
      data.pop();

      const expected = {
        start: {
          datetime: start,
          index: 0,
        },
        end: {
          datetime: end,
          index: -1,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end)).to.eql(expected);
    });

    // eslint-disable-next-line max-len
    it('should return an endpoints object with a start and end index when basal segments overlap only the end time and `optionalExtents` arg is `true`', () => {
      const start = addDuration(data[0].normalTime, -MS_IN_HOUR);
      const end = addDuration(start, MS_IN_DAY);

      // remove the first datum
      data.shift();

      const expected = {
        start: {
          datetime: start,
          index: 0,
        },
        end: {
          datetime: end,
          index: 2,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end, true)).to.eql(expected);
    });

    // eslint-disable-next-line max-len
    it('should return an endpoints object with a `-1` start index when basal segments overlap only the end time and `optionalExtents` arg is `false`', () => {
      const start = addDuration(data[0].normalTime, -MS_IN_HOUR);
      const end = addDuration(start, MS_IN_DAY);

      // remove the first datum
      data.shift();

      const expected = {
        start: {
          datetime: start,
          index: -1,
        },
        end: {
          datetime: end,
          index: 2,
        },
      };

      expect(basalUtils.getEndpoints(data, start, end)).to.eql(expected);
    });
  });

  describe('getGroupDurations', () => {
    const sixHours = MS_IN_HOUR * 6;
    let data;

    beforeEach(() => {
      data = [
        new Basal({ deviceTime: '2018-01-01T00:00:00', duration: sixHours }),
        new Basal({ deviceTime: '2018-01-01T06:00:00', duration: sixHours }),
        new Basal({ deviceTime: '2018-01-01T12:00:00', duration: sixHours }),
        new Basal({ deviceTime: '2018-01-01T18:00:00', duration: sixHours }),
      ];
    });

    it('should return an object with `automated` and `manual` keys', () => {
      const start = data[0].normalTime;
      const end = addDuration(start, MS_IN_DAY);
      const result = basalUtils.getGroupDurations(data, start, end);

      expect(_.keysIn(result)).to.eql(['automated', 'manual']);
    });

    it('should return durations for `automated` and `manual` basal delivery', () => {
      const halfAutomatedData = _.map(data, (d, i) => (
        _.assign({}, d, {
          deliveryType: (i % 2 === 0) ? 'automated' : 'scheduled',
        })
      ));

      const start = halfAutomatedData[0].normalTime;
      const end = addDuration(start, MS_IN_DAY);
      const result = basalUtils.getGroupDurations(halfAutomatedData, start, end);

      expect(result.automated).to.equal(result.manual);
      expect(result.automated + result.manual).to.equal(MS_IN_DAY);
    });

    // eslint-disable-next-line max-len
    it('should handle partial durations for `automated` and `manual` basals that fall partially outside the start of range', () => {
      const firstDatum = data[0];
      firstDatum.deliveryType = 'automated';
      const start = addDuration(firstDatum.normalTime, MS_IN_HOUR);
      const end = addDuration(start, MS_IN_DAY);
      const result = basalUtils.getGroupDurations(data, start, end);
      expect(result.automated).to.equal(firstDatum.duration - MS_IN_HOUR);
      expect(result.automated + result.manual).to.equal(MS_IN_DAY - MS_IN_HOUR);
    });

    // eslint-disable-next-line max-len
    it('should handle partial durations for `automated` and `manual` basals that fall partially outside the end of range', () => {
      const firstDatum = data[0];
      const lastDatum = data[data.length - 1];
      lastDatum.deliveryType = 'automated';
      const start = addDuration(firstDatum.normalTime, -MS_IN_HOUR);
      const end = addDuration(start, MS_IN_DAY);
      const result = basalUtils.getGroupDurations(data, start, end);
      expect(result.automated).to.equal(lastDatum.duration - MS_IN_HOUR);
      expect(result.automated + result.manual).to.equal(MS_IN_DAY - MS_IN_HOUR);
    });
  });

  describe('getTotalBasal', () => {
    it('should be a function', () => {
      assert.isFunction(basalUtils.getTotalBasal);
    });

    it('should return 0 on an empty array', () => {
      expect(basalUtils.getTotalBasal([])).to.equal(0);
    });

    it('should return 0 on an array consisting of only 0 basals', () => {
      expect(basalUtils.getTotalBasal([{
        duration: 36e5,
        rate: 0,
      }, {
        duration: 23 * 36e5,
        rate: 0,
      }])).to.equal(0);
    });

    it('should return 11.25 on 3 hrs of 0.25 U/hr basal and 21 hrs of 0.5 U/hr', () => {
      expect(basalUtils.getTotalBasal([{
        duration: 36e5 * 3,
        rate: 0.25,
      }, {
        duration: 21 * 36e5,
        rate: 0.5,
      }])).to.equal(11.25);
    });
  });
});

/* eslint-enable max-len */
