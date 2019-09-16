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

import React, { PropTypes } from 'react';
import ClipboardButton from 'react-clipboard.js';
import _ from 'lodash';
import moment from 'moment-timezone';
import i18next from 'i18next';

import Header from './common/Header';
import Table from './common/Table';
import HistoryTable from './DiabeloopHistoryParameters';

import * as datetime from '../../utils/datetime';
import * as dblData from '../../utils/settings/diabeloopData';
import { deviceName, getDeviceMeta } from '../../utils/settings/data';

import styles from './Diabeloop.css';

const t = i18next.t.bind(i18next);

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
    }, {
      key: 'value',
      label: t('Value'),
    }, {
      key: 'unit',
      label: t('Unit'),
    },
  ];

  // eslint-disable-next-line lodash/prefer-lodash-method
  parametersByLevel.forEach((parameters, level) => {
    const title = {
      label: {
        main: `${t('level')} ${level}`,
      },
      className: styles.bdlgSettingsHeader,
    };

    tables.push(
      <Table
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

  const parameters = _.get(pumpSettings, 'payload.parameters', null);
  const device = _.get(pumpSettings, 'payload.device', null);
  const history = _.sortBy(_.cloneDeep(_.get(pumpSettings, 'payload.history', null)), ['changeDate']);

  if (parameters === null || device === null) {
    return null;
  }

  const parametersByLevel = dblData.getParametersByLevel(parameters);

  return (
    <div>
      <ClipboardButton
        className={styles.copyButton}
        button-title={t('For email or notes')}
        data-clipboard-target="#copySettingsText"
        onSuccess={copySettingsClicked}
      >
        <p>{t('Copy as text')}</p>
      </ClipboardButton>
      <Header
        deviceDisplayName={deviceName(props.deviceKey)}
        deviceMeta={getDeviceMeta(pumpSettings, timePrefs)}
        title={displayDeviceDate}
      />
      <div className={styles.settingsContainer}>
        <div className={styles.categoryContainer}>
          <div className={styles.categoryTitle}>{t('Device')}</div>
          <table className={styles.settingsTable}>
            <caption className={styles.bdlgSettingsHeader}>
              {t('Device')}<span className={styles.secondaryLabelWithMain}>{device.name}</span>
            </caption>
            <tbody>
              <tr><td>{t('Manufacturer')}</td><td>{device.manufacturer}</td></tr>
              <tr><td>{t('Identifier')}</td><td>{device.deviceId}</td></tr>
              <tr><td>{t('IMEI')}</td><td>{device.imei}</td></tr>
              <tr><td>{t('Software version')}</td><td>{device.swVersion}</td></tr>
            </tbody>
          </table>
        </div>
        {renderDiabeloopParameters(parametersByLevel)}
        <div className={styles.categoryContainer}>
          <div className={styles.categoryTitle}>&nbsp;</div>
          <HistoryTable
            title={HistoryTable.title}
            rows={history}
            columns={HistoryTable.columns}
            tableStyle={styles.settingsTable}
            onSwitchToDaily={handleClickHistory}
            unknownParameterIcon={<i className="icon-unsure-data" />}
            addedParameterIcon={<i className="icon-add" />}
            deletedParameterIcon={<i className="icon-remove" />}
            updatedParameterIcon={<i className="icon-refresh" />}
            changeValueArrowIcon={<i className="icon-next" />}
            switchToDailyIconClass="icon-chart-line"
            />
        </div>
      </div>
      <pre className={styles.copyText} id="copySettingsText">
        {dblData.diabeloopText(device, parametersByLevel, displayDeviceDate)}
      </pre>
    </div>
  );
};

Diabeloop.propTypes = {
  copySettingsClicked: PropTypes.func.isRequired,
  deviceKey: PropTypes.oneOf(['diabeloop']).isRequired,
  pumpSettings: PropTypes.shape({
    deviceId: PropTypes.string.isRequired,
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
          _id: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
          updatedAt: PropTypes.string.isRequired,
          parameters: PropTypes.arrayOf(
            PropTypes.shape({
              _id: PropTypes.string.isRequired,
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
    timezoneName: PropTypes.oneOfType([PropTypes.string]),
  }).isRequired,
  user: PropTypes.object.isRequired,
};
export default Diabeloop;
