/*
 * Copyright (c) 2023-2026, Diabeloop
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

export const HyperglycemiaIcon = React.forwardRef((props: SvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
  return (
    <SvgIcon {...props} ref={ref}>
      <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_10575_21292)">
          <path
            d="M23.3954 3.98273C26.8854 3.98273 28.5854 7.36273 30.2254 10.6227C32.0954 14.3527 33.5154 16.8027 35.9854 16.8027C37.0854 16.8027 37.9854 17.7027 37.9854 18.8027C37.9854 19.9027 37.0854 20.8027 35.9854 20.8027C30.8554 20.8027 28.5254 16.1527 26.6454 12.4227C25.6554 10.4427 24.4154 7.98273 23.3954 7.98273C22.2954 7.98273 21.3954 7.08273 21.3954 5.98273C21.3954 4.88273 22.2954 3.98273 23.3954 3.98273Z"
            fill="currentColor"/>
          <path
            d="M23.3953 3.98273C24.4953 3.98273 25.3953 4.88273 25.3953 5.98273C25.3953 7.08273 24.4953 7.98273 23.3953 7.98273C22.3753 7.98273 21.1353 10.4427 20.1453 12.4227C18.2653 16.1627 15.9353 20.8027 10.8053 20.8027C9.70527 20.8027 8.80527 19.9027 8.80527 18.8027C8.80527 17.7027 9.70527 16.8027 10.8053 16.8027C13.2853 16.8027 14.6953 14.3527 16.5653 10.6227C18.2053 7.35273 19.9053 3.98273 23.3953 3.98273Z"
            fill="currentColor"/>
          <path
            d="M25.1162 16.8116V41.4316C25.1162 42.5316 24.2162 43.4316 23.1162 43.4316C22.0162 43.4316 21.1162 42.5316 21.1162 41.4316V16.8116C21.1162 15.7116 22.0162 14.8116 23.1162 14.8116C24.2162 14.8116 25.1162 15.7116 25.1162 16.8116Z"
            fill="currentColor"/>
        </g>
        <defs>
          <clipPath id="clip0_10575_21292">
            <rect width="48" height="48" fill="currentColor"/>
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  )

})

HyperglycemiaIcon.displayName = 'HyperglycemiaIcon'
