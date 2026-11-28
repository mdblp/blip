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

import Avatar from '@mui/material/Avatar'
import { type TimePrefs, type ZenMode } from 'medical-domain'
import React, { type FunctionComponent } from 'react'
import colors from '../../../styles/colors.css'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { getZenModeInfo } from '../../../utils/zen-mode/zen-mode.util'
import { DailyDrawer } from '../common/daily-drawer'
import { DailyDrawerSection } from '../common/daily-drawer-section'
import { DailyDrawerLine } from '../common/daily-drawer-line'

interface ZenModeDrawerProps {
  datum: ZenMode
  timePrefs: TimePrefs
  onClose: () => void
}

const ZEN_MODE_TEXT = 'ZEN'

export const ZenModeDrawer: FunctionComponent<ZenModeDrawerProps> = (props) => {
  const { datum: zenMode, timePrefs, onClose } = props
  const { title, lines } = getZenModeInfo(zenMode)

  return (
    <DailyDrawer onClose={onClose}>
      <DailyDrawerSection
        icon={<Avatar sx={{ bgcolor: colors.zenMode, width: 48, height: 48, fontSize: 'inherit' }}>{ZEN_MODE_TEXT}</Avatar>}
        title={title}
        dateTitle={getDateTitleForBaseDatum(zenMode, timePrefs)}
        content={<>{lines.map((line) => <DailyDrawerLine key={line.label} {...line} />)}</>}
        hasHeaderDivider
      />
    </DailyDrawer>
  )
}
