/*
 * Copyright (c) 2023-2024, Diabeloop
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

import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'

export const LIGHT_BORDER = '1px solid #e7e7e7'
export const RESCUE_CARBS_COLOR = 'var(--error-color-main)'
export const MANUAL_BOLUS_COLOR = 'var(--dark-blue-main)'

export const useCarbsAndBolusStyles = makeStyles()((theme: Theme) => ({
  cell: {
    borderRadius: theme.spacing(1),
    margin: 'auto',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    position: 'relative'
  },
  cellsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: LIGHT_BORDER,
    borderBottom: LIGHT_BORDER,
    backgroundColor: '#f8f8f8',
    gap: 10,
    paddingBlock: theme.spacing(2)
  },
  hoverTooltip: {
    position: 'absolute',
    left: 108,
    zIndex: 1,
    borderRadius: '4px',
    width: '290px',
    backgroundColor: theme.palette.common.white,
    '& .header': {
      backgroundColor: theme.palette.grey[200],
      padding: theme.spacing(1, 2)
    },
    '& .content': {
      padding: theme.spacing(1, 2)
    }
  },
  tooltipTail: {
    width: 0,
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    position: 'absolute',
    '&.rescue-carbs': {
      top: 46,
      left: -16,
      borderRight: `15px solid ${RESCUE_CARBS_COLOR}`
    },
    '&.manual-bolus': {
      top: 38,
      left: -16,
      borderRight: `15px solid ${MANUAL_BOLUS_COLOR}`
    }
  }
}))
