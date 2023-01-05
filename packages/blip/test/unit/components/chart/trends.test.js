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

import React from 'react'
import moment from 'moment-timezone'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { mount } from 'enzyme'

import { MGDL_UNITS, TimeService } from 'medical-domain'
import { components as vizComponents } from 'tidepool-viz'

import Utils from '../../../../app/core/utils'
import Trends from '../../../../app/components/chart/trends'
import DataUtilStub from '../../../helpers/DataUtil'
import { CircularProgress } from '@mui/material'

/** @typedef {import('enzyme').ReactWrapper<Trends>} TrendsWrapper */

describe('Trends', () => {
  const tidelineData = {
    data: [],
    grouped: {
      cbg: []
    },
    endpoints: [
      '2018-01-01T00:00:00.000Z',
      '2021-06-20T00:00:00.000Z'
    ],
    getTimezoneAt: sinon.stub().returns('UTC')
  }

  const patient = {
    userid: '1234',
    profile: {
      fullName: 'Jone Dah'
    }
  }
  const baseProps = {
    bgPrefs: {
      bgClasses: {
        'very-low': {
          boundary: 60
        },
        'low': {
          boundary: 80
        },
        'target': {
          boundary: 180
        },
        'high': {
          boundary: 200
        },
        'very-high': {
          boundary: 300
        }
      },
      bgUnits: MGDL_UNITS
    },
    chartPrefs: {
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
        extentSize: 14
      }
    },
    epochLocation: moment.utc('2021-01-01T12:00:00.000Z').valueOf(),
    msRange: TimeService.MS_IN_DAY*7,
    patient,
    patients: [patient],
    userIsHCP: true,
    onClickNavigationBack: sinon.stub(),
    dataUtil: new DataUtilStub(),
    loading: false,
    canPrint: false,
    onClickPrint: sinon.stub(),
    onClickRefresh: sinon.stub(),
    onClickNoDataRefresh: sinon.stub(),
    onSwitchToDashboard: sinon.stub(),
    onSwitchToDaily: sinon.stub(),
    onSwitchToTrends: sinon.stub(),
    onSwitchToSettings: sinon.stub(),
    onSwitchPatient: sinon.stub(),
    onDatetimeLocationChange: sinon.stub().resolves(false),
    updateChartPrefs: sinon.stub().callsFake((_p,cb) => { if (cb) cb() }),
    trackMetric: sinon.stub(),
    dialogRangeDatePicker: (props) => <div id="range-date-picker">{`${props.start} - ${props.end}`}</div>,
    tidelineData,
    timePrefs: {
      timezoneAware: true,
      timezoneName: 'US/Pacific'
    },
    trendsState: {
      1234: {
        userid: '1234'
      }
    },
    permsOfLoggedInUser: {
      root: true
    },
    profileDialog: function ProfileDialogStub() { return <div id="profile-dialog" /> }
  }

  before(() => {
    // Avoid mounting the redux stack
    sinon.stub(Trends.prototype, 'renderChart').returns(<div />)
    sinon.stub(vizComponents, 'RangeSelect').value(
      function RangeSelect() { return <div id="range-select" /> }
    )
  })

  after(() => {
    sinon.restore()
  })

  /** @type {TrendsWrapper|null} */
  let wrapper = null

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
    baseProps.updateChartPrefs.resetHistory()
    baseProps.onDatetimeLocationChange.resetHistory()
  })

  describe('render', () => {
    beforeEach(() => {
      wrapper = mount(<Trends {...baseProps} />)
    })
    it('should show a loader when loading prop is true', () => {
      const loader = () => wrapper.find(CircularProgress)

      expect(loader().length).to.equal(0)

      wrapper.setProps({ loading: true })
      expect(loader().length).to.equal(1)
    })

    it('should render the stats', () => {
      const stats = wrapper.find('Stats')
      expect(stats.length).to.equal(1)
    })
  })

  describe('componentDidMount', () => {
    it.skip('should clamp to startDate', async () => {
      const props = {...baseProps, epochLocation: moment.utc('2014-03-13T12:00:00.000Z').valueOf() }
      wrapper = mount(<Trends {...props} />)
      await Utils.waitTimeout(10)
      expect(props.onDatetimeLocationChange.calledOnce, 'onDatetimeLocationChange.calledOnce').to.be.true
      const firstCall = props.onDatetimeLocationChange.firstCall.args
      expect(firstCall).to.be.an('array').lengthOf(2)
      expect(firstCall[0]).to.be.eq(1515369600000) // 2018-01-08T00:00:00.000Z
      expect(firstCall[1]).to.be.eq(props.chartPrefs.trends.extentSize * TimeService.MS_IN_DAY) // 14 days
      expect(wrapper.state()?.atMostRecent, 'atMostRecent').to.be.false
    })

    it.skip('should clamp to endDate', async () => {
      const props = {...baseProps, epochLocation: moment.utc('2022-01-01T00:00:00.000Z').valueOf() }
      wrapper = mount(<Trends {...props} />)
      await Utils.waitTimeout(10)
      expect(props.onDatetimeLocationChange.calledOnce, 'onDatetimeLocationChange.calledOnce').to.be.true
      const firstCall = props.onDatetimeLocationChange.firstCall.args
      expect(firstCall).to.be.an('array').lengthOf(2)
      expect(firstCall[0]).to.be.eq(1623542400000) // 2021-06-13T00:00:00.000Z
      expect(firstCall[1]).to.be.eq(props.chartPrefs.trends.extentSize * TimeService.MS_IN_DAY) // 14 days
      expect(wrapper.state()?.atMostRecent, 'atMostRecent').to.be.true
    })

    it.skip('should clamp to extendsSize', async () => {
      const tidelineData = {
        data: [],
        grouped: {
          cbg: []
        },
        endpoints: [
          '2021-06-01T00:00:00.000Z',
          '2021-06-05T00:00:00.000Z'
        ],
        getTimezoneAt: sinon.stub().returns('UTC')
      }
      const props = {...baseProps, epochLocation: moment.utc('2021-06-04T12:00:00.000Z').valueOf(), tidelineData }
      wrapper = mount(<Trends {...props} />)
      await Utils.waitTimeout(10)
      expect(props.onDatetimeLocationChange.calledOnce, 'onDatetimeLocationChange.calledOnce').to.be.true
      let firstCall = props.onDatetimeLocationChange.firstCall.args
      expect(firstCall).to.be.an('array').lengthOf(2)
      expect(firstCall[0], 'onDatetimeLocationChange[0]').to.be.eq(1622678400000) // 2021-06-03T00:00:00.000Z
      expect(firstCall[1], 'onDatetimeLocationChange[1]').to.be.eq(4 * TimeService.MS_IN_DAY)
      expect(props.updateChartPrefs.calledOnce, 'updateChartPrefs.calledOnce').to.be.true
      firstCall = props.updateChartPrefs.firstCall.args
      expect(firstCall[0], 'updateChartPrefs[0]').to.be.an('object')
      expect(firstCall[0]?.trends?.extentSize, 'extentSize').to.be.eq(4)
      expect(firstCall[1], 'updateChartPrefs[1]').to.be.a('function')
      expect(wrapper.state()?.atMostRecent, 'atMostRecent').to.be.true
    })

    it.skip('should set the extendSize', async () => {
      const props = {...baseProps, msRange: TimeService.MS_IN_DAY }
      wrapper = mount(<Trends {...props} />)
      await Utils.waitTimeout(10)
      const firstCall = props.onDatetimeLocationChange.firstCall.args
      expect(firstCall).to.be.an('array').lengthOf(2)
      expect(firstCall[0]).to.be.eq(1609502400000) // 2021-01-01T12:00:00.000Z
      expect(firstCall[1]).to.be.eq(props.chartPrefs.trends.extentSize * TimeService.MS_IN_DAY) // 14 days
      expect(wrapper.state()?.atMostRecent, 'atMostRecent').to.be.false
    })
  })

  // describe("componentDidUpdate", () => {
  //   it("should set the atMostRecent state", () => {
  //   });
  // });

})
