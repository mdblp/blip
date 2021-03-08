/**
 * Copyright (c) 2014, Tidepool Project
 * Copyright (c) 2020, Diabeloop
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

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import bows from 'bows';
import moment from 'moment-timezone';
import i18next from 'i18next';

import { TidelineData, nurseShark, MS_IN_DAY } from 'tideline';
import { utils as vizUtils, components as vizComponents, createPrintPDFPackage } from 'tidepool-viz';

import config from '../config';
import personUtils from '../core/personutils';
import utils from '../core/utils';
import { MGDL_UNITS } from '../core/constants';
import PartialDataLoad from '../core/lib/partial-data-load';
import { Header, Basics, Daily, Trends, Settings } from './chart';
import Messages from './messages';
import { FETCH_PATIENT_DATA_SUCCESS } from '../redux';

const { waitTimeout } = utils;
const { DataUtil } = vizUtils.data;
const { addDuration, getLocalizedCeiling } = vizUtils.datetime;
const { isAutomatedBasalDevice: isAutomatedBasalDeviceCheck } = vizUtils.device;
const { commonStats, getStatDefinition, statFetchMethods } = vizUtils.stat;
const { Loader } = vizComponents;

/** @type {(s: string, p?: object) => string} */
const t = i18next.t.bind(i18next);

const LOADING_STATE_NONE = 0;
const LOADING_STATE_INITIAL_FETCH = LOADING_STATE_NONE + 1;
const LOADING_STATE_INITIAL_PROCESS = LOADING_STATE_INITIAL_FETCH + 1;
const LOADING_STATE_DONE = LOADING_STATE_INITIAL_PROCESS + 1;
const LOADING_STATE_EARLIER_FETCH = LOADING_STATE_DONE + 1;
const LOADING_STATE_EARLIER_PROCESS = LOADING_STATE_EARLIER_FETCH + 1;
const LOADING_STATE_ERROR = LOADING_STATE_EARLIER_PROCESS + 1;

/**
 * @typedef { import('redux').Store } Store
 * @typedef { import("../index").BlipApi } API
 * @typedef { import("../../../yourloops/models/shoreline").User } User
 * @typedef { import("../../../yourloops/models/device-data").PatientData } PatientData
 * @typedef { import("../../../yourloops/models/message").MessageNote } MessageNote
 *
 * @typedef {{ api: API, patient: User, store: Store }} PatientDataProps
 * @typedef {{loadingState: number, tidelineData: TidelineData, epochLocation: number, epochRange: number, chartType: string, patient: User, canPrint: boolean, pdf: object, chartPrefs: object, createMessageDatetime: moment.Moment | null, messageThread: MessageNote[] | null}} PatientDataState
 */

/**
 * Main patient data rendering page
 * @augments {React.Component<PatientDataProps,PatientDataState>}
 */
