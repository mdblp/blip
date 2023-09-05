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

import React, { type FunctionComponent, useEffect, useRef, useState } from 'react'
import { PatientNavBarMemoized as PatientNavBar } from '../header-bars/patient-nav-bar'
import { Route, Routes } from 'react-router-dom'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { PrintPDFDialog } from '../pdf/print-pdf-dialog'
import { PatientDashboard } from '../dashboard-widgets/patient-dashboard'
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
import { DevicePage } from '../../pages/device/device-page'
import { setPageTitle } from '../../lib/utils'

export const PatientData: FunctionComponent = () => {
  const alert = useAlert()
  const theme = useTheme()
  const { t } = useTranslation()
  const patientIdForWhichDataHasBeenFetched = useRef(null)

  const {
    bgPrefs,
    chartPrefs,
    changeChart,
    changePatient,
    currentChart,
    dailyDate,
    dailyChartRef,
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
    patient,
    timePrefs,
    updateChartPrefs
  } = usePatientData()
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

  setPageTitle(t(currentChart))

  useEffect(() => {
    if (patient.userid !== patientIdForWhichDataHasBeenFetched.current) {
      patientIdForWhichDataHasBeenFetched.current = patient.userid
      fetchPatientData()
        .catch((err) => {
          console.log(err)
          alert.error(err.toString())
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient])

  return (
    <React.Fragment>
      <PatientNavBar
        currentChart={currentChart}
        currentPatient={patient}
        onChangeChart={changeChart}
        onClickPrint={() => {
          setShowPdfDialog(true)
        }}
        onSwitchPatient={changePatient}
      />
      <React.Fragment>
        {loadingData
          ? <SpinningLoader className="centered-spinning-loader" />
          : <React.Fragment>
            {!medicalData?.hasDiabetesData() &&
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Typography>{t('no-patient-data', { patientName: patient.profile.fullName })}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={refreshData}
                  sx={{ marginTop: theme.spacing(1) }}
                >
                  {t('refresh')}
                </Button>
              </Box>
            }
            {medicalData?.hasDiabetesData() &&
              <React.Fragment>
                <Routes>
                  <Route
                    path={AppUserRoute.Dashboard}
                    element={
                      <PatientDashboard
                        bgPrefs={bgPrefs}
                        medicalDataService={medicalData}
                        patient={patient}
                        timePrefs={timePrefs}
                        loading={refreshingData}
                      />
                    }
                  />
                  <Route
                    path={AppUserRoute.Daily}
                    element={
                      <React.Fragment>
                        <Daily
                          bgPrefs={bgPrefs}
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
                      </React.Fragment>
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
                    path={AppUserRoute.Device}
                    element={
                      <DevicePage
                        goToDailySpecificDate={goToDailySpecificDate}
                        medicalData={medicalData}
                      />
                    }
                  />
                </Routes>
                {showPdfDialog &&
                  <PrintPDFDialog
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
              </React.Fragment>
            }
          </React.Fragment>
        }
      </React.Fragment>
    </React.Fragment>
  )
}
