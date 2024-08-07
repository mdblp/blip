/*
 * Copyright (c) 2023-2024, Diabeloop
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

import { type Bolus, BolusSubtype, DatumType, Prescriptor, type Wizard } from 'medical-domain'
import { getBolusType, getDelivered, getProgrammed, getRecommended, isInterruptedBolus } from './bolus.util'
import { BolusType } from '../../models/enums/bolus-type.enum'

const normalBolus = { normal: 5 } as Bolus

const cancelledBolus = { normal: 2, expectedNormal: 5 } as Bolus

const immediatelyCancelledBolus = { normal: 0, expectedNormal: 5 } as Bolus

const invalidBolus = { normal: NaN } as Bolus

describe('BolusUtil', function () {
  describe('getBolusType', () => {
    it('should return the appropriate type', () => {
      const wizard = { type: DatumType.Wizard } as Wizard
      const bolusPen = { type: DatumType.Bolus, subType: BolusSubtype.Pen } as Bolus
      const bolusManualPrescriptor = { type: DatumType.Bolus, prescriptor: Prescriptor.Manual } as Bolus
      const bolusBiphasic = { type: DatumType.Bolus, subType: BolusSubtype.Biphasic } as Bolus
      const defaultBolus = {
        type: DatumType.Bolus,
        subType: BolusSubtype.Normal,
        prescriptor: Prescriptor.Auto
      } as Bolus

      expect(getBolusType(wizard)).toEqual(BolusType.Meal)
      expect(getBolusType(bolusPen)).toEqual(BolusType.Pen)
      expect(getBolusType(bolusManualPrescriptor)).toEqual(BolusType.Manual)
      expect(getBolusType(bolusBiphasic)).toEqual(BolusType.Meal)
      expect(getBolusType(defaultBolus)).toEqual(BolusType.Correction)
    })
  })

  describe('getDelivered', () => {
    it('should return normal if the value is defined', () => {
      expect(getDelivered(normalBolus)).toEqual(normalBolus.normal)
    })

    it('should return NaN if the value is not defined', () => {
      expect(getDelivered({} as Bolus)).toEqual(NaN)
      expect(getDelivered(invalidBolus)).toEqual(NaN)
    })
  })

  describe('isInterruptedBolus', () => {
    it('should return `false` on a no-frills `normal` bolus', () => {
      expect(isInterruptedBolus(normalBolus)).toEqual(false)
    })

    it('should return `true` on a cancelled `normal` bolus', () => {
      expect(isInterruptedBolus(cancelledBolus)).toEqual(true)
      expect(isInterruptedBolus(immediatelyCancelledBolus)).toEqual(true)
    })

    it('should return `false` on an invalid `normal` bolus', () => {
      expect(isInterruptedBolus(invalidBolus)).toEqual(false)
    })
  })

  describe('getProgrammed', () => {
    it('should return the value of a no-frills `normal` bolus', () => {
      expect(getProgrammed(normalBolus)).toEqual(normalBolus.normal)
    })

    it('should return the `expectedNormal` of a cancelled `normal` bolus', () => {
      expect(getProgrammed(cancelledBolus)).toEqual(cancelledBolus.expectedNormal)
    })
  })

  describe('getRecommended', () => {
    it('should return NaN when no recommended exists (i.e., `quick` or `manual` bolus)', () => {
      expect(getRecommended({} as Wizard)).toEqual(NaN)
    })

    it('should return total when both `carb` and `correction` recommendations exist', () => {
      const carbValue = 2
      const correctionValue = 0.5

      expect(getRecommended({
        type: DatumType.Wizard,
        bolus: normalBolus,
        recommended: { carb: carbValue, correction: correctionValue }
      } as Wizard)).toEqual(carbValue + correctionValue)
    })

    it('should return `carb` rec when only `carb` recommendation exists', () => {
      const carbValue = 2

      expect(getRecommended({
        type: DatumType.Wizard,
        bolus: normalBolus,
        recommended: { carb: carbValue }
      } as Wizard)).toEqual(carbValue)
    })

    it('should return `correction` rec when only `correction` recommendation exists', () => {
      const correctionValue = 0.5

      expect(getRecommended({
        type: DatumType.Wizard,
        bolus: normalBolus,
        recommended: { correction: correctionValue }
      } as Wizard)).toEqual(correctionValue)
    })

    it('should return `net` rec when `net` recommendation exists', () => {
      const netValue = 3
      const carbValue = 2
      const correctionValue = 0.5

      expect(getRecommended({
        type: DatumType.Wizard,
        bolus: normalBolus,
        recommended: { net: netValue, carb: carbValue, correction: correctionValue }
      } as Wizard)).toEqual(netValue)
    })

    it('should return 0 when no bolus recommended, even if overridden', () => {
      expect(getRecommended({ recommended: {} } as Wizard)).toEqual(0)
    })
  })
})
