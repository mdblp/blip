/*
 /**
 * Copyright (c) 2014, Tidepool Project
 * Copyright (c) 2020-2022, Diabeloop
 * Display patient data in an iframe
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
 */

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import bows from 'bows'
import moment from 'moment-timezone'
import i18next from 'i18next'
import clsx from 'clsx'
import { Route, Switch } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

import MedicalDataService, { MGDL_UNITS, TimeService } from 'medical-domain'
import { createPrintPDFPackage, utils as vizUtils } from 'tidepool-viz'

import config from '../config'
import personUtils from '../core/personutils'
import utils from '../core/utils'
import ApiUtils from '../core/api-utils'
import { Daily, PatientDashboard as BlipOldDashboard, Trends } from './chart'
import Messages from './messages'
import { FETCH_PATIENT_DATA_SUCCESS } from '../redux'
import { PatientNavBarMemoized as PatientNavBar } from 'yourloops/components/header-bars/patient-nav-bar'
import ChartType from 'yourloops/enum/chart-type.enum'
import PatientDashboard from 'yourloops/components/dashboard-widgets/patient-dashboard'

const { waitTimeout } = utils
const { DataUtil } = vizUtils.data

/** @type {(s: string, p?: object) => string} */
const t = i18next.t.bind(i18next)

const LOADING_STATE_NONE = 0
const LOADING_STATE_INITIAL_FETCH = LOADING_STATE_NONE + 1
const LOADING_STATE_INITIAL_PROCESS = LOADING_STATE_INITIAL_FETCH + 1
const LOADING_STATE_DONE = LOADING_STATE_INITIAL_PROCESS + 1
const LOADING_STATE_EARLIER_FETCH = LOADING_STATE_DONE + 1
const LOADING_STATE_EARLIER_PROCESS = LOADING_STATE_EARLIER_FETCH + 1
const LOADING_STATE_ERROR = LOADING_STATE_EARLIER_PROCESS + 1

/**
 * @typedef { import('history').History } History
 * @typedef { import('redux').Store } Store
 * @typedef { import('../index').BlipApi } API
 * @typedef { import('../index').IUser } User
 * @typedef { import('../index').PatientData } PatientData
 * @typedef { import('../index').MessageNote } MessageNote
 * @typedef { import('../index').DialogDatePicker } DialogDatePicker
 * @typedef { import('../index').DialogRangeDatePicker } DialogRangeDatePicker
 * @typedef { import('../core/lib/partial-data-load').DateRange } DateRange
 *
 * @typedef {{ api: API, patient: User, store: Store, prefixURL: string, history: History;dialogDatePicker: DialogDatePicker; dialogRangeDatePicker:DialogRangeDatePicker }} PatientDataProps
 * @typedef {{loadingState: number; medicalData: MedicalDataService | null; epochLocation: number; epochRange: number; patient: User; canPrint: boolean; chartPrefs: object; createMessageDatetime: string | null; messageThread: MessageNote[] | null; errorMessage?: string | null; msRange: number}} PatientDataState
 */

/**
 * Main patient data rendering page
 * @augments {React.Component<PatientDataProps,PatientDataState>}
 */
