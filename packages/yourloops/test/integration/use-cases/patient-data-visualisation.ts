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

import {
  checkPatientStatistics,
  checkPatientStatisticsNoData,
  checkPatientStatisticsWithTwoWeeksOldData
} from '../assert/patient-statistics.assert'
import { checkPatientDashboardLayout, type PatientDashboardLayoutParams } from '../assert/layout.assert'
import {
  checkDeviceUsageWidget,
  checkDeviceUsageWidgetNoData,
  checkDeviceUsageWidgetWithTwoWeeksOldData
} from '../assert/device-usage.assert'
import { patient1, patient2 } from '../data/patient.api.data'
import {
  checkPatientDropdown,
  checkPatientNavBarForPatient,
  checkPatientSwitch
} from '../assert/patient-nav-bar.assert'
import {
  checkEmptyMedicalFilesWidgetForHcp,
  checkEmptyMedicalFilesWidgetForPatient
} from '../assert/medical-widget.assert'
import { checkMonitoringAlertsCard } from '../assert/monitoring-alerts.assert'

export const testDashboardDataVisualisationForHcp = async (patientDashboardLayoutParams: PatientDashboardLayoutParams) => {
  await checkPatientDashboardLayout(patientDashboardLayoutParams)
  await checkPatientStatistics()
  await checkDeviceUsageWidget()
  await checkMonitoringAlertsCard()
}

export const testDashboardDataVisualisationForPatient = async (patientDashboardLayoutParams: PatientDashboardLayoutParams): Promise<void> => {
  await checkPatientDashboardLayout(patientDashboardLayoutParams)
  await checkPatientStatistics()
  await checkDeviceUsageWidget()
}

export const testDashboardDataVisualisationWithTwoWeeksOldData = async () => {
  await checkPatientStatisticsWithTwoWeeksOldData()
  await checkDeviceUsageWidgetWithTwoWeeksOldData()
}

export const testDashboardDataVisualisationPrivateTeam = async (patientDashboardLayoutParams: PatientDashboardLayoutParams) => {
  await checkPatientDashboardLayout(patientDashboardLayoutParams)
  await checkPatientStatistics()
  await checkDeviceUsageWidget()
}

export const testDashboardDataVisualisationPrivateTeamNoData = async (patientDashboardLayoutParams: PatientDashboardLayoutParams) => {
  await checkPatientDashboardLayout(patientDashboardLayoutParams)
  await checkPatientStatisticsNoData()
  await checkDeviceUsageWidgetNoData()
}

export const testPatientNavBarForHcp = async () => {
  await checkPatientDropdown(patient1, patient2)
}

export const testPatientNavBarForPatient = async () => {
  await checkPatientNavBarForPatient()
}

export const testEmptyMedicalFilesWidgetForPatient = async () => {
  await checkEmptyMedicalFilesWidgetForPatient()
}

export const testEmptyMedicalFilesWidgetForHcp = async () => {
  await checkEmptyMedicalFilesWidgetForHcp()
}

export const testSwitchPatientCorrectDataDisplay = async () => {
  await checkPatientSwitch()
}
