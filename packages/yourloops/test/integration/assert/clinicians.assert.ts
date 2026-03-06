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

export const testPatientRemoveClinician = () => {
  const cliniciansTable = screen.getByTestId('clinicians-table')
  const removeClinicianButton = within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')
  removeClinicianButton.click()

  const dialog = screen.getByTestId('remove-clinician-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('zzz')
}

export const testHcpRemoveClinician = async () => {
  const cliniciansTable = screen.getByTestId('clinicians-table')
  const removeClinicianButton = within(cliniciansTable).getByLabelText('Remove clinician Tim Canu')
  await userEvent.click(removeClinicianButton)

  const dialog = screen.getByTestId('remove-clinician-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent('Remove clinicianDo you want to remove Tim Canu from the lead clinicians of patient Rouis Patient2?CancelRemove clinician')

  const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(dialog).not.toBeInTheDocument()

  await userEvent.click(removeClinicianButton)
  const confirmButton = within(dialog).getByRole('button', { name: 'Remove clinician' })
  await userEvent.click(confirmButton)
  // TODO Fix issue here
  await waitFor(() => {
    expect(screen.getByTestId('remove-clinician-dialog')).not.toBeInTheDocument()
  }, { timeout: 3000 })

  const successAlert = await screen.findByText('Clinician removed successfully')
  expect(successAlert).toBeVisible()

}

export const testPatientAddClinician = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a clinician' })
  expect(addButton).toBeVisible()
}

export const testHcpAddClinician = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a clinician' })
  expect(addButton).toBeVisible()
}
