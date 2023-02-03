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

import { useState } from 'react'
import { type TrendsDisplayFlags } from '../models/trends-display-flags.model'
import { DisplayFlag } from '../models/enums/display-flag.enum'

export interface TrendsContextResult {
  displayFlags: TrendsDisplayFlags
  toggleCbgSegments: (displayFlag: DisplayFlag) => void
}

export const useTrendsProviderHook = (): TrendsContextResult => {
  const [displayFlags, setDisplayFlags] = useState<TrendsDisplayFlags>({
    cbg50Enabled: true,
    cbg80Enabled: true,
    cbg100Enabled: true,
    cbgMedianEnabled: true
  })

  const toggleCbgSegments = (displayFlag: DisplayFlag): void => {
    switch (displayFlag) {
      case DisplayFlag.Cbg50Enabled:
        setDisplayFlags({ ...displayFlags, cbg50Enabled: !displayFlags.cbg50Enabled })
        return
      case DisplayFlag.Cbg80Enabled:
        setDisplayFlags({ ...displayFlags, cbg80Enabled: !displayFlags.cbg80Enabled })
        return
      case DisplayFlag.Cbg100Enabled:
        setDisplayFlags({ ...displayFlags, cbg100Enabled: !displayFlags.cbg100Enabled })
        return
      case DisplayFlag.CbgMedianEnabled:
        setDisplayFlags({ ...displayFlags, cbgMedianEnabled: !displayFlags.cbgMedianEnabled })
        return
      default:
        throw Error(`Display flag field ${displayFlag as string} is unknown`)
    }
  }

  return { displayFlags, toggleCbgSegments }
}
