/*
 * Copyright (c) 2022, Diabeloop
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

import { getBgClass } from './blood-glucose.util'
import { BgBounds, ClassificationType } from '../../models/blood-glucose.model'

const bgBounds = {
  veryHighThreshold: 300,
  targetUpperBound: 180,
  targetLowerBound: 70,
  veryLowThreshold: 55
}

describe('BloodGlucoseUtil', () => {
  describe('getBgClasses', () => {
    it('should throw an error if no `bgBounds` with numerical lower & upper bounds provided', () => {
      const functionWithNull = () => { getBgClass(null as unknown as BgBounds, 100) }
      expect(functionWithNull).toThrow(
        'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
      )
      const functionWithUndefined = () => { getBgClass(undefined as unknown as BgBounds, 100) }
      expect(functionWithUndefined).toThrow(
        'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
      )
      const functionWithEmptyObject = () => { getBgClass({} as BgBounds, 100) }
      expect(functionWithEmptyObject).toThrow(
        'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
      )
      const functionWithInvalidBgBounds = () => { getBgClass({ foo: 'bar' } as unknown as BgBounds, 100) }
      expect(functionWithInvalidBgBounds).toThrow(
        'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
      )
      const functionWithInvalidTargetUpperBound = () => {
        getBgClass({ targetLowerBound: 80, targetUpperBound: 'one eighty' } as unknown as BgBounds, 100)
      }
      expect(functionWithInvalidTargetUpperBound).toThrow(
        'You must provide a `bgBounds` object with a `targetLowerBound` and a `targetUpperBound`!'
      )
    })

    it('should throw an error if no `bgValue` or non-numerical `bgValue`', () => {
      const functionWithNoBgValue = () => { getBgClass(bgBounds) }
      expect(functionWithNoBgValue).toThrow(
        'You must provide a positive, numerical blood glucose value to categorize!'
      )
      const functionWithNullBgValue = () => { getBgClass(bgBounds, null as unknown as number) }
      expect(functionWithNullBgValue).toThrow(
        'You must provide a positive, numerical blood glucose value to categorize!'
      )
      const functionWithUndefinedBgValue = () => { getBgClass(bgBounds, undefined as unknown as number) }
      expect(functionWithUndefinedBgValue).toThrow(
        'You must provide a positive, numerical blood glucose value to categorize!'
      )
      const functionWithEmptyObjectBgValue = () => { getBgClass(bgBounds, {} as number) }
      expect(functionWithEmptyObjectBgValue).toThrow(
        'You must provide a positive, numerical blood glucose value to categorize!'
      )
      const functionWithNegativeBgValue = () => { getBgClass(bgBounds, -100) }
      expect(functionWithNegativeBgValue).toThrow(
        'You must provide a positive, numerical blood glucose value to categorize!'
      )
      const functionWithDecimalBgValue = () => { getBgClass(bgBounds, 4.4) }
      expect(functionWithDecimalBgValue).not.toThrow()
      const functionWithIntegerBgValue = () => { getBgClass(bgBounds, 100) }
      expect(functionWithIntegerBgValue).not.toThrow()
    })

    describe('three-way classification (low, target, high)', () => {
      it('should return `low` for a value < the `targetLowerBound`', () => {
        expect(getBgClass(bgBounds, 69)).toEqual('low')
      })

      it('should return `target` for a value equal to the `targetLowerBound`', () => {
        expect(getBgClass(bgBounds, 70)).toEqual('target')
      })

      it('should return `target` for a value > `targetLowerBound` and < `targetUpperBound`', () => {
        expect(getBgClass(bgBounds, 100)).toEqual('target')
      })

      it('should return `target` for a value equal to the `targetUpperBound`', () => {
        expect(getBgClass(bgBounds, 180)).toEqual('target')
      })

      it('should return `high` for a value > the `targetUpperBound`', () => {
        expect(getBgClass(bgBounds, 181)).toEqual('high')
      })
    })

    describe('five-way classification (veryLow, low, target, high, veryHigh)', () => {
      it('should return `veryLow` for a value < the `veryLowThreshold`', () => {
        expect(getBgClass(bgBounds, 54, ClassificationType.FiveWay)).toEqual('veryLow')
      })

      it('should return `low` for a value equal to the `veryLowThreshold`', () => {
        expect(getBgClass(bgBounds, 55, ClassificationType.FiveWay)).toEqual('low')
      })

      it('should return `low` for a value < the `targetLowerBound`', () => {
        expect(getBgClass(bgBounds, 69, ClassificationType.FiveWay)).toEqual('low')
      })

      it('should return `target` for a value equal to the `targetLowerBound`', () => {
        expect(getBgClass(bgBounds, 70, ClassificationType.FiveWay)).toEqual('target')
      })

      it('should return `target` for a value > `targetLowerBound` and < `targetUpperBound`', () => {
        expect(getBgClass(bgBounds, 100, ClassificationType.FiveWay)).toEqual('target')
      })

      it('should return `target` for a value equal to the `targetUpperBound`', () => {
        expect(getBgClass(bgBounds, 180, ClassificationType.FiveWay)).toEqual('target')
      })

      it('should return `high` for a value > the `targetUpperBound`', () => {
        expect(getBgClass(bgBounds, 181, ClassificationType.FiveWay)).toEqual('high')
      })

      it('should return `high` for a value equal to the `veryHighThreshold`', () => {
        expect(getBgClass(bgBounds, 300, ClassificationType.FiveWay)).toEqual('high')
      })

      it('should return `veryHigh` for a value > the `veryHighThreshold`', () => {
        expect(getBgClass(bgBounds, 301, ClassificationType.FiveWay)).toEqual('veryHigh')
      })
    })
  })
})
