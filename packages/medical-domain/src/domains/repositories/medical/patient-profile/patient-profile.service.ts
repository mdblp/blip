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


import { DiabeticType } from '../../../models/medical/patient-profile/diabetic-type.enum'
import { BgUnit, MGDL_UNITS, MMOLL_UNITS } from '../../../models/medical/datum/bg.model'
import { BgBounds } from '../../../models/statistics/glycemia-statistics.model'

function getDT1DT2RangeByUnit(unit: BgUnit): BgBounds {
  switch (unit) {
    case MGDL_UNITS: {
      return {
        veryHighThreshold: 250,
        targetUpperBound: 180,
        targetLowerBound: 70,
        veryLowThreshold: 54
      }
    }
    case MMOLL_UNITS: {
      return {
        veryHighThreshold: 13.9,
        targetUpperBound: 10,
        targetLowerBound: 3.9,
        veryLowThreshold: 3
      }
    }
  }
}

function getDT1PregnancyRangeByUnit(unit: BgUnit): BgBounds {
  switch (unit) {
    case MGDL_UNITS: {
      return {
        veryHighThreshold: 250,
        targetUpperBound: 140,
        targetLowerBound: 63,
        veryLowThreshold: 54
      }
    }
    case MMOLL_UNITS: {
      return {
        veryHighThreshold: 13.9,
        targetUpperBound: 7.8,
        targetLowerBound: 3.5,
        veryLowThreshold: 3
      }
    }
  }
}

// Returns the default BG range for a given diabetic profile type and BG unit
// If no profile is found, returns the common one (DT1/DT2)
export function getDefaultRangeByDiabeticType(type: string, unit: BgUnit): BgBounds {
  switch (type) {
    case DiabeticType.DT1DT2:
      return getDT1DT2RangeByUnit(unit)
    case DiabeticType.DT1Pregnancy:
      return getDT1PregnancyRangeByUnit(unit)
    default:
      // if no profile is found, return the by default the common one (DT1/DT2)
      return getDT1DT2RangeByUnit(unit)
  }
}
