import React, { FunctionComponent } from 'react'
import styles from './diabeloop.css'
import { formatLocalizedFromUTC } from '../utils/datetime'
import { useTranslation } from 'react-i18next'

const DEFAULT_VALUE = '-'

interface PumpTableProps {
  pump: {
    manufacturer: string
    serialNumber: string
    swVersion: string
    expirationDate: string
  }
  timePrefs: {
    timezoneAware: boolean
    timezoneName: string
  }
}

export const PumpTable: FunctionComponent<PumpTableProps> = (
  {
    pump = {
      expirationDate: DEFAULT_VALUE,
      manufacturer: DEFAULT_VALUE,
      serialNumber: DEFAULT_VALUE,
      swVersion: DEFAULT_VALUE
    },
    ...props
  }
) => {
  const { timePrefs } = props
  const { t } = useTranslation('main')

  const formatDate = (value: string): string => {
    return value === '' ? DEFAULT_VALUE : formatLocalizedFromUTC(value, timePrefs, t('MMM D, YYYY'))
  }

  const pumpExpirationDate = formatDate(pump.expirationDate)

  return (
    <table data-testid="settings-table-pump" className={styles.pumpTable}>
      <caption className={styles.bdlgSettingsHeader}>
        {t('Pump')}
      </caption>
      <tbody>
      <tr>
        <td>{t('Manufacturer')}</td>
        <td>{pump.manufacturer}</td>
      </tr>
      <tr>
        <td>{t('Serial Number')}</td>
        <td>{pump.serialNumber}</td>
      </tr>
      <tr>
        <td>{t('Pump version')}</td>
        <td>{pump.swVersion}</td>
      </tr>
      <tr>
        <td>{t('Pump cartridge expiration date')}</td>
        <td>{pumpExpirationDate}</td>
      </tr>
      </tbody>
    </table>
  )
}
