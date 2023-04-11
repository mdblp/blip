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
import { type MedicalReport } from '../../../lib/medical-files/models/medical-report.model'
import { loggedInUserId } from '../mock/auth0.hook.mock'
import { mySecondTeamId, mySecondTeamName } from '../mock/team.api.mock'
import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import userEvent from '@testing-library/user-event'
import { monitoredPatientId } from '../data/patient.api.data'

const MEDICAL_REPORT_TO_CREATE_ID = 'fakeMedicalReportId'
const MEDICAL_REPORT_TO_CREATE_DATE = '01-01-2023'

const checkMedicalReportCancel = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const createMedicalReportButton = within(medicalFilesWidget).getByRole('button', { name: 'New' })
  await userEvent.click(createMedicalReportButton)
  const medicalReportDialog = screen.getByRole('dialog')
  expect(medicalReportDialog).toHaveTextContent('Create medical report1. Diagnosis​2. Progression proposal​3. Training subject​CancelSave')
  const cancelMedicalReportCreationButton = within(medicalReportDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelMedicalReportCreationButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

const checkMedicalReportCreate = async (medicalFilesWidget: HTMLElement, firstName: string, lastName: string): Promise<void> => {
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
    teamId: mySecondTeamId,
    teamName: mySecondTeamName,
    patientId: monitoredPatientId,
    diagnosis,
    progressionProposal,
    trainingSubject,
    authorFirstName: firstName,
    authorLastName: lastName,
    number: 3
  }
  jest.spyOn(MedicalFilesApi, 'createMedicalReport').mockResolvedValue(medicalReportCreated)
  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Save' }))
  expect(MedicalFilesApi.createMedicalReport).toHaveBeenCalledWith({
    teamId: mySecondTeamId,
    patientId: monitoredPatientId,
    diagnosis,
    progressionProposal,
    trainingSubject,
    teamName: mySecondTeamName,
    authorFirstName: firstName,
    authorLastName: lastName
  })
  expect(within(screen.getByTestId('alert-snackbar')).getByText('Medical report successfully saved'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(medicalFilesWidget).toHaveTextContent('Medical filesMedical report-1 2022-01-10Created by Vishnou LapaixMySecondTeamMedical report-2 2022-01-02Created by Vishnou LapaixMySecondTeamMedical report-3 01-01-2023Created by HCP firstName HCP lastNameMySecondTeamNew')
}

const checkMedicalReportUpdate = async (medicalFilesWidget: HTMLElement, firstName: string, lastName: string): Promise<void> => {
  const medicalReportButton = within(medicalFilesWidget).getByRole('button', { name: 'Medical report-3 01-01-2023 Created by HCP firstName HCP lastName MySecondTeam' })
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
    teamId: mySecondTeamId,
    teamName: mySecondTeamName,
    patientId: monitoredPatientId,
    diagnosis: diagnosisEdited,
    progressionProposal: progressionProposalEdited,
    trainingSubject: trainingSubjectEdited,
    authorFirstName: firstName,
    authorLastName: lastName,
    number: 3
  }
  jest.spyOn(MedicalFilesApi, 'updateMedicalReport').mockResolvedValue(medicalReportUpdated)
  await userEvent.click(within(createdMedicalReportDialogEdit).getByRole('button', { name: 'Save' }))
  expect(MedicalFilesApi.updateMedicalReport).toHaveBeenCalledWith(medicalReportUpdated)
  expect(within(screen.getByTestId('alert-snackbar')).getByText('Medical report successfully saved'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

const checkMedicalReportConsult = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const medicalReportButton = within(medicalFilesWidget).getByRole('button', { name: 'Medical report-2 2022-01-02 Created by Vishnou Lapaix MySecondTeam' })
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

const checkMedicalReportDelete = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const deleteMedicalReportButton = within(medicalFilesWidget).getByRole('button', { name: 'Delete medical report 3 created by team MySecondTeam' })
  await userEvent.click(deleteMedicalReportButton)
  const deleteDialog = screen.getByRole('dialog')
  expect(deleteDialog).toHaveTextContent('Delete medical reportAre you sure you want to delete the medical report 3 created by team MySecondTeam?CancelDelete')
  const cancelButton = within(deleteDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(deleteMedicalReportButton)
  const deleteButton = within(screen.queryByRole('dialog')).getByRole('button', { name: 'Delete' })
  jest.spyOn(MedicalFilesApi, 'deleteMedicalReport').mockResolvedValue(undefined)
  await userEvent.click(deleteButton)
  expect(MedicalFilesApi.deleteMedicalReport).toHaveBeenCalledWith(MEDICAL_REPORT_TO_CREATE_ID)
  expect(within(screen.getByTestId('alert-snackbar')).getByText('Medical report successfully deleted'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(medicalFilesWidget).toHaveTextContent('Medical filesMedical report-1 2022-01-10Created by Vishnou LapaixMySecondTeamMedical report-2 2022-01-02Created by Vishnou LapaixMySecondTeamNew')
}

export const checkMedicalWidgetForHcp = async (firstName: string, lastName: string): Promise<void> => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const medicalFilesWidget = dashboard.getByTestId('medical-files-card')
  expect(medicalFilesWidget).toHaveTextContent('Medical filesMedical report-1 2022-01-10Created by Vishnou LapaixMySecondTeamMedical report-2 2022-01-02Created by Vishnou LapaixMySecondTeamNew')
  await checkMedicalReportCancel(medicalFilesWidget)
  await checkMedicalReportCreate(medicalFilesWidget, firstName, lastName)
  await checkMedicalReportUpdate(medicalFilesWidget, firstName, lastName)
  await checkMedicalReportConsult(medicalFilesWidget)
  await checkMedicalReportDelete(medicalFilesWidget)
}

export const checkMedicalWidgetForPatient = async (): Promise<void> => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const medicalFilesWidget = dashboard.getByTestId('medical-files-card')
  expect(medicalFilesWidget).toHaveTextContent('Medical filesMedical report-1 2022-01-10Created by Vishnou LapaixMySecondTeamMedical report-2 2022-01-02Created by Vishnou LapaixMySecondTeam')
  expect(within(medicalFilesWidget).queryByRole('button', { name: 'Delete Medical report 2022-01-02' })).not.toBeInTheDocument()
  await checkMedicalReportConsult(medicalFilesWidget)
}
