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

import { act, screen, within } from '@testing-library/react'
import { monitoredPatient, unmonitoredPatient } from '../data/patient.api.data'
import userEvent from '@testing-library/user-event'
import { myThirdTeamId, myThirdTeamName } from '../mock/team.api.mock'
import PatientApi from '../../../lib/patient/patient.api'
import DirectShareApi from '../../../lib/share/direct-share.api'
import { loggedInUserId } from '../mock/auth0.hook.mock'

export const checkRemovePatientPrivateDialogContent = async () => {
  const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
  await userEvent.click(removeButton)
  const removeDialog = screen.getByRole('dialog')

  const dialogTitle = within(removeDialog).getByText(`Remove ${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} from My private practice`)
  expect(dialogTitle).toBeVisible()
  const dialogQuestion = within(removeDialog).getByTestId('modal-remove-patient-question')
  expect(dialogQuestion).toHaveTextContent(`Are you sure you want to remove ${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} from My private practice?`)
  const dialogInfo = within(removeDialog).getByText('You will no longer have access to their data.')
  expect(dialogInfo).toBeVisible()
  const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })
  expect(confirmRemoveButton).toBeVisible()
  const cancelButton = within(removeDialog).getByText('Cancel')
  expect(cancelButton).toBeVisible()
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemovePatientMedicalTeamDialogContent = async () => {
  const removeButton = screen.getByRole('button', { name: `Remove patient ${unmonitoredPatient.profile.email}` })
  expect(removeButton).toBeVisible()

  await userEvent.click(removeButton)

  const removeDialog = screen.getByRole('dialog')
  expect(removeDialog).toBeVisible()

  const title = within(removeDialog).getByText(`Remove ${unmonitoredPatient.profile.fullName} from ${myThirdTeamName}`)
  expect(title).toBeVisible()
  const question = within(removeDialog).getByTestId('modal-remove-patient-question')
  expect(question).toHaveTextContent(`Are you sure you want to remove ${unmonitoredPatient.profile.fullName} from ${myThirdTeamName}?`)
  const info = within(removeDialog).getByText('You and the care team will no longer have access to their data.')
  expect(info).toBeVisible()
  const alertInfo = within(removeDialog).getByText('If you want to remove the patient from another care team, you must first select the care team from the dropdown menu at the top right of YourLoops.')
  expect(alertInfo).toBeVisible()
  const cancelButton = within(removeDialog).getByText('Cancel')
  expect(cancelButton).toBeVisible()
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemovePatientMedicalTeamConfirm = async () => {
  const removeButton = screen.getByRole('button', { name: `Remove patient ${unmonitoredPatient.profile.email}` })
  expect(removeButton).toBeVisible()

  await userEvent.click(removeButton)

  expect(screen.queryByRole('dialog')).toBeVisible()
  const removeDialog = screen.getByRole('dialog')
  expect(removeDialog).toBeVisible()
  const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

  await userEvent.click(confirmRemoveButton)

  expect(PatientApi.removePatient).toHaveBeenCalledWith(myThirdTeamId, unmonitoredPatient.userid)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${unmonitoredPatient.profile.firstName} ${unmonitoredPatient.profile.lastName} is no longer a member of ${myThirdTeamName}`)
}

export const checkRemovePatientMedicalTeamError = async () => {
  jest.spyOn(PatientApi, 'removePatient').mockRejectedValueOnce(Error('Remove patient error: This error was thrown by a mock on purpose'))
  const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
  await userEvent.click(removeButton)
  const removeDialog = screen.getByRole('dialog')
  const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

  await act(async () => {
    await userEvent.click(confirmRemoveButton)
  })
  expect(PatientApi.removePatient).toHaveBeenCalledWith(myThirdTeamId, monitoredPatient.userid)
  expect(screen.getByRole('dialog')).toBeVisible()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  const cancelButton = within(removeDialog).getByRole('button', { name: 'Cancel' })

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemovePatientPrivateConfirm = async () => {
  const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
  await userEvent.click(removeButton)
  const removeDialog = screen.getByRole('dialog')

  const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })
  expect(confirmRemoveButton).toBeVisible()

  await userEvent.click(confirmRemoveButton)

  expect(DirectShareApi.removeDirectShare).toHaveBeenCalledWith(monitoredPatient.userid, loggedInUserId)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`Direct data sharing with ${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} has been removed`)
}
