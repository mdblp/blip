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
import { getIfuDocumentName, IfuPrefix, IfuUnitPart } from '../../../../lib/medical-files/medical-files.utils'

const buildPumpSettings = (
  deviceName: DeviceSystem,
  swVersion: string,
  pumpManufacturer: PumpManufacturer,
  cgmName: string
): PumpSettings => ({
  payload: {
    device: { name: deviceName, swVersion } as PumpSettings['payload']['device'],
    pump: { manufacturer: pumpManufacturer } as PumpSettings['payload']['pump'],
    cgm: { name: cgmName } as PumpSettings['payload']['cgm'],
  }
} as PumpSettings)

const dblg1Kal = (swVersion = '1.18.0') => buildPumpSettings(DeviceSystem.Dblg1, swVersion, PumpManufacturer.Vicentra, CGMName.G6)
const dblg1Dana = (swVersion = '1.18.0') => buildPumpSettings(DeviceSystem.Dblg1, swVersion, PumpManufacturer.Sooil, CGMName.G6)
const dblg2KalG6 = () => buildPumpSettings(DeviceSystem.Dblg2, '2.0.0', PumpManufacturer.Vicentra, CGMName.G6)
const dblg2KalG7 = () => buildPumpSettings(DeviceSystem.Dblg2, '2.0.0', PumpManufacturer.Vicentra, CGMName.G7)
const dblg2DanaG7 = () => buildPumpSettings(DeviceSystem.Dblg2, '2.0.0', PumpManufacturer.Sooil, CGMName.G7)
const dblg2DanaG6 = () => buildPumpSettings(DeviceSystem.Dblg2, '2.0.0', PumpManufacturer.Sooil, CGMName.G6)

