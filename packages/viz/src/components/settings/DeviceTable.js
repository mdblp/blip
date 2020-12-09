import i18next from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Diabeloop.css';

const t = i18next.t.bind(i18next);
const DEFAULT_VALUE = '-';

class DeviceTable extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    const { device } = this.props; 

    return (
      <table className={styles.deviceTable}>
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
    );
  }
}

// if the value is not present
DeviceTable.defaultProps = {
  device: {
    deviceId: DEFAULT_VALUE,
    imei: DEFAULT_VALUE,
    name: DEFAULT_VALUE,
    manufacturer: DEFAULT_VALUE,
    swVersion: DEFAULT_VALUE
  }
};

DeviceTable.propTypes = {
  device: PropTypes.shape({
    deviceId: PropTypes.string.isRequired,
    imei: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    manufacturer: PropTypes.string.isRequired,
    swVersion: PropTypes.string.isRequired,
  }).isRequired
}; 

export default DeviceTable;
