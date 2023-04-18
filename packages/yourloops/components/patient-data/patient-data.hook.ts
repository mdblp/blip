/*
 * Copyright (c) 2023, Diabeloop
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

import { ChartTypes } from '../../enum/chart-type.enum'
import { useAuth } from '../../lib/auth'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { type Patient } from '../../lib/patient/models/patient.model'
import { usePatientContext } from '../../lib/patient/patient.provider'

interface UsePatientDataReturn {
  currentChart: ChartTypes
  selectedPatient: Patient
  changeChart: (chart: ChartTypes) => void
  changePatient: (patient: Patient) => void
}

export const usePatientData = (): UsePatientDataReturn => {
  const navigate = useNavigate()
  const paramHook = useParams()
  const { patientId } = paramHook
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { getPatientById } = usePatientContext()

  const urlPrefix = user.isUserPatient() ? '' : `/patient/${patientId}`
  const selectedPatient = getPatientById(patientId)

  const getCurrentChart = (): ChartTypes => {
    switch (pathname) {
      case `${urlPrefix}/daily`:
        return ChartTypes.Daily
      case `${urlPrefix}/trends`:
        return ChartTypes.Trends
      case `${urlPrefix}/dashboard`:
        return ChartTypes.Dashboard
    }
  }

  const changePatient = (patient: Patient): void => {
    navigate(`/patient/${patient.userid}/${getCurrentChart()}`)
  }

  const changeChart = (chart: ChartTypes): void => {
    navigate(`${urlPrefix}/${chart}`)
  }

  return {
    currentChart: getCurrentChart(),
    selectedPatient,
    changeChart,
    changePatient
  }
}
