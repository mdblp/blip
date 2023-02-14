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
import { type MedicalRecord } from '../../../lib/medical-files/models/medical-record.model'
import { loggedInUserId } from '../mock/auth0.hook.mock'
import { mySecondTeamId } from '../mock/team.api.mock'
import { monitoredPatientId } from '../mock/patient.api.mock'
import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import userEvent from '@testing-library/user-event'

const MEDICAL_RECORD_TO_CREATE_ID = 'fakeMedicalRecordId'
const MEDICAL_RECORD_TO_CREATE_DATE = '01-01-2023'

const checkMedicalRecordCancel = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const createMedicalReportButton = within(medicalFilesWidget).getByRole('button', { name: 'New' })
  await userEvent.click(createMedicalReportButton)
  const createdMedicalRecordDialog = screen.getByRole('dialog')
  expect(createdMedicalRecordDialog).toHaveTextContent('Create medical record1. Diagnosis​2. Progression proposal​3. Training subject​CancelSave')
  const cancelMedicalRecordCreationButton = within(createdMedicalRecordDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelMedicalRecordCreationButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

const checkMedicalRecordCreate = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const createMedicalReportButton = within(medicalFilesWidget).getByRole('button', { name: 'New' })
  await userEvent.click(createMedicalReportButton)
  const createdMedicalRecordDialog = within(screen.getByRole('dialog'))
  const medicalRecordInputs = createdMedicalRecordDialog.getAllByRole('textbox')
  const diagnosis = 'fake diagnosis'
  const progressionProposal = 'fake progression proposal'
  const trainingSubject = 'fake training subject'
  await userEvent.type(medicalRecordInputs[0], diagnosis)
  await userEvent.type(medicalRecordInputs[1], progressionProposal)
  await userEvent.type(medicalRecordInputs[2], trainingSubject)
  const medicalRecordCreated: MedicalRecord = {
    id: MEDICAL_RECORD_TO_CREATE_ID,
    authorId: loggedInUserId,
    creationDate: MEDICAL_RECORD_TO_CREATE_DATE,
    teamId: mySecondTeamId,
    patientId: monitoredPatientId,
    diagnosis,
    progressionProposal,
    trainingSubject
  }
  jest.spyOn(MedicalFilesApi, 'createMedicalRecord').mockResolvedValue(medicalRecordCreated)
  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Save' }))
  expect(MedicalFilesApi.createMedicalRecord).toHaveBeenCalledWith({
    teamId: mySecondTeamId,
    patientId: monitoredPatientId,
    diagnosis,
    progressionProposal,
    trainingSubject
  })
  expect(within(screen.getByTestId('alert-snackbar')).getByText('Medical record successfully saved'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(medicalFilesWidget).toHaveTextContent('Medical filesPrescriptionsPrescription_2022-01-02Medical recordsMedical_record_2022-01-02Medical_record_01-01-2023New')
}

const checkMedicalRecordUpdate = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const medicalRecordButton = within(medicalFilesWidget).getByRole('button', { name: 'Medical_record_01-01-2023' })
  await userEvent.click(medicalRecordButton)
  const createdMedicalRecordDialogEdit = screen.getByRole('dialog')
  expect(createdMedicalRecordDialogEdit).toHaveTextContent('Edit Medical_record_01-01-20231. Diagnosisfake diagnosis​2. Progression proposalfake progression proposal​3. Training subjectfake training subject​CancelSave')

  const diagnosisEdited = 'fake diagnosis edited'
  const progressionProposalEdited = 'fake progression proposal edited'
  const trainingSubjectEdited = 'fake training subject edited'
  const medicalRecordInputsToEdit = within(createdMedicalRecordDialogEdit).getAllByRole('textbox')
  await userEvent.type(medicalRecordInputsToEdit[0], ' edited')
  await userEvent.type(medicalRecordInputsToEdit[1], ' edited')
  await userEvent.type(medicalRecordInputsToEdit[2], ' edited')
  const medicalRecordUpdated: MedicalRecord = {
    id: MEDICAL_RECORD_TO_CREATE_ID,
    authorId: loggedInUserId,
    creationDate: MEDICAL_RECORD_TO_CREATE_DATE,
    teamId: mySecondTeamId,
    patientId: monitoredPatientId,
    diagnosis: diagnosisEdited,
    progressionProposal: progressionProposalEdited,
    trainingSubject: trainingSubjectEdited
  }
  jest.spyOn(MedicalFilesApi, 'updateMedicalRecord').mockResolvedValue(medicalRecordUpdated)
  await userEvent.click(within(createdMedicalRecordDialogEdit).getByRole('button', { name: 'Save' }))
  expect(MedicalFilesApi.updateMedicalRecord).toHaveBeenCalledWith(medicalRecordUpdated)
  expect(within(screen.getByTestId('alert-snackbar')).getByText('Medical record successfully saved'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

const checkMedicalRecordConsult = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const medicalRecordButton = within(medicalFilesWidget).getByRole('button', { name: 'Medical_record_2022-01-02' })
  await userEvent.click(medicalRecordButton)
  const medicalRecordDialog = screen.getByRole('dialog')
  expect(medicalRecordDialog).toHaveTextContent('Consult Medical_record_2022-01-021. Diagnosiswhatever diagnosis​2. Progression proposalwhatever proposal​3. Training subjecthere is the subject​Close')

  const medicalRecordInputs = within(medicalRecordDialog).getAllByRole('textbox')
  expect(medicalRecordInputs[0]).toBeDisabled()
  expect(medicalRecordInputs[1]).toBeDisabled()
  expect(medicalRecordInputs[2]).toBeDisabled()
  await userEvent.click(within(medicalRecordDialog).getByRole('button', { name: 'Close' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

const checkMedicalRecordDelete = async (medicalFilesWidget: HTMLElement): Promise<void> => {
  const deleteMedicalRecordButton = within(medicalFilesWidget).getByRole('button', { name: 'Delete Medical_record_01-01-2023' })
  await userEvent.click(deleteMedicalRecordButton)
  const deleteDialog = screen.getByRole('dialog')
  expect(deleteDialog).toHaveTextContent('Delete Medical_record_01-01-2023Are you sure you want to delete Medical_record_01-01-2023?CancelDelete')
  const cancelButton = within(deleteDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(deleteMedicalRecordButton)
  const deleteButton = within(screen.queryByRole('dialog')).getByRole('button', { name: 'Delete' })
  jest.spyOn(MedicalFilesApi, 'deleteMedicalRecord').mockResolvedValue(undefined)
  await userEvent.click(deleteButton)
  expect(MedicalFilesApi.deleteMedicalRecord).toHaveBeenCalledWith(MEDICAL_RECORD_TO_CREATE_ID)
  expect(within(screen.getByTestId('alert-snackbar')).getByText('Medical record successfully deleted'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(medicalFilesWidget).toHaveTextContent('Medical filesPrescriptionsPrescription_2022-01-02Medical recordsMedical_record_2022-01-02New')
}

export const checkMedicalWidgetForHcp = async (): Promise<void> => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const medicalFilesWidget = dashboard.getByTestId('medical-files-card')
  expect(medicalFilesWidget).toHaveTextContent('Medical filesPrescriptionsPrescription_2022-01-02Medical recordsMedical_record_2022-01-02New')
  await checkMedicalRecordCancel(medicalFilesWidget)
  await checkMedicalRecordCreate(medicalFilesWidget)
  await checkMedicalRecordUpdate(medicalFilesWidget)
  await checkMedicalRecordConsult(medicalFilesWidget)
  await checkMedicalRecordDelete(medicalFilesWidget)
}

export const checkMedicalWidgetForPatient = async (): Promise<void> => {
  const dashboard = within(screen.getByTestId('patient-dashboard'))
  const medicalFilesWidget = dashboard.getByTestId('medical-files-card')
  expect(medicalFilesWidget).toHaveTextContent('Medical filesPrescriptionsPrescription_2022-01-02Medical recordsMedical_record_2022-01-02')
  await checkMedicalRecordConsult(medicalFilesWidget)
}