class PatientDataPage extends React.Component {
  constructor(/** @type {PatientDataProps} */ props) {
    super(props)
    const { api, patient } = this.props

    this.log = bows('PatientData')
    this.trackMetric = api.metrics.send
    this.chartRef = React.createRef()
    /** @type {DataUtil | null} */
    this.dataUtil = null
    this.apiUtils = new ApiUtils(api, patient)

    const currentUser = api.whoami
    const browserTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone

    this.state = {
      loadingState: LOADING_STATE_NONE,
      errorMessage: null,
      /** Current display date (date at center) */
      epochLocation: 0,
      /** Current display data range in ms around epochLocation */
      msRange: 0,
      timePrefs: {
        timezoneAware: true,
        timezoneName: browserTimezone
      },
      bgPrefs: {
        bgUnits: currentUser.settings?.units?.bg ?? MGDL_UNITS,
        bgClasses: {}
      },
      permsOfLoggedInUser: {
        view: {},
        notes: {}
      },
      canPrint: false,
      showPDFPrintOptions: false,

      // Messages
      messageThread: null,
      createMessageDatetime: null,

      // Original states info
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
          /** To keep the wanted extentSize (num days between endpoints) between charts switch. */
          extentSize: 14
        },
        dashboard: {},
        bgLog: {
          bgSource: 'smbg'
        }
      },
      chartStates: {
        trends: {}
      },
      /** @type {MedicalDataService | null} */
      medicalData: null
    }

    this.handleSwitchToDashboard = this.handleSwitchToDashboard.bind(this)
    this.handleSwitchToDaily = this.handleSwitchToDaily.bind(this)
    this.handleSwitchToTrends = this.handleSwitchToTrends.bind(this)
    this.handleShowMessageCreation = this.handleShowMessageCreation.bind(this)
    this.handleClickRefresh = this.handleClickRefresh.bind(this)
    this.handleClickNoDataRefresh = this.handleClickNoDataRefresh.bind(this)

    this.handleDatetimeLocationChange = this.handleDatetimeLocationChange.bind(this)
    this.handleLoadDataRange = this.handleLoadDataRange.bind(this)
    this.updateChartPrefs = this.updateChartPrefs.bind(this)
    this.handleSwitchPatient = this.handleSwitchPatient.bind(this)

    this.unsubscribeStore = null
  }

  reduxListener() {
    const { store } = this.props
    const { chartStates } = this.state
    const reduxState = store.getState()
    if (!_.isEqual(reduxState.viz.trends, this.state.chartStates.trends)) {
      this.setState({ chartStates: { ...chartStates, trends: _.cloneDeep(reduxState.viz.trends) } })
    }
  }

  componentDidMount() {
    const { store } = this.props
    this.unsubscribeStore = store.subscribe(this.reduxListener.bind(this))
    this.handleRefresh().then(() => {
      const locationChart = this.getChartType()
      switch (locationChart) {
        case 'daily':
          this.handleSwitchToDaily()
          break
        case 'trends':
          this.handleSwitchToTrends()
          break
        case 'dashboard':
          this.handleSwitchToDashboard()
          break
        default:
          this.handleSwitchToDashboard()
          break
      }
    })
  }

  componentWillUnmount() {
    if (typeof this.unsubscribeStore === 'function') {
      this.unsubscribeStore()
      this.unsubscribeStore = null
    }
    this.chartRef = null
    this.apiUtils = null
  }

  render() {
    const { dialogPDFOptions: DialogPDFOptions } = this.props
    const { loadingState, errorMessage, medicalData, canPrint, showPDFPrintOptions } = this.state
    const chartType = this.getChartType()
    let loader = null
    let messages = null
    let patientData = null
    let errorDisplay = null

    switch (loadingState) {
      case LOADING_STATE_EARLIER_FETCH:
      case LOADING_STATE_EARLIER_PROCESS:
      case LOADING_STATE_DONE:
        if (chartType === 'daily') {
          messages = this.renderMessagesContainer()
        }
        patientData = this.renderPatientData()
        break
      case LOADING_STATE_NONE:
        messages = <p>Please select a patient</p>
        break
      case LOADING_STATE_INITIAL_FETCH:
      case LOADING_STATE_INITIAL_PROCESS:
        loader = <CircularProgress className="centered-spinning-loader" />
        break
      default:
        if (errorMessage === 'no-data') {
          errorDisplay = this.renderNoData()
        } else {
          errorDisplay = <p id="loading-error-message">{errorMessage ?? t('An unknown error occurred')}</p>
        }
        break
    }

    let start = '1970-01-01'
    let end = '1970-01-02'
    if (canPrint && showPDFPrintOptions) {
      const { startDate, endDate } = medicalData.getLocaleTimeEndpoints()
      start = startDate
      end = endDate
      //hack to display the current date selected in print calendar
      if (chartType === 'dashboard') {
        const timezone = medicalData.getTimezoneAt(this.state.epochLocation)
        end = TimeService.format(this.state.epochLocation, timezone)
      }
    }

    const classes = clsx(
      'patient-data',
      'patient-data-yourloops',
      { ['patient-data-with-dialog']: showPDFPrintOptions }
    )

    return (
      <>
        {loader}
        <div className={classes}>
          {messages}
          {patientData}
          {errorDisplay}
          {canPrint &&
            <DialogPDFOptions
              open={showPDFPrintOptions}
              minDate={start}
              maxDate={end}
              onResult={this.handlePrint}
              defaultPreset={'1week'}
            />
          }
        </div>
      </>
    )
  }

  renderPatientData() {
    if (this.isInsufficientPatientData()) {
      return this.renderNoData()
    }
    return this.renderChart()
  }

  renderNoData() {
    const patientName = personUtils.fullName(this.props.patient)
    const noDataText = t('{{patientName}} does not have any data yet.', { patientName })
    const reloadBtnText = t('Click to reload.')

    return (
      <div>
        <PatientNavBar
          currentPatient={this.props.patient}
          chartType="no-data"
          onSwitchPatient={this.handleSwitchPatient}
        />
        <div className="container-box-outer patient-data-content-outer">
          <div className="container-box-inner patient-data-content-inner">
            <div className="patient-data-content">
              <div className="patient-data-message-no-data">
                <p>{noDataText}</p>
                <button type="button" className="btn btn-primary" onClick={this.handleClickNoDataRefresh}>
                  {reloadBtnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  isInsufficientPatientData() {
    /** @type {PatientData} */
    return !this.state.medicalData.hasDiabetesData()
  }

  renderChart() {
    const {
      patient,
      setPatient,
      userIsHCP,
      isSelectedTeamMedical,
      prefixURL,
      dialogDatePicker,
      dialogRangeDatePicker,
      chatWidget,
      alarmCard,
      api,
      medicalFilesWidget
    } = this.props
    const {
      canPrint,
      permsOfLoggedInUser,
      loadingState,
      chartPrefs,
      chartStates,
      epochLocation,
      msRange,
      medicalData,
      bgPrefs,
      timePrefs
    } = this.state
    const user = api.whoami

    return (
      <React.Fragment>
        <PatientNavBar
          chartType={this.getChartType()}
          currentPatient={patient}
          onClickDashboard={() => this.navigateToChart(ChartType.Dashboard)}
          onClickDaily={() => this.navigateToChart(ChartType.Daily)}
          onClickTrends={() => this.navigateToChart(ChartType.Trends)}
          onClickPrint={this.handleClickPrint}
          onSwitchPatient={this.handleSwitchPatient}
        />
        <Switch>
          <Route path={`${prefixURL}/dashboard`}>
            {patient.monitoring?.enabled
              ? <BlipOldDashboard
                bgPrefs={this.state.bgPrefs}
                chartPrefs={chartPrefs}
                patient={patient}
                setPatient={setPatient}
                userIsHCP={userIsHCP}
                user={user}
                isSelectedTeamMedical={isSelectedTeamMedical}
                dataUtil={this.dataUtil}
                timePrefs={this.state.timePrefs}
                epochLocation={epochLocation}
                msRange={msRange}
                loading={loadingState !== LOADING_STATE_DONE}
                tidelineData={medicalData}
                permsOfLoggedInUser={permsOfLoggedInUser}
                trackMetric={this.trackMetric}
                chatWidget={chatWidget}
                alarmCard={alarmCard}
                medicalFilesWidget={medicalFilesWidget}
                onSwitchToDaily={this.handleSwitchToDaily}
                canPrint={canPrint}
              />
              : <PatientDashboard
                bgPrefs={bgPrefs}
                chartPrefs={chartPrefs}
                dataUtil={this.dataUtil}
                epochDate={epochLocation}
                loading={loadingState !== LOADING_STATE_DONE}
                medicalDataService={medicalData}
                msRange={msRange}
                patient={patient}
                permsOfLoggedInUser={permsOfLoggedInUser}
                timePrefs={timePrefs}
                trackMetric={this.trackMetric}
                onSwitchToDaily={this.handleSwitchToDaily}
              />
            }
          </Route>
          <Route path={`${prefixURL}/daily`}>
            <Daily
              dialogDatePicker={dialogDatePicker}
              bgPrefs={this.state.bgPrefs}
              chartPrefs={chartPrefs}
              dataUtil={this.dataUtil}
              timePrefs={this.state.timePrefs}
              patient={patient}
              setPatient={setPatient}
              tidelineData={medicalData}
              epochLocation={epochLocation}
              msRange={msRange}
              loading={loadingState !== LOADING_STATE_DONE}
              onClickRefresh={this.handleClickRefresh}
              onCreateMessage={this.handleShowMessageCreation}
              onShowMessageThread={this.handleShowMessageThread.bind(this)}
              onDatetimeLocationChange={this.handleDatetimeLocationChange}
              trackMetric={this.trackMetric}
              updateChartPrefs={this.updateChartPrefs}
              ref={this.chartRef}
            />
          </Route>
          <Route path={`${prefixURL}/trends`}>
            <Trends
              dialogRangeDatePicker={dialogRangeDatePicker}
              bgPrefs={this.state.bgPrefs}
              chartPrefs={chartPrefs}
              dataUtil={this.dataUtil}
              timePrefs={this.state.timePrefs}
              epochLocation={epochLocation}
              msRange={msRange}
              patient={patient}
              setPatient={setPatient}
              tidelineData={medicalData}
              loading={loadingState !== LOADING_STATE_DONE}
              onClickRefresh={this.handleClickRefresh}
              onSwitchToDaily={this.handleSwitchToDaily}
              onDatetimeLocationChange={this.handleDatetimeLocationChange}
              trackMetric={this.trackMetric}
              updateChartPrefs={this.updateChartPrefs}
              trendsState={chartStates.trends}
            />
          </Route>
        </Switch>
      </React.Fragment>
    )
  }

  renderMessagesContainer() {
    const { patient, api } = this.props
    const { createMessageDatetime, messageThread, timePrefs } = this.state
    if (createMessageDatetime) {
      const user = api.whoami
      return (
        <Messages
          createDatetime={createMessageDatetime}
          user={user}
          patient={patient}
          onClose={this.closeMessageCreation.bind(this)}
          onSave={this.handleCreateNote.bind(this)}
          onNewMessage={this.handleMessageCreation.bind(this)}
          onEdit={this.handleEditMessage.bind(this)}
          timePrefs={timePrefs}
          trackMetric={this.trackMetric} />
      )
    } else if (Array.isArray(messageThread)) {
      const user = api.whoami
      return (
        <Messages
          messages={messageThread}
          user={user}
          patient={patient}
          onClose={this.closeMessageThread.bind(this)}
          onSave={this.handleReplyToMessage.bind(this)}
          onEdit={this.handleEditMessage.bind(this)}
          timePrefs={timePrefs}
          trackMetric={this.trackMetric} />
      )
    }
    return null
  }

  getChartType() {
    const { history, prefixURL } = this.props

    switch (history.location.pathname) {
      case `${prefixURL}/daily`:
        return ChartType.Daily
      case `${prefixURL}/trends`:
        return ChartType.Trends
      case `${prefixURL}/dashboard`:
        return ChartType.Dashboard
    }
    return null
  }

  /**
   *
   * @param {{ start: string; end: string; preset?: string; }} printOptions
   * @returns {Promise<void>}
   */
  async generateReport(printOptions) {
    const { patient } = this.props
    const { medicalData, bgPrefs } = this.state

    if (medicalData === null) {
      return Promise.reject('MedicalData is null')
    }

    const start = moment.tz(
      printOptions.start,
      medicalData.getTimezoneAt(TimeService.getEpoch(printOptions.start))
    ).startOf('day')
    const timezone = medicalData.getTimezoneAt(TimeService.getEpoch(printOptions.end))
    const end = moment.tz(printOptions.end, timezone).endOf('day')
    const endPDFDate = end.toISOString()

    // Load a 2 days more than needed, around the wanted location, to be sure
    // we have data with duration too within this range
    await this.handleLoadDataRange(start, end, 'pdf')

    const timePrefs = {
      timezoneAware: true,
      timezoneName: timezone
    }
    const opts = {
      bgPrefs,
      patient,
      timePrefs,
      endPDFDate
    }
    const lastPumpSettings = medicalData.medicalData.pumpSettings[medicalData.medicalData.pumpSettings.length - 1]
    const pdfData = {
      basics: medicalData.generateBasicsData(start.toISOString(), end.toISOString()),
      daily: vizUtils.data.selectDailyViewData(medicalData, start, end),
      settings: !printOptions.preset
        ? vizUtils.data.generatePumpSettings(lastPumpSettings, end)
        : lastPumpSettings
    }

    vizUtils.data.generatePDFStats(pdfData, this.dataUtil)
    return createPrintPDFPackage(pdfData, opts)
  }

  async generateCSV(printOptions) {
    const { api, patient } = this.props

    const startDate = moment.utc(printOptions.start).startOf('day').toISOString()
    const endDate = moment.utc(printOptions.end).endOf('day').toISOString()
    return api.exportData(patient, startDate, endDate)
  }

  async handleMessageCreation(message) {
    await this.chartRef.current.createMessage(/*nurseShark.reshapeMessage(*/message)/*)*/
    this.trackMetric('note', 'create_note')
  }

  async handleReplyToMessage(comment) {
    const { api } = this.props
    const id = await api.replyMessageThread(comment)
    this.trackMetric('note', 'reply_note')
    return id
  }

  /**
   * Create a new note
   * @param {MessageNote} message the message
   * @returns {Promise<string>}
   */
  handleCreateNote(message) {
    const { api } = this.props
    return api.startMessageThread(message)
  }

  /**
   * Callback after a message is edited.
   * @param {MessageNote} message the edited message
   * @returns {Promise<void>}
   */
  async handleEditMessage(message) {
    const { api } = this.props

    await api.editMessage(message)
    this.trackMetric('note', 'edit_note')

    if (_.isEmpty(message.parentmessage)) {
      // Daily timeline view only cares for top-level note
      this.chartRef.current.editMessage(message)
    }
  }

  async handleShowMessageThread(messageThread) {
    const { api } = this.props

    const messages = await api.getMessageThread(messageThread)
    this.setState({ messageThread: messages })
  }

  handleShowMessageCreation(/** @type {moment.Moment | Date | null} */ datetime) {
    const { epochLocation, medicalData } = this.state
    let mDate = datetime
    if (datetime === null) {
      const timezone = medicalData.getTimezoneAt(epochLocation)
      mDate = moment.utc(epochLocation).tz(timezone)
    }
    this.setState({ createMessageDatetime: mDate.toISOString() })
  }

  closeMessageThread() {
    this.setState({ createMessageDatetime: null, messageThread: null })
  }

  closeMessageCreation() {
    this.setState({ createMessageDatetime: null, messageThread: null })
  }

  /**
   * Handles navigation between patient navbar tabs
   * @param chart {ChartType} the chart we are going to
   * @Returns {void}
   */
  navigateToChart(chart) {
    const currentChart = this.getChartType()
    if (currentChart === chart) {
      return
    }
    switch (chart) {
      case ChartType.Dashboard:
        this.handleSwitchToDashboard()
        break
      case ChartType.Daily:
        this.handleSwitchToDaily(this.state.epochLocation)
        break
      case ChartType.Trends:
        this.handleSwitchToTrends()
        break
    }
  }

  /**
   *
   * @param {moment.Moment | Date | number | null} datetime The day to display
   */
  handleSwitchToDaily(datetime = null) {
    const { prefixURL, history } = this.props
    const fromChart = this.getChartType()
    const toChart = 'daily'

    let { epochLocation } = this.state

    if (typeof datetime === 'number') {
      epochLocation = datetime
    } else if (moment.isMoment(datetime) || datetime instanceof Date) {
      epochLocation = datetime.valueOf()
    }

    this.dataUtil.chartPrefs = this.state.chartPrefs[toChart]
    this.setState({
      epochLocation,
      msRange: TimeService.MS_IN_DAY
    }, () => {
      if (fromChart !== toChart) {
        history.push(`${prefixURL}/${toChart}`)
        this.trackMetric('data_visualization', 'click_view', toChart)
      }
    })
  }

  handleSwitchPatient(newPatient) {
    this.props.setPatient(newPatient)
  }

  handleSwitchToTrends(e) {
    const { prefixURL, history } = this.props
    const fromChart = this.getChartType()
    const toChart = 'trends'
    if (e) {
      e.preventDefault()
    }

    this.dataUtil.chartPrefs = this.state.chartPrefs[toChart]
    if (fromChart !== toChart) {
      history.push(`${prefixURL}/${toChart}`)
      this.trackMetric('data_visualization', 'click_view', toChart)
    }
  }

  handleSwitchToDashboard(e) {
    const { prefixURL, history } = this.props
    const fromChart = this.getChartType()
    const toChart = 'dashboard'
    if (e) {
      e.preventDefault()
    }

    if (this.dataUtil) {
      this.dataUtil.chartPrefs = this.state.chartPrefs[toChart]
    }
    // Default one week data period for dashboard (now() - 7 days)
    this.setState({
      epochLocation: new Date().valueOf(),
      msRange: TimeService.MS_IN_DAY * 7
    })
    if (fromChart !== toChart) {
      history.push(`${prefixURL}/${toChart}`)
      this.trackMetric('data_visualization', 'click_view', toChart)
    }
  }

  handleClickPrint = () => {
    if (this.state.canPrint) {
      this.setState({ showPDFPrintOptions: true })
    }
  }

  /**
   * @param {{ start: string; end: string; format?: string; preset?: string; }|undefined} printOptions
   * @returns {Promise<void>}
   */
  handlePrint = (printOptions) => {
    const openPDFWindow = (pdf) => {
      const printWindow = window.open(pdf.url)
      if (printWindow !== null) {
        printWindow.focus()
        if (!utils.isFirefox()) {
          printWindow.print()
        }
      }
    }
    const openCSVWindow = (csv, userid) => {
      const url = window.URL.createObjectURL(new Blob([...csv], { type: 'application/zip' }))
      var a = document.createElement('a')
      a.href = url
      a.download = `${userid}.csv`
      document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click()
      a.remove()
    }

    this.setState({ showPDFPrintOptions: false })

    if (!printOptions) {
      return Promise.resolve()
    }

    // Return a promise for the tests
    return new Promise((resolve, reject) => {
      const { patient } = this.props
      this.setState({ canPrint: false, loadingState: LOADING_STATE_EARLIER_FETCH })
      if (printOptions.format === 'pdf') {
        this.generateReport(printOptions)
          .then((pdf) => {
            this.trackMetric('export_data', 'save_report', printOptions.preset ?? 'custom')
            openPDFWindow(pdf)
            resolve()
          })
          .catch((err) => {
            this.log.error('generateReport:', err)
            this.trackMetric('export_data', 'save_report', 'error')
            if (_.isFunction(window.onerror)) {
              window.onerror('print', 'patient-data', 0, 0, err)
            }
            reject(err)
          }).finally(() => {
            this.setState({ canPrint: true, loadingState: LOADING_STATE_DONE })
          })
      } else {
        this.generateCSV(printOptions)
          .then((blob) => {
            this.trackMetric('export_data', 'save_report_csv', printOptions.preset ?? 'custom')
            openCSVWindow(blob, patient.userid)
            resolve()
          })
          .catch((err) => {
            this.log.error('generateReport:', err)
            this.trackMetric('export_data', 'save_report_csv', 'error')
            if (_.isFunction(window.onerror)) {
              window.onerror('print', 'patient-data', 0, 0, err)
            }
            reject(err)
          }).finally(() => {
            this.setState({ canPrint: true, loadingState: LOADING_STATE_DONE })
          })
      }
    })
  }

  handleClickRefresh(/* e */) {
    this.handleRefresh().catch(reason => this.log.error(reason))
  }

  handleClickNoDataRefresh(/* e */) {
    this.handleRefresh().catch(reason => this.log.error(reason))
  }

  onLoadingFailure(err) {
    // TODO A cleaner message
    const errorMessage = _.isError(err) ? err.message : (String(err)).toString()
    this.log.error(errorMessage, err)
    this.setState({ loadingState: LOADING_STATE_ERROR, errorMessage })
  }

  updateChartPrefs(updates, cb = _.noop) {
    const newPrefs = {
      ...this.state.chartPrefs,
      ...updates
    }

    const fromChart = this.getChartType()
    if (fromChart) {
      this.dataUtil.chartPrefs = newPrefs[fromChart]
      this.setState({ chartPrefs: newPrefs }, cb)
    }
  }

  /**
   * Chart display date / range change
   * @param {number} epochLocation datetime epoch value in ms
   * @param {number} msRange ms around epochLocation
   * @returns {Promise<boolean>} true if new data are loaded
   */
  handleDatetimeLocationChange(epochLocation, msRange) {
    const chartType = this.getChartType()

    if (!Number.isFinite(epochLocation) || !Number.isFinite(msRange)) {
      throw new Error('handleDatetimeLocationChange: invalid parameters')
    }

    const msDiff = chartType === 'daily' ? msRange : Math.round(msRange / 2)
    let start = moment.utc(epochLocation - msDiff).startOf('day')
    let end = moment.utc(epochLocation + msDiff).startOf('day').add(1, 'day')

    if (chartType === 'daily') {
      const rangeToLoad = this.apiUtils.partialDataLoad.getMissingRanges({ start, end }, true)
      if (rangeToLoad.length > 0) {
        // For daily we will load 4 days to avoid too many loading
        start = moment.utc(epochLocation - TimeService.MS_IN_DAY * 4).startOf('day')
        end = moment.utc(epochLocation + TimeService.MS_IN_DAY * 4).startOf('day').add(1, 'day')
      }
    }

    return this.handleLoadDataRange(start, end, chartType).then((result) => {
      this.setState({ epochLocation, msRange })
      return result
    })
  }

  /**
   * Fetch new medical data if needed
   * @param {moment.Moment} start
   * @param {moment.Moment} end
   * @param {"pdf" | null | undefined} target
   * @returns {Promise<boolean>} true if new data are loaded
   */
  async handleLoadDataRange(start, end, target = null) {
    const { loadingState } = this.state
    const chartType = target ?? this.getChartType()
    let dataLoaded = false

    if (!(moment.isMoment(start) && moment.isMoment(end))) {
      this.log.error('Invalid start or end parameter', { start, end })
      return false
    }
    if (start.isAfter(end)) {
      this.log.error('Invalid wanted range', { start, end })
      return false
    }

    this.log.info('handleLoadDataRange', chartType, start.toISOString(), '→', end.toISOString())

    // Don't do anything if we are currently loading
    if (loadingState === LOADING_STATE_DONE) {
      const msRange = end.valueOf() - start.valueOf()
      const epochLocation = Math.round(start.valueOf() + msRange / 2)

      const updateLocation = chartType === 'pdf' ? _.noop : () => {
        this.setState({ epochLocation, msRange })
      }

      /** @type {DateRange} */
      let rangeDisplay = {
        start: moment.utc(start.valueOf()).startOf('day'),
        end: moment.utc(end.valueOf()).startOf('day').add(1, 'day')
      }
      const rangeToLoad = this.apiUtils.partialDataLoad.getMissingRanges(rangeDisplay, true)
      if (rangeToLoad.length > 0) {
        this.setState({ loadingState: LOADING_STATE_EARLIER_FETCH })
        const data = await this.apiUtils.fetchDataRange(rangeDisplay)

        this.setState({ loadingState: LOADING_STATE_EARLIER_PROCESS })
        await this.processData(data)

        if (chartType !== 'pdf') {
          // The loading state will be changed after the PDF is generated,
          // for other cases, we have finished
          this.setState({ loadingState: LOADING_STATE_DONE })
        }

        dataLoaded = true
      }

      updateLocation()
    }

    return dataLoaded
  }

  async handleRefresh() {
    this.setState({
      loadingState: LOADING_STATE_INITIAL_FETCH,
      epochLocation: 0,
      msRange: 0,
      medicalData: null
    })

    try {
      const data = await this.apiUtils.refresh()
      this.setState({ loadingState: LOADING_STATE_INITIAL_PROCESS })
      await waitTimeout(1)
      // Process the data to be usable by us
      await this.processData(data)

      this.setState({ loadingState: LOADING_STATE_DONE })

    } catch (reason) {
      this.onLoadingFailure(reason)
    }
  }

  /**
   *
   * @param {PatientData} data
   */
  async processData(data) {
    const { store, patient } = this.props
    const { timePrefs, bgPrefs, epochLocation, msRange } = this.state
    let { medicalData } = this.state

    const firstLoadOrRefresh = medicalData === null

    this.props.api.metrics.startTimer('process_data')

    await waitTimeout(1)
    if (firstLoadOrRefresh) {
      medicalData = new MedicalDataService()
      medicalData.opts = {
        defaultSource: 'Diabeloop',
        YLP820_BASAL_TIME: config.YLP820_BASAL_TIME,
        timezoneName: timePrefs.timezoneName,
        dateRange: {
          start: this.apiUtils.dateRange.start.valueOf(),
          end: this.apiUtils.dateRange.end.valueOf()
        },
        bgUnits: bgPrefs.bgUnits,
        defaultPumpManufacturer: 'default'
      }
    }
    medicalData.add(data)

    if (medicalData.data.length === 0) {
      this.props.api.metrics.endTimer('process_data')
      throw new Error('no-data')
    }

    const bgPrefsUpdated = {
      bgUnits: medicalData.opts.bgUnits,
      bgClasses: medicalData.opts.bgClasses
    }
    this.dataUtil = new DataUtil(medicalData.data, {
      bgPrefs: bgPrefsUpdated,
      timePrefs,
      endpoints: medicalData.endpoints
    })
    let newLocation = epochLocation
    if (epochLocation === 0) {
      // First loading, display the last day in the daily chart
      newLocation = moment.utc(medicalData.endpoints[1]).valueOf() - TimeService.MS_IN_DAY / 2
    }
    let newRange = msRange
    if (msRange === 0) {
      newRange = TimeService.MS_IN_DAY
    }

    const hasDiabetesData = medicalData.hasDiabetesData()
    this.setState({
      bgPrefs: bgPrefsUpdated,
      timePrefs: medicalData.opts.timePrefs,
      medicalData,
      epochLocation: newLocation,
      msRange: newRange,
      canPrint: hasDiabetesData
    })

    if (firstLoadOrRefresh) {
      store.dispatch({
        type: FETCH_PATIENT_DATA_SUCCESS,
        payload: {
          patientId: patient.userid
        }
      })
    }

    this.props.api.metrics.endTimer('process_data')
  }
}

PatientDataPage.propTypes = {
  api: PropTypes.object.isRequired,
  chatWidget: PropTypes.func.isRequired,
  alarmCard: PropTypes.func.isRequired,
  medicalFilesWidget: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  setPatient: PropTypes.func.isRequired,
  userIsHCP: PropTypes.bool.isRequired,
  isSelectedTeamMedical: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  dialogDatePicker: PropTypes.func.isRequired,
  dialogRangeDatePicker: PropTypes.func.isRequired,
  dialogPDFOptions: PropTypes.func.isRequired,
  prefixURL: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
}

export default PatientDataPage
