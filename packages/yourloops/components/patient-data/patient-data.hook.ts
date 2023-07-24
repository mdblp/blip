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
import { usePatientsContext } from '../../lib/patient/patients.provider'
import type MedicalDataService from 'medical-domain'
import { defaultBgClasses, type TimePrefs, TimeService, Unit } from 'medical-domain'
import { type MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { type DateRange, isValidDateQueryParam, PatientDataUtils } from './patient-data.utils'
import DataUtil from 'tidepool-viz/src/utils/data'
import { type DailyChartRef } from './models/daily-chart-ref.model'
import { usePatientContext } from '../../lib/patient/patient.provider'

export interface usePatientDataResult {
  bgPrefs: BgPrefs
  changeChart: (chart: ChartTypes) => void
  changePatient: (patient: Patient) => void
  chartPrefs: ChartPrefs
  currentChart: ChartTypes
  dataUtil: DataUtil
  dailyChartRef: MutableRefObject<DailyChartRef>
  dailyDate: number
  dashboardEpochDate: number
  fetchPatientData: () => Promise<void>
  goToDailySpecificDate: (date: number | Date) => void
  handleDatetimeLocationChange: (epochLocation: number, msRange: number) => Promise<boolean>
  updateDataForGivenRange: (dateRange: DateRange) => Promise<boolean>
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
const DEFAULT_MS_RANGE = TimeService.MS_IN_DAY

export const usePatientData = (): usePatientDataResult => {
  const navigate = useNavigate()
  const paramHook = useParams()
  const { patientId } = paramHook
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { getPatientById } = usePatientsContext()
  const patientHook = usePatientContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const dailyChartRef = useRef(null)
  const dateQueryParam = searchParams.get(DATE_QUERY_PARAM_KEY)
  const isUserPatient = user.isUserPatient()
  const urlPrefix = isUserPatient ? '' : `/patient/${patientId}`
  const patient = isUserPatient ? patientHook.patient : getPatientById(patientId)
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
  const [chartPrefs, setChartPrefs] = useState<ChartPrefs>(defaultChartPrefs)
  const [dashboardEpochDate, setDashboardEpochDate] = useState<number>(new Date().valueOf())
  const [dailyDate, setDailyDate] = useState<number | null>(null)
  const [trendsDate, setTrendsDate] = useState<number | null>(null)
  const [timePrefs, setTimePrefs] = useState<TimePrefs>({
    timezoneAware: true,
    timezoneName: new Intl.DateTimeFormat().resolvedOptions().timeZone // the browser timezone
  })

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
      case `${urlPrefix}/device`:
        return ChartTypes.Device
    }
  }, [pathname, urlPrefix])

  const [msRange, setMsRange] = useState<number>(DEFAULT_MS_RANGE)

  const changePatient = (patient: Patient): void => {
    patientDataUtils.current.changePatient(patient)
    setMedicalData(null)
    navigate(`/patient/${patient.userid}/${currentChart}`)
  }

  const getMsRangeByChartType = (chartType: ChartTypes, patientMedicalData: MedicalDataService): number => {
    if (chartType === ChartTypes.Dashboard) {
      return patientDataUtils.current.getRangeDaysInMs(patientMedicalData.medicalData)
    }
    return DEFAULT_MS_RANGE
  }

  const changeChart = (chart: ChartTypes): void => {
    if (chart === currentChart) {
      return
    }
    if (chart === ChartTypes.Dashboard) {
      setDashboardEpochDate(new Date().valueOf())
    }
    if (chart === ChartTypes.Daily && dateQueryParam) {
      setDailyDate(parseInt(dateQueryParam))
    }

    const newMsRange = getMsRangeByChartType(chart, medicalData)
    setMsRange(newMsRange)

    navigate(`${urlPrefix}/${chart}`)
  }

  const updateChartPrefs = (chartPrefs: ChartPrefs): void => {
    setChartPrefs(chartPrefs)
  }

  const goToDailySpecificDate = (date: number | Date): void => {
    setDailyDate(date instanceof Date ? date.valueOf() : date)
    navigate(`${urlPrefix}/${ChartTypes.Daily}?date=${new Date(date).toISOString()}`)
  }

  const handleDatetimeLocationChange = async (epochLocation: number, msRange: number): Promise<boolean> => {
    try {
      setRefreshingData(true)
      const dateRange = patientDataUtils.current.getDateRange({ currentChart, epochLocation, msRange })
      const patientData = await patientDataUtils.current.loadDataRange(dateRange)
      if (patientData && patientData.length > 0) {
        const medicalDataUpdated = medicalData
        medicalDataUpdated.add(patientData)
        setMedicalData(medicalDataUpdated)
        return true
      }
      return false
    } catch (err) {
      console.log(err)
    } finally {
      if (currentChart === ChartTypes.Daily) {
        setDailyDate(epochLocation)
        setSearchParams({ [DATE_QUERY_PARAM_KEY]: new Date(epochLocation).toISOString() })
      }
      if (currentChart === ChartTypes.Trends) {
        setTrendsDate(epochLocation)
      }
      setMsRange(msRange)
      setRefreshingData(false)
    }
  }

  // This function is used for the PDF/CSV, this is the only case where we update medicalData without updating dataUtil
  const updateDataForGivenRange = async (dateRange: DateRange): Promise<boolean> => {
    try {
      setRefreshingData(true)
      const patientData = await patientDataUtils.current.loadDataRange(dateRange)
      if (patientData && patientData.length > 0) {
        const medicalDataUpdated = medicalData
        medicalDataUpdated.add(patientData)
        setMedicalData(medicalDataUpdated)
        return true
      }
      return false
    } catch (err) {
      console.log(err)
    } finally {
      setRefreshingData(false)
    }
  }

  const refreshData = async (): Promise<void> => {
    setLoadingData(true)
    try {
      const patientData = await patientDataUtils.current.retrievePatientData()
      if (!patientData) {
        return
      }
      const medicalDataRetrieved = patientDataUtils.current.buildMedicalData(patientData)
      const dataUtil = new DataUtil(medicalDataRetrieved.data, {
        bgPrefs,
        timePrefs,
        endpoints: medicalDataRetrieved.endpoints
      })
      setMedicalData(medicalDataRetrieved)
      setDataUtil(dataUtil)
    } finally {
      setLoadingData(false)
    }
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
      const initialDate = patientDataUtils.current.getInitialDate(medicalData)
      const msRangeByChartType = getMsRangeByChartType(currentChart, medicalData)
      setMsRange(msRangeByChartType)
      setDataUtil(dataUtil)
      setMedicalData(medicalData)
      setDailyDate(dateQueryParam && isValidDateQueryParam(dateQueryParam) ? new Date(dateQueryParam).valueOf() : initialDate)
      setTrendsDate(initialDate)
      setTimePrefs(medicalData.opts.timePrefs)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (medicalData) {
      const dataUtil = new DataUtil(medicalData.data, {
        bgPrefs,
        timePrefs,
        endpoints: medicalData.endpoints
      })
      setDataUtil(dataUtil)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyDate, dashboardEpochDate, trendsDate, medicalData])

  return {
    bgPrefs,
    changeChart,
    changePatient,
    currentChart,
    chartPrefs,
    dataUtil,
    dailyChartRef,
    dailyDate,
    dashboardEpochDate,
    fetchPatientData,
    goToDailySpecificDate,
    handleDatetimeLocationChange,
    updateDataForGivenRange,
    loadingData,
    medicalData,
    msRange,
    patient,
    refreshData,
    refreshingData,
    trendsDate,
    timePrefs,
    updateChartPrefs
  }
}
