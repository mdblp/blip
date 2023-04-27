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
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { usePatientContext } from '../../lib/patient/patient.provider'
import type MedicalDataService from 'medical-domain'
import { defaultBgClasses, type TimePrefs, TimeService, Unit } from 'medical-domain'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PatientDataUtils } from './patient-data.utils'
import DataUtil from 'tidepool-viz/src/utils/data'

export interface PatientDataContextResult {
  bgPrefs: BgPrefs
  changeChart: (chart: ChartTypes) => void
  changePatient: (patient: Patient) => void
  chartPrefs: ChartPrefs
  currentChart: ChartTypes
  dataUtil: DataUtil
  dailyDate: number
  dashboardDate: number
  fetchPatientData: () => Promise<void>
  goToDailySpecificDate: (date: number | Date) => void
  handleDatetimeLocationChange: (epochLocation: number, msRange: number) => Promise<boolean>
  loadingData: boolean
  medicalData: MedicalDataService | null
  msRange: number
  updateChartPrefs: (chartPrefs: ChartPrefs) => void
  patient: Patient
  refreshData: () => Promise<void>
  refreshingData: boolean
  timePrefs: TimePrefs
  trendsDate: number
}

const DATE_QUERY_PARAM_KEY = 'date'

export const usePatientDataProviderHook = (): PatientDataContextResult => {
  const navigate = useNavigate()
  const paramHook = useParams()
  const { patientId } = paramHook
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { getPatientById } = usePatientContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const dateQueryParam = searchParams.get(DATE_QUERY_PARAM_KEY)
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
  const [msRange, setMsRange] = useState<number>(TimeService.MS_IN_DAY)
  const [chartPrefs, setChartPrefs] = useState<ChartPrefs>(defaultChartPrefs)
  const [dashboardDate, setDashboardDate] = useState<number>(new Date().valueOf())
  const [dailyDate, setDailyDate] = useState<number>(0)
  const [trendsDate, setTrendsDate] = useState<number>(0)

  const patientDataUtils = useRef(new PatientDataUtils({
    patient,
    timePrefs,
    bgUnits
  }))

  const currentChart = useMemo<ChartTypes>(() => {
    switch (pathname) {
      case `${urlPrefix}/daily`:
        return ChartTypes.Daily
      case `${urlPrefix}/trends`:
        return ChartTypes.Trends
      case `${urlPrefix}/dashboard`:
        return ChartTypes.Dashboard
    }
  }, [pathname, urlPrefix])

  const changePatient = (patient: Patient): void => {
    patientDataUtils.current.changePatient(patient)
    navigate(`/patient/${patient.userid}/${currentChart}`)
  }

  const changeChart = (chart: ChartTypes): void => {
    navigate(`${urlPrefix}/${chart}`)
  }

  const updateChartPrefs = (chartPrefs: ChartPrefs): void => {
    dataUtil.chartPrefs = chartPrefs // TODO could be removed, chartPrefs is unused in dataUtils
    setChartPrefs(chartPrefs)
  }

  const goToDailySpecificDate = (date: number | Date): void => {
    navigate(`${urlPrefix}/${ChartTypes.Daily}?date=${date instanceof Date ? date.valueOf() : date}`)
  }

  const handleDatetimeLocationChange = async (epochLocation: number, msRange: number): Promise<boolean> => {
    try {
      setRefreshingData(true)
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
      currentChart === ChartTypes.Daily
        ? setSearchParams({ [DATE_QUERY_PARAM_KEY]: epochLocation.toString() })
        : setTrendsDate(epochLocation)
      setMsRange(msRange)
      setRefreshingData(false)
    }
  }

  const refreshData = async (): Promise<void> => {
    setLoadingData(true)
    const patientData = await patientDataUtils.current.retrievePatientData()
    const medicalData = patientDataUtils.current.buildMedicalData(patientData)
    const dataUtil = new DataUtil(medicalData.data, {
      bgPrefs,
      timePrefs,
      endpoints: medicalData.endpoints
    })
    setMedicalData(medicalData)
    setDataUtil(dataUtil)
    setLoadingData(false)
  }

  const fetchPatientData = async (): Promise<void> => {
    try {
      setLoadingData(true)
      setChartPrefs(defaultChartPrefs)
      const patientData = await patientDataUtils.current.retrievePatientData()
      if (!patientData) {
        return
      }
      const medicalData = patientDataUtils.current.buildMedicalData(patientData)
      const dataUtil = new DataUtil(medicalData.data, {
        bgPrefs,
        timePrefs,
        endpoints: medicalData.endpoints
      })
      setDataUtil(dataUtil)
      setMedicalData(medicalData)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (medicalData) {
      switch (currentChart) {
        case ChartTypes.Dashboard:
          setDashboardDate(new Date().valueOf())
          setMsRange(TimeService.MS_IN_DAY * 7)
          break
        case ChartTypes.Daily:
          if (dateQueryParam) {
            setDailyDate(parseInt(dateQueryParam))
          } else {
            setDailyDate(dailyDate !== 0 ? dailyDate : patientDataUtils.current.getInitialDate(medicalData))
          }
          setMsRange(TimeService.MS_IN_DAY)
          break
        case ChartTypes.Trends:
          setTrendsDate(trendsDate !== 0 ? trendsDate : patientDataUtils.current.getInitialDate(medicalData))
          setMsRange(TimeService.MS_IN_DAY)
      }
    }
  }, [currentChart, medicalData, dailyDate, trendsDate, dateQueryParam])

  return {
    bgPrefs,
    changeChart,
    changePatient,
    currentChart,
    chartPrefs,
    dataUtil,
    dailyDate,
    dashboardDate,
    fetchPatientData,
    goToDailySpecificDate,
    handleDatetimeLocationChange,
    loadingData,
    medicalData,
    msRange,
    patient,
    refreshData,
    refreshingData,
    timePrefs,
    trendsDate,
    updateChartPrefs
  }
}
