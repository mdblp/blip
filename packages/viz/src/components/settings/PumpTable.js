import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import i18next from 'i18next';
import styles from './Diabeloop.css';
import * as datetime from '../../utils/datetime';

const t = i18next.t.bind(i18next);

class PumpTable extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    const { pump } = this.props; 
    const pumpExpirationDate = this.formatDate(pump.expirationDate);
    
    return (
      <table className={styles.settingsTable}>
        <caption className={styles.bdlgSettingsHeader}>
          {t('Pump')}
        </caption>
        <tbody>
          <tr><td>{t('Manufacturer')}</td><td>{pump.manufacturer}</td></tr>
          <tr><td>{t('Serial Number')}</td><td>{pump.serialNumber}</td></tr>
          <tr><td>{t('Pump Version')}</td><td>{pump.swVersion}</td></tr>
          <tr><td>{t('Cartridge expiration date')}</td><td>{pumpExpirationDate}</td></tr>
        </tbody>
      </table>
    );
  }

  formatDate(value) {
    const { timePrefs } = this.props;
    if (_.isEmpty(value))
    {
      return null;
    }

    return datetime.formatLocalizedFromUTC(value, timePrefs, 'MMM D, YYYY');
  }
}

export default PumpTable;
