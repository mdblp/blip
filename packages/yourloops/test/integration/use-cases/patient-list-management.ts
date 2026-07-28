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

import { checkCaregiverLayout } from '../assert/layout.assert'
import { checkPatientFiltersForPrivateTeam } from '../assert/patient-filters.assert'
import {
  checkAckMonitoringAlertDialogCloseOnAnalyse,
  checkAckMonitoringAlertDialogContent,
  checkAckMonitoringAlertHyperglycemia,
  checkAckMonitoringAlertHypoglycemia,
  checkAckMonitoringAlertNoData,
  checkAckMonitoringAlertTimeOutOfRange,
  checkDataGridTranslations,
  checkInactiveAlertIconRedirectToDashboard,
  checkLeadCliniciansColumn,
  checkMonitoringAlertsIconsInactiveForFirstPatient,
  checkPatientColumnsFiltersContent,
  checkPatientListColumnsCaregiver,
  checkPatientListColumnSort,
  checkPatientListCurrentTab,
  checkPatientListCurrentTabForPrivateTeam,
  checkPatientListFilters,
  checkPatientListHeaderCaregiver,
  checkPatientListHeaderForHcp,
  checkPatientListHideShowColumns,
  checkPatientListPendingTab,
  checkPatientListSearchCaregiver,
  checkPatientListTooltipsMgDL,
  checkPatientListTooltipsMmolL,
  checkPatientListTooltipsNoData,
  checkPendingPatientColumnsSettingsMedicalTeam,
  checkRemovePatientCaregiver,
  checkRemovePatientErrorCaregiver,
  goBackToPatientsList
} from '../assert/patient-list.assert'
import {
  checkAckMonitoringAlertDialogCloseOnAnalyseMobile,
  checkAckMonitoringAlertDialogContentMobile, checkAckMonitoringAlertHyperglycemiaMobile,
  checkAckMonitoringAlertHypoglycemiaMobile,
  checkAckMonitoringAlertNoDataMobile,
  checkAckMonitoringAlertTimeOutOfRangeMobile,
  checkPatientListCurrentTabMobile,
  checkPatientListCurrentTabForPrivateTeamMobile,
  checkPatientListFiltersMobile,
  checkPatientListHeaderForHcpMobile,
  checkPatientListHideShowColumnsMobile,
  goBackToPatientsListMobile
} from '../assert/patient-list-mobile.assert'
import { Router } from '../models/router.model'

export const testPatientListForHcp = async () => {
  await checkPatientListHeaderForHcp()
  await checkPatientListTooltipsMgDL()
  await checkPatientListTooltipsNoData()
  await checkPatientListColumnSort()
  await checkPatientListFilters()
  await checkPatientColumnsFiltersContent()
  await checkPendingPatientColumnsSettingsMedicalTeam()
  await checkPatientListHideShowColumns()
  await checkPatientListPendingTab()
  await checkPatientListCurrentTab()
}

export const testPatientListForHcpMobile = async () => {
  await checkPatientListHeaderForHcpMobile()
  await checkPatientListFiltersMobile()
  await checkPatientListHideShowColumnsMobile()
  await checkPatientListCurrentTabMobile()
}

export const testPatientListContentForHcp = async () => {
  await checkMonitoringAlertsIconsInactiveForFirstPatient()
  await checkLeadCliniciansColumn()
}

export const testPatientListForHcpWithMmolL = async () => {
  await checkPatientListTooltipsMmolL()
}

export const testPatientListForHcpPrivateTeam = async () => {
  await checkPatientListCurrentTabForPrivateTeam()
  await checkPatientFiltersForPrivateTeam()
}

export const testPatientListForHcpPrivateTeamMobile = async () => {
  await checkPatientListCurrentTabForPrivateTeamMobile()
}

export const testAckMonitoringAlerts = async (router: Router) => {
  await checkInactiveAlertIconRedirectToDashboard(router)
  await goBackToPatientsList(router)
  await checkAckMonitoringAlertDialogContent()
  await checkAckMonitoringAlertDialogCloseOnAnalyse(router)
  await goBackToPatientsList(router)
  await checkAckMonitoringAlertHypoglycemia()
  await checkAckMonitoringAlertTimeOutOfRange()
  await checkAckMonitoringAlertNoData()
  await checkAckMonitoringAlertHyperglycemia()
}

export const testAckMonitoringAlertsMobile = async (router: Router) => {
  await checkAckMonitoringAlertNoDataMobile()
  await checkAckMonitoringAlertDialogContentMobile()
  await checkAckMonitoringAlertDialogCloseOnAnalyseMobile(router)
  await goBackToPatientsListMobile(router)
  await checkAckMonitoringAlertHypoglycemiaMobile()
  await checkAckMonitoringAlertTimeOutOfRangeMobile()
  await checkAckMonitoringAlertNoDataMobile()
  await checkAckMonitoringAlertHyperglycemiaMobile()
}

export const testAckMonitoringAlertsWithError = async () => {
  await checkAckMonitoringAlertHypoglycemia(true)
}

export const testAckMonitoringAlertsWithErrorMobile = async () => {
  await checkAckMonitoringAlertHypoglycemiaMobile(true)
}

export const testDataGridTranslations = async () => {
  checkDataGridTranslations()
}

export const testPatientListColumnsCaregiver = async () => {
  checkPatientListHeaderCaregiver()
  await checkPatientListColumnsCaregiver()
}

export const testRemovePatientErrorCaregiver = async () => {
  await checkRemovePatientErrorCaregiver()
}

export const testRemovePatientCaregiver = async (lastName: string, firstName: string) => {
  await checkCaregiverLayout(`${lastName} ${firstName}`)
  checkPatientListHeaderCaregiver()
  await checkRemovePatientCaregiver()
}

export const testPatientListSearchCaregiver = async (lastDataUploadDate: string) => {
  await checkPatientListSearchCaregiver(lastDataUploadDate)
}
