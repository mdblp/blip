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

import { testPatientStatistics, testPatientStatisticsNoData } from '../assert/patient-statistics'
import { type PatientDashboardLayout, testPatientDashboardLayout } from '../assert/layout'
import { testDeviceUsageWidget, testDeviceUsageWidgetNoData } from '../assert/device-usage'
import { monitoredPatient, unmonitoredPatient } from '../data/patient.api.data'
import { testPatientDropdown } from '../assert/patient-nav-bar'

export const testDashboardDataVisualisationForHcp = async (patientDashboardLayout: PatientDashboardLayout) => {
  await testPatientDashboardLayout(patientDashboardLayout)
  await testPatientStatistics()
  await testDeviceUsageWidget()
}

export const testDashboardDataVisualisationForHcpPrivate = async (patientDashboardLayout: PatientDashboardLayout) => {
  await testPatientDashboardLayout(patientDashboardLayout)
  await testPatientStatisticsNoData()
  await testDeviceUsageWidgetNoData()
}

export const testPatientNavBar = async () => {
  await testPatientDropdown(monitoredPatient, unmonitoredPatient)
}
