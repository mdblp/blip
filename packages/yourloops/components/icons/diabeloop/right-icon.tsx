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

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import React, { ForwardedRef } from 'react'
import { makeStyles } from 'tss-react/mui'

const styles = makeStyles()(() => ({
  checkmark: {
    strokeWidth: 6,
    strokeLinecap: 'round'
  }
}))

export const RightIcon = React.forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
  const { classes } = styles()
  return (
    <SvgIcon {...props} ref={ref}>
      <svg viewBox="0 0 180 180" fill="none">
        <rect width="180" height="180" rx="90" fill="currentColor"/>
        <rect x="15.5" y="15.5" width="149" height="149" rx="74.5" fill="currentColor"/>
        <rect x="15.5" y="15.5" width="149" height="149" rx="74.5" stroke="white"/>
        <path d="M53.9465 98.6502L83.567 126.643L130.969 62.0462" stroke="white" className={classes.checkmark}/>
      </svg>
    </SvgIcon>
  )
})

RightIcon.displayName = 'RightIcon'
