/*
 * Copyright (c) 2023-2024, Diabeloop
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
import { type MedicalReport } from '../../../lib/medical-files/models/medical-report.model'
import { loggedInUserId } from '../mock/auth0.hook.mock'
import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import userEvent from '@testing-library/user-event'
import { patient1Id } from '../data/patient.api.data'

export interface MedicalFilesWidgetParams {
  selectedPatientId: string
  loggedInUserFirstName: string
  loggedInUserLastName: string
  selectedTeamId: string
  selectedTeamName: string
}

const MEDICAL_REPORT_TO_CREATE_ID = 'fakeMedicalReportId'
const MEDICAL_REPORT_TO_CREATE_DATE = '01-01-2023'

export const getMedicalFilesWidget = async (): Promise<HTMLElement> => {
  const dashboard = within(await screen.findByTestId('patient-dashboard'))
  return dashboard.getByTestId('medical-files-card')
}

export const checkMedicalReportContentForHcp = async (medicalFilesWidgetParams: MedicalFilesWidgetParams): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  expect(medicalFilesWidget).toHaveTextContent(`Medical filesMedical report-1 2022-01-10Created by Lapaix Vishnou${medicalFilesWidgetParams.selectedTeamName}Medical report-2 2022-01-02Created by Lapaix Vishnou${medicalFilesWidgetParams.selectedTeamName}New`)
}

export const checkMedicalReportContentForPatient = async (medicalFilesWidgetParams: MedicalFilesWidgetParams): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  expect(MedicalFilesApi.getMedicalReports).toHaveBeenCalledWith(medicalFilesWidgetParams.selectedPatientId, null)
  expect(medicalFilesWidget).toHaveTextContent('Medical filesMedical report-1 2022-01-10Created by Lapaix VishnouMySecondTeamMedical report-2 2022-01-02Created by Lapaix VishnouMySecondTeam')
  expect(within(medicalFilesWidget).queryByRole('button', { name: 'Delete Medical report 2022-01-02' })).not.toBeInTheDocument()
}

export const checkMedicalReportCancel = async (): Promise<void> => {
  const createMedicalReportButton = within(await getMedicalFilesWidget()).getByRole('button', { name: 'New' })
  await userEvent.click(createMedicalReportButton)
  const medicalReportDialog = screen.getByRole('dialog')
  expect(medicalReportDialog).toHaveTextContent('Create medical report1. Diagnosis​2. Progression proposal​3. Training subject​CancelSave')
  const cancelMedicalReportCreationButton = within(medicalReportDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelMedicalReportCreationButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkMedicalReportCreate = async (medicalFileWidgetParams: MedicalFilesWidgetParams): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  const createMedicalReportButton = within(medicalFilesWidget).getByRole('button', { name: 'New' })
  await userEvent.click(createMedicalReportButton)
  const createdMedicalReportDialog = within(screen.getByRole('dialog'))
  const medicalReportInputs = createdMedicalReportDialog.getAllByRole('textbox')
  const diagnosis = 'fake diagnosis'
  const progressionProposal = 'fake progression proposal'
  const trainingSubject = 'fake training subject'
  await userEvent.type(medicalReportInputs[0], diagnosis)
  await userEvent.type(medicalReportInputs[1], progressionProposal)
  await userEvent.type(medicalReportInputs[2], trainingSubject)
  const medicalReportCreated: MedicalReport = {
    id: MEDICAL_REPORT_TO_CREATE_ID,
    authorId: loggedInUserId,
    creationDate: MEDICAL_REPORT_TO_CREATE_DATE,
    teamId: medicalFileWidgetParams.selectedTeamId,
    teamName: medicalFileWidgetParams.selectedTeamName,
    patientId: patient1Id,
    diagnosis,
    progressionProposal,
    trainingSubject,
    authorFirstName: medicalFileWidgetParams.loggedInUserFirstName,
    authorLastName: medicalFileWidgetParams.loggedInUserLastName,
    number: 3
  }
  jest.spyOn(MedicalFilesApi, 'createMedicalReport').mockResolvedValue(medicalReportCreated)
  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Save' }))
  expect(MedicalFilesApi.createMedicalReport).toHaveBeenCalledWith({
    teamId: medicalFileWidgetParams.selectedTeamId,
    patientId: patient1Id,
    diagnosis,
    progressionProposal,
    trainingSubject,
    teamName: medicalFileWidgetParams.selectedTeamName,
    authorFirstName: medicalFileWidgetParams.loggedInUserFirstName,
    authorLastName: medicalFileWidgetParams.loggedInUserLastName
  })
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Medical report successfully saved')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(medicalFilesWidget).toHaveTextContent(`Medical filesMedical report-1 2022-01-10Created by Lapaix Vishnou${medicalFileWidgetParams.selectedTeamName}Medical report-2 2022-01-02Created by Lapaix Vishnou${medicalFileWidgetParams.selectedTeamName}Medical report-3 01-01-2023Created by HCP lastName HCP firstName${medicalFileWidgetParams.selectedTeamName}New`)
}

export const checkMedicalReportUpdate = async (medicalFileWidgetParams: MedicalFilesWidgetParams): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  const medicalReportButton = within(medicalFilesWidget).getByRole('button', { name: `Medical report-3 01-01-2023 Created by HCP lastName HCP firstName ${medicalFileWidgetParams.selectedTeamName}` })
  await userEvent.click(medicalReportButton)
  const createdMedicalReportDialogEdit = screen.getByRole('dialog')
  expect(createdMedicalReportDialogEdit).toHaveTextContent('Edit medical report 31. Diagnosisfake diagnosis​2. Progression proposalfake progression proposal​3. Training subjectfake training subject​CancelSave')

  const diagnosisEdited = 'fake diagnosis edited'
  const progressionProposalEdited = 'fake progression proposal edited'
  const trainingSubjectEdited = 'fake training subject edited'
  const medicalReportInputsToEdit = within(createdMedicalReportDialogEdit).getAllByRole('textbox')
  await userEvent.type(medicalReportInputsToEdit[0], ' edited')
  await userEvent.type(medicalReportInputsToEdit[1], ' edited')
  await userEvent.type(medicalReportInputsToEdit[2], ' edited')
  const medicalReportUpdated: MedicalReport = {
    id: MEDICAL_REPORT_TO_CREATE_ID,
    authorId: loggedInUserId,
    creationDate: MEDICAL_REPORT_TO_CREATE_DATE,
    teamId: medicalFileWidgetParams.selectedTeamId,
    teamName: medicalFileWidgetParams.selectedTeamName,
    patientId: patient1Id,
    diagnosis: diagnosisEdited,
    progressionProposal: progressionProposalEdited,
    trainingSubject: trainingSubjectEdited,
    authorFirstName: medicalFileWidgetParams.loggedInUserFirstName,
    authorLastName: medicalFileWidgetParams.loggedInUserLastName,
    number: 3
  }
  jest.spyOn(MedicalFilesApi, 'updateMedicalReport').mockResolvedValue(medicalReportUpdated)
  await userEvent.click(within(createdMedicalReportDialogEdit).getByRole('button', { name: 'Save' }))
  expect(MedicalFilesApi.updateMedicalReport).toHaveBeenCalledWith(medicalReportUpdated)
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Medical report successfully saved')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkMedicalReportConsult = async (medicalFileWidgetParams: MedicalFilesWidgetParams): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  const medicalReportButton = within(medicalFilesWidget).getByRole('button', { name: `Medical report-2 2022-01-02 Created by Lapaix Vishnou ${medicalFileWidgetParams.selectedTeamName}` })
  await userEvent.click(medicalReportButton)
  const medicalReportDialog = screen.getByRole('dialog')
  expect(medicalReportDialog).toHaveTextContent('Consult medical report 21. Diagnosiswhatever diagnosis 2 ​2. Progression proposalwhatever proposal 2​3. Training subjecthere is the subject 2​Close')

  const medicalReportInputs = within(medicalReportDialog).getAllByRole('textbox')
  expect(medicalReportInputs[0]).toBeDisabled()
  expect(medicalReportInputs[1]).toBeDisabled()
  expect(medicalReportInputs[2]).toBeDisabled()
  await userEvent.click(within(medicalReportDialog).getByRole('button', { name: 'Close' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkMedicalReportDelete = async (medicalFileWidgetParams: MedicalFilesWidgetParams): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  const deleteMedicalReportButton = within(medicalFilesWidget).getByRole('button', { name: `Delete medical report 3 created by team ${medicalFileWidgetParams.selectedTeamName}` })
  await userEvent.click(deleteMedicalReportButton)
  const deleteDialog = screen.getByRole('dialog')
  expect(deleteDialog).toHaveTextContent(`Delete medical reportAre you sure you want to delete the medical report 3 created by team ${medicalFileWidgetParams.selectedTeamName}?CancelDelete`)
  const cancelButton = within(deleteDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(deleteMedicalReportButton)
  const deleteButton = within(screen.queryByRole('dialog')).getByRole('button', { name: 'Delete' })
  jest.spyOn(MedicalFilesApi, 'deleteMedicalReport').mockResolvedValue(undefined)
  await userEvent.click(deleteButton)
  expect(MedicalFilesApi.deleteMedicalReport).toHaveBeenCalledWith(MEDICAL_REPORT_TO_CREATE_ID)
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Medical report successfully deleted')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(medicalFilesWidget).toHaveTextContent(`Medical filesMedical report-1 2022-01-10Created by Lapaix Vishnou${medicalFileWidgetParams.selectedTeamName}Medical report-2 2022-01-02Created by Lapaix Vishnou${medicalFileWidgetParams.selectedTeamName}New`)
}

export const checkEmptyMedicalFilesWidgetForPatient = async (): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  expect(within(medicalFilesWidget).getByText('No medical files have yet been created by your healthcare professional.')).toBeVisible()
}

export const checkEmptyMedicalFilesWidgetForHcp = async (): Promise<void> => {
  const medicalFilesWidget = await getMedicalFilesWidget()
  expect(within(medicalFilesWidget).getByText('No medical files have yet been created.')).toBeVisible()
}
