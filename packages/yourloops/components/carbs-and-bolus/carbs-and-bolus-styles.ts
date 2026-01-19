/*
 * Copyright (c) 2023-2025, Diabeloop
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

export const LIGHT_BORDER = '1px solid #e7e7e7'
export const RESCUE_CARBS_COLOR = 'var(--error-color-main)'
export const MANUAL_BOLUS_COLOR = 'var(--dark-blue-main)'

export const DEFAULT_TOOLTIP_POSITION = { top: 0, left: 85 }

export const useCarbsAndBolusStyles = makeStyles()((theme) => ({
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
  containerFlexLarge: {
    opacity: 1,
    margin: '2px 0',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '160px',
  }
}))
