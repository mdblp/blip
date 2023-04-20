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

import React, { type ForwardedRef } from 'react'
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon'

export const TimeSpentOufOfRangeIcon = React.forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
  return (
    <SvgIcon {...props} ref={ref}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <defs>
          <style>
            {'.time-spent-out-of-range-icon-no-fill { fill: none }'}
          </style>
        </defs>
        <path d="m21.97,28.06c-.51,0-1.02-.2-1.41-.59-.78-.78-.78-2.05,0-2.83L38.64,6.56c.78-.78,2.05-.78,2.83,0,.78.78.78,2.05,0,2.83l-18.09,18.09c-.39.39-.9.59-1.41.59Z" />
        <path d="m42,16.03c-1.1,0-2-.9-2-2v-6h-6c-1.1,0-2-.9-2-2s.9-2,2-2h8c1.1,0,2,.9,2,2v8c0,1.1-.9,2-2,2Z" />
        <g>
          <path className="time-spent-out-of-range-icon-no-fill"
                d="m30.83,26.31c0,5.06-4.11,9.17-9.17,9.17s-9.17-4.11-9.17-9.17,4.11-9.17,9.17-9.17c.23,0,.46.02.69.03l3.79-3.79c-1.39-.48-2.88-.75-4.43-.75-7.54,0-13.68,6.14-13.68,13.68s6.14,13.68,13.68,13.68,13.68-6.14,13.68-13.68c0-1.56-.28-3.06-.76-4.45l-3.83,3.83c.01.2.03.41.03.62Z" />
          <path d="m21.95,32.06c-1.6,0-3.11-.62-4.24-1.76-1.13-1.13-1.76-2.64-1.76-4.24s.62-3.11,1.76-4.24l4.64-4.64c-.23-.02-.46-.03-.69-.03-5.06,0-9.17,4.11-9.17,9.17s4.11,9.17,9.17,9.17,9.17-4.11,9.17-9.17c0-.21-.02-.41-.03-.62l-4.6,4.6c-1.13,1.13-2.64,1.76-4.24,1.76Z" />
          <path d="m35.39,26.32c0,7.54-6.14,13.68-13.68,13.68s-13.68-6.14-13.68-13.68,6.14-13.68,13.68-13.68c1.55,0,3.04.27,4.43.75l3.07-3.07c-2.28-1.07-4.81-1.68-7.49-1.68-9.76,0-17.68,7.92-17.68,17.68s7.92,17.68,17.68,17.68,17.68-7.92,17.68-17.68c0-2.69-.62-5.23-1.7-7.52l-3.06,3.06c.48,1.4.76,2.89.76,4.45Z" />
        </g>
      </svg>
    </SvgIcon>
  )
})

TimeSpentOufOfRangeIcon.displayName = 'TimeSpentOutOfRangeIcon'
