/*
 * Copyright (c) 2022-2023, Diabeloop
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

declare module '*.css'
declare module '*.svg'
declare module '@serprex/react-motion'

declare module 'tidepool-viz' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  import { type CbgDateTrace } from './models/cbg-date-trace.model'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  import { type CbgPositionData } from './models/cbg-position-data.model'
  export const delayShowCbgTracesOnFocus: (userId: string, sliceData: { id: string }, slicePosition: CbgPositionData, focusedKeys: string[]) => void
  export const focusTrendsCbgDateTrace: (userId: string, data: CbgDateTrace, cbgPosition: CbgPositionData) => void
  export const unfocusTrendsCbgDateTrace: (userId: string) => void
  export const unfocusTrendsCbgSlice: (userId: string) => void
}
