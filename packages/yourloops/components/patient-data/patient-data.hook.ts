/*
 * Copyright (c) 2023-2025, Diabeloop
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

import { type BgPrefs, buildDevice, Device } from 'dumb'
import { PatientView } from '../../enum/patient-view.enum'
import { type Patient } from '../../lib/patient/models/patient.model'
import { type ChartPrefs } from '../dashboard-cards/models/chart-prefs.model'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import type MedicalDataService from 'medical-domain'
import { defaultBgClasses, type TimePrefs, TimeService, Unit } from 'medical-domain'
import { type MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { convertIfNeeded, type DateRange, isValidDateQueryParam, PatientDataUtils } from './patient-data.utils'
import DataUtil from 'tidepool-viz/src/utils/data'
import { type DailyChartRef } from './models/daily-chart-ref.model'
import { AppUserRoute } from '../../models/enums/routes.enum'

export interface usePatientDataResult {
  bgPrefs: BgPrefs
  changePatientView: (patientView: PatientView) => void
  changePatient: (patient: Patient) => void
  chartPrefs: ChartPrefs
  currentPatientView: PatientView
  dailyChartRef: MutableRefObject<DailyChartRef>
  dailyDate: number
  device?: Device
  fetchPatientData: () => Promise<void>
  goToDailySpecificDate: (date: number | Date) => void
  handleDatetimeLocationChange: (epochLocation: number, msRange: number) => Promise<boolean>
  updateDataForGivenRange: (dateRange: DateRange) => Promise<{ medicalData: MedicalDataService, dataUtil: DataUtil }>
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

interface UsePatientDataProps {
  patient: Patient
}

const DATE_QUERY_PARAM_KEY = 'date'
const DEFAULT_MS_RANGE = TimeService.MS_IN_DAY

export const usePatientData = ({ patient }: UsePatientDataProps): usePatientDataResult => {
  const navigate = useNavigate()
  const { teamId } = useParams()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const dailyChartRef = useRef(null)
  const dateQueryParam = searchParams.get(DATE_QUERY_PARAM_KEY)
  const bgUnits = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter
  const bgClasses = defaultBgClasses[bgUnits] // used to class the blood glucose values in the chart
  const bgPrefs: BgPrefs = convertIfNeeded(patient.diabeticProfile?.bloodGlucosePreference, bgUnits) || {
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

  const currentPatientView = useMemo<PatientView>(() => {
    const urlPrefix = pathname.substring(0, pathname.lastIndexOf('/'))
    const routeWithoutUrlPrefix = pathname.replace(urlPrefix, '')

    switch (routeWithoutUrlPrefix) {
      case AppUserRoute.Daily:
        return PatientView.Daily
      case AppUserRoute.Trends:
        return PatientView.Trends
      case AppUserRoute.Dashboard:
        return PatientView.Dashboard
      case AppUserRoute.Devices:
        return PatientView.Devices
      case AppUserRoute.PatientProfile:
        return PatientView.PatientProfile
    }
  }, [pathname])

  const getRouteByPatientView = (view: PatientView): AppUserRoute => {
    switch (view) {
      case PatientView.Daily:
        return AppUserRoute.Daily
      case PatientView.Dashboard:
        return AppUserRoute.Dashboard
      case PatientView.Devices:
        return AppUserRoute.Devices
      case PatientView.PatientProfile:
        return AppUserRoute.PatientProfile
      case PatientView.Trends:
        return AppUserRoute.Trends
    }
  }

  const [msRange, setMsRange] = useState<number>(DEFAULT_MS_RANGE)

  const changePatient = (patient: Patient): void => {
    patientDataUtils.current.changePatient(patient)
    setMedicalData(null)
    navigate(`${AppUserRoute.Teams}/${teamId}${AppUserRoute.Patients}/${patient.userid}${getRouteByPatientView(currentPatientView)}`)
  }

  const getMsRangeByPatientView = (patientView: PatientView, patientMedicalData: MedicalDataService): number => {
    if (patientMedicalData && patientView === PatientView.Dashboard) {
      return patientDataUtils.current.getRangeDaysInMs(patientMedicalData.medicalData)
    }
    return DEFAULT_MS_RANGE
  }

  const changePatientView = (patientView: PatientView): void => {
    if (patientView === currentPatientView) {
      return
    }
    if (patientView === PatientView.Daily && dateQueryParam) {
      setDailyDate(parseInt(dateQueryParam))
    }

    const newMsRange = getMsRangeByPatientView(patientView, medicalData)
    setMsRange(newMsRange)

    const route = getRouteByPatientView(patientView)
    navigate(`..${route}`, { relative: 'path' })
  }

  const updateChartPrefs = (chartPrefs: ChartPrefs): void => {
    setChartPrefs(chartPrefs)
  }

  const goToDailySpecificDate = (date: number | Date): void => {
    setDailyDate(date instanceof Date ? date.valueOf() : date)
    navigate(`../${PatientView.Daily}?date=${new Date(date).toISOString()}`, { relative: 'path' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDatetimeLocationChange = async (epochLocation: number, msRange: number): Promise<boolean> => {
    try {
      setRefreshingData(true)
      const dateRange = patientDataUtils.current.getDateRange({
        currentPatientView: currentPatientView,
        epochLocation,
        msRange
      })
      const patientData = await patientDataUtils.current.loadDataRange(dateRange)
      if (patientData && patientData.cbg.length > 0) {
        const medicalDataUpdated = medicalData
        medicalDataUpdated.add(patientData)
        const dataUtil = new DataUtil(medicalData.medicalData, {
          bgPrefs,
          timePrefs,
          endpoints: medicalData.endpoints
        })
        setMedicalData(medicalDataUpdated)
        setDataUtil(dataUtil)
        return true
      }
      return false
    } catch (err) {
      console.log(err)
    } finally {
      if (currentPatientView === PatientView.Daily) {
        setDailyDate(epochLocation)
        setSearchParams({ [DATE_QUERY_PARAM_KEY]: new Date(epochLocation).toISOString() })
      }
      if (currentPatientView === PatientView.Trends) {
        setTrendsDate(epochLocation)
      }
      setMsRange(msRange)
      setRefreshingData(false)
    }
  }

  // This function is used for the PDF/CSV, this is the only case where we update medicalData without updating dataUtil
  const updateDataForGivenRange = async (dateRange: DateRange): Promise<{
    medicalData: MedicalDataService
    dataUtil: DataUtil
  }> => {
    try {
      setRefreshingData(true)
      const patientData = await patientDataUtils.current.loadDataRange(dateRange)
      if (patientData && patientData.cbg.length > 0) {
        const medicalDataUpdated = medicalData
        medicalDataUpdated.add(patientData)
        const dataUtilUpdated = new DataUtil(medicalDataUpdated.medicalData, {
          bgPrefs,
          timePrefs,
          endpoints: medicalDataUpdated.endpoints
        })
        setMedicalData(medicalDataUpdated)
        return { medicalData: medicalDataUpdated, dataUtil: dataUtilUpdated }
      }
      return { medicalData, dataUtil }
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
      const dataUtil = new DataUtil(medicalDataRetrieved.medicalData, {
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
      const dataUtil = new DataUtil(medicalData.medicalData, {
        bgPrefs,
        timePrefs,
        endpoints: medicalData.endpoints
      })
      const initialDate = patientDataUtils.current.getInitialDate(medicalData)
      const msRangeByPatientView = getMsRangeByPatientView(currentPatientView, medicalData)
      setMsRange(msRangeByPatientView)
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
      const dataUtil = new DataUtil(medicalData.medicalData, {
        bgPrefs,
        timePrefs,
        endpoints: medicalData.endpoints
      })
      setDataUtil(dataUtil)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyDate, trendsDate, medicalData])

  return {
    bgPrefs,
    changePatientView,
    changePatient,
    currentPatientView,
    chartPrefs,
    dailyChartRef,
    dailyDate,
    device: buildDevice(medicalData),
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
