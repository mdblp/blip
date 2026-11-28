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

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import React, { type FunctionComponent, useMemo } from 'react'
import { computeDateValue } from '../../../utils/tooltip/tooltip.util'
import { type DateTitle } from '../../tooltips/common/tooltip/tooltip'

interface DailyDrawerSectionProps {
  icon: JSX.Element
  title: string
  dateTitle: DateTitle
  content: JSX.Element
  hasHeaderDivider?: boolean
}

export const DailyDrawerSection: FunctionComponent<DailyDrawerSectionProps> = (props) => {
  const { icon, title, dateTitle, content, hasHeaderDivider } = props

  const dateValue = useMemo(() => computeDateValue(dateTitle), [dateTitle])

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingX: 3, paddingBottom: 2 }}>
        {icon}
        <Box component="span" sx={{ fontWeight: 'bold', flexGrow: 1 }}>{title}</Box>
        <span data-testid="daily-drawer-date">{dateValue}</span>
      </Box>
      {hasHeaderDivider && <Divider />}
      <Box sx={{ paddingX: 3, paddingTop: hasHeaderDivider ? 2 : 0, paddingBottom: 2 }}>
        {content}
      </Box>
    </>
  )
}
