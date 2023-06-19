/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { act, renderHook } from '@testing-library/react'
import {
  useMonitoringAlertsContentConfiguration
} from '../../../../components/monitoring-alert/monitoring-alerts-content-configuration.hook'
import { buildTeam, createPatient } from '../../common/utils'
import * as teamHookMock from '../../../../lib/team'
import * as authHookMock from '../../../../lib/auth'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { Unit } from 'medical-domain'
import * as selectedTeamHookMock from '../../../../lib/selected-team/selected-team.provider'
import { type MonitoringAlertsParameters } from '../../../../lib/team/models/monitoring-alerts-parameters.model'

jest.mock('../../../../lib/team')
jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/selected-team/selected-team.provider')
describe('MonitoringAlertsContentConfiguration hook', () => {
  const teamId = 'teamId'
  const team = buildTeam(teamId)
  const patient = createPatient('patientId', UserInviteStatus.Accepted)
  const user = { id: 'id', settings: { units: { bg: Unit.MilligramPerDeciliter } } }

  const getDefaultMonitoringAlertsParameters = (): MonitoringAlertsParameters => ({
    bgUnit: Unit.MilligramPerDeciliter,
    lowBg: 50,
    highBg: 140,
    outOfRangeThreshold: 10,
    veryLowBg: 40,
    hypoThreshold: 45,
    nonDataTxThreshold: 50,
    reportingPeriod: 7
  })

  const getTeamMock = jest.fn()
  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        getTeam: getTeamMock
      }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user
      }
    });
    (selectedTeamHookMock.useSelectedTeamContext as jest.Mock).mockImplementation(() => {
      return { selectedTeam: { id: teamId, monitoringAlertsParameters: getDefaultMonitoringAlertsParameters() } }
    })
  })

  describe('getErrorMessage', () => {
    afterAll(() => {
      user.settings.units.bg = Unit.MilligramPerDeciliter
    })

    it('should return no error messages when monitoring values are correct', () => {
      const monitoringAlertsParameters = getDefaultMonitoringAlertsParameters()

      const { result } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters,
        patient,
        userBgUnit: Unit.MilligramPerDeciliter
      }))

      expect(result.current.lowBg.errorMessage).toBeNull()
      expect(result.current.highBg.errorMessage).toBeNull()
      expect(result.current.veryLowBg.errorMessage).toBeNull()
    })

    it('should return an error message expecting integer values if BG unit is mg/dL', () => {
      const monitoringAlertsParameters = getDefaultMonitoringAlertsParameters()

      monitoringAlertsParameters.lowBg = 66.6
      monitoringAlertsParameters.highBg = 140.5
      monitoringAlertsParameters.veryLowBg = 64.1

      const { result: firstHook } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters,
        patient,
        userBgUnit: Unit.MilligramPerDeciliter
      }))

      expect(firstHook.current.veryLowBg.errorMessage).toBe('mandatory-integer')
      expect(firstHook.current.lowBg.errorMessage).toBe('mandatory-integer')
      expect(firstHook.current.highBg.errorMessage).toBe('mandatory-integer')
    })

    it('should return an error message expecting float values if BG unit is mmol/L', () => {
      const monitoringAlertsParameters = getDefaultMonitoringAlertsParameters()

      user.settings.units.bg = Unit.MmolPerLiter

      monitoringAlertsParameters.lowBg = 3.55
      monitoringAlertsParameters.highBg = 8.55
      monitoringAlertsParameters.veryLowBg = 3.55
      monitoringAlertsParameters.bgUnit = Unit.MmolPerLiter

      const { result: secondHook } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters,
        patient,
        userBgUnit: Unit.MmolPerLiter
      }))

      expect(secondHook.current.veryLowBg.errorMessage).toBe('mandatory-float-number')
      expect(secondHook.current.lowBg.errorMessage).toBe('mandatory-float-number')
      expect(secondHook.current.highBg.errorMessage).toBe('mandatory-float-number')
    })

    it('should return an error if values are out of range', () => {
      const monitoringAlertsParameters = getDefaultMonitoringAlertsParameters()
      monitoringAlertsParameters.lowBg = 25000
      monitoringAlertsParameters.highBg = 14230
      monitoringAlertsParameters.veryLowBg = 123456789

      const { result } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters,
        patient,
        userBgUnit: Unit.MmolPerLiter
      }))

      expect(result.current.veryLowBg.errorMessage).toBe('mandatory-range')
      expect(result.current.lowBg.errorMessage).toBe('mandatory-range')
      expect(result.current.highBg.errorMessage).toBe('mandatory-range')
    })
  })

  describe('saveButtonDisabled', () => {
    it('should be enabled if monitoring is correct', () => {
      const { result } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters: getDefaultMonitoringAlertsParameters(),
        patient,
        userBgUnit: Unit.MilligramPerDeciliter
      }))

      expect(result.current.saveButtonDisabled).toBeFalsy()
    })

    it('should be disabled if monitoring is incorrect', () => {
      const monitoringAlertsParameters = getDefaultMonitoringAlertsParameters()
      monitoringAlertsParameters.highBg = 260

      const { result } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters,
        patient,
        userBgUnit: Unit.MilligramPerDeciliter
      }))

      expect(result.current.saveButtonDisabled).toBeTruthy()
    })
  })

  describe('resetToTeamDefaultValues', () => {
    const patient = createPatient('patientId', UserInviteStatus.Accepted)

    it('should return an error message if patient is not created', () => {
      const { result } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters: getDefaultMonitoringAlertsParameters(),
        userBgUnit: Unit.MilligramPerDeciliter
      }))

      expect(() => {
        result.current.resetToTeamDefaultValues()
      }).toThrowError('This action cannot be done if the patient is undefined')
    })

    it('should set default values if there is no error', () => {
      const defaultMonitoringAlertsParameters = getDefaultMonitoringAlertsParameters()

      team.monitoringAlertsParameters = getDefaultMonitoringAlertsParameters();

      (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
        return {
          getTeam: () => team
        }
      })

      const updatedMonitoringAlertsParameters: MonitoringAlertsParameters = {
        bgUnit: Unit.MilligramPerDeciliter,
        lowBg: 55,
        highBg: 120,
        outOfRangeThreshold: 15,
        veryLowBg: 45,
        hypoThreshold: 50,
        nonDataTxThreshold: 60,
        reportingPeriod: 14
      }

      const { result } = renderHook(() => useMonitoringAlertsContentConfiguration({
        monitoringAlertsParameters: updatedMonitoringAlertsParameters,
        patient,
        userBgUnit: Unit.MilligramPerDeciliter
      }))
      act(() => {
        result.current.resetToTeamDefaultValues()
      })

      expect(result.current.highBg.value).toEqual(defaultMonitoringAlertsParameters.highBg)
      expect(result.current.lowBg.value).toEqual(defaultMonitoringAlertsParameters.lowBg)
      expect(result.current.veryLowBg.value).toEqual(defaultMonitoringAlertsParameters.veryLowBg)
      expect(result.current.nonDataTxThreshold.value).toEqual(defaultMonitoringAlertsParameters.nonDataTxThreshold)
      expect(result.current.outOfRangeThreshold.value).toEqual(defaultMonitoringAlertsParameters.outOfRangeThreshold)
      expect(result.current.hypoThreshold.value).toEqual(defaultMonitoringAlertsParameters.hypoThreshold)
    })
  })

  it('should call the onSave prop method when calling save', () => {
    const monitoringAlertsParameters = getDefaultMonitoringAlertsParameters()
    const expectedResult = {
      ...monitoringAlertsParameters,
      status: undefined,
      monitoringEnd: undefined
    }
    const onSaveMock = jest.fn()

    const { result } = renderHook(() => useMonitoringAlertsContentConfiguration({
      monitoringAlertsParameters,
      onSave: onSaveMock,
      userBgUnit: Unit.MilligramPerDeciliter
    }))
    act(() => {
      result.current.save()
    })

    expect(onSaveMock).toHaveBeenCalledWith(expectedResult)
  })
})
