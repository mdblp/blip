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
import { BG_CLAMP_THRESHOLD, BgClasses } from '../../../models/medical/medical-data-options.model'
import type { MonitoringAlertsParameters } from '../../../models/monitoring-alerts/monitoring-alerts-parameters.model'

const DEFAULT_REPORTING_PERIOD = 55

// Returns the default BG range for a given diabetic profile type and BG unit
// If no profile is found, returns the common one (DT1/DT2)
export function getDefaultRangeByDiabeticType(type: string, unit: BgUnit): BgClasses {
  switch (type) {
    case DiabeticType.DT1Pregnancy:
      return getDT1PregnancyRangeByUnit(unit)
    case DiabeticType.DT1DT2:
    default:
      // if no profile is found, return the by default the common one (DT1/DT2)
      return getDT1DT2RangeByUnit(unit)
  }
}

function getDT1PregnancyRangeByUnit(unit: BgUnit): BgClasses {
  switch (unit) {
    case MGDL_UNITS: {
      return {
        veryHigh:BG_CLAMP_THRESHOLD[MGDL_UNITS],
        high: 250,
        target: 140,
        low: 63,
        veryLow: 54,
      }
    }
    case MMOLL_UNITS: {
      return {
        veryHigh:BG_CLAMP_THRESHOLD[MGDL_UNITS],
        high: 13.9,
        target: 7.8,
        low: 3.5,
        veryLow: 3
      }
    }
  }
}

function getDT1DT2RangeByUnit(unit: BgUnit): BgClasses {
  switch (unit) {
    case MGDL_UNITS: {
      return {
        veryHigh:BG_CLAMP_THRESHOLD[MGDL_UNITS],
        high: 250,
        target: 180,
        low: 70,
        veryLow: 54
      }
    }
    case MMOLL_UNITS: {
      return {
        veryHigh: BG_CLAMP_THRESHOLD[MMOLL_UNITS],
        high: 13.9,
        target: 10,
        low: 3.9,
        veryLow: 3
      }
    }
  }
}

// Returns the default Alerts for a given diabetic profile type and BG unit
// If no profile is found, returns the common one (DT1/DT2)
export function getDefaultAlertsByDiabeticType(type: string, unit: BgUnit): MonitoringAlertsParameters {
  switch (type) {
    case DiabeticType.DT1Pregnancy:
      return getDT1PregnancyAlertsByUnit(unit)
    case DiabeticType.DT1DT2:
    default:
      // if no profile is found, return the by default the common one (DT1/DT2)
      return getDT1DT2AlertsByUnit(unit)
  }
}

function getDT1PregnancyAlertsByUnit(unit: BgUnit): MonitoringAlertsParameters {
  switch (unit) {
    case MGDL_UNITS: {
      return {
        bgUnit: unit,
        lowBg: 63,
        highBg: 140,
        outOfRangeThreshold : 50,
        veryLowBg: 54,
        hypoThreshold: 5,
        nonDataTxThreshold : 50,
        reportingPeriod : DEFAULT_REPORTING_PERIOD,
      }
    }
    case MMOLL_UNITS: {
      return {
        bgUnit: unit,
        lowBg: 3.5,
        highBg: 7.8,
        outOfRangeThreshold :50,
        veryLowBg: 3,
        hypoThreshold: 5,
        nonDataTxThreshold : 50,
        reportingPeriod : DEFAULT_REPORTING_PERIOD,
      }
    }
  }
}

function getDT1DT2AlertsByUnit(unit: BgUnit): MonitoringAlertsParameters {
  switch (unit) {
    case MGDL_UNITS: {
      return {
        bgUnit: unit,
        lowBg: 70,
        highBg: 180,
        outOfRangeThreshold : 50,
        veryLowBg: 54,
        hypoThreshold: 5,
        nonDataTxThreshold : 50,
        reportingPeriod : DEFAULT_REPORTING_PERIOD,
      }
    }
    case MMOLL_UNITS: {
      return {
        bgUnit: unit,
        lowBg: 3.9,
        highBg: 10,
        outOfRangeThreshold :50,
        veryLowBg: 3,
        hypoThreshold: 5,
        nonDataTxThreshold : 50,
        reportingPeriod : DEFAULT_REPORTING_PERIOD,
      }
    }
  }
}
