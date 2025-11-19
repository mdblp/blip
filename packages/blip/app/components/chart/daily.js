/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
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
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import bows from 'bows'
import moment from 'moment-timezone'
import ReactResizeDetector from 'react-resize-detector'
import i18next from 'i18next'
import { chartDailyFactory } from 'tideline'
import { TimeService } from 'medical-domain'
import Footer from './footer'
import {
  AlarmEventTooltip,
  BasalTooltip,
  BloodGlucoseTooltip,
  BolusTooltip,
  ConfidentialTooltip,
  EatingShortlyTooltip,
  EventsSuperpositionPopover,
  IobTooltip,
  NightModeTooltip,
  ParameterTooltip,
  PhysicalTooltip,
  RescueCarbsTooltip,
  ReservoirTooltip,
  TimeChangeTooltip,
  WarmUpTooltip,
  ZenModeTooltip
} from 'dumb'
import Box from '@mui/material/Box'
import { DailyDatePicker } from 'yourloops/components/date-pickers/daily-date-picker'
import { PatientStatistics } from 'yourloops/components/statistics/patient-statistics'
import SpinningLoader from 'yourloops/components/loaders/spinning-loader'
import metrics from 'yourloops/lib/metrics'

/**
 * @typedef { import('medical-domain').MedicalDataService } MedicalDataService
 * @typedef { import('../../index').DatePicker } DatePicker
 */

