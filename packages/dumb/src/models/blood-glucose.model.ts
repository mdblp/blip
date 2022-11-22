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

import { Unit } from './unit.model'
import { Source } from './settings.model'
import { Annotation } from './annotation.model'

export interface BloodGlucoseData {
  value: number
  annotations?: Annotation[]
  source: Source
  normalTime: string
  timezone: string
}

export type BgUnits = Unit.MilligramPerDeciliter | Unit.MmolPerLiter

export interface BgBounds {
  veryHighThreshold: number
  targetUpperBound: number
  targetLowerBound: number
  veryLowThreshold: number
}

export interface BgClasses {
  'very-low': { boundary: number }
  low: { boundary: number }
  target: { boundary: number }
  high: { boundary: number }
  'very-high': { boundary: number }
}

export interface BgPrefs {
  bgUnits: BgUnits
  bgBounds: BgBounds
  bgClasses: BgClasses
}

export enum ClassificationType {
  FiveWay = 'fiveWay',
  ThreeWay = 'threeWay'
}

export enum BgClass {
  High = 'high',
  Low = 'low',
  Target = 'target',
  VeryHigh = 'veryHigh',
  VeryLow = 'veryLow',
}
