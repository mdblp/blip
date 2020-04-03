/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2020, Diabeloop
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
 * not, you can obtain one from the Open Source Initiative (OSI) at
 * https://opensource.org/licenses/BSD-2-Clause.
 * == BSD2 LICENSE ==
 */

/** @typedef { import("tideline/js/diabeloop-data").DiabeloopData } DiabeloopData */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import bows from 'bows';
import moment from 'moment-timezone';
import i18next from '../../core/language';

import ChartDaily from 'tideline/plugins/blip/chart-daily';
import { components as vizComponents } from '@tidepool/viz';

import { BG_DATA_TYPES } from '../../core/constants';
import Header from './header';
import Footer from './footer';
import Stats from './stats';
import TidepoolDaily from './daily';
import BgSourceToggle from './bgSourceToggle';

// In milliseconds
const DEBOUNCE_TIME = 100;
const CHART_TYPE = 'daily';

/** Translate a string @type{(t: string, ...args) => string} */
const t = i18next.t.bind(i18next);

/**
 * @augments  {React.Component<{datetimeLocation: string, loading: boolean, trackMetric: (m: string)=>void, patientData: DiabeloopData, [x: string]: any}>}
 */
class Daily extends React.Component {
  static propTypes = {
    bgPrefs: PropTypes.object.isRequired,
    bgSource: PropTypes.oneOf(BG_DATA_TYPES),
    chartPrefs: PropTypes.object.isRequired,
    dataUtil: PropTypes.object,
    timePrefs: PropTypes.object.isRequired,
    datetimeLocation: PropTypes.string.isRequired,
    // DiabeloopData from tideline
    patientData: PropTypes.object.isRequired,
    pdf: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
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
    onSwitchToBgLog: PropTypes.func.isRequired,
    onSwitchToTrends: PropTypes.func.isRequired,
    // PatientData state updaters
    onUpdateChartDateRange: PropTypes.func.isRequired,
    updateChartPrefs: PropTypes.func.isRequired,
    updateDatetimeLocation: PropTypes.func.isRequired,
    trackMetric: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { datetimeLocation, patientData } = props;

    this.chartType = CHART_TYPE;
    this.log = bows('DblgDaily');
    this.state = {
      tidepoolDaily: false,
      title: moment.tz(datetimeLocation, patientData.timePrefs.timezoneName).format(t('ddd, MMM D, YYYY')),
      atMostRecent: false,
      inTransition: false,
    };
    this.debouncedResize = null;
    this.onSwitchDisplay = this.onSwitchDisplay.bind(this);
  }

  componentDidMount() {
    // Thanks to WindowSizeListener (react-window-size-listener)
    this.debouncedResize = _.debounce(this.onWindowResize.bind(this), DEBOUNCE_TIME);
    window.addEventListener('resize', this.debouncedResize, false);
    this.log.info('Mounting...');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResize, false);
    this.debouncedResize = null;
    this.log.info('Unmount...');
  }

  render() {
    const { tidepoolDaily } = this.state;
    /** @type {React.CSSProperties} */
    const btnStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
    };
    /** @type {React.CSSProperties} */
    const divStyle = {
      display: 'flex',
      flexDirection: 'column',
    };
    /** @type {JSX.Element} */
    let btn = null;
    /** @type {JSX.Element} */
    let tidelineMain = null;
    if (tidepoolDaily) {
      btn = <button type="button" onClick={this.onSwitchDisplay} style={btnStyle}>Switch to Diabeloop View</button>;
      tidelineMain = this.renderTidepoolDaily();
    } else {
      btn = <button type="button" onClick={this.onSwitchDisplay} style={btnStyle}>Switch to Tidepool View</button>;
      tidelineMain = this.renderDiabeloopDaily();
    }

    return (
      <div style={divStyle}>
        {btn}
        {tidelineMain}
      </div>
    );
  }

  renderTidepoolDaily() {
    return (<TidepoolDaily {...this.props} />)
  }

  renderDiabeloopDaily() {
    const { loading, patientData, trackMetric, datetimeLocation } = this.props;
    const Loader = vizComponents.Loader;

    let dailyChart = null;
    if (!loading) {
      dailyChart = (
        <ChartDaily
          containerId="tidelineContainer"
          className="patient-data-chart"
          diabeloopData={patientData}
          datetimeLocation={datetimeLocation}
          trackMetric={trackMetric}
        />
      );
    }

    return (
      <div id="tidelineMain" className="daily">
        <Header
          chartType={CHART_TYPE}
          patient={this.props.patient}
          printReady={!!this.props.pdf.url}
          inTransition={this.state.inTransition}
          atMostRecent={this.state.atMostRecent}
          title={this.state.title}
          iconBack={'icon-back'}
          iconNext={'icon-next'}
          iconMostRecent={'icon-most-recent'}
          onClickBack={this.onClickBack}
          onClickNext={this.onClickNext}
          onClickMostRecent={this.onClickMostRecent}
          onClickBasics={this.props.onSwitchToBasics}
          onClickOneDay={_.noop}
          onClickBgLog={this.props.onSwitchToBgLog}
          onClickTrends={this.props.onSwitchToTrends}
          onClickSettings={this.props.onSwitchToSettings}
          onClickPrint={this.props.onClickPrint}
        ref="header" />
        <div className="container-box-outer patient-data-content-outer">
          <div className="container-box-inner patient-data-content-inner">
            <div className="patient-data-content">
              <Loader show={loading} overlay={true} />
              {dailyChart}
            </div>
          </div>
          <div className="container-box-inner patient-data-sidebar">
            <div className="patient-data-sidebar-inner">
              <BgSourceToggle
                bgSource={this.props.dataUtil.bgSource}
                bgSources={this.props.dataUtil.bgSources}
                chartPrefs={this.props.chartPrefs}
                chartType={CHART_TYPE}
                onClickBgSourceToggle={this.onClickBgSourceToggle}
              />
              <Stats
                bgPrefs={this.props.bgPrefs}
                bgSource={this.props.dataUtil.bgSource}
                chartPrefs={this.props.chartPrefs}
                chartType={CHART_TYPE}
                dataUtil={this.props.dataUtil}
                endpoints={this.state.endpoints}
              />
            </div>
          </div>
        </div>
        <Footer
         chartType={CHART_TYPE}
         onClickRefresh={this.props.onClickRefresh}
        ref="footer" />
      </div>
    );
  }


  renderScrollBar() {}

  // ** Events **

  onWindowResize() {
    this.log.debug('onWindowResize');

  }

  onClickBack() {
  }

  onClickNext() {
  }

  onClickMostRecent() {}
  onClickBgSourceToggle() {}

  onSwitchDisplay() {
    const { tidepoolDaily } = this.state;
    this.setState({ tidepoolDaily: !tidepoolDaily });
  }
}

export default Daily;
