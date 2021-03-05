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
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import bows from 'bows';
import moment from 'moment-timezone';
import WindowSizeListener from 'react-window-size-listener';
import i18next from 'i18next';

import { chartDailyFactory } from 'tideline';
import { components as vizComponents } from 'tidepool-viz';

import { BG_DATA_TYPES } from '../../core/constants';
import Stats from './stats';
import BgSourceToggle from './bgSourceToggle';
import Header from './header';
import Footer from './footer';

/** @typedef {import('tideline').TidelineData} TidelineData */

const Loader = vizComponents.Loader;
const BolusTooltip = vizComponents.BolusTooltip;
const SMBGTooltip = vizComponents.SMBGTooltip;
const CBGTooltip = vizComponents.CBGTooltip;
const FoodTooltip = vizComponents.FoodTooltip;
const ReservoirTooltip = vizComponents.ReservoirTooltip;
const PhysicalTooltip = vizComponents.PhysicalTooltip;
const ParameterTooltip = vizComponents.ParameterTooltip;
const ConfidentialTooltip = vizComponents.ConfidentialTooltip;

const t = i18next.t.bind(i18next);

class DailyChart extends React.Component {
  static propTypes = {
    bgClasses: PropTypes.object.isRequired,
    bgUnits: PropTypes.string.isRequired,
    datetimeLocation: PropTypes.object.isRequired,
    patient: PropTypes.object,
    tidelineData: PropTypes.object.isRequired,
    timePrefs: PropTypes.object.isRequired,
    // message handlers
    onCreateMessage: PropTypes.func.isRequired,
    onShowMessageThread: PropTypes.func.isRequired,
    // other handlers
    onDatetimeLocationChange: PropTypes.func.isRequired,
    onMostRecent: PropTypes.func.isRequired,
    onTransition: PropTypes.func.isRequired,
    onBolusHover: PropTypes.func.isRequired,
    onBolusOut: PropTypes.func.isRequired,
    onSMBGHover: PropTypes.func.isRequired,
    onSMBGOut: PropTypes.func.isRequired,
    onCBGHover: PropTypes.func.isRequired,
    onCBGOut: PropTypes.func.isRequired,
    onCarbHover: PropTypes.func.isRequired,
    onCarbOut: PropTypes.func.isRequired,
    onReservoirHover: PropTypes.func.isRequired,
    onReservoirOut: PropTypes.func.isRequired,
    onPhysicalHover: PropTypes.func.isRequired,
    onPhysicalOut: PropTypes.func.isRequired,
    onParameterHover: PropTypes.func.isRequired,
    onParameterOut: PropTypes.func.isRequired,
    onConfidentialHover: PropTypes.func.isRequired,
    onConfidentialOut: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.chartOpts = [
      'bgClasses',
      'bgUnits',
      'timePrefs',
      'onBolusHover',
      'onBolusOut',
      'onSMBGHover',
      'onSMBGOut',
      'onCBGHover',
      'onCBGOut',
      'onCarbHover',
      'onCarbOut',
      'onReservoirHover',
      'onReservoirOut',
      'onPhysicalHover',
      'onPhysicalOut',
      'onParameterHover',
      'onParameterOut',
      'onConfidentialHover',
      'onConfidentialOut',
    ];

    this.log = bows('Daily Chart');
    this.state = {
      chart: null
    };
    /** @type {React.RefObject} */
    this.refNode = React.createRef();
  }

  componentDidMount() {
    this.mountChart();
  }

  componentWillUnmount() {
    this.unmountChart();
  }

  mountChart(cb = _.noop) {
    if (this.state.chart === null) {
      const { datetimeLocation } = this.props;
      this.log.debug('Mounting...', { datetimeLocation });
      const chart = chartDailyFactory(this.refNode.current, _.pick(this.props, this.chartOpts));
      chart.setupPools();
      this.setState({ chart }, () => {
        this.bindEvents();
        this.initializeChart(datetimeLocation);
        cb();
      });
    } else {
      cb();
    }
  }

  unmountChart(cb = _.noop) {
    const { chart } = this.state;
    if (chart !== null) {
      this.log('Unmounting...');
      this.unbindEvents();
      chart.destroy();
      this.setState({ chart: null }, cb);
    } else {
      cb();
    }
  }