class PatientDataPage extends React.Component {
  constructor(/** @type{PatientDataProps} */ props) {
    super(props);
    const { api } = this.props;
    this.log = bows('PatientData');

    /** @type {(eventName: string, properties?: unknown) => void} */
    this.trackMetric = api.sendMetrics.bind(api);

    this.chartRef = React.createRef();

    const browserTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.state = {
      // New states info
      chartType: 'daily',
      loadingState: LOADING_STATE_NONE,
      errorMessage: null,
      /** Current display date (date at center) */
      epochLocation: 0,
      /** Current display data range in ms around epochLocation */
      msRange: 0,
      /** @type {moment.Moment[]} Available data dates range returned by the API */
      dataRange: null,
      /** @type {PartialDataLoad} */
      partialDataLoad: null,
      timePrefs: {
        timezoneAware: true,
        timezoneName: browserTimezone,
      },
      bgPrefs: {
        bgUnits: MGDL_UNITS,
        bgClasses: {},
      },
      permsOfLoggedInUser: {
        view: {},
        notes: {},
      },
      canPrint: false,
      pdf: null,

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
            sunday: true,
          },
          /** To keep the wanted extentSize (num days between endpoints) between charts switch. */
          extentSize: 14,
          // we track both showingCbg & showingSmbg as separate Booleans for now
          // in case we decide to layer BGM & CGM data, as has been discussed/prototyped
          showingCbg: true,
          showingSmbg: false,
          smbgGrouped: false,
          smbgLines: false,
          smbgRangeOverlay: true,
        },
        bgLog: {
          bgSource: 'smbg',
        },
      },
      chartStates: {
        trends: {
        },
      },
      printOpts: {
        numDays: {
          daily: 6,
          bgLog: 30,
        },
      },
      /** @type {TidelineData} */
      tidelineData: null,
    };

    this.handleSwitchToBasics = this.handleSwitchToBasics.bind(this);
    this.handleSwitchToDaily = this.handleSwitchToDaily.bind(this);
    this.handleSwitchToTrends = this.handleSwitchToTrends.bind(this);
    this.handleSwitchToSettings = this.handleSwitchToSettings.bind(this);
    this.handleShowMessageCreation = this.handleShowMessageCreation.bind(this);
    this.handleClickRefresh = this.handleClickRefresh.bind(this);
    this.handleClickNoDataRefresh = this.handleClickNoDataRefresh.bind(this);

    this.handleDatetimeLocationChange = this.handleDatetimeLocationChange.bind(this);
    this.updateChartPrefs = this.updateChartPrefs.bind(this);

    this.unsubscribeStore = null;
  }

  reduxListener() {
    const { store } = this.props;
    const { chartStates } = this.state;
    const reduxState = store.getState();
    if (!_.isEqual(reduxState.viz.trends, this.state.chartStates.trends)) {
      this.setState({ chartStates: { ...chartStates, trends: _.cloneDeep(reduxState.viz.trends) } });
    }
  }

  componentDidMount() {
    const { store } = this.props;
    this.log.debug('Mounting...');
    this.unsubscribeStore = store.subscribe(this.reduxListener.bind(this));
    this.handleRefresh();
  }

  componentWillUnmount() {
    this.log.debug('Unmounting...');
    if (typeof this.unsubscribeStore === 'function') {
      this.log('componentWillUnmount => unsubscribeStore()');
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }

  render() {
    const { loadingState, chartType, errorMessage } = this.state;

    let loader = null;
    let messages = null;
    let patientData = null;
    let errorDisplay = null;

    switch (loadingState) {
      case LOADING_STATE_EARLIER_FETCH:
      case LOADING_STATE_EARLIER_PROCESS:
      case LOADING_STATE_DONE:
        if (chartType === 'daily') {
          messages = this.renderMessagesContainer();
        }
        patientData = this.renderPatientData();
        break;
      case LOADING_STATE_NONE:
        messages = <p>Please select a patient</p>;
        break;
      case LOADING_STATE_INITIAL_FETCH:
      case LOADING_STATE_INITIAL_PROCESS:
        loader = <Loader />;
        break;
      default:
        errorDisplay = <p>{errorMessage ?? t('Failed somewhere')}</p>;
        break;
    }

    return (
      <div className='patient-data patient-data-yourloops'>
        {messages}
        {patientData}
        {loader}
        {errorDisplay}
      </div>
    );
  }

  renderPatientData() {
    if (this.isInsufficientPatientData()) {
      return this.renderNoData();
    }
    return this.renderChart();
  }

  renderEmptyHeader() {
    return <Header
      chartType="no-data"
      title={t('Data')}
      canPrint={false}
      trackMetric={this.trackMetric} />;
  }

  renderInitialLoading() {
    const header = this.renderEmptyHeader();
    return (
      <div>
        {header}
        <div className='container-box-outer patient-data-content-outer'>
          <div className='container-box-inner patient-data-content-inner'>
            <div className='patient-data-content'></div>
          </div>
        </div>
      </div>
    );
  }

  renderNoData() {
    const header = this.renderEmptyHeader();
    const noDataText = t('{{patientName}} does not have any data yet.', {
      patientName: personUtils.patientFullName(this.props.patient)
    });
    const reloadBtnText = t('Click to reload.');

    return (
      <div>
        {header}
        <div className='container-box-outer patient-data-content-outer'>
          <div className='container-box-inner patient-data-content-inner'>
            <div className='patient-data-content'>
              <div className='patient-data-message-no-data'>
                <p>{noDataText}</p>
                <button type='button' className='btn btn-primary' onClick={this.handleClickNoDataRefresh}>
                  {reloadBtnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  isInsufficientPatientData() {
    /** @type {PatientData} */
    const diabetesData = _.get(this.state, 'tidelineData.diabetesData', []);
    if (_.isEmpty(diabetesData)) {
      this.log.warn('Sorry, no data to display');
      return true;
    }
    return false;
  }

  renderChart() {
    const { patient, profileDialog } = this.props;
    const {
      canPrint,
      permsOfLoggedInUser,
      loadingState,
      chartPrefs,
      chartStates,
      epochLocation,
      msRange,
      tidelineData
    } = this.state;

    switch (this.state.chartType) {
      case 'basics':
        return (
          <Basics
            profileDialog={profileDialog}
            bgPrefs={this.state.bgPrefs}
            chartPrefs={chartPrefs}
            dataUtil={this.dataUtil}
            timePrefs={this.state.timePrefs}
            patient={patient}
            tidelineData={tidelineData}
            loading={loadingState !== LOADING_STATE_DONE}
            canPrint={canPrint}
            permsOfLoggedInUser={permsOfLoggedInUser}
            onClickRefresh={this.handleClickRefresh}
            onClickNoDataRefresh={this.handleClickNoDataRefresh}
            onSwitchToBasics={this.handleSwitchToBasics}
            onSwitchToDaily={this.handleSwitchToDaily}
            onClickPrint={this.handleClickPrint}
            onSwitchToTrends={this.handleSwitchToTrends}
            onSwitchToSettings={this.handleSwitchToSettings}
            trackMetric={this.trackMetric}
            updateChartPrefs={this.updateChartPrefs}
            uploadUrl={config.UPLOAD_API}
            ref={this.chartRef} />
          );
      case 'daily':
        return (
          <Daily
            profileDialog={profileDialog}
            bgPrefs={this.state.bgPrefs}
            chartPrefs={chartPrefs}
            dataUtil={this.dataUtil}
            timePrefs={this.state.timePrefs}
            patient={patient}
            tidelineData={tidelineData}
            epochLocation={epochLocation}
            msRange={msRange}
            loading={loadingState !== LOADING_STATE_DONE}
            canPrint={canPrint}
            permsOfLoggedInUser={permsOfLoggedInUser}
            onClickRefresh={this.handleClickRefresh}
            onCreateMessage={this.handleShowMessageCreation}
            onShowMessageThread={this.handleShowMessageThread.bind(this)}
            onSwitchToBasics={this.handleSwitchToBasics}
            onSwitchToDaily={this.handleSwitchToDaily}
            onClickPrint={this.handleClickPrint}
            onSwitchToTrends={this.handleSwitchToTrends}
            onSwitchToSettings={this.handleSwitchToSettings}
            onDatetimeLocationChange={this.handleDatetimeLocationChange}
            trackMetric={this.trackMetric}
            updateChartPrefs={this.updateChartPrefs}
            ref={this.chartRef} />
          );
      case 'trends':
        return (
          <Trends
            profileDialog={profileDialog}
            bgPrefs={this.state.bgPrefs}
            chartPrefs={chartPrefs}
            currentPatientInViewId={patient.userid}
            dataUtil={this.dataUtil}
            timePrefs={this.state.timePrefs}
            epochLocation={epochLocation}
            msRange={msRange}
            patient={patient}
            patientData={tidelineData}
            loading={loadingState !== LOADING_STATE_DONE}
            canPrint={canPrint}
            permsOfLoggedInUser={permsOfLoggedInUser}
            onClickRefresh={this.handleClickRefresh}
            onSwitchToBasics={this.handleSwitchToBasics}
            onSwitchToDaily={this.handleSwitchToDaily}
            onSwitchToTrends={this.handleSwitchToTrends}
            onSwitchToSettings={this.handleSwitchToSettings}
            onDatetimeLocationChange={this.handleDatetimeLocationChange}
            trackMetric={this.trackMetric}
            updateChartPrefs={this.updateChartPrefs}
            uploadUrl={config.UPLOAD_API}
            trendsState={chartStates.trends}
          />
        );
      case 'settings':
        return (
          <div className='app-no-print'>
            <Settings
              bgPrefs={this.state.bgPrefs}
              chartPrefs={this.state.chartPrefs}
              currentPatientInViewId={patient.userid}
              timePrefs={this.state.timePrefs}
              patient={patient}
              patientData={tidelineData}
              canPrint={canPrint}
              permsOfLoggedInUser={this.state.permsOfLoggedInUser}
              onClickRefresh={this.handleClickRefresh}
              onClickNoDataRefresh={this.handleClickNoDataRefresh}
              onSwitchToBasics={this.handleSwitchToBasics}
              onSwitchToDaily={this.handleSwitchToDaily}
              onSwitchToTrends={this.handleSwitchToTrends}
              onSwitchToSettings={this.handleSwitchToSettings}
              onClickPrint={this.handleClickPrint}
              trackMetric={this.trackMetric}
              uploadUrl={config.UPLOAD_API}
            />
          </div>
        );
    }

    return null;
  }

  renderMessagesContainer() {
    const { patient, api } = this.props;
    const { createMessageDatetime, messageThread, timePrefs } = this.state;
    if (createMessageDatetime) {
      const user = api.whoami;
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
      );
    } else if (Array.isArray(messageThread)) {
      const user = api.whoami;
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
      );
    }
    return null;
  }

  generatePDFStats(data) {
    const { timePrefs } = this.state;
    const {
      bgBounds,
      bgUnits,
      latestPump: { manufacturer, deviceModel },
    } = this.dataUtil;
    const isAutomatedBasalDevice = isAutomatedBasalDeviceCheck(manufacturer, deviceModel);

    const getStat = (statType) => {
      const { bgSource, days } = this.dataUtil;

      return getStatDefinition(this.dataUtil[statFetchMethods[statType]](), statType, {
        bgSource,
        days,
        bgPrefs: {
          bgBounds,
          bgUnits,
        },
        manufacturer,
      });
    };

    const basicsDateRange = _.get(data, 'basics.dateRange');
    if (basicsDateRange) {
      data.basics.endpoints = [basicsDateRange[0], getLocalizedCeiling(basicsDateRange[1], timePrefs).toISOString()];

      this.dataUtil.endpoints = data.basics.endpoints;

      data.basics.stats = {
        [commonStats.timeInRange]: getStat(commonStats.timeInRange),
        [commonStats.readingsInRange]: getStat(commonStats.readingsInRange),
        [commonStats.totalInsulin]: getStat(commonStats.totalInsulin),
        [commonStats.timeInAuto]: isAutomatedBasalDevice ? getStat(commonStats.timeInAuto) : undefined,
        [commonStats.carbs]: getStat(commonStats.carbs),
        [commonStats.averageDailyDose]: getStat(commonStats.averageDailyDose),
      };
    }

    const dailyDateRanges = _.get(data, 'daily.dataByDate');
    if (dailyDateRanges) {
      _.forIn(
        dailyDateRanges,
        _.bind(function (value, key) {
          data.daily.dataByDate[key].endpoints = [
            getLocalizedCeiling(dailyDateRanges[key].bounds[0], timePrefs).toISOString(),
            getLocalizedCeiling(dailyDateRanges[key].bounds[1], timePrefs).toISOString(),
          ];

          this.dataUtil.endpoints = data.daily.dataByDate[key].endpoints;

          data.daily.dataByDate[key].stats = {
            [commonStats.timeInRange]: getStat(commonStats.timeInRange),
            [commonStats.averageGlucose]: getStat(commonStats.averageGlucose),
            [commonStats.totalInsulin]: getStat(commonStats.totalInsulin),
            [commonStats.timeInAuto]: isAutomatedBasalDevice ? getStat(commonStats.timeInAuto) : undefined,
            [commonStats.carbs]: getStat(commonStats.carbs),
          };
        }, this)
      );
    }

    const bgLogDateRange = _.get(data, 'bgLog.dateRange');
    if (bgLogDateRange) {
      data.bgLog.endpoints = [
        getLocalizedCeiling(bgLogDateRange[0], timePrefs).toISOString(),
        addDuration(getLocalizedCeiling(bgLogDateRange[1], timePrefs).toISOString(), 864e5),
      ];

      this.dataUtil.endpoints = data.bgLog.endpoints;

      data.bgLog.stats = {
        [commonStats.averageGlucose]: getStat(commonStats.averageGlucose),
      };
    }

    return data;
  }

  generatePDF() {
    const { patient } = this.props;
    const { tidelineData, bgPrefs, printOpts, timePrefs } = this.state;
    const diabetesData = tidelineData.diabetesData;

    const mostRecent = diabetesData[diabetesData.length - 1].normalTime;
    const opts = {
      bgPrefs,
      numDays: printOpts.numDays,
      patient,
      timePrefs,
      mostRecent,
    };

    const dailyData = vizUtils.data.selectDailyViewData(
      mostRecent,
      _.pick(tidelineData.grouped, ['basal', 'bolus', 'cbg', 'food', 'message', 'smbg', 'upload', 'physicalActivity']),
      printOpts.numDays.daily,
      timePrefs
    );

    const bgLogData = vizUtils.data.selectBgLogViewData(
      mostRecent,
      _.pick(tidelineData.grouped, ['smbg']),
      printOpts.numDays.bgLog,
      timePrefs
    );

    const pdfData = {
      basics: tidelineData.basicsData,
      daily: dailyData,
      settings: _.last(tidelineData.grouped.pumpSettings),
      bgLog: bgLogData,
    };

    this.generatePDFStats(pdfData);

    this.log('Generating PDF with', pdfData, opts);

    return createPrintPDFPackage(pdfData, opts);
  }

  async handleMessageCreation(message) {
    this.log.debug('handleMessageCreation', message);
    const shapedMessage = nurseShark.reshapeMessage(message);

    this.log.debug({ message, shapedMessage });
    await this.chartRef.current.createMessage(nurseShark.reshapeMessage(message));
    this.trackMetric('message', { action: 'Created New Message' });
  }

  async handleReplyToMessage(comment) {
    const { api } = this.props;
    const id = await api.replyMessageThread(comment);
    this.trackMetric('Replied To Message');
    return id;
  }

  /**
   * Create a new note
   * @param {MessageNote} message the message
   * @returns {Promise<string>}
   */
  handleCreateNote(message) {
    const { api } = this.props;
    return api.startMessageThread(message);
  }

  /**
   * Callback after a message is edited.
   * @param {MessageNote} message the edited message
   * @returns {Promise<void>}
   */
  async handleEditMessage(message) {
    this.log.debug("handleEditMessage", { message });
    const { api } = this.props;

    await api.editMessage(message);
    this.trackMetric('message', { action: 'edited' });

    if (_.isEmpty(message.parentmessage)) {
      // Daily timeline view only cares for top-level note
      const reshapedMessage = nurseShark.reshapeMessage(message);
      this.chartRef.current.editMessage(reshapedMessage);
    }
  }

  async handleShowMessageThread(messageThread) {
    this.log.debug("handleShowMessageThread", messageThread);
    const { api } = this.props;

    const messages = await api.getMessageThread(messageThread);
    this.setState({ messageThread: messages });
    this.trackMetric('message', { action: 'Clicked Message Icon' });
  }

  handleShowMessageCreation(/** @type {moment.Moment | Date} */ datetime) {
    const { epochLocation, tidelineData } = this.state;
    this.log.debug('handleShowMessageCreation', { datetime, epochLocation });
    let mDate = datetime;
    let action = 'Create a message from background';
    if (datetime === null) {
      action = 'Clicked create a message';
      const timezone = tidelineData.getTimezoneAt(epochLocation);
      mDate = moment.utc(epochLocation).tz(timezone);
    }
    this.setState({ createMessageDatetime : mDate.toISOString() });

    this.trackMetric('message', { action, date: mDate });
  }

  closeMessageThread() {
    this.setState({ createMessageDatetime: null, messageThread: null });
    this.trackMetric('message', { action: 'Closed Message Thread Modal' });
  }

  closeMessageCreation() {
    this.setState({ createMessageDatetime: null, messageThread: null });
  }

  handleSwitchToBasics(e) {
    this.trackMetric('switch blip tab', {
      fromChart: this.state.chartType,
      toChart: 'basics',
    });
    if (e) {
      e.preventDefault();
    }

    this.dataUtil.chartPrefs = this.state.chartPrefs['basics'];
    this.setState({ chartType: 'basics' });
  }

  /**
   *
   * @param {moment.Moment | Date | number} datetime The day to display
   * @param {string} calendarName For trackmetrics: The calendar we came from
   */
  handleSwitchToDaily(datetime = null, calendarName = 'none') {
    this.trackMetric('switch blip tab', {
      fromChart: this.state.chartType,
      fromCalendar: calendarName,
      toChart: 'daily',
    });

    let { epochLocation } = this.state;

    if (typeof datetime === 'number') {
      epochLocation = datetime;
    } else if (moment.isMoment(datetime) || datetime instanceof Date) {
      epochLocation = datetime.valueOf();
    }

    this.log.info('Switch to daily', { date: moment.utc(epochLocation).toISOString(), epochLocation });

    this.dataUtil.chartPrefs = this.state.chartPrefs['daily'];
    this.setState({
      chartType: 'daily',
      epochLocation,
      msRange: MS_IN_DAY,
    });
  }

  handleSwitchToTrends(e) {
    this.trackMetric('switch blip tab', {
      fromChart: this.state.chartType,
      toChart: 'trends',
    });
    if (e) {
      e.preventDefault();
    }

    this.dataUtil.chartPrefs = this.state.chartPrefs['trends'];
    this.setState({ chartType: 'trends' });
  }

  handleSwitchToSettings(e) {
    this.trackMetric('Clicked Switch To Settings', {
      fromChart: this.state.chartType,
    });
    if (e) {
      e.preventDefault();
    }
    this.setState({ chartType: 'settings' });
  }

  handleClickPrint = () => {
    function openPDFWindow(pdf) {
      const printWindow = window.open(pdf.url);
      if (printWindow !== null) {
        printWindow.focus();
        if (!utils.isFirefox()) {
          printWindow.print();
        }
      }
    }

    this.trackMetric('Clicked Print', {
      fromChart: this.state.chartType,
    });

    // Return a promise for the tests
    return new Promise((resolve, reject) => {
      if (this.state.pdf !== null) {
        openPDFWindow(this.state.pdf);
        resolve();
      } else {
        const { tidelineData, loadingState } = this.state;
        let hasDiabetesData = false;
        if (tidelineData !== null) {
          hasDiabetesData = _.get(tidelineData, 'diabetesData.length', 0) > 0;
        }

        if (loadingState === LOADING_STATE_DONE && hasDiabetesData) {
          this.generatePDF()
            .then((pdf) => {
              openPDFWindow(pdf);
              this.setState({ pdf });
              resolve();
            })
            .catch((err) => {
              this.log('generatePDF:', err);
              if (_.isFunction(window.onerror)) {
                window.onerror('print', 'patient-data', 0, 0, err);
              }
              reject(err);
            });
        } else {
          resolve();
        }
      }
    });
  }

  handleClickRefresh(/* e */) {
    this.trackMetric('Clicked Refresh');
    this.handleRefresh();
  }

  handleClickNoDataRefresh(/* e */) {
    this.trackMetric('Clicked No Data Refresh');
    this.handleRefresh();
  }

  onLoadingFailure(err) {
    // TODO A cleaner message
    const errorMessage = _.isError(err) ? err.message : (new String(err)).toString();
    this.log.error(errorMessage, err);
    this.setState({ loadingState: LOADING_STATE_ERROR, errorMessage });
  }

  updateChartPrefs(updates, cb = _.noop) {
    this.log.debug('updateChartPrefs', { updates, cb});
    const newPrefs = {
      ...this.state.chartPrefs,
      ...updates,
    };

    this.dataUtil.chartPrefs = newPrefs[this.state.chartType];
    this.setState({ chartPrefs: newPrefs, }, cb);
  }

  /**
   * Chart display date / range change
   * @param {number} epochLocation datetime epoch value in ms
   * @param {number} msRange ms around epochLocation
   * @returns {Promise<boolean>} true if new data are loaded
   */
  async handleDatetimeLocationChange(epochLocation, msRange) {
    let dataLoaded = false;
    const {
      partialDataLoad,
      epochLocation: currentLocation,
      msRange: currentRange,
      chartType,
      loadingState,
    } = this.state;

    // this.log.debug('handleDatetimeLocationChange()', {
    //   currentLocation,
    //   currentRange,
    //   epochLocation,
    //   msRange,
    //   date: moment.utc(epochLocation).toISOString(),
    //   rangeDays: msRange/MS_IN_DAY
    // });

    if (!Number.isFinite(epochLocation) || !Number.isFinite(msRange)) {
      throw new Error('handleDatetimeLocationChange: invalid parameters');
    }

    // Don't do anything if we are currently loading
    // And try to do something only if there is something to do !
    if (loadingState === LOADING_STATE_DONE && (currentLocation !== epochLocation || currentRange !== msRange)) {
      // For daily check for +/- 1 day (and not 0.5 day), for others only the displayed range
      let msRangeDataNeeded = chartType === 'daily' ? MS_IN_DAY : msRange / 2;
      let rangeDisplay = {
        start: epochLocation - msRangeDataNeeded,
        end: epochLocation + msRangeDataNeeded,
      };
      let rangeToLoad = partialDataLoad.getRangeToLoad(rangeDisplay);
      if (rangeToLoad) {
        // We need more data!
        const { api, patient } = this.props;

        if (chartType === 'daily') {
          // For daily we will load 1 week to avoid too many loading
          msRangeDataNeeded = MS_IN_DAY * 3;
          rangeDisplay = {
            start: epochLocation - msRangeDataNeeded,
            end: epochLocation + msRangeDataNeeded,
          };
          rangeToLoad = partialDataLoad.getRangeToLoad(rangeDisplay);
        }

        this.log.info('handleChartDateRangeUpdate getRangeToLoad', rangeToLoad);

        const loadingOptions = {
          startDate: moment.utc(rangeToLoad.start).toISOString(),
          endDate: moment.utc(rangeToLoad.end).toISOString(),
        };
        this.log.info('Update loading range:', loadingOptions);

        // Tell the user a loading is in progress
        this.setState({ loadingState: LOADING_STATE_EARLIER_FETCH });

        // Get the data from the API
        const [patientData, messagesNotes] = await Promise.all([
          api.getPatientData(patient, loadingOptions),
          api.getMessages(patient.userid, loadingOptions),
        ]);

        this.setState({ loadingState: LOADING_STATE_EARLIER_PROCESS });
        // Mark this range as loaded, so we won't ask the API again for them
        partialDataLoad.setRangeLoaded(rangeToLoad);

        // Process the data to be usable by us
        const combinedData = patientData.concat(messagesNotes);
        await this.processData(combinedData);
        dataLoaded = true;
      }

      this.setState({ epochLocation, msRange });
    }

    return dataLoaded;
  }

  handleRefresh() {
    const { api, patient } = this.props;

    // TODO bgUnits from api.whoami
    this.setState({
      loadingState: LOADING_STATE_INITIAL_FETCH,
      dataRange: null,
      epochLocation: 0,
      msRange: 0,
      tidelineData: null,
      pdf: null,
      canPrint: false,
    }, async () => {
      try {
        const range = await api.getPatientDataRange(patient);
        this.log.info('Data range:', range);

        // Assume browser locale, will adjust after
        const timezone = this.state.timePrefs.timezoneName;
        const dataRange = [
          moment.tz(range[0], timezone),
          moment.tz(range[1], timezone),
        ];

        this.setState({ dataRange });

        const initialLoadingDates = [
          moment.utc(dataRange[1]).startOf('week').subtract(2, 'weeks').subtract(1, 'day'),
          moment.utc(dataRange[1]).endOf('day'),
        ];

        // Get the initial range of data to load:
        // 3 weeks (for basics view) -> start/end of week
        // substract one day to be sure to have all the data we need
        // since the timezone is generally not UTC
        const loadingOptions = {
          startDate: initialLoadingDates[0].toISOString(),
          endDate: initialLoadingDates[1].toISOString(),
          withPumpSettings: true,
        };

        this.log.info('Initial loading options:', loadingOptions);

        // Get the data from the API
        const [patientData, messagesNotes] = await Promise.all([
          api.getPatientData(patient, loadingOptions),
          api.getMessages(patient.userid, loadingOptions),
        ]);

        const partialDataLoad = new PartialDataLoad(
          { start: dataRange[0].valueOf(), end: dataRange[1].valueOf() },
          { start: initialLoadingDates[0].valueOf(), end: initialLoadingDates[1].valueOf() },
        );
        this.log('partialDataLoad:', partialDataLoad.toDebug());

        const combinedData = patientData.concat(messagesNotes);
        this.setState({ loadingState: LOADING_STATE_INITIAL_PROCESS, partialDataLoad });

        // Process the data to be usable by us
        await this.processData(combinedData);

      } catch (reason) {
        this.onLoadingFailure(reason);
      }
    });
  }

  /**
   *
   * @param {PatientData} data
   */
  async processData(data) {
    const { store, patient } = this.props;
    const { timePrefs, bgPrefs, dataRange, epochLocation } = this.state;
    let { tidelineData } = this.state;

    console.time('process data');
    const res = nurseShark.processData(data, bgPrefs.bgUnits);
    await waitTimeout(1);
    if (tidelineData === null) {
      const opts = {
        timePrefs,
        ...bgPrefs,
        // Used by tideline oneDay to set-up the scroll range
        // Send this information by tidelineData options
        dataRange,
      };
      tidelineData = new TidelineData(opts);
    }
    await tidelineData.addData(res.processedData);
    console.timeEnd('process data');

    if (_.isEmpty(tidelineData.data)) {
      throw new Error(t('No data to display!'));
    }

    this.dataUtil = new DataUtil(tidelineData.data, { bgPrefs, timePrefs, endpoints: tidelineData.endpoints });

    let newLocation = epochLocation;
    if (epochLocation === 0) {
      // First loading, display the last day in the daily chart
      newLocation = moment.utc(tidelineData.endpoints[1]).valueOf() - MS_IN_DAY/2;
    }

    this.setState({
      bgPrefs: {
        bgUnits: tidelineData.opts.bgUnits,
        bgClasses: tidelineData.opts.bgClasses,
      },
      timePrefs: tidelineData.opts.timePrefs,
      tidelineData,
      epochLocation: newLocation,
      msRange: MS_IN_DAY,
      loadingState: LOADING_STATE_DONE,
      canPrint: true,
    }, () => {
      this.log.info('Loading finished');
      store.dispatch({
        type: FETCH_PATIENT_DATA_SUCCESS,
        payload: {
          patientId: patient.userid,
        },
      });
    });
  }
}

PatientDataPage.propTypes = {
  api: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  profileDialog: PropTypes.func.isRequired,
};

export default PatientDataPage;
