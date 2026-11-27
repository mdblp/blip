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

import { type TimePrefs, type WarmUp } from 'medical-domain'
import React, { type FunctionComponent } from 'react'
import warmupIcon from 'warmup-icon.svg'
import { getDateTitleForBaseDatum } from '../../utils/tooltip/tooltip.util'
import { getWarmUpTooltipContent } from '../../utils/warm-up/warm-up.util'
import { DailyDrawer } from './daily-drawer'
import { DailyDrawerIcon } from './daily-drawer-icon'
import { DailyDrawerLine } from './daily-drawer-line'

interface WarmUpDrawerProps {
  datum: WarmUp
  timePrefs: TimePrefs
  onClose: () => void
}

export const WarmUpDrawer: FunctionComponent<WarmUpDrawerProps> = (props) => {
  const { datum: warmUp, timePrefs, onClose } = props

  const { title, description, endTime } = getWarmUpTooltipContent(warmUp)

  return (
    <DailyDrawer
      icon={<DailyDrawerIcon src={warmupIcon} />}
      title={title}
      dateTitle={getDateTitleForBaseDatum(warmUp, timePrefs)}
      content={<DailyDrawerLine label={description} value={endTime} />}
      onClose={onClose}
    />
  )
}
