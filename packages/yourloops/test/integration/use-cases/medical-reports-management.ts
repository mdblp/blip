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

import { screen, within } from '@testing-library/react'
import {
  type MedicalFileWidgetParams,
  testMedicalReportCancel,
  testMedicalReportConsult,
  testMedicalReportCreate,
  testMedicalReportDelete,
  testMedicalReportUpdate
} from '../assert/medical-widget'
import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'

export const testMedicalWidgetForHcp = async (medicalFileWidgetParams: MedicalFileWidgetParams): Promise<void> => {
  const dashboard = within(await screen.findByTestId('patient-dashboard'))
  const medicalFilesWidget = dashboard.getByTestId('medical-files-card')
  expect(medicalFilesWidget).toHaveTextContent(`Medical filesMedical report-1 2022-01-10Created by Vishnou Lapaix${medicalFileWidgetParams.selectedTeamName}Medical report-2 2022-01-02Created by Vishnou Lapaix${medicalFileWidgetParams.selectedTeamName}New`)
  await testMedicalReportCancel(medicalFilesWidget)
  await testMedicalReportCreate(medicalFilesWidget, medicalFileWidgetParams)
  await testMedicalReportUpdate(medicalFilesWidget, medicalFileWidgetParams)
  await testMedicalReportConsult(medicalFilesWidget, medicalFileWidgetParams)
  await testMedicalReportDelete(medicalFilesWidget, medicalFileWidgetParams)
}

export const testMedicalWidgetForPatient = async (medicalFileWidgetParams: MedicalFileWidgetParams): Promise<void> => {
  expect(MedicalFilesApi.getMedicalReports).toHaveBeenCalledWith(medicalFileWidgetParams.selectedPatientId, null)
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const medicalFilesWidget = dashboard.getByTestId('medical-files-card')
  expect(medicalFilesWidget).toHaveTextContent('Medical filesMedical report-1 2022-01-10Created by Vishnou LapaixMySecondTeamMedical report-2 2022-01-02Created by Vishnou LapaixMySecondTeam')
  expect(within(medicalFilesWidget).queryByRole('button', { name: 'Delete Medical report 2022-01-02' })).not.toBeInTheDocument()
  await testMedicalReportConsult(medicalFilesWidget, medicalFileWidgetParams)
}
