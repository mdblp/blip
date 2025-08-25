/*
 * Copyright (c) 2025, Diabeloop
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

import { PumpManufacturer, ReservoirChange } from 'medical-domain'
import i18next from 'i18next'
import { ReservoirChangeType } from '../../models/enums/reservoir-change-type.enum'
import danaPumpIcon from 'dana-pump.svg'
import insightPumpIcon from 'insight-pump.svg'
import kaleidoPumpIcon from 'kaleido-pump.svg'
import medisafePumpIcon from 'medisafe-pump.svg'

const t = i18next.t.bind(i18next)

export const getChangeTypeByManufacturer = (manufacturer: PumpManufacturer): ReservoirChangeType => {
  const manufacturerUpperCase = manufacturer.toUpperCase()
  switch (manufacturerUpperCase) {
    case PumpManufacturer.Sooil:
      return ReservoirChangeType.Reservoir
    case PumpManufacturer.Vicentra:
    case PumpManufacturer.Roche:
    case PumpManufacturer.Terumo:
    case PumpManufacturer.Default:
    default:
      return ReservoirChangeType.Cartridge
  }
}

export const getReservoirChangeTitle = (reservoirChange: ReservoirChange): string => {
  const manufacturer = reservoirChange.pump?.manufacturer || PumpManufacturer.Default
  const changeType = getChangeTypeByManufacturer(manufacturer)
 return (changeType === ReservoirChangeType.Reservoir)
    ? t('Reservoir change')
    : t('Cartridge change')
}

export const getReservoirChangeIcon = (pumpManufacturer: PumpManufacturer) => {
  const manufacturerUpperCase = pumpManufacturer.toUpperCase()
  switch (manufacturerUpperCase) {
    case PumpManufacturer.Sooil:
      return danaPumpIcon
    case PumpManufacturer.Roche:
      return insightPumpIcon
    case PumpManufacturer.Terumo:
      return medisafePumpIcon
    case PumpManufacturer.Vicentra:
    default:
      return kaleidoPumpIcon
  }
}
