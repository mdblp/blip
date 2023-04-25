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

import { type BgPrefs } from 'dumb'
import { ChartTypes } from '../../enum/chart-type.enum'
import { type Patient } from '../../lib/patient/models/patient.model'
import { type ChartPrefs } from '../dashboard-widgets/models/chart-prefs.model'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { usePatientContext } from '../../lib/patient/patient.provider'
import type MedicalDataService from 'medical-domain'
import { defaultBgClasses, type TimePrefs, TimeService, Unit } from 'medical-domain'
import { useRef, useState } from 'react'
import { PatientDataUtils } from './patient-data.utils'
import metrics from '../../lib/metrics'
import DataUtil from 'tidepool-viz/src/utils/data'
import moment from 'moment-timezone'

export interface PatientDataContextResult {
  bgPrefs: BgPrefs
  changeChart: (chart: ChartTypes) => void
  changePatient: (patient: Patient) => void
  chartPrefs: ChartPrefs
  currentChart: ChartTypes
  dataUtil: DataUtil
  epochLocation: number
  fetchPatientData: () => Promise<void>
  handleDatetimeLocationChange: (epochLocation: number, msRange: number) => Promise<boolean>
  loadingData: boolean
  medicalData: MedicalDataService | null
  msRange: number
  updateChartPrefs: (chartPrefs: ChartPrefs) => void
  patient: Patient
  refreshData: () => Promise<void>
  refreshingData: boolean
  timePrefs: TimePrefs
}

export const usePatientDataProviderHook = (): PatientDataContextResult => {
  const navigate = useNavigate()
  const paramHook = useParams()
  const { patientId } = paramHook
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { getPatientById } = usePatientContext()

  const urlPrefix = user.isUserPatient() ? '' : `/patient/${patientId}`
  const patient = getPatientById(patientId ?? user.id)
  const bgUnits = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter
  const bgClasses = defaultBgClasses[bgUnits]
  const bgPrefs: BgPrefs = {
    bgUnits,
    bgClasses,
    bgBounds: {
      veryHighThreshold: bgClasses.high,
      targetUpperBound: bgClasses.target,
      targetLowerBound: bgClasses.low,
      veryLowThreshold: bgClasses.veryLow
    }
  }
  const timePrefs: TimePrefs = {
    timezoneAware: true,
    timezoneName: new Intl.DateTimeFormat().resolvedOptions().timeZone // the browser timezone
  }
  const defaultChartPrefs = {
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

  const [loadingData, setLoadingData] = useState<boolean>(true)
  const [refreshingData, setRefreshingData] = useState<boolean>(false)
  const [medicalData, setMedicalData] = useState<MedicalDataService | null>(null)
  const [dataUtil, setDataUtil] = useState<DataUtil | null>(null)
  const [epochLocation, setEpochLocation] = useState<number | null>(null)
  const [msRange, setMsRange] = useState<number | null>(null)
  const [chartPrefs, setChartPrefs] = useState<ChartPrefs>(defaultChartPrefs)

  const patientDataUtils = useRef(new PatientDataUtils({
    patient,
    timePrefs,
    bgUnits
  }))

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
    patientDataUtils.current.changePatient(patient)
    navigate(`/patient/${patient.userid}/${getCurrentChart()}`)
  }

  const changeChart = (chart: ChartTypes): void => {
    navigate(`${urlPrefix}/${chart}`)
    switch (chart) {
      case ChartTypes.Dashboard:
        setEpochLocation(new Date().valueOf())
        setMsRange(TimeService.MS_IN_DAY * 7)
        break
      case ChartTypes.Daily:
        setMsRange(TimeService.MS_IN_DAY)
    }
  }

  const updateChartPrefs = (chartPrefs: ChartPrefs): void => {
    dataUtil.chartPrefs = chartPrefs // TODO could be removed, chartPrefs is unused in dataUtils
    setChartPrefs(chartPrefs)
  }

  const handleDatetimeLocationChange = async (epochLocation: number, msRange: number): Promise<boolean> => {
    try {
      setRefreshingData(true)
      const currentChart = getCurrentChart()
      const dateRange = patientDataUtils.current.getDateRange({ currentChart, epochLocation, msRange })
      const patientData = await patientDataUtils.current.loadDataRange(dateRange)
      if (patientData && patientData.length > 0) {
        medicalData.add(patientData)
        setMedicalData(medicalData)
        return true
      }
      return false
    } catch (err) {
      console.log(err)
    } finally {
      setEpochLocation(epochLocation)
      setMsRange(msRange)
      setRefreshingData(false)
    }
  }

  const refreshData = async (): Promise<void> => {
    setRefreshingData(true)
    const patientData = await patientDataUtils.current.retrievePatientData()
    const medicalData = patientDataUtils.current.buildMedicalData(patientData)
    const dataUtil = new DataUtil(medicalData.data, {
      bgPrefs,
      timePrefs,
      endpoints: medicalData.endpoints
    })
    setMedicalData(medicalData)
    setDataUtil(dataUtil)
    setRefreshingData(false)
  }

  const fetchPatientData = async (): Promise<void> => {
    try {
      setLoadingData(true)
      setChartPrefs(defaultChartPrefs)
      const patientData = await patientDataUtils.current.retrievePatientData()
      if (!patientData) {
        return
      }
      // metrics.startTimer('process_data')
      const medicalData = patientDataUtils.current.buildMedicalData(patientData)
      const dataUtil = new DataUtil(medicalData.data, {
        bgPrefs,
        timePrefs,
        endpoints: medicalData.endpoints
      })
      // metrics.endTimer('process_data')
      setDataUtil(dataUtil)
      setMedicalData(medicalData)
      setEpochLocation(moment.utc(medicalData.endpoints[1]).valueOf() - TimeService.MS_IN_DAY / 2)
      setMsRange(TimeService.MS_IN_DAY)
    } finally {
      setLoadingData(false)
    }
  }

  return {
    bgPrefs,
    changeChart,
    changePatient,
    currentChart: getCurrentChart(),
    chartPrefs,
    dataUtil,
    epochLocation,
    fetchPatientData,
    handleDatetimeLocationChange,
    loadingData,
    medicalData,
    msRange,
    patient,
    refreshData,
    refreshingData,
    timePrefs,
    updateChartPrefs
  }
}
