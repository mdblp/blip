import React, { FunctionComponent } from 'react'
import styles from './diabeloop.css'
import { formatLocalizedFromUTC } from '../utils/datetime'
import { useTranslation } from 'react-i18next'

const DEFAULT_VALUE = '-'

interface CgmTableProps {
  cgm: {
    manufacturer: string
    name: string
    expirationDate: string
    swVersionTransmitter: string
    transmitterId: string
    endOfLifeTransmitterDate: string
  }
  timePrefs: {
    timezoneAware: boolean
    timezoneName: string
  }
}

export const CgmTable: FunctionComponent<CgmTableProps> = (
  {
    cgm = {
      manufacturer: DEFAULT_VALUE,
      name: DEFAULT_VALUE,
      expirationDate: DEFAULT_VALUE,
      swVersionTransmitter: DEFAULT_VALUE,
      transmitterId: DEFAULT_VALUE,
      endOfLifeTransmitterDate: DEFAULT_VALUE
    },
    ...props
  }
) => {
  const { timePrefs } = props
  const { t } = useTranslation('main')

  const formatDate = (value: string): string => {
    return value === '' ? DEFAULT_VALUE : formatLocalizedFromUTC(value, timePrefs, t('MMM D, YYYY'))
  }

  const cgmEndOfLife = formatDate(cgm.endOfLifeTransmitterDate)
  const cgmSensorExpirationDate = formatDate(cgm.expirationDate)

  return (
    <table data-testid="settings-table-cgm" className={styles.cgmTable}>
      <caption className={styles.bdlgSettingsHeader}>
        {t('CGM')}
      </caption>
      <tbody>
      <tr>
        <td>{t('Manufacturer')}</td>
        <td>{cgm.manufacturer}</td>
      </tr>
      <tr>
        <td>{t('Product')}</td>
        <td>{cgm.name}</td>
      </tr>
      <tr>
        <td>{t('Cgm sensor expiration date')}</td>
        <td>{cgmSensorExpirationDate}</td>
      </tr>
      <tr>
        <td>{t('Cgm transmitter software version')}</td>
        <td>{cgm.swVersionTransmitter}</td>
      </tr>
      <tr>
        <td>{t('Cgm transmitter id')}</td>
        <td>{cgm.transmitterId}</td>
      </tr>
      <tr>
        <td>{t('Cgm transmitter end of life')}</td>
        <td>{cgmEndOfLife}</td>
      </tr>
      </tbody>
    </table>
  )
}
