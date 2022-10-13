import React, { FunctionComponent } from 'react'
import styles from './diabeloop.css'
import { useTranslation } from 'react-i18next'

const DEFAULT_VALUE = '-'

interface TerminalTableProps {
  device: {
    deviceId: string
    imei: string
    name: string
    manufacturer: string
    swVersion: string
  }
}

export const TerminalTable: FunctionComponent<TerminalTableProps> = (
  {
    device = {
      deviceId: DEFAULT_VALUE,
      imei: DEFAULT_VALUE,
      name: DEFAULT_VALUE,
      manufacturer: DEFAULT_VALUE,
      swVersion: DEFAULT_VALUE
    }
  }
) => {
  const { t } = useTranslation('main')

  return (
    <table data-testid="settings-table-terminal" className={styles.deviceTable}>
      <caption className={styles.bdlgSettingsHeader}>
        {device.name}
      </caption>
      <tbody>
      <tr>
        <td>{t('Manufacturer')}</td>
        <td>{device.manufacturer}</td>
      </tr>
      <tr>
        <td>{t('Identifier')}</td>
        <td>{device.deviceId}</td>
      </tr>
      <tr>
        <td>{t('IMEI')}</td>
        <td>{device.imei}</td>
      </tr>
      <tr>
        <td>{t('Software version')}</td>
        <td>{device.swVersion}</td>
      </tr>
      </tbody>
    </table>
  )
}
