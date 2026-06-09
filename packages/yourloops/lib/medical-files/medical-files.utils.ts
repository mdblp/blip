/*
 * Copyright (c) 2022-2026, Diabeloop
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

import { CGMName, DeviceSystem, PumpManufacturer, PumpSettings, Unit } from 'medical-domain'

export enum IfuUnitPart {
  Mmoll = 'mmoll',
  Mgdl = 'mgdl'
}

export enum IfuPrefix {
  Dblg1Kal = 'DBLG1Z-RA-IFU-001',
  Dblg1Dana = 'DBLG1E-RA-IFU-001',
  Dblg2KalG6 = 'DBLG2-RA-IFU-001',
  Dblg2KalG7 = 'DBLG2-RA-IFU-002',
  Dblg2DanaG7 = 'DBLG2-RA-IFU-003'
}

interface IfuConfig {
  prefix: IfuPrefix
  langs: Partial<Record<string, IfuUnitPart[]>>
}

const IFU_CONFIGS = {
  dblg1Kal: {
    prefix: IfuPrefix.Dblg1Kal,
    langs: { en: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], de: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], nl: [IfuUnitPart.Mmoll], fr: [IfuUnitPart.Mgdl] }
  },
  dblg1Dana: {
    prefix: IfuPrefix.Dblg1Dana,
    langs: { en: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], de: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], fr: [IfuUnitPart.Mgdl] }
  },
  dblg2KalG6: {
    prefix: IfuPrefix.Dblg2KalG6,
    langs: { en: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], de: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], nl: [IfuUnitPart.Mmoll] }
  },
  dblg2KalG7: {
    prefix: IfuPrefix.Dblg2KalG7,
    langs: { en: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], de: [IfuUnitPart.Mmoll, IfuUnitPart.Mgdl], nl: [IfuUnitPart.Mmoll] }
  },
  dblg2DanaG7: {
    prefix: IfuPrefix.Dblg2DanaG7,
    langs: { en: [IfuUnitPart.Mgdl] }
  }
} satisfies Record<string, IfuConfig>

const resolveIfuConfig = (pumpSettings: PumpSettings): IfuConfig | null => {
  const { device, pump, cgm } = pumpSettings.payload
  const isDana = pump.manufacturer === PumpManufacturer.Sooil

  if (device.name === DeviceSystem.Dblg1 && device.swVersion.startsWith('1.18')) {
    return isDana ? IFU_CONFIGS.dblg1Dana : IFU_CONFIGS.dblg1Kal
  }
  if (device.name === DeviceSystem.Dblg2) {
    if (isDana) {
      return cgm.name === CGMName.G7 ? IFU_CONFIGS.dblg2DanaG7 : null
    }
    return cgm.name === CGMName.G7 ? IFU_CONFIGS.dblg2KalG7 : IFU_CONFIGS.dblg2KalG6
  }
  return null
}

export const getIfuDocumentName = (pumpSettings: PumpSettings, bgUnit: string, lang: string): string | null => {
  const config = resolveIfuConfig(pumpSettings)
  if (!config) return null

  const unitPart = bgUnit === Unit.MmolPerLiter ? IfuUnitPart.Mmoll : IfuUnitPart.Mgdl
  const allowedUnits = config.langs[lang]
  if (!allowedUnits?.includes(unitPart)) return null

  return `${config.prefix}-${unitPart}-${lang}`
}
