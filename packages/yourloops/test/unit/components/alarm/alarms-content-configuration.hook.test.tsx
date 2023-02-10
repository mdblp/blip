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

import { act, renderHook } from '@testing-library/react-hooks'
import useAlarmsContentConfiguration from '../../../../components/alarm/alarms-content-configuration.hook'
import { UnitsType } from '../../../../lib/units/models/enums/units-type.enum'
import { buildTeam, createPatient } from '../../common/utils'
import * as teamHookMock from '../../../../lib/team'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'
import PatientUtils from '../../../../lib/patient/patient.util'

jest.mock('../../../../lib/team')

describe('AlarmsContentConfiguration hook', () => {
  const teamId = 'teamId'
  const team = buildTeam(teamId)
  const patient = createPatient('patientId', [{ status: UserInvitationStatus.accepted, teamId }])
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
  const getTeamMock = jest.fn()
  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        getTeam: getTeamMock
      }
    })
  })

  describe('getErrorMessage', () => {
    it('should return no error messages when monitoring values are correct', () => {
      const monitoring = getDefaultMonitoring()
      const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, patient }))
      expect(result.current.lowBg.errorMessage).toBeNull()
      expect(result.current.highBg.errorMessage).toBeNull()
      expect(result.current.veryLowBg.errorMessage).toBeNull()
    })

    it('should return an error message if values are not integer or float (depending on bg unit)', () => {
      const monitoringOne = getDefaultMonitoring()
      monitoringOne.parameters.lowBg = 66.6
      monitoringOne.parameters.highBg = 140.5
      monitoringOne.parameters.veryLowBg = 64.1
      const { result: firstHook } = renderHook(() => useAlarmsContentConfiguration({
        monitoring: monitoringOne,
        patient
      }))
      expect(firstHook.current.veryLowBg.errorMessage).toBe('mandatory-integer')
      expect(firstHook.current.lowBg.errorMessage).toBe('mandatory-integer')
      expect(firstHook.current.highBg.errorMessage).toBe('mandatory-integer')

      const monitoringTwo = getDefaultMonitoring()
      monitoringTwo.parameters.bgUnit = UnitsType.MMOLL
      monitoringTwo.parameters.lowBg = 3.55
      monitoringTwo.parameters.highBg = 8.55
      monitoringTwo.parameters.veryLowBg = 3.55
      const { result: secondHook } = renderHook(() => useAlarmsContentConfiguration({
        monitoring: monitoringTwo,
        patient
      }))
      expect(secondHook.current.veryLowBg.errorMessage).toBe('mandatory-float-number')
      expect(secondHook.current.lowBg.errorMessage).toBe('mandatory-float-number')
      expect(secondHook.current.highBg.errorMessage).toBe('mandatory-float-number')
    })

    it('should return an error if values are out of range', () => {
      const monitoring = getDefaultMonitoring()
      monitoring.parameters.lowBg = 25000
      monitoring.parameters.highBg = 14230
      monitoring.parameters.veryLowBg = 123456789
      const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, patient }))
      expect(result.current.veryLowBg.errorMessage).toBe('mandatory-range')
      expect(result.current.lowBg.errorMessage).toBe('mandatory-range')
      expect(result.current.highBg.errorMessage).toBe('mandatory-range')
    })
  })

  describe('saveButtonDisabled', () => {
    it('should be enabled if monitoring is correct', () => {
      const { result } = renderHook(() => useAlarmsContentConfiguration({
        monitoring: getDefaultMonitoring(),
        patient
      }))
      expect(result.current.saveButtonDisabled).toBeFalsy()
    })

    it('should be disabled if monitoring is incorrect', () => {
      const monitoring = getDefaultMonitoring()
      monitoring.parameters.highBg = 260
      const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, patient }))
      expect(result.current.saveButtonDisabled).toBeTruthy()
    })
  })

  describe('resetToTeamDefaultValues', () => {
    const patient = createPatient('patientId', [{ status: UserInvitationStatus.accepted, teamId }])
    it('should return an error message if patient is not created', () => {
      const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring: getDefaultMonitoring() }))
      expect(() => { result.current.resetToTeamDefaultValues() }).toThrowError('This action cannot be done if the patient is undefined')
    })

    it('should return a error message if patient team is not found', () => {
      jest.spyOn(PatientUtils, 'getRemoteMonitoringTeam').mockReturnValue({
        status: UserInvitationStatus.accepted,
        teamId
      })
      const { result } = renderHook(() => useAlarmsContentConfiguration({
        monitoring: getDefaultMonitoring(),
        patient
      }))
      expect(() => { result.current.resetToTeamDefaultValues() }).toThrowError(`Cannot find team with id ${teamId}`)
    })

    it('should return an error message if the team has no monitoring parameters', () => {
      delete team.monitoring.parameters;
      (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
        return {
          getTeam: () => team
        }
      })
      jest.spyOn(PatientUtils, 'getRemoteMonitoringTeam').mockReturnValue({
        status: UserInvitationStatus.accepted,
        teamId
      })
      const { result } = renderHook(() => useAlarmsContentConfiguration({
        patient,
        monitoring: getDefaultMonitoring()
      }))
      expect(() => { result.current.resetToTeamDefaultValues() }).toThrowError('The given team has no monitoring values')
    })

    it('should set default values if there is no error', () => {
      jest.spyOn(PatientUtils, 'getRemoteMonitoringTeam').mockReturnValue({
        status: UserInvitationStatus.accepted,
        teamId
      })
      const defaultMonitoring = getDefaultMonitoring()
      team.monitoring = getDefaultMonitoring();
      (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
        return {
          getTeam: () => team
        }
      })
      const updatedMonitoring = {
        enabled: true,
        parameters: {
          bgUnit: UnitsType.MGDL,
          lowBg: 55,
          highBg: 120,
          outOfRangeThreshold: 15,
          veryLowBg: 45,
          hypoThreshold: 50,
          nonDataTxThreshold: 60,
          reportingPeriod: 14
        }
      }
      const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring: updatedMonitoring, patient }))
      act(() => {
        result.current.resetToTeamDefaultValues()
      })
      expect(result.current.highBg.value).toEqual(defaultMonitoring.parameters.highBg)
      expect(result.current.lowBg.value).toEqual(defaultMonitoring.parameters.lowBg)
      expect(result.current.veryLowBg.value).toEqual(defaultMonitoring.parameters.veryLowBg)
      expect(result.current.nonDataTxThreshold.value).toEqual(defaultMonitoring.parameters.nonDataTxThreshold)
      expect(result.current.outOfRangeThreshold.value).toEqual(defaultMonitoring.parameters.outOfRangeThreshold)
      expect(result.current.hypoThreshold.value).toEqual(defaultMonitoring.parameters.hypoThreshold)
    })
  })

  it('should call the onSave prop method when calling save', () => {
    const monitoring = getDefaultMonitoring()
    const expectedResult = {
      ...monitoring,
      status: undefined,
      monitoringEnd: undefined
    }
    const onSaveMock = jest.fn()
    const { result } = renderHook(() => useAlarmsContentConfiguration({ monitoring, onSave: onSaveMock }))
    act(() => {
      result.current.save()
    })
    expect(onSaveMock).toHaveBeenCalledWith(expectedResult)
  })
})
