/*
 * Copyright (c) 2026, Diabeloop
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

import { type DeviceParameterChange, type Parameter, type TimePrefs } from 'medical-domain'
import parameterIcon from 'parameter-change.png'
import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { ParameterChangeLine } from '../../tooltips/parameter-tooltip/parameter-change-line'
import { DailyDrawer } from '../common/daily-drawer'
import { DailyDrawerIcon } from '../common/daily-drawer-icon'

interface ParameterDrawerProps {
  datum: DeviceParameterChange
  timePrefs: TimePrefs
  onClose: () => void
}

export const ParameterDrawer: FunctionComponent<ParameterDrawerProps> = (props) => {
  const { datum: parameterChange, timePrefs, onClose } = props
  const { t } = useTranslation()

  return (
    <DailyDrawer
      icon={<DailyDrawerIcon src={parameterIcon} />}
      title={t('settings-change')}
      dateTitle={getDateTitleForBaseDatum(parameterChange, timePrefs)}
      content={
        <>
          {parameterChange.params.map((parameter: Parameter) =>
            <ParameterChangeLine key={parameter.id} parameter={parameter} />
          )}
        </>
      }
      onClose={onClose}
    />
  )
}
