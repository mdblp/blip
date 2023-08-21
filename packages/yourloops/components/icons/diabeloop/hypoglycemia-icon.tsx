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

export const HypoglycemiaIcon = React.forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
  return (
    <SvgIcon {...props} ref={ref}>
      <svg viewBox="0 0 48 48" fill="currentColor">
        <path d="m36.62,27.21c-5.13,0-7.46,4.65-9.34,8.38-.99,1.98-2.23,4.44-3.25,4.44s-2.26-2.46-3.25-4.44c-1.88-3.74-4.21-8.38-9.34-8.38-1.1,0-2,.9-2,2s.9,2,2,2c2.48,0,3.89,2.45,5.76,6.18,1.64,3.27,3.34,6.64,6.83,6.64s5.19-3.38,6.83-6.64c1.87-3.73,3.29-6.18,5.76-6.18,1.1,0,2-.9,2-2s-.9-2-2-2Z" />
        <path d="m24,31.99c-1.1,0-2-.9-2-2V6c0-1.1.9-2,2-2s2,.9,2,2v23.99c0,1.1-.9,2-2,2Z" />
      </svg>
    </SvgIcon>
  )
})

HypoglycemiaIcon.displayName = 'HypoglycemiaIcon'
