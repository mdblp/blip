/**
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
import { formatLocalizedFromUTC } from '../utils/datetime'
import { useTranslation } from 'react-i18next'
import { Pump, TimePrefs } from './models'

const DEFAULT_VALUE = '-'

interface PumpTableProps {
  pump: Pump
  timePrefs: TimePrefs
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
