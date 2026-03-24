/*
 * Copyright (c) 2026, Diabeloop
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

import { screen, waitFor, within } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event/dist/cjs/index.js'
import { LeadCliniciansApi } from '../../../lib/lead-clinicians/lead-clinicians.api'
import { patient2Id } from '../data/patient.api.data'
import { userTimId, userYdrisId } from '../mock/auth0.hook.mock'

export const testCliniciansEmptyList = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  expect(cliniciansSection.getByText('Lead clinicians')).toBeVisible()
  expect(cliniciansSection.getByText('The lead clinicians are the healthcare providers managing the treatment, who should be contacted in case of need.')).toBeVisible()
  expect(cliniciansSection.getByRole('button', { name: 'Add a clinician' })).toBeEnabled()
  expect(screen.queryByTestId('clinicians-table')).not.toBeInTheDocument()
}

export const testCliniciansOneClinician = async () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  expect(cliniciansSection.getByText('Lead clinicians')).toBeVisible()
  expect(cliniciansSection.getByText('The lead clinicians are the healthcare providers managing the treatment, who should be contacted in case of need.')).toBeVisible()
  expect(cliniciansSection.getByRole('button', { name: 'Add a clinician' })).toBeEnabled()

  const cliniciansTable = screen.getByTestId('clinicians-table')
  expect(cliniciansTable).toHaveTextContent('NameProfessionEmailActionsTCTim CanuNursetim.canu@example.com')
  expect(within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')).toBeVisible()
  const removeButton = within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')
  await userEvent.hover(removeButton)
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Remove clinician')
  await userEvent.unhover(removeButton)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
}

export const testCliniciansFiveClinicians = async () => {
  const allowHoverOnDisabledElementConfig = { pointerEventsCheck: PointerEventsCheckLevel.Never }

  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  expect(cliniciansSection.getByText('Lead clinicians')).toBeVisible()
  expect(cliniciansSection.getByText('The lead clinicians are the healthcare providers managing the treatment, who should be contacted in case of need.')).toBeVisible()

  const addClinicianButton = cliniciansSection.getByRole('button', { name: 'Add a clinician' })
  expect(addClinicianButton).toBeDisabled()
  await userEvent.hover(addClinicianButton, allowHoverOnDisabledElementConfig)
  expect(await screen.findByRole('tooltip')).toHaveTextContent('A patient can only have up to 5 clinicians')
  await userEvent.unhover(addClinicianButton, allowHoverOnDisabledElementConfig)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const cliniciansTable = screen.getByTestId('clinicians-table')
  expect(cliniciansTable).toHaveTextContent('NameProfessionEmailActionsCFClinician FourNurseclinician.four@example.comCNClinician Number fiveDiabetologistclinician.five@example.comHRHugo RodriguesDiabetologisthugo.rodrigues@example.comTCTim CanuNursetim.canu@example.comYRYdris RebibaneOtherydris.rebibane@example.com')
  expect(within(cliniciansTable).getByLabelText('Remove clinician Clinician Four')).toBeVisible()
  expect(within(cliniciansTable).getByLabelText('Remove clinician Clinician Number five')).toBeVisible()
  expect(within(cliniciansTable).getByLabelText('Remove clinician Hugo Rodrigues')).toBeVisible()
  expect(within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')).toBeVisible()
  expect(within(cliniciansTable).getByLabelText('Remove clinician Ydris Rebibane')).toBeVisible()
}

export const testPatientRemoveClinician = async () => {
  const cliniciansTable = screen.getByTestId('clinicians-table')
  const removeClinicianButton = within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')
  await userEvent.click(removeClinicianButton)

  const dialog = screen.getByTestId('remove-clinician-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('Remove clinicianDo you want to remove Tim Canu from your lead clinicians?CancelRemove clinician')

  await testRemoveClinicianSuccess()
}

export const testHcpRemoveClinician = async () => {
  const cliniciansTable = screen.getByTestId('clinicians-table')
  const removeClinicianButton = within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')
  await userEvent.click(removeClinicianButton)

  const dialog = screen.getByTestId('remove-clinician-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('Remove clinicianDo you want to remove Tim Canu from the lead clinicians of patient Rouis Patient2?CancelRemove clinician')

  await testRemoveClinicianSuccess()
}

export const testPatientAddClinician = async () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a clinician' })
  await userEvent.click(addButton)

  const dialog = screen.getByTestId('add-clinician-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('Add a lead clinicianSelect the name of the clinician to add them as your lead clinician:Clinician name​Clinician nameEntering a lead clinician allows you to identify the professionals to contact in case of need.')

  await testAddClinicianSuccess(true)
}

export const testHcpAddClinician = async () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a clinician' })
  await userEvent.click(addButton)

  const dialog = screen.getByTestId('add-clinician-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('Add a lead clinicianSelect the name of the clinician to add them as a lead clinician of Rouis Patient2:Clinician name​Clinician nameEntering a lead clinician allows you to identify the professionals to contact in case of need.')

  await testAddClinicianSuccess(false)
}

export const testRemoveClinicianError = async () => {
  const cliniciansTable = screen.getByTestId('clinicians-table')
  const removeClinicianButton = within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')
  await userEvent.click(removeClinicianButton)

  const dialog = screen.getByTestId('remove-clinician-dialog')
  expect(dialog).toBeVisible()
  const confirmButton = within(screen.getByTestId('remove-clinician-dialog')).getByRole('button', { name: 'Remove clinician' })
  await userEvent.click(confirmButton)

  expect(screen.queryByTestId('remove-clinician-dialog')).not.toBeInTheDocument()

  expect(LeadCliniciansApi.removeClinician).toHaveBeenCalledWith(patient2Id, userTimId)

  const errorAlert = await screen.findByText('An error occurred, please try again later.')
  expect(errorAlert).toBeVisible()
}

export const testAddClinicianError = async () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a clinician' })
  await userEvent.click(addButton)

  const dialog = screen.getByTestId('add-clinician-dialog')
  expect(dialog).toBeVisible()
  const addClinicianButton = within(screen.getByTestId('add-clinician-dialog')).getByRole('button', { name: 'Add clinician' })
  const clinicianSelect = within(screen.getByTestId('add-clinician-dialog')).getByLabelText('Clinician name')
  await userEvent.click(clinicianSelect)
  const clinicianOption = within(screen.getByRole('listbox')).getByText('Ydris Rebibane')
  await userEvent.click(clinicianOption)
  await userEvent.click(addClinicianButton)

  expect(LeadCliniciansApi.addClinician).toHaveBeenCalledWith(patient2Id, userYdrisId)

  const errorAlert = await screen.findByText('An error occurred, please try again later.')
  expect(errorAlert).toBeVisible()
}

const testRemoveClinicianSuccess = async () => {
  const cliniciansTable = screen.getByTestId('clinicians-table')
  const removeClinicianButton = within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')

  const cancelButton = within(screen.getByTestId('remove-clinician-dialog')).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(screen.queryByTestId('remove-clinician-dialog')).not.toBeInTheDocument()

  await userEvent.click(removeClinicianButton)
  const confirmButton = within(screen.getByTestId('remove-clinician-dialog')).getByRole('button', { name: 'Remove clinician' })
  expect(confirmButton).toBeVisible()
  await userEvent.click(confirmButton)

  expect(LeadCliniciansApi.removeClinician).toHaveBeenCalledTimes(1)
  expect(LeadCliniciansApi.removeClinician).toHaveBeenCalledWith(patient2Id, userTimId)

  expect(screen.queryByTestId('remove-clinician-dialog')).not.toBeInTheDocument()

  const successAlert = await screen.findByText('Clinician removed successfully')
  expect(successAlert).toBeVisible()
}

const testAddClinicianSuccess = async (isPatient: boolean) => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a clinician', hidden: true })

  const cancelButton = within(screen.getByTestId('add-clinician-dialog')).getByRole('button', { name: 'Cancel' })
  expect(cancelButton).toBeEnabled()
  expect(within(screen.getByTestId('add-clinician-dialog')).getByRole('button', { name: 'Add clinician' })).toBeDisabled()

  await userEvent.click(cancelButton)
  expect(screen.queryByTestId('add-clinician-dialog')).not.toBeInTheDocument()

  await userEvent.click(addButton)
  expect(screen.getByTestId('add-clinician-dialog')).toBeVisible()
  const addClinicianButton = within(screen.getByTestId('add-clinician-dialog')).getByRole('button', { name: 'Add clinician' })
  expect(addClinicianButton).toBeDisabled()

  const clinicianSelect = within(screen.getByTestId('add-clinician-dialog')).getByLabelText('Clinician name')
  await userEvent.click(clinicianSelect)

  const clinicianOptions = within(screen.getByRole('listbox')).getAllByRole('option')
  expect(clinicianOptions).toHaveLength(3)
  // The options differ between HCP and patient as:
  // - The patient sees HCP from multiple teams
  // - The HCP only sees clinicians from their team (which doesn't include the Yourloops UI user)
  // but we add the "loggedInUser" (named Yann Blanc) in the mock for HCP tests
  if (isPatient) {
    expect(clinicianOptions[0]).toHaveTextContent('Hugo Rodrigues')
    expect(clinicianOptions[1]).toHaveTextContent('Ydris Rebibane')
    expect(clinicianOptions[2]).toHaveTextContent('Yourloops UI 28.0 HCP 0')
  } else {
    expect(clinicianOptions[0]).toHaveTextContent('Hugo Rodrigues')
    expect(clinicianOptions[1]).toHaveTextContent('Yann Blanc')
    expect(clinicianOptions[2]).toHaveTextContent('Ydris Rebibane')
  }

  const clinicianOption = within(screen.getByRole('listbox')).getByText('Ydris Rebibane')
  await userEvent.click(clinicianOption)
  expect(addClinicianButton).toBeEnabled()

  await userEvent.click(addClinicianButton)
  expect(LeadCliniciansApi.addClinician).toHaveBeenCalledWith(patient2Id, userYdrisId)

  const successAlert = await screen.findByText('Clinician added successfully')
  expect(successAlert).toBeVisible()
}
