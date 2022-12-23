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

import { UnitsType } from '../../../../lib/units/models/enums/units-type.enum'
import { buildBgValues, buildThresholds } from '../../../../components/alarm/alarm-content-configuration.utils'

describe('Thresholds', () => {
  const getDefaultMonitoring = () => ({
    enabled: true,
    parameters: {
      bgUnit: UnitsType.MGDL,
      lowBg: 50,
      highBg: 140,
      outOfRangeThreshold: 10,
      veryLowBg: 40,
      hypoThreshold: 45,
      nonDataTxThreshold: 50,
      reportingPeriod: 7
    }
  })
  const monitoring = getDefaultMonitoring()
  it('should return default thresholds value in mmol/L if the parameters are in mmol/L', () => {
    monitoring.parameters.bgUnit = UnitsType.MMOLL
    const thresholdsInMmol = buildThresholds(monitoring.parameters.bgUnit)

    expect(thresholdsInMmol.minLowBg).toBe(2.8)
    expect(thresholdsInMmol.maxHighBg).toBe(13.9)
    expect(thresholdsInMmol.minLowBg).toBe(2.8)
    expect(thresholdsInMmol.maxLowBg).toBe(5.6)
    expect(thresholdsInMmol.minVeryLowBg).toBe(2.2)
    expect(thresholdsInMmol.maxVeryLowBg).toBe(5)
  })

  it('should return default thresholds value in mg/dL if the parameters are in mg/dL', () => {
    const monitoring = getDefaultMonitoring()
    monitoring.parameters.bgUnit = UnitsType.MGDL
    const thresholdsInMgdl = buildThresholds(monitoring.parameters.bgUnit)
    expect(thresholdsInMgdl.minHighBg).toBe(140)
    expect(thresholdsInMgdl.maxHighBg).toBe(250)
    expect(thresholdsInMgdl.minLowBg).toBe(50)
    expect(thresholdsInMgdl.maxLowBg).toBe(100)
    expect(thresholdsInMgdl.minVeryLowBg).toBe(40)
    expect(thresholdsInMgdl.maxVeryLowBg).toBe(90)
  })
})
describe('Bg values', function () {
  const defaultMonitoringBgValue = () => ({
    enabled: true,
    parameters: {
      bgUnitDefault: UnitsType.MGDL,
      outOfRangeThresholdDefault: 50,
      nonDataTxThresholdDefault: 50,
      hypoThresholdDefault: 5,
      veryLowBgDefault: 54,
      lowBgDefault: 70,
      highBgDefault: 180,
      reportingPeriodDefault: 7 * 24
    }
  })
  it('should return default bg values in mmol/L if the parameters are in mmol/L', function () {
    const monitoring = defaultMonitoringBgValue()
    monitoring.parameters.bgUnitDefault = UnitsType.MGDL
    const bgValuesInMmol = buildBgValues(monitoring.parameters.bgUnitDefault)
    expect(bgValuesInMmol.highBgDefault).toBe(180)
    expect(bgValuesInMmol.lowBgDefault).toBe(70)
    expect(bgValuesInMmol.veryLowBgDefault).toBe(54)
  })
  it('should return default bg values in mg/dL if the parameters are in mg/dL ', function () {
    const monitoring = defaultMonitoringBgValue()
    monitoring.parameters.bgUnitDefault = UnitsType.MMOLL
    const bgValuesInMmol = buildBgValues(monitoring.parameters.bgUnitDefault)
    expect(bgValuesInMmol.highBgDefault).toBe(10)
    expect(bgValuesInMmol.lowBgDefault).toBe(2.8)
    expect(bgValuesInMmol.veryLowBgDefault).toBe(2.2)
  })
})