  bindEvents() {
    const { chart } = this.state;
    chart.emitter.on('createMessage', this.props.onCreateMessage);
    chart.emitter.on('inTransition', this.props.onTransition);
    chart.emitter.on('messageThread', this.props.onShowMessageThread);
    chart.emitter.on('mostRecent', this.props.onMostRecent);
    chart.emitter.on('navigated', this.props.onDatetimeLocationChange);
  }

  unbindEvents() {
    const { chart } = this.state;
    chart.emitter.off('createMessage', this.props.onCreateMessage);
    chart.emitter.off('inTransition', this.props.onTransition);
    chart.emitter.off('messageThread', this.props.onShowMessageThread);
    chart.emitter.off('mostRecent', this.props.onMostRecent);
    chart.emitter.off('navigated', this.props.onDatetimeLocationChange);
  }

  /**
   * @param {moment.Moment | null} datetime The datetime for the daily chart
   */
  initializeChart(datetime = null) {
    const { tidelineData } = this.props;
    const { chart } = this.state;
    this.log('Initializing...');
    if (_.isEmpty(tidelineData.data)) {
      throw new Error(t('Cannot create new chart with no data'));
    }

    chart.load(tidelineData);
    chart.locate(datetime);
  }

  render() {
    return (
      <div id="tidelineContainer" className="patient-data-chart" ref={this.refNode} />
    );
  }

  rerenderChart() {
    this.log('Rerendering...');
    this.unmountChart(this.mountChart.bind(this));
  }

  getCurrentDay = () => {
    return this.state.chart.getCurrentDay().toISOString();
  };

  goToMostRecent = () => {
    this.state.chart.setAtDate(null, true);
  };

  panBack = () => {
    this.state.chart.panBack();
  };

  panForward = () => {
    this.state.chart.panForward();
  };

  // methods for messages
  closeMessage = () => {
    return this.state.chart.closeMessage();
  };

  createMessage = (message) => {
    return this.state.chart.createMessage(message);
  };

  editMessage = (message) => {
    return this.state.chart.editMessage(message);
  };
}

