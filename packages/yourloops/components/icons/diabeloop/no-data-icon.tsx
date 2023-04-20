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

export const NoDataIcon = React.forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
  return (
    <SvgIcon {...props} ref={ref}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path d="m39.49,11.37l2.64-2.64c.78-.78.78-2.05,0-2.83-.78-.78-2.05-.78-2.83,0l-2.64,2.64c-3.45-2.83-7.86-4.54-12.66-4.54C12.97,4,4,12.97,4,24c0,4.8,1.7,9.21,4.54,12.66l-2.63,2.63c-.78.78-.78,2.05,0,2.83.39.39.9.59,1.41.59s1.02-.2,1.41-.59l2.64-2.64c3.45,2.82,7.84,4.51,12.63,4.51,11.03,0,20-8.97,20-20,0-4.79-1.69-9.19-4.51-12.63Zm-31.49,12.63c0-8.82,7.18-16,16-16,3.7,0,7.1,1.27,9.81,3.39l-22.42,22.42c-2.12-2.71-3.39-6.11-3.39-9.81Zm16,16c-3.68,0-7.07-1.26-9.78-3.36l22.41-22.41c2.1,2.71,3.36,6.09,3.36,9.78,0,8.82-7.18,16-16,16Z" />
      </svg>
    </SvgIcon>
  )
})

NoDataIcon.displayName = 'NoDataIcon'
