import React from 'react';
import moment from 'moment-timezone';
import i18next from 'i18next';
import _ from 'lodash';
import styles from './Diabeloop.css';
import * as datetime from '../../utils/datetime';

const t = i18next.t.bind(i18next);

class CgmTable extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    const cgmEndOfLife = this.formatDate(this.props.cgm.endOfLifeTransmitterDate);
    const cgmSensorExpirationDate = this.formatDate(this.props.cgm.expirationDate);
  
    return (
      <table className={styles.settingsTable}>
        <caption className={styles.bdlgSettingsHeader}>
          {t('CGM')}
        </caption>
        <tbody>
          <tr><td>{t('Manufacturer')}</td><td>{this.props.cgm.manufacturer}</td></tr>
          <tr><td>{t('Product')}</td><td>{this.props.cgm.name}</td></tr>
          <tr><td>{t('Sensor Expiration date')}</td><td>{cgmSensorExpirationDate}</td></tr>
          <tr><td>{t('Transmitter software version')}</td><td>{this.props.cgm.swVersionTransmitter}</td></tr>
          <tr><td>{t('Transmitter ID')}</td><td>{this.props.cgm.transmitterId}</td></tr>
          <tr><td>{t('Transmitter end of life')}</td><td>{cgmEndOfLife}</td></tr>
        </tbody>
      </table>
    );
  }

  formatDate(value) {
    if (_.isEmpty(value))
    {
      return null;
    }

    return datetime.formatLocalizedFromUTC(value, this.props.timePrefs, 'MMM D, YYYY');
  }
}

export default CgmTable;
