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

import React, { type FunctionComponent, useEffect, useRef, useState } from 'react'
import { PatientNavBarMemoized as PatientNavBar } from '../header-bars/patient-nav-bar'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { PrintReportDialog } from '../pdf/print-report-dialog'
import { PatientDashboard } from '../dashboard-cards/patient-dashboard'
import Daily from 'blip/app/components/chart/daily'
import Trends from 'blip/app/components/chart/trends'
import SpinningLoader from '../loaders/spinning-loader'
import { useAlert } from '../utils/snackbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { usePatientData } from './patient-data.hook'
import 'tidepool-viz/src/styles/colors.css'
import 'tideline/css/tideline.less'
import 'blip/app/style.less'
import { useDailyNotes } from './daily-notes.hook'
import metrics from '../../lib/metrics'
import DailyNotes from 'blip/app/components/messages'
import { useAuth } from '../../lib/auth'
import { errorTextFromException, setPageTitle } from '../../lib/utils'
import TeamUtils from '../../lib/team/team.util'
import { Patient } from '../../lib/patient/models/patient.model'
import { getPageTitleByPatientView } from './patient-data.utils'
import { DevicesView } from '../../pages/patient-view/devices/devices-view'
import { logError } from '../../utils/error.util'
import { PatientProfileView } from '../../pages/patient-view/patient-profile/patient-profile-view'
import { ConfigService } from '../../lib/config/config.service'

interface PatientDataProps {
  patient: Patient
}

export const PatientData: FunctionComponent<PatientDataProps> = ({ patient }: PatientDataProps) => {
  const alert = useAlert()
  const theme = useTheme()
  const { t } = useTranslation()
  const patientIdForWhichDataHasBeenFetched = useRef(null)
  const { teamId } = useParams()

  const {
    bgPrefs,
    chartPrefs,
    changePatientView,
    currentPatientView,
    dailyDate,
    dailyChartRef,
    device,
    fetchPatientData,
    goToDailySpecificDate,
    handleDatetimeLocationChange,
    updateDataForGivenRange,
    loadingData,
    medicalData,
    msRange,
    refreshData,
    refreshingData,
    trendsDate,
    timePrefs,
    updateChartPrefs
  } = usePatientData({ patient })
  const {
    showMessageCreation,
    showMessageThread,
    closeMessageBox,
    createNewMessage,
    createMessageDatetime,
    editMessage,
    handleMessageCreation,
    messageThread,
    replyToMessage
  } = useDailyNotes({ dailyDate, dailyChartRef, medicalData })
  const { user } = useAuth()

  const [showPdfDialog, setShowPdfDialog] = useState<boolean>(false)

  const pageTitle = getPageTitleByPatientView(currentPatientView)
  setPageTitle(pageTitle)

  useEffect(() => {
    if (patient?.userid && patient.userid !== patientIdForWhichDataHasBeenFetched.current) {
      patientIdForWhichDataHasBeenFetched.current = patient.userid
      fetchPatientData()
        .catch((err) => {
          const errorMessage = errorTextFromException(err)
          logError(errorMessage, 'fetch-patient-data')

          alert.error(t('error-http-40x'))
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient])

  const isEatingShortlyEnabled = ConfigService.getIsEatingShortlyEnabled()

  return (
    <>
      <PatientNavBar
        currentPatientView={currentPatientView}
        currentPatient={patient}
        onChangePatientView={changePatientView}
        onClickPrint={() => {
          setShowPdfDialog(true)
        }}
      />
      <>
        {loadingData
          ? <SpinningLoader className="centered-spinning-loader" />
          : <>
            {!medicalData?.hasDiabetesData() &&
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%"
                }}>
                <Typography>{t('no-patient-data', { patientName: patient.profile.fullName })}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={refreshData}
                  sx={{ marginTop: theme.spacing(1) }}
                  data-testid="no-data-refresh-button"
                >
                  {t('refresh')}
                </Button>
              </Box>
            }
            {medicalData?.hasDiabetesData() &&
              <>
                <Routes>
                  <Route
                    path={AppUserRoute.Dashboard}
                    element={
                      <PatientDashboard
                        bgPrefs={bgPrefs}
                        medicalDataService={medicalData}
                        patient={patient}
                        goToDailySpecificDate={goToDailySpecificDate}
                      />
                    }
                  />
                  <Route
                    path={AppUserRoute.Daily}
                    element={
                      <>
                        <Daily
                          bgPrefs={bgPrefs}
                          device={device}
                          timePrefs={timePrefs}
                          patient={patient}
                          tidelineData={medicalData}
                          epochLocation={dailyDate}
                          msRange={msRange}
                          loading={refreshingData}
                          onClickRefresh={refreshData}
                          onCreateMessage={showMessageCreation}
                          onShowMessageThread={showMessageThread}
                          onDatetimeLocationChange={handleDatetimeLocationChange}
                          isEatingShortlyEnabled={isEatingShortlyEnabled}
                          ref={dailyChartRef}
                        />
                        <>
                          {(createMessageDatetime || messageThread) &&
                            <DailyNotes
                              createDatetime={createMessageDatetime}
                              messages={messageThread}
                              onNewMessage={handleMessageCreation}
                              user={user}
                              patient={patient}
                              onClose={closeMessageBox}
                              onSave={createMessageDatetime ? createNewMessage : replyToMessage}
                              onEdit={editMessage}
                              timePrefs={timePrefs}
                              trackMetric={metrics.send}
                            />
                          }
                        </>
                      </>
                    }
                  />
                  <Route
                    path={AppUserRoute.Trends}
                    element={
                      <Trends
                        bgPrefs={bgPrefs}
                        chartPrefs={chartPrefs}
                        epochLocation={trendsDate}
                        msRange={msRange}
                        patient={patient}
                        tidelineData={medicalData}
                        loading={refreshingData}
                        onClickRefresh={refreshData}
                        onSwitchToDaily={goToDailySpecificDate}
                        onDatetimeLocationChange={handleDatetimeLocationChange}
                        updateChartPrefs={updateChartPrefs}
                      />
                    }
                  />
                  <Route
                    path={AppUserRoute.Devices}
                    element={
                      <DevicesView
                        goToDailySpecificDate={goToDailySpecificDate}
                        medicalData={medicalData}
                      />
                    }
                  />
                  {
                    user.isUserHcpOrPatient() && !TeamUtils.isPrivate(teamId) &&
                    <Route
                      path={AppUserRoute.PatientProfile}
                      element={
                        <PatientProfileView
                          patient={patient}
                        />
                      }
                    />
                  }
                  <Route path="/" element={<Navigate to={AppUserRoute.Dashboard} replace />} />
                  <Route path="*" element={<Navigate to={AppUserRoute.NotFound} replace />} />
                </Routes>
                {showPdfDialog &&
                  <PrintReportDialog
                    bgPrefs={bgPrefs}
                    defaultPreset={'1week'}
                    medicalData={medicalData}
                    updateDataForGivenRange={updateDataForGivenRange}
                    patient={patient}
                    onClose={() => {
                      setShowPdfDialog(false)
                    }}
                  />
                }
              </>
            }
          </>
        }
      </>
    </>
  )
}