describe('getIfuDocumentName', () => {
  describe('DBLG1 KAL', () => {
    it.each([
      ['en', Unit.MmolPerLiter, `${IfuPrefix.Dblg1Kal}-${IfuUnitPart.Mmoll}-en`],
      ['en', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg1Kal}-${IfuUnitPart.Mgdl}-en`],
      ['de', Unit.MmolPerLiter, `${IfuPrefix.Dblg1Kal}-${IfuUnitPart.Mmoll}-de`],
      ['de', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg1Kal}-${IfuUnitPart.Mgdl}-de`],
      ['nl', Unit.MmolPerLiter, `${IfuPrefix.Dblg1Kal}-${IfuUnitPart.Mmoll}-nl`],
      ['fr', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg1Kal}-${IfuUnitPart.Mgdl}-fr`],
    ])('lang=%s unit=%s → %s', (lang, unit, expected) => {
      expect(getIfuDocumentName(dblg1Kal(), unit, lang)).toBe(expected)
    })

    it.each([
      ['nl', Unit.MilligramPerDeciliter],
      ['fr', Unit.MmolPerLiter],
      ['es', Unit.MmolPerLiter],
      ['es', Unit.MilligramPerDeciliter],
    ])('returns null for lang=%s unit=%s', (lang, unit) => {
      expect(getIfuDocumentName(dblg1Kal(), unit, lang)).toBeNull()
    })

    it('returns null when swVersion does not start with 1.18', () => {
      expect(getIfuDocumentName(dblg1Kal('1.17.0'), Unit.MilligramPerDeciliter, 'en')).toBeNull()
    })
  })

  describe('DBLG1 DANA', () => {
    it.each([
      ['en', Unit.MmolPerLiter, `${IfuPrefix.Dblg1Dana}-${IfuUnitPart.Mmoll}-en`],
      ['en', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg1Dana}-${IfuUnitPart.Mgdl}-en`],
      ['de', Unit.MmolPerLiter, `${IfuPrefix.Dblg1Dana}-${IfuUnitPart.Mmoll}-de`],
      ['de', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg1Dana}-${IfuUnitPart.Mgdl}-de`],
      ['fr', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg1Dana}-${IfuUnitPart.Mgdl}-fr`],
    ])('lang=%s unit=%s → %s', (lang, unit, expected) => {
      expect(getIfuDocumentName(dblg1Dana(), unit, lang)).toBe(expected)
    })

    it.each([
      ['nl', Unit.MmolPerLiter],
      ['nl', Unit.MilligramPerDeciliter],
      ['fr', Unit.MmolPerLiter],
      ['es', Unit.MilligramPerDeciliter],
    ])('returns null for lang=%s unit=%s', (lang, unit) => {
      expect(getIfuDocumentName(dblg1Dana(), unit, lang)).toBeNull()
    })

    it('returns null when swVersion does not start with 1.18', () => {
      expect(getIfuDocumentName(dblg1Dana('1.17.0'), Unit.MilligramPerDeciliter, 'en')).toBeNull()
    })
  })

  describe('DBLG2 KAL G6', () => {
    it.each([
      ['en', Unit.MmolPerLiter, `${IfuPrefix.Dblg2KalG6}-${IfuUnitPart.Mmoll}-en`],
      ['en', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg2KalG6}-${IfuUnitPart.Mgdl}-en`],
      ['de', Unit.MmolPerLiter, `${IfuPrefix.Dblg2KalG6}-${IfuUnitPart.Mmoll}-de`],
      ['de', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg2KalG6}-${IfuUnitPart.Mgdl}-de`],
      ['nl', Unit.MmolPerLiter, `${IfuPrefix.Dblg2KalG6}-${IfuUnitPart.Mmoll}-nl`],
    ])('lang=%s unit=%s → %s', (lang, unit, expected) => {
      expect(getIfuDocumentName(dblg2KalG6(), unit, lang)).toBe(expected)
    })

    it.each([
      ['nl', Unit.MilligramPerDeciliter],
      ['fr', Unit.MmolPerLiter],
      ['fr', Unit.MilligramPerDeciliter],
      ['es', Unit.MmolPerLiter],
    ])('returns null for lang=%s unit=%s', (lang, unit) => {
      expect(getIfuDocumentName(dblg2KalG6(), unit, lang)).toBeNull()
    })
  })

  describe('DBLG2 KAL G7', () => {
    it.each([
      ['en', Unit.MmolPerLiter, `${IfuPrefix.Dblg2KalG7}-${IfuUnitPart.Mmoll}-en`],
      ['en', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg2KalG7}-${IfuUnitPart.Mgdl}-en`],
      ['de', Unit.MmolPerLiter, `${IfuPrefix.Dblg2KalG7}-${IfuUnitPart.Mmoll}-de`],
      ['de', Unit.MilligramPerDeciliter, `${IfuPrefix.Dblg2KalG7}-${IfuUnitPart.Mgdl}-de`],
      ['nl', Unit.MmolPerLiter, `${IfuPrefix.Dblg2KalG7}-${IfuUnitPart.Mmoll}-nl`],
    ])('lang=%s unit=%s → %s', (lang, unit, expected) => {
      expect(getIfuDocumentName(dblg2KalG7(), unit, lang)).toBe(expected)
    })

    it.each([
      ['nl', Unit.MilligramPerDeciliter],
      ['fr', Unit.MmolPerLiter],
      ['fr', Unit.MilligramPerDeciliter],
      ['es', Unit.MmolPerLiter],
    ])('returns null for lang=%s unit=%s', (lang, unit) => {
      expect(getIfuDocumentName(dblg2KalG7(), unit, lang)).toBeNull()
    })
  })

  describe('DBLG2 DANA G7', () => {
    it('returns document name for en mgdl', () => {
      expect(getIfuDocumentName(dblg2DanaG7(), Unit.MilligramPerDeciliter, 'en')).toBe(`${IfuPrefix.Dblg2DanaG7}-${IfuUnitPart.Mgdl}-en`)
    })

    it.each([
      ['en', Unit.MmolPerLiter],
      ['de', Unit.MmolPerLiter],
      ['de', Unit.MilligramPerDeciliter],
      ['fr', Unit.MilligramPerDeciliter],
      ['nl', Unit.MmolPerLiter],
    ])('returns null for lang=%s unit=%s', (lang, unit) => {
      expect(getIfuDocumentName(dblg2DanaG7(), unit, lang)).toBeNull()
    })
  })

  describe('unsupported combinations', () => {
    it('returns null for DBLG2 DANA G6', () => {
      expect(getIfuDocumentName(dblg2DanaG6(), Unit.MilligramPerDeciliter, 'en')).toBeNull()
    })

    it('returns null for unknown device system', () => {
      const settings = buildPumpSettings('UNKNOWN' as DeviceSystem, '1.0.0', PumpManufacturer.Vicentra, CGMName.G6)
      expect(getIfuDocumentName(settings, Unit.MilligramPerDeciliter, 'en')).toBeNull()
    })
  })
})
