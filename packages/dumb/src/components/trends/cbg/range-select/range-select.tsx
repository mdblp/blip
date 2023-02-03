/*
 * Copyright (c) 2023, Diabeloop
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

import styles from './range-select.css'

import { RangeLabeledToggle } from '../../../controls/range-labeled-toggle/range-labeled-toggle'
import { useTrendsContext } from '../../../../provider/trends.provider'
import { DisplayFlag } from '../../../../models/enums/display-flag.enum'
import { useTranslation } from 'react-i18next'

export const RangeSelect: FunctionComponent = () => {
  const { displayFlags } = useTrendsContext()
  const { t } = useTranslation()

  return (
    <div className={styles.container} data-testid="range-selection">
      <RangeLabeledToggle
        checked={displayFlags.cbg100Enabled}
        label={t('100% of Readings')}
        displayFlag={DisplayFlag.Cbg100Enabled}
      />
      <RangeLabeledToggle
        checked={displayFlags.cbg80Enabled}
        label={t('80% of Readings')}
        displayFlag={DisplayFlag.Cbg80Enabled}
      />
      <RangeLabeledToggle
        checked={displayFlags.cbg50Enabled}
        label={t('50% of Readings')}
        displayFlag={DisplayFlag.Cbg50Enabled}
      />
      <RangeLabeledToggle
        checked={displayFlags.cbgMedianEnabled}
        displayFlag={DisplayFlag.CbgMedianEnabled}
        label={t('Median')}
      />
    </div>
  )
}
