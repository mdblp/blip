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

import React, { type FunctionComponent } from 'react'
import styles from './diabeloop.css'
import { useTranslation } from 'react-i18next'
import { type DeviceConfig } from 'medical-domain'

const DEFAULT_VALUE = '-'

interface TerminalTableProps {
  device: DeviceConfig
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