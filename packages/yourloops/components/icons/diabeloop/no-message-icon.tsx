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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path d="m42,43.97H6.06c-1.1,0-2-.9-2-2v-24.66c0-1.1.9-2,2-2s2,.9,2,2v22.66h31.94v-22.66c0-1.1.9-2,2-2s2,.9,2,2v24.66c0,1.1-.9,2-2,2Z" />
        <path d="m24.03,31.64c-.38,0-.76-.11-1.09-.32L4.96,19.61c-.93-.6-1.19-1.84-.58-2.77.6-.92,1.84-1.19,2.77-.58l16.88,10.99,16.88-10.99c.93-.6,2.17-.34,2.77.58.6.93.34,2.16-.58,2.77l-17.97,11.7c-.33.22-.71.32-1.09.32Z" />
        <path d="m41.97,19.33c-.36,0-.73-.1-1.06-.31l-16.91-10.59L7.09,19.02c-.94.59-2.17.3-2.76-.63-.59-.94-.3-2.17.63-2.76L22.94,4.38c.65-.41,1.47-.41,2.12,0l17.97,11.26c.94.59,1.22,1.82.63,2.76-.38.61-1.03.94-1.7.94Z" />
      </svg>
    </SvgIcon>
  )
})

NoMessageIcon.displayName = 'NoMessageIcon'