class DailyChart extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    bgClasses: PropTypes.object.isRequired,
    bgUnits: PropTypes.string.isRequired,
    epochLocation: PropTypes.number.isRequired,
    msRange: PropTypes.number.isRequired,
    patient: PropTypes.object,
    refToAttachResize: PropTypes.object.isRequired,
    tidelineData: PropTypes.object.isRequired,
    timePrefs: PropTypes.object.isRequired,
    // message handlers
    onCreateMessage: PropTypes.func.isRequired,
    onShowMessageThread: PropTypes.func.isRequired,
    // other handlers
    onDatetimeLocationChange: PropTypes.func.isRequired,
    onTransition: PropTypes.func.isRequired,
    onBasalHover: PropTypes.func.isRequired,
    onBolusHover: PropTypes.func.isRequired,
    onSMBGHover: PropTypes.func.isRequired,
    onCBGHover: PropTypes.func.isRequired,
    onCarbHover: PropTypes.func.isRequired,
    onIobHover: PropTypes.func.isRequired,
    onReservoirHover: PropTypes.func.isRequired,
    onPhysicalHover: PropTypes.func.isRequired,
    onParameterHover: PropTypes.func.isRequired,
    onWarmUpHover: PropTypes.func.isRequired,
    onAlarmEventHover: PropTypes.func.isRequired,
    onNightModeHover: PropTypes.func.isRequired,
    onZenModeHover: PropTypes.func.isRequired,
    onConfidentialHover: PropTypes.func.isRequired,
    onTooltipOut: PropTypes.func.isRequired,
    onEventSuperpositionClick: PropTypes.func.isRequired,
    onChartMounted: PropTypes.func.isRequired,
    trackMetric: PropTypes.func.isRequired,
    isEatingShortlyEnabled: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    this.chartOpts = [
      'bgClasses',
      'bgUnits',
      'timePrefs',
      'onBasalHover',
      'onBolusHover',
      'onSMBGHover',
      'onCBGHover',
      'onCarbHover',
      'onEatingShortlyHover',
      'onReservoirHover',
      'onPhysicalHover',
      'onParameterHover',
      'onConfidentialHover',
      'onIobHover',
      'onWarmUpHover',
      'onAlarmEventHover',
      'onNightModeHover',
      'onTimeChangeHover',
      'onZenModeHover',
      'onTooltipOut',
      'onEventSuperpositionClick',
      'trackMetric',
      'isEatingShortlyEnabled'
    ]

    this.log = bows('DailyChart')
    this.state = {
      /** @type {function | null} */
      chart: null,
      /** Avoid recreate the chart on loading: This leads to a crash */
      needRecreate: false
    }
    /** @type {React.RefObject} */
    this.refNode = React.createRef()
    this.viewHasBeenInitialized = false // This boolean is only here because react-resize-detector has to be mocked in ITs... :(
    this.unmountingInProgress = false
  }

  componentDidUpdate() {
    // Prevent the scroll drag while loading
    const { loading } = this.props
    const { chart, needRecreate } = this.state
    if (!this.viewHasBeenInitialized) {
      this.handleWindowResize()
    }
    if (chart) {
      chart.loadingInProgress = loading
      if (needRecreate && !loading && !chart.isInTransition()) {
        this.setState({ needRecreate: false })
        this.reCreateChart()
      }
    }
  }

  componentWillUnmount() {
    this.unmountChart()
  }

  mountChart() {
    if (this.state.chart === null && !this.unmountingInProgress) {
      const { tidelineData, epochLocation } = this.props
      this.log.debug('Mounting...')
      const chart = chartDailyFactory(this.refNode.current, tidelineData, _.pick(this.props, this.chartOpts))
      this.setState({ chart }, () => {
        this.state.chart.setAtDate(epochLocation)
        this.bindEvents()
        this.props.onChartMounted()
      })
    }
  }

  unmountChart(recreate = false) {
    const { chart } = this.state
    if (chart !== null && !this.unmountingInProgress) {
      this.unmountingInProgress = true
      this.log('Unmounting...')
      this.unbindEvents()
      chart.destroy()
      this.setState({ chart: null }, () => {
        this.unmountingInProgress = false
        if (recreate) {
          this.mountChart()
        }
      })
    } else if (recreate) {
      this.mountChart()
    }
  }

  bindEvents() {
    const { chart } = this.state
    chart.emitter.on('createMessage', this.props.onCreateMessage)
    chart.emitter.on('inTransition', this.props.onTransition)
    chart.emitter.on('messageThread', this.props.onShowMessageThread)
    chart.emitter.on('navigated', this.props.onDatetimeLocationChange)
  }

  unbindEvents() {
    const { chart } = this.state
    chart.emitter.off('createMessage', this.props.onCreateMessage)
    chart.emitter.off('inTransition', this.props.onTransition)
    chart.emitter.off('messageThread', this.props.onShowMessageThread)
    chart.emitter.off('navigated', this.props.onDatetimeLocationChange)
  }

  render() {
    return (
      <React.Fragment>
        <ReactResizeDetector
          targetRef={this.props.refToAttachResize}
          onResize={this.handleWindowResize}
          handleWidth
          handleHeight
        />
        <div
          id="tidelineContainer"
          data-testid="tidelineContainer"
          className="patient-data-chart"
          ref={this.refNode}
        />
      </React.Fragment>
    )
  }

  handleWindowResize = () => {
    const { loading } = this.props
    const { chart } = this.state
    const needRecreate = loading || chart?.isInTransition() === true
    if (!needRecreate) {
      this.viewHasBeenInitialized = true
      this.reCreateChart()
    } else {
      this.log.info('Delaying chart re-creation: loading or transition in progress')
    }
  }

  reCreateChart() {
    const { chart } = this.state
    this.log.info(chart === null ? 'Creating chart...' : 'Recreating chart...')
    this.unmountChart(true)
  }

  rerenderChartData() {
    const { chart } = this.state
    if (chart !== null) {
      this.log.info('Rerendering chart data...')
      chart.renderPoolsData(true)
    }
  }

  goToDate(/** @type {Date} */ date) {
    this.state.chart.panToDate(date)
  }

  goToMostRecent() {
    this.state.chart.setAtDate(null, true)
  }

  panBack() {
    this.state.chart.panBack()
  }

  panForward() {
    this.state.chart.panForward()
  }

  createMessage(message) {
    return this.state.chart.createMessage(message)
  }

  editMessage(message) {
    return this.state.chart.editMessage(message)
  }
}

/**
 * @typedef {{tidelineData: MedicalDataService; epochLocation: number; bgPrefs: any; msRange: number; loading: boolean; datePicker?: DatePicker}} DailyProps
 */

