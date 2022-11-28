/*
 * Copyright (c) 2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, { FunctionComponent } from 'react'
import styles from './diabeloop.css'
import { formatLocalizedFromUTC } from '../../utils/datetime/datetime.util'
import { useTranslation } from 'react-i18next'
import { CgmConfig, TimePrefs } from 'medical-domain'

const DEFAULT_VALUE = '-'

interface CgmTableProps {
  cgm: CgmConfig
  timePrefs: TimePrefs
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
