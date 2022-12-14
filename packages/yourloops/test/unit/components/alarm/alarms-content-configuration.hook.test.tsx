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

import { renderHook } from '@testing-library/react-hooks'
import useAlarmsContentConfiguration from '../../../../components/alarm/alarms-content-configuration.hook'
import { UnitsType } from '../../../../lib/units/models/enums/units-type.enum'
import { buildTeam, createPatient } from '../../common/utils'

const patient = createPatient()
const teamId = 'teamId'
const team = buildTeam(teamId)
const monitoring = team.monitoring = {
  enabled: true,
  parameters: {
    bgUnit: UnitsType.MGDL,
    lowBg: 1,
    highBg: 2,
    outOfRangeThreshold: 10,
    veryLowBg: 40,
    hypoThreshold: 45,
    nonDataTxThreshold: 50,
    reportingPeriod: 7
  }
}
describe('AlarmsContentConfiguration hook', () => {
  it('should not return message error if the value is within the low target and is in mg/dL', () => {
    monitoring.parameters.bgUnit = UnitsType.MGDL
    monitoring.parameters.lowBg = 50
    monitoring.parameters.highBg = 140.5
    team.monitoring.parameters.veryLowBg = 30
    const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, patient }))
    expect(result.current.lowBg.errorMessage).toBeNull()
    expect(result.current.highBg.errorMessage).toBe('mandatory-integer')
    expect(result.current.veryLowBg.errorMessage).toBe('mandatory-range')
  })
  it('should return message error if the value is within the very low target and not is in mmol/L', () => {
    team.monitoring.parameters.bgUnit = UnitsType.MMOLL
    team.monitoring.parameters.veryLowBg = 3
    const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, patient }))
    expect(result.current.veryLowBg.errorMessage).toBe('mandatory-float')
  })
  it('should return default thresholds value in mmol/L if the parameters are in mmol/L', () => {
    team.monitoring.parameters.bgUnit = UnitsType.MMOLL
    const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, patient }))
    expect(result.current.thresholds.minHighBg).toBe(7.8)
    expect(result.current.thresholds.maxHighBg).toBe(13.9)
    expect(result.current.thresholds.minLowBg).toBe(2.8)
    expect(result.current.thresholds.maxLowBg).toBe(5.6)
    expect(result.current.thresholds.minVeryLowBg).toBe(2.2)
    expect(result.current.thresholds.maxVeryLowBg).toBe(5)
  })
  it('should return default thresholds value in mg/dL if the parameters are in mg/dL', () => {
    team.monitoring.parameters.bgUnit = UnitsType.MGDL
    const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, patient }))
    expect(result.current.thresholds.minHighBg).toBe(140)
    expect(result.current.thresholds.maxHighBg).toBe(250)
    expect(result.current.thresholds.minLowBg).toBe(50)
    expect(result.current.thresholds.maxLowBg).toBe(100)
    expect(result.current.thresholds.minVeryLowBg).toBe(40)
    expect(result.current.thresholds.maxVeryLowBg).toBe(90)
  })
})
