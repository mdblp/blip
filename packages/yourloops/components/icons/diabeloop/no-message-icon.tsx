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

export const NoMessageIcon = React.forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
  return (
    <SvgIcon {...props} ref={ref}>
      <svg viewBox="0 0 48 48" fill="currentColor">
        <path d="m42.74,15.45L25.06,4.38c-.65-.41-1.47-.41-2.12,0L5,15.61c-.09.06-.18.13-.26.2-.54.46-.8,1.17-.68,1.85v24.31c0,1.1.9,2,2,2h35.94c1.1,0,2-.9,2-2v-24.66c0-.84-.52-1.56-1.26-1.85Zm-18.74-7.02l14.74,9.23-14.72,9.58-14.74-9.6,14.72-9.22Zm-15.95,31.53v-18.34l14.88,9.69c.33.22.71.32,1.09.32s.76-.11,1.09-.32l14.88-9.69v18.34H8.06Z" />
      </svg>
    </SvgIcon>
  )
})

NoMessageIcon.displayName = 'NoMessageIcon'
