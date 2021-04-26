/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
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

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment-timezone';
import i18next from 'i18next';
import bows from 'bows';

import Header from './common/Header';
import Table from './common/Table';
import HistoryTable from './DiabeloopHistoryParameters';

import * as datetime from '../../utils/datetime';
import * as dblData from '../../utils/settings/diabeloopData';
import PumpTable from './PumpTable';
import CgmTable from './CgmTable';
import TerminalTable from './TerminalTable';

import { deviceName, getDeviceMeta } from '../../utils/settings/data';

import styles from './Diabeloop.css';

const t = i18next.t.bind(i18next);
const log = bows('DblSettings');

/**
 * Return the <div><table /></div> objects
 * @param {Map} parametersByLevel
 */
function renderDiabeloopParameters(parametersByLevel) {
  const tables = [];

  const tableStyle = styles.settingsTable;
  const columns = [
    {
      key: 'name',
      label: t('Parameter'),
      className: 'secondaryLabelWithMainBold',
    }, {
      key: 'value',
      label: t('Value'),
      className: 'secondaryLabelWithMainBold',
    }, {
      key: 'unit',
      label: t('Unit'),
      className: 'secondaryLabelWithMainBold',
    },
  ];

  // eslint-disable-next-line lodash/prefer-lodash-method
  parametersByLevel.forEach((parameters, level) => {
    const title = {
      label: {
        main: level === 1 ? '' : `${t('Advanced')}`,
      },
      className: styles.bdlgSettingsHeader,
    };
    tables.push(
      <Table
        key={title.label.main}
        title={title}
        rows={parameters}
        columns={columns}
        tableStyle={tableStyle}
      />
    );
  });

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryTitle}>{`${t('Parameters')}`}</div>
      {tables}
    </div>
  );
}

const Diabeloop = (props) => {
  const {
    copySettingsClicked,
    pumpSettings,
    timePrefs,
    handleClickHistory,
  } = props;

  const deviceDateISO =
    moment.tz(pumpSettings.deviceTime, 'UTC').tz(datetime.getBrowserTimezone()).format();
  const deviceDate = new Date(deviceDateISO);
  const displayDeviceDate = deviceDate.toLocaleString();
  const [copyText, setCopyText] = React.useState('');

  const parameters = _.get(pumpSettings, 'payload.parameters', null);
  const device = _.get(pumpSettings, 'payload.device', null);
  const pump = _.get(pumpSettings, 'payload.pump', null);
  const cgm = _.get(pumpSettings, 'payload.cgm', null);
  const history = _.sortBy(_.cloneDeep(_.get(pumpSettings, 'payload.history', null)), ['changeDate']);

  const parametersByLevel = dblData.getParametersByLevel(parameters);

  const handleCopyToClipboard = () => {
    if (_.isFunction(_.get(navigator, 'clipboard.writeText')) && !_.get(window, 'config.TEST', false)) {
      // Available on HTTPS connection only
      // Does not seems to work well during unit tests (promise not always resolved)
      navigator.clipboard.writeText(copyText).then(() => {
        copySettingsClicked(true, true);
      }).catch((reason) => {
        log.error('Copy failed', reason);
        copySettingsClicked(false, true, reason.message);
      });
    } else {
      log.info('Using old clipboard API');
      window.getSelection().removeAllRanges();
      const pre = document.createElement('pre');
      pre.appendChild(document.createTextNode(copyText));
      document.body.appendChild(pre);
      pre.focus();
      const range = document.createRange();
      range.selectNodeContents(pre);
      window.getSelection().addRange(range);
      try {
        document.execCommand('copy');
        copySettingsClicked(true, false);
      } catch (err) {
        log.error('Copy failed', err);
        copySettingsClicked(false, false, err.message);
      }
      window.getSelection().removeAllRanges();
      document.body.removeChild(pre);
    }
  };

  React.useEffect(() => {
    setCopyText(dblData.diabeloopText(device, parametersByLevel, displayDeviceDate));
  }, []);

  return (
    <div>
      <button
        id="button-settings-copy-as-text"
        className={styles.copyButton}
        title={t("For email or notes")}
        onClick={handleCopyToClipboard}>
        {t('Copy as text')}
      </button>
      <Header
        deviceDisplayName={deviceName(props.deviceKey)}
        deviceMeta={getDeviceMeta(pumpSettings, timePrefs)}
        title={displayDeviceDate}
      />
      <div className={styles.settingsContainer}>
        <div className={styles.categoryContainer}>
          <div className={styles.categoryTitle}>{t('Device')}</div>
          <TerminalTable device={device} />
          <PumpTable pump={pump} timePrefs={timePrefs} />
          <CgmTable cgm={cgm} timePrefs={timePrefs} />
        </div>
        {renderDiabeloopParameters(parametersByLevel)}
        <div className={styles.categoryContainer}>
          <div className={styles.categoryTitle}>&nbsp;</div>
          <HistoryTable
            timePrefs={timePrefs}
            title={HistoryTable.title}
            rows={history}
            columns={HistoryTable.columns}
            tableStyle={styles.settingsTable}
            onSwitchToDaily={handleClickHistory}
            unknownParameterIcon={<i className="icon-unsure-data" />}
            addedParameterIcon={<i className="icon-add" />}
            deletedParameterIcon={<i className="icon-remove" />}
            updatedParameterIcon={<i className="icon-refresh" />}
            changeValueArrowIcon={<i className="icon-next" key="icon-next" />}
            switchToDailyIconClass="icon-chart-line"
            />
        </div>
      </div>
    </div>
  );
};

Diabeloop.propTypes = {
  copySettingsClicked: PropTypes.func.isRequired,
  deviceKey: PropTypes.oneOf(['diabeloop']).isRequired,
  pumpSettings: PropTypes.shape({
    deviceId: PropTypes.string.isRequired,
    deviceTime: PropTypes.string.isRequired,
    payload: PropTypes.shape({
      device: PropTypes.shape({
        deviceId: PropTypes.string.isRequired,
        imei: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        manufacturer: PropTypes.string.isRequired,
        swVersion: PropTypes.string.isRequired,
      }).isRequired,
      parameters: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          unit: PropTypes.string.isRequired,
          level: PropTypes.number.isRequired,
        })
      ).isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          changeDate: PropTypes.string.isRequired,
          parameters: PropTypes.arrayOf(
            PropTypes.shape({
              changeType: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired,
              unit: PropTypes.string.isRequired,
              level: PropTypes.number.isRequired,
              effectiveDate: PropTypes.string.isRequired,
            })
          ),
        })),
    }).isRequired,
  }),
  timePrefs: PropTypes.shape({
    timezoneAware: PropTypes.bool.isRequired,
    timezoneName: PropTypes.string,
  }).isRequired,
  handleClickHistory: PropTypes.func.isRequired,
};

export default Diabeloop;
