
/**
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
 */

import PropTypes from 'prop-types';

import React from 'react';
import _ from 'lodash';
import { utils } from 'tidepool-viz';
import { withTranslation, Trans } from 'react-i18next';

import IncrementalInput from '../../components/incrementalinput';
import CustomizedTrendsChart from './customizedtrendschart';
import { roundBgTarget, getSettings } from '../../core/utils';
import { MGDL_UNITS, MMOLL_UNITS, DEFAULT_BG_TARGETS, DEFAULT_BG_SETTINGS } from '../../core/constants';

const BG_INCREMENT_STEPS = {
  [MGDL_UNITS]: 5,
  [MMOLL_UNITS]: 0.1,
};

const VALUES_MIN_MAX = {
  [MGDL_UNITS]: {
    low: {
      min: 60,
      max: 180,
    },
    high: {
      min: 80,
      max: 250,
    },
  },
  [MMOLL_UNITS]: {
    low: {
      min: 3.3,
      max: 10.0,
    },
    high: {
      min: 4.4,
      max: 13.9,
    },
  },
};

export class PatientSettings extends React.Component {
  static propTypes = {
    editingAllowed: PropTypes.bool.isRequired,
    patient: PropTypes.object,
    onUpdatePatientSettings: PropTypes.func.isRequired,
    trackMetric: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onIncrementChange = this.onIncrementChange.bind(this);
    this.resetRange = this.resetRange.bind(this);
    this.state = {
      tracked: {
        low: false,
        high: false,
      },
      error: {
        low: false,
        high: false,
      },
    };
  }

  render() {
    const { patient, t, editingAllowed } = this.props;
    let settings = {};

    if (!patient) {
      return (<div></div>);
    }

    if (!patient.settings) {
      settings = DEFAULT_BG_SETTINGS;
    }
    else {
      settings = getSettings(patient.settings);
    }

    const lowNode = editingAllowed ? this.renderIncrementalInput('low', settings) : this.renderValueNode('low', settings);
    const highNode = editingAllowed ? this.renderIncrementalInput('high', settings) : this.renderValueNode('high', settings);

    const resetNode = editingAllowed ? <a href="#" className="PatientSettings-reset" onClick={this.resetRange}>{t('Reset to default')}</a> : null;
    const errorNode = (this.state.error.low || this.state.error.high) ? this.renderErrorNode() : null;

    let chartTargets = {
      high: utils.bg.formatBgValue(roundBgTarget(settings.bgTarget.high, settings.units.bg), { bgUnits: settings.units.bg }),
      low: utils.bg.formatBgValue(roundBgTarget(settings.bgTarget.low, settings.units.bg), { bgUnits: settings.units.bg }),
    };

    return (
      <div className="PatientSettings">
        <Trans className="PatientPage-sectionTitle" i18nKey="html.patientsettings-target-range">
          My target range <span className="PatientPage-sectionTitle--lowercase">is</span>
        </Trans>
        <div className="PatientInfo-content">
          <div className="PatientInfo-head">
            <div className="PatientSettings-blocks">
              <div className="PatientInfo-blockRow">
                {t('Above')}
                {lowNode}
                {t('and below')}
                {highNode}
                {resetNode}
              </div>
            </div>
            {errorNode}
            <div className="PatientSettings-blocks">
              <CustomizedTrendsChart
                max={chartTargets.high}
                min={chartTargets.low}
                />
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderValueNode(bound, settings) {
    return (<span className="PatientSettings-bgValue">{settings.bgTarget[bound]} {settings.units.bg}</span>);
  }

  renderIncrementalInput(bound, settings) {
    let value = roundBgTarget(settings.bgTarget[bound], settings.units.bg);

    return (<IncrementalInput
      name={bound}
      error={this.state.error[bound]}
      value={value}
      unit={settings.units.bg}
      minValue={VALUES_MIN_MAX[settings.units.bg][bound].min}
      maxValue={VALUES_MIN_MAX[settings.units.bg][bound].max}
      step={BG_INCREMENT_STEPS[settings.units.bg]}
      onChange={this.onIncrementChange}
      />);
  }

  renderErrorNode() {
    const { t } = this.props;
    if (this.state.error.low) {
      return (<p className="PatientSettings-error-message">{t('Upper target must be greater than lower target.')}</p>);
    }
    else if (this.state.error.high) {
      return (<p className="PatientSettings-error-message">{t('Lower target must be less than upper target.')}</p>);
    }
  }

  resetRange(e) {
    e.preventDefault();

    this.setState({
      error: {
        low: false,
        high: false,
      },
    });

    const targetUnits = _.get(this.props.patient, 'settings.units.bg', MGDL_UNITS);

    const defaultSettings = {
      bgTarget: DEFAULT_BG_TARGETS[targetUnits],
    };

    this.props.onUpdatePatientSettings(this.props.patient.userid, defaultSettings);
  }

  onIncrementChange(inputName, newValue, newUnit) {
    const value = parseFloat(utils.bg.formatBgValue(newValue, { bgUnits: newUnit }))

    let lowError = false;
    let highError = false;

    const patientSettings = getSettings(this.props.patient.settings);
    let newSettings = _.defaultsDeep({}, {
      bgTarget: {
        [inputName]: value,
      },
    }, patientSettings);

    // We never change the patient bg units here
    delete newSettings.units;

    if (!this.validateBounds(newSettings.bgTarget)) {
      switch(inputName) {
        case 'low':
          highError = true;
          break;
        case 'high':
          lowError = true;
          break;
      }

      this.setState({
        error: {
          low: lowError,
          high: highError,
        },
      });

      return;
    }

    this.setState({
      error: {
        low: false,
        high: false,
      },
    });

    if (!this.state.tracked[inputName]) {
      this.props.trackMetric(inputName + ' target changed');

      this.setState({
        tracked: {
          [inputName]: true,
        },
      });
    }

    this.props.onUpdatePatientSettings(this.props.patient.userid, newSettings);
  }

  validateBounds(bounds) {
    return bounds.low < bounds.high;
  }
}

export default withTranslation()(PatientSettings);