class Daily extends React.Component {
  static propTypes = {
    patient: PropTypes.object.isRequired,
    permsOfLoggedInUser: PropTypes.object.isRequired,
    bgPrefs: PropTypes.object.isRequired,
    bgSource: PropTypes.oneOf(BG_DATA_TYPES),
    chartPrefs: PropTypes.object.isRequired,
    dataUtil: PropTypes.object,
    timePrefs: PropTypes.object.isRequired,
    datetimeLocation: PropTypes.object.isRequired,
    endpoints: PropTypes.arrayOf(PropTypes.string).isRequired,
    tidelineData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    canPrint: PropTypes.bool.isRequired,
    // refresh handler
    onClickRefresh: PropTypes.func.isRequired,
    // message handlers
    onCreateMessage: PropTypes.func.isRequired,
    onShowMessageThread: PropTypes.func.isRequired,
    // navigation handlers
    onSwitchToBasics: PropTypes.func.isRequired,
    onSwitchToDaily: PropTypes.func.isRequired,
    onClickPrint: PropTypes.func.isRequired,
    onSwitchToSettings: PropTypes.func.isRequired,
    onSwitchToTrends: PropTypes.func.isRequired,
    // PatientData state updaters
    onUpdateChartDateRange: PropTypes.func.isRequired,
    updateChartPrefs: PropTypes.func.isRequired,
    updateDatetimeLocation: PropTypes.func.isRequired,
    trackMetric: PropTypes.func.isRequired,
    profileDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.chartType = 'daily';
    this.log = bows('Daily View');
    this.state = {
      atMostRecent: false,
      inTransition: false,
      title: '',
      tooltip: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.props;
    if (prevProps.loading && !loading) {
      this.chartRef.current.rerenderChart();
    }
  }

  render() {
    const { tidelineData, endpoints } = this.props;
    const { inTransition, tooltip } = this.state;
    const { timePrefs } = tidelineData.opts;

    return (
      <div id="tidelineMain" className="daily">
        <Header
          profileDialog={this.props.profileDialog}
          chartType={this.chartType}
          patient={this.props.patient}
          inTransition={inTransition}
          atMostRecent={this.state.atMostRecent}
          title={this.state.title}
          iconBack={'icon-back'}
          iconNext={'icon-next'}
          iconMostRecent={'icon-most-recent'}
          permsOfLoggedInUser={this.props.permsOfLoggedInUser}
          canPrint={this.props.canPrint}
          trackMetric={this.props.trackMetric}
          onClickBack={this.handlePanBack}
          onClickBasics={this.props.onSwitchToBasics}
          onClickTrends={this.handleClickTrends}
          onClickMostRecent={this.handleClickMostRecent}
          onClickNext={this.handlePanForward}
          onClickOneDay={this.handleClickOneDay}
          onClickSettings={this.props.onSwitchToSettings}
          onClickPrint={this.props.onClickPrint} />
        <div className="container-box-outer patient-data-content-outer">
          <div className="container-box-inner patient-data-content-inner">
            <div className="patient-data-content">
              <Loader show={this.props.loading} overlay={true} />
              <DailyChart
                bgClasses={this.props.bgPrefs.bgClasses}
                bgUnits={this.props.bgPrefs.bgUnits}
                datetimeLocation={this.props.datetimeLocation}
                tidelineData={tidelineData}
                timePrefs={timePrefs}
                // message handlers
                onCreateMessage={this.props.onCreateMessage}
                onShowMessageThread={this.props.onShowMessageThread}
                // other handlers
                onDatetimeLocationChange={this.handleDatetimeLocationChange}
                onHideBasalSettings={this.handleHideBasalSettings}
                onMostRecent={this.handleMostRecent}
                onShowBasalSettings={this.handleShowBasalSettings}
                onTransition={this.handleInTransition}
                onBolusHover={this.handleBolusHover}
                onBolusOut={this.handleTooltipOut}
                onSMBGHover={this.handleSMBGHover}
                onSMBGOut={this.handleTooltipOut}
                onCBGHover={this.handleCBGHover}
                onCBGOut={this.handleTooltipOut}
                onCarbHover={this.handleCarbHover}
                onCarbOut={this.handleTooltipOut}
                onReservoirHover={this.handleReservoirHover}
                onReservoirOut={this.handleTooltipOut}
                onPhysicalHover={this.handlePhysicalHover}
                onPhysicalOut={this.handleTooltipOut}
                onParameterHover={this.handleParameterHover}
                onParameterOut={this.handleTooltipOut}
                onConfidentialHover={this.handleConfidentialHover}
                onConfidentialOut={this.handleTooltipOut}
                ref={this.chartRef}
              />
            </div>
          </div>
          <div className="container-box-inner patient-data-sidebar">
            <div className="patient-data-sidebar-inner">
              <BgSourceToggle
                bgSource={this.props.dataUtil.bgSource}
                bgSources={this.props.dataUtil.bgSources}
                chartPrefs={this.props.chartPrefs}
                chartType={this.chartType}
                onClickBgSourceToggle={this.toggleBgDataSource}
              />
              <Stats
                bgPrefs={this.props.bgPrefs}
                bgSource={this.props.dataUtil.bgSource}
                chartPrefs={this.props.chartPrefs}
                chartType={this.chartType}
                dataUtil={this.props.dataUtil}
                endpoints={endpoints}
              />
            </div>
          </div>
        </div>
        <Footer
          chartType={this.chartType}
          onClickRefresh={this.props.onClickRefresh} />
        {tooltip}
        <WindowSizeListener onResize={this.handleWindowResize} />
      </div>
    );
  }

  /**
   * @param {moment.Moment} datetime A date to display
   * @returns {string}
   */
  getTitle(datetime) {
    /** @type {{tidelineData: TidelineData}} */
    const { tidelineData } = this.props;
    return moment.tz(datetime, tidelineData.getTimezoneAt(datetime)).format(t('ddd, MMM D, YYYY'));
  }

  // handlers
  toggleBgDataSource = (e, bgSource) => {
    if (e) {
      e.preventDefault();
    }

    const changedTo = bgSource === 'cbg' ? 'CGM' : 'BGM';
    this.props.trackMetric(`Daily Click to ${changedTo}`);

    const prefs = _.cloneDeep(this.props.chartPrefs);
    prefs.daily.bgSource = bgSource;
    this.props.updateChartPrefs(prefs);
  };

  handleWindowResize = () => {
    this.chartRef.current && this.chartRef.current.rerenderChart();
  };

  handleClickTrends = (e) => {
    if (e) {
      e.preventDefault();
    }
    const datetime = this.chartRef.current.getCurrentDay();
    this.props.onSwitchToTrends(datetime);
  };

  handleClickMostRecent = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.chartRef.current.goToMostRecent();
  };