/** @augments React.Component<DailyProps> */
class Daily extends React.Component {
  static propTypes = {
    patient: PropTypes.object.isRequired,
    device: PropTypes.object,
    bgPrefs: PropTypes.object.isRequired,
    timePrefs: PropTypes.object.isRequired,
    epochLocation: PropTypes.number.isRequired,
    msRange: PropTypes.number.isRequired,
    tidelineData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    // refresh handler
    onClickRefresh: PropTypes.func.isRequired,
    // message handlers
    onCreateMessage: PropTypes.func.isRequired,
    onShowMessageThread: PropTypes.func.isRequired,
    // navigation handlers
    onDatetimeLocationChange: PropTypes.func.isRequired,
    isEatingShortlyEnabled: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    /** @type {React.RefObject<DailyChart>} */
    this.refToAttachResize = React.createRef()
    this.chartRef = React.createRef()
    this.log = bows('DailyView')
    this.state = {
      atMostRecent: this.isAtMostRecent(),
      inTransition: false,
      title: this.getTitle(props.epochLocation),
      tooltip: null,
      chartMounted: false
    }

    /** @type {{tidelineData: MedicalDataService}} */
    const { tidelineData } = props
    const { startDate, endDate } = tidelineData.getLocaleTimeEndpoints()
    /** @type {Date} */
    this.startDate = Date.parse(startDate)
    /** @type {Date} */
    this.endDate = Date.parse(endDate)
    this.onChartMounted = this.onChartMounted.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { epochLocation, loading } = this.props
    const { epochLocation: prevEpochLocation } = prevProps
    const { title } = this.state

    if (loading && !prevProps.loading) {
      this.setState({ title: i18next.t('Loading...') })
    } else if (epochLocation !== prevEpochLocation || (!loading && prevProps.loading)) {
      const nowTitle = this.getTitle(epochLocation)
      if (title !== nowTitle) {
        this.setState({ title: nowTitle, atMostRecent: this.isAtMostRecent() })
      }
    }
  }

  onChartMounted() {
    this.setState({ chartMounted: true })
  }

