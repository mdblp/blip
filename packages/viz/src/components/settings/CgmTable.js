import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import * as datetime from '../../utils/datetime';
import styles from './Diabeloop.css';

const t = i18next.t.bind(i18next);
const DEFAULT_VALUE = '-';

class CgmTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { cgm } = this.props;

    if (cgm === null) {
      return null;
    }

    const cgmEndOfLife = this.formatDate(cgm.endOfLifeTransmitterDate);
    const cgmSensorExpirationDate = this.formatDate(cgm.expirationDate);

    return (
      <table id="settings-table-cgm" className={styles.cgmTable}>
        <caption id="settings-table-cgm-title" className={styles.bdlgSettingsHeader}>
          {t('CGM')}
        </caption>
        <tbody>
          <tr>
            <td id="settings-table-cgm-manufacturer">{t('Manufacturer')}</td>
            <td id="settings-table-cgm-manufacturer-value">{cgm.manufacturer}</td>
          </tr>
          <tr>
            <td id="settings-table-cgm-product">{t('Product')}</td>
            <td id="settings-table-cgm-product-value">{cgm.name}</td>
          </tr>
          <tr>
            <td id="settings-table-cgm-expdate">{t('Cgm sensor expiration date')}</td>
            <td id="settings-table-cgm-expdate-value" data-isodate={cgm.expirationDate}>{cgmSensorExpirationDate}</td>
          </tr>
          <tr>
            <td id="settings-table-cgm-swversion">{t('Cgm transmitter software version')}</td>
            <td id="settings-table-cgm-swversion-value">{cgm.swVersionTransmitter}</td>
          </tr>
          <tr>
            <td id="settings-table-cgm-transmitterid">{t('Cgm transmitter id')}</td>
            <td id="settings-table-cgm-transmitterid-value">{cgm.transmitterId}</td>
          </tr>
          <tr>
            <td id="settings-table-cgm-eoldate">{t('Cgm transmitter end of life')}</td>
            <td id="settings-table-cgm-eoldate-value" data-isodate={cgm.endOfLifeTransmitterDate}>{cgmEndOfLife}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  formatDate(value) {
    const { timePrefs } = this.props;
    if (_.isEmpty(value)) {
      return DEFAULT_VALUE;
    }

    return datetime.formatLocalizedFromUTC(value, timePrefs, t('MMM D, YYYY'));
  }
}

// if the value is not present
CgmTable.defaultProps = {
  cgm : {
    manufacturer: DEFAULT_VALUE,
    name: DEFAULT_VALUE,
    expirationDate: DEFAULT_VALUE,
    swVersionTransmitter: DEFAULT_VALUE,
    transmitterId: DEFAULT_VALUE,
    endOfLifeTransmitterDate: DEFAULT_VALUE
  },
};

CgmTable.propTypes = {
  cgm : PropTypes.shape({
    manufacturer: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    expirationDate: PropTypes.string.isRequired,
    swVersionTransmitter: PropTypes.string.isRequired,
    transmitterId: PropTypes.string.isRequired,
    endOfLifeTransmitterDate: PropTypes.string.isRequired
  }).isRequired,
  timePrefs: PropTypes.shape({
    timezoneAware: PropTypes.bool.isRequired,
    timezoneName: PropTypes.string,
  }).isRequired,
};

export default CgmTable;