  handleClickOneDay = (e) => {
    if (e) {
      e.preventDefault();
    }
    return;
  };

  handleDatetimeLocationChange = (datetimeLocationEndpoints) => {
    const start = moment.utc(datetimeLocationEndpoints.start);
    const end = moment.utc(datetimeLocationEndpoints.end);
    const center = moment.utc(datetimeLocationEndpoints.center);
    const endpoints = [
      start.toISOString(),
      end.toISOString(),
    ];

    this.setState({
      title: this.getTitle(center),
      endpoints,
    });

    this.props.updateDatetimeLocation(center);

    // Update the chart date range in the patientData component.
    this.props.onUpdateChartDateRange(endpoints);
  };

  handleInTransition = inTransition => {
    this.setState({ inTransition });
  };

  updateDatumHoverForTooltip(datum) {
    const { datetimeLocation, bgPrefs, tidelineData } = this.props;
    const rect = datum.rect;
    // range here is -12 to 12
    const hoursOffset = moment.utc(datum.data.epoch).diff(datetimeLocation, 'hours');
    datum.top = rect.top + rect.height / 2;
    if (hoursOffset > 5) {
      datum.side = 'left';
      datum.left = rect.left;
    } else {
      datum.side = 'right';
      datum.left = rect.left + rect.width;
    }
    datum.bgPrefs = bgPrefs;
    datum.timePrefs = tidelineData.opts.timePrefs;
    return datum;
  }

  handleTooltipOut = () => this.setState({ tooltip: null });

  handleBolusHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
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
      />);
    this.setState({ tooltip });
  };

  handleSMBGHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
    const tooltip = (
      <SMBGTooltip
        smbg={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />);
    this.setState({ tooltip });
  };

  handleCBGHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
    const tooltip = (
      <CBGTooltip
        cbg={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />);
    this.setState({ tooltip });
  };

  handleCarbHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
    const tooltip = (
      <FoodTooltip
        food={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />);
    this.setState({ tooltip });
  };

  handleReservoirHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
    const tooltip = (
      <ReservoirTooltip
        reservoir={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />);
    this.setState({ tooltip });
  };

  handlePhysicalHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
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
      />);
    this.setState({ tooltip });
  };

  handleParameterHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
    const tooltip = (
      <ParameterTooltip
        parameter={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />);
    this.setState({ tooltip });
  };

  handleConfidentialHover = (datum) => {
    this.updateDatumHoverForTooltip(datum);
    const tooltip = (
      <ConfidentialTooltip
      confidential={datum.data}
        position={{
          top: datum.top,
          left: datum.left
        }}
        side={datum.side}
        bgPrefs={datum.bgPrefs}
        timePrefs={datum.timePrefs}
      />);
    this.setState({ tooltip });
  };

  handleMostRecent = (atMostRecent) => {
    this.setState({ atMostRecent });
  };

  handlePanBack = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.chartRef.current.panBack();
  };

  handlePanForward = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.chartRef.current.panForward();
  };

  // Messages:

  /**
   * Update the daily view by adding the new message
   * @param {object} message A nurseshark processed message
   * @return {Promise<boolean>} true if the message was added
   */
  createMessage = (message) => {
    return this.chartRef.current.createMessage(message);
  };

  /**
   * Update the daily view message
   * @param {object} message A nurseshark processed message
   * @return {boolean} true if the message was correctly updated
   */
  editMessage = (message) => {
    return this.chartRef.current.editMessage(message);
  };
}

export { DailyChart };
export default Daily;
