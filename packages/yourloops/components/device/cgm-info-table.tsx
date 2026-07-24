/*
 * Copyright (c) 2023-2026, Diabeloop
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

import type { CgmConfig } from 'medical-domain'
import { CGMName } from 'medical-domain'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDateWithMomentLongFormat } from '../../lib/utils'
import { GenericListCard } from './generic-list-card'

interface CgmInfoProps {
  cgm: CgmConfig
}

export const CgmInfoTable: FC<CgmInfoProps> = ({ cgm }) => {
  const { t } = useTranslation()

  const getTableLines = (cgm: CgmConfig): { value: string, label: string }[] => {
    const tableInfoLines = [
      { label: t('Manufacturer'), value: cgm.manufacturer },
      { label: t('Product'), value: cgm.name },
      { label: t('Cgm sensor expiration date'), value: formatDateWithMomentLongFormat(new Date(cgm.expirationDate)) }
    ]

    const g6InfoLines = [
      { label: t('Cgm transmitter software version'), value: cgm.swVersionTransmitter },
      { label: t('Cgm transmitter id'), value: cgm.transmitterId },
      { label: t('Cgm transmitter end of life'), value: formatDateWithMomentLongFormat(new Date(cgm.endOfLifeTransmitterDate)) }
    ]

    const g7InfoLines = [
      { label: t('serial-number'), value: cgm.serialNumber },
      { label: t('software-number'), value: cgm.softwareNumber },
      { label: t('pairing-code'), value: cgm.pairingCode }
    ]

    const additionalLines = cgm.name === CGMName.G6 ? g6InfoLines : g7InfoLines
    tableInfoLines.push(...additionalLines)

    return tableInfoLines
  }

  return (
    <GenericListCard
      title={t('CGM')}
      tableLines={getTableLines(cgm)}
      data-testid="settings-table-cgm"
    />
  )
}