  render() {
    const { tidelineData, epochLocation, msRange, loading, timePrefs } = this.props
    const { inTransition, atMostRecent, tooltip, title } = this.state
    const trackMetric = metrics.send
    const endpoints = this.getEndpoints()
    const dateFilter = {
      start: Date.parse(endpoints[0]).valueOf(),
      end: Date.parse(endpoints[1]).valueOf()
    }
    const onSelectedDateChange = loading || inTransition ? _.noop : (/** @type {string|undefined} */ date) => {
      if (typeof date === 'string' && this.chartRef.current !== null) {
        const timezone = tidelineData.getTimezoneAt(Date.parse(date).valueOf())
        const mDate = moment.tz(date, timezone).add(TimeService.MS_IN_DAY / 2, 'milliseconds')
        this.log.debug('DatePicker', date, timezone, mDate.toISOString())
        this.chartRef.current.goToDate(mDate.toDate())
      }
    }

    return (
      <div id="tidelineMain" className="daily">
        <Box data-testid="daily-view-content" className="container-box-outer patient-data-content-outer" display="flex" flexDirection="column">
          <Box display="flex">
            {this.state.chartMounted &&
              <DailyDatePicker
                atMostRecent={atMostRecent}
                displayedDate={title}
                date={epochLocation}
                endDate={this.endDate}
                inTransition={inTransition}
                loading={loading}
                onBackButtonClick={this.handlePanBack}
                onMostRecentButtonClick={this.handleClickMostRecent}
                onNextButtonClick={this.handlePanForward}
                onSelectedDateChange={onSelectedDateChange}
                startDate={this.startDate}
              />
            }
          </Box>
          <Box className="chart-with-stats-wrapper" ref={this.refToAttachResize}>
            <div className="container-box-inner patient-data-content-inner light-rounded-border">
              <div className="patient-data-content-daily">
                {loading && <SpinningLoader className="centered-spinning-loader" />}
                <DailyChart
                  refToAttachResize={this.refToAttachResize}
                  loading={loading}
                  bgClasses={this.props.bgPrefs.bgClasses}
                  bgUnits={this.props.bgPrefs.bgUnits}
                  epochLocation={epochLocation}
                  msRange={msRange}
                  tidelineData={tidelineData}
                  timePrefs={timePrefs}
                  // message handlers
                  onCreateMessage={this.props.onCreateMessage}
                  onShowMessageThread={this.props.onShowMessageThread}
                  // other handlers
                  onDatetimeLocationChange={this.handleDatetimeLocationChange}
                  onTransition={this.handleInTransition}
                  onBolusHover={this.handleBolusHover}
                  onSMBGHover={this.handleSMBGHover}
                  onBasalHover={this.handleBasalHover}
                  onCBGHover={this.handleCBGHover}
                  onCarbHover={this.handleCarbHover}
                  onEatingShortlyHover={this.handleEatingShortlyHover}
                  onReservoirHover={this.handleReservoirHover}
                  onPhysicalHover={this.handlePhysicalHover}
                  onParameterHover={this.handleParameterHover}
                  onWarmUpHover={this.handleWarmUpHover}
                  onAlarmEventHover={this.handleAlarmEventHover}
                  onConfidentialHover={this.handleConfidentialHover}
                  onIobHover={this.handleIobHover}
                  onNightModeHover={this.handleNightModeHover}
                  onTimeChangeHover={this.handleTimeChangeHover}
                  onZenModeHover={this.handleZenModeHover}
                  onTooltipOut={this.handleTooltipOut}
                  onEventSuperpositionClick={this.handleEventSuperpositionClick}
                  onChartMounted={this.onChartMounted}
                  trackMetric={trackMetric}
                  isEatingShortlyEnabled={this.props.isEatingShortlyEnabled}
                  ref={this.chartRef}
                />
              </div>
              <Box marginBlock={2}>
                <Footer onClickRefresh={this.props.onClickRefresh} />
              </Box>
            </div>
            <div className="container-box-inner patient-data-sidebar">
              <div className="patient-data-sidebar-inner">
                <PatientStatistics
                  medicalData={tidelineData.medicalData}
                  bgPrefs={this.props.bgPrefs}
                  dateFilter={dateFilter}
                  diabeticProfile={this.props.patient?.diabeticProfile?.type}
                />
              </div>
            </div>
          </Box>
        </Box>
        {tooltip}
      </div>
    )
  }

  /**
   * @param {number} epoch ms since epoch
   * @returns true if we are at the most recent date
   * @private
   */
  isAtMostRecent(epoch = -1) {
    const { tidelineData, epochLocation, msRange } = this.props
    if (epoch < 0) {
      epoch = epochLocation
    }
    // Takes the last endpoint, substract half a day, because "epoch" is the center
    // of the day, substract 1ms to be sure ">" work.
    const endDate = moment.utc(tidelineData.endpoints[1]).valueOf() - 1 - msRange / 2
    return epoch > endDate
  }

  getEndpoints() {
    const { epochLocation, msRange } = this.props
    const start = moment.utc(epochLocation - msRange / 2).toISOString()
    const end = moment.utc(epochLocation + msRange / 2).toISOString()
    return [start, end]
  }

  /**
   * @param {number} datetime A date to display
   * @returns {string}
   */
  getTitle(datetime) {
    /** @type {{tidelineData: MedicalDataService}} */
    const { tidelineData } = this.props
    return moment.tz(datetime, tidelineData.getTimezoneAt(datetime)).format(i18next.t('ddd, MMM D, YYYY'))
  }

  handlePanBack = (e) => {
    const { loading } = this.props
    if (e) {
      e.preventDefault()
    }
    if (!loading && this.chartRef.current !== null) {
      this.chartRef.current.panBack()
    }
  }

  handlePanForward = (e) => {
    const { loading } = this.props
    if (e) {
      e.preventDefault()
    }
    if (!loading && this.chartRef.current !== null) {
      this.chartRef.current.panForward()
    }
  }

  handleClickMostRecent = (e) => {
    const { loading } = this.props
    if (e) {
      e.preventDefault()
    }
    if (!loading && this.chartRef.current !== null) {
      this.chartRef.current.goToMostRecent()
    }
  }

