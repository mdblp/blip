/*
 * Copyright (c) 2023-2026, Diabeloop
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

import * as authHookMock from '../../../../lib/auth'
import * as patientsHookMock from '../../../../lib/patient/patients.provider'
import * as router from 'react-router'
import type User from '../../../../lib/auth/models/user.model'
import { act, renderHook } from '@testing-library/react'
import { usePatientData } from '../../../../components/patient-data/patient-data.hook'
import { PatientView } from '../../../../enum/patient-view.enum'
import { TimeService } from 'medical-domain'
import { type ChartPrefs } from '../../../../components/dashboard-cards/models/chart-prefs.model'
import { createPatient } from '../../common/utils'
import { AppUserRoute } from '../../../../models/enums/routes.enum'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/patient/patients.provider')
describe('usePatientData hook', () => {
  const patientId = 'fakeId'
  const DEFAULT_MS_RANGE = TimeService.MS_IN_DAY
  const getUrlPrefixForHcp = (id = patientId) => `/patient/${id}`
  const useNavigateMock = jest.fn()
  const useParamHookMock = jest.fn().mockReturnValue({ patientId })
  const useLocationMock = jest.fn().mockReturnValue({ pathname: `${getUrlPrefixForHcp()}${AppUserRoute.Dashboard}` })
  const patient = createPatient()

  beforeAll(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => useNavigateMock)
    jest.spyOn(router, 'useLocation').mockImplementation(useLocationMock)
    jest.spyOn(router, 'useParams').mockImplementation(useParamHookMock);

    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          isUserHcp: () => true,
          isUserPatient: () => false
        } as User
      }
    });
    (patientsHookMock.usePatientsContext as jest.Mock).mockImplementation(() => ({
      getPatientById: () => createPatient()
    }))
  })

  describe('changePatientView', () => {
    it('should change currentPatientView to Daily', async () => {
      const { result } = renderHook(() => usePatientData({ patient }))
      expect(result.current.currentPatientView).toEqual(PatientView.Dashboard)
      expect(result.current.msRange).toEqual(DEFAULT_MS_RANGE)

      act(() => {
        result.current.changePatientView(PatientView.Daily)
      })

      expect(result.current.msRange).toEqual(TimeService.MS_IN_DAY)
      expect(useNavigateMock).toHaveBeenCalledWith(expect.stringContaining(AppUserRoute.Daily))
    })

    it('should change currentPatientView to Trends', async () => {
      const { result } = renderHook(() => usePatientData({ patient }))
      expect(result.current.currentPatientView).toEqual(PatientView.Dashboard)
      expect(result.current.msRange).toEqual(DEFAULT_MS_RANGE)

      act(() => {
        result.current.changePatientView(PatientView.Trends)
      })

      expect(result.current.msRange).toEqual(DEFAULT_MS_RANGE)
      expect(useNavigateMock).toHaveBeenCalledWith(expect.stringContaining(AppUserRoute.Trends))
    })
  })

  describe('updateChartPrefs', () => {
    it('should update chart prefs', () => {
      const defaultChartPrefs: ChartPrefs = {
        trends: {
          activeDays: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true
          },
          extentSize: 14
        }
      }
      const updatedChartPrefs: ChartPrefs = {
        ...defaultChartPrefs,
        trends: {
          ...defaultChartPrefs.trends,
          activeDays: {
            ...defaultChartPrefs.trends.activeDays,
            saturday: false,
            sunday: false
          },
          extentSize: 28
        }
      }

      const { result } = renderHook(() => usePatientData({ patient }))
      expect(result.current.chartPrefs).toEqual(defaultChartPrefs)

      act(() => {
        result.current.updateChartPrefs(updatedChartPrefs)
      })
      expect(result.current.chartPrefs).toEqual(updatedChartPrefs)
    })
  })

  describe('goToDailySpecificDate', () => {
    it('should go to a specific date in daily chart', () => {
      const currentDate = new Date().getTime()
      const { result } = renderHook(() => usePatientData({ patient }))
      expect(result.current.dailyDate).toBeNull()

      act(() => {
        result.current.goToDailySpecificDate(currentDate)
      })
      expect(result.current.dailyDate).toEqual(currentDate)
      expect(useNavigateMock).toHaveBeenCalledWith(expect.stringContaining(`${AppUserRoute.Daily}?date=${new Date(currentDate).toISOString()}`))
    })
  })
})