  /**
   * @param {number} epoch Date displayed -> center of the daily view. In ms since epoch.
   */
  handleDatetimeLocationChange = (epoch) => {
    const { loading } = this.props
    if (!loading) {
      this.setState({ title: this.getTitle(epoch), atMostRecent: this.isAtMostRecent(epoch) })
      this.props.onDatetimeLocationChange(epoch, TimeService.MS_IN_DAY).then((dataLoaded) => {
        if (dataLoaded && this.chartRef.current !== null) {
          // New data available, re-render the chart so they can be displayed
          // to the user
          this.chartRef.current.rerenderChartData()
        }
      }).catch((reason) => {
        this.log.error('handleDatetimeLocationChange', reason)
      })
    }
  }

  handleInTransition = inTransition => {
    this.setState({ inTransition })
  }

  updateDatumHoverForTooltip(datum) {
    /** @type {{ epochLocation: number, bgPrefs: {}, tidelineData: MedicalDataService }} */
    const { epochLocation, bgPrefs } = this.props
    const rect = datum.rect
    // range here is -12 to 12
    const datumEpoch = datum.data.eventsCount ? datum.data.events[0].epoch : datum.data.epoch
    const hoursOffset = (datumEpoch - epochLocation) / TimeService.MS_IN_HOUR
    datum.top = rect.top + rect.height / 2
    if (hoursOffset > 5) {
      datum.side = 'left'
      datum.left = rect.left
    } else {
      datum.side = 'right'
      datum.left = rect.left + rect.width
    }
    datum.bgPrefs = bgPrefs
    datum.timePrefs = { timezoneAware: true, timezoneName: datum.timezone }
    return datum
  }

  handleTooltipOut = () => this.setState({ tooltip: null }) // Tips for debug use: _.noop;

  handleBasalHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <BasalTooltip
        basal={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleBolusHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <BolusTooltip
        bolus={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleSMBGHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <BloodGlucoseTooltip
        isSmbg={true}
        data={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleCBGHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <BloodGlucoseTooltip
        data={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleCarbHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <RescueCarbsTooltip
        food={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleEatingShortlyHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <EatingShortlyTooltip
        eatingShortly={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleIobHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <IobTooltip
        data={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleReservoirHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <ReservoirTooltip
        reservoir={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handlePhysicalHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <PhysicalTooltip
        physicalActivity={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleParameterHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <ParameterTooltip
        parameter={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleWarmUpHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <WarmUpTooltip
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
        warmup={datum.data} />)
    this.setState({ tooltip })
  }

  handleAlarmEventHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <AlarmEventTooltip
        alarmEvent={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
        device={this.props.device}
      />)
    this.setState({ tooltip })
  }

  handleNightModeHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <NightModeTooltip
        nightMode={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleTimeChangeHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <TimeChangeTooltip
        timeChange={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleZenModeHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <ZenModeTooltip
        zenMode={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        timePrefs={datum.timePrefs}
      />)
    this.setState({ tooltip })
  }

  handleConfidentialHover = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <ConfidentialTooltip
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
      />)
    this.setState({ tooltip })
  }

  handleEventSuperpositionClick = (datum) => {
    this.updateDatumHoverForTooltip(datum)
    const tooltip = (
      <EventsSuperpositionPopover
        superpositionEvent={datum.data}
        htmlElement={datum.htmlEvent.currentTarget}
        timePrefs={datum.timePrefs}
        bgPrefs={datum.bgPrefs}
        device={this.props.device}
        onClose={this.handleTooltipOut}
      />)
    this.setState({ tooltip })
  }

  // Messages:

  /**
   * Update the daily view by adding the new message
   * @param {object} message A processed message
   * @return {Promise<boolean>} true if the message was added
   */
  createMessage = (message) => {
    return this.chartRef.current.createMessage(message)
  }

  /**
   * Update the daily view message
   * @param {object} message A processed message
   * @return {boolean} true if the message was correctly updated
   */
  editMessage = (message) => {
    return this.chartRef.current.editMessage(message)
  }
}

export { DailyChart }
export default Daily
