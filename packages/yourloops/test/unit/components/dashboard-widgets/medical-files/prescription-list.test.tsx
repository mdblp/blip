/*
 * Copyright (c) 2022, Diabeloop
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

import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import PrescriptionList from '../../../../../components/dashboard-widgets/medical-files/prescription-list'
import MedicalFilesApi from '../../../../../lib/medical-files/medical-files-api'
import { Prescription } from '../../../../../lib/medical-files/model'
import * as authHookMock from '../../../../../lib/auth'
import User from '../../../../../lib/auth/user'

jest.mock('../../../../../lib/auth')
describe('Prescription list', () => {
  const prescription: Prescription = {
    id: 'fakeId',
    name: 'new prescription',
    patientId: 'patientId',
    teamId: 'teamId',
    prescriptorId: 'prescriptorId',
    link: 'zelda',
    uploadedAt: '2022-02-02'
  }
  const getPrescriptionsSpy = () => {
    return jest.spyOn(MedicalFilesApi, 'getPrescriptions').mockResolvedValue([prescription])
  }
  const getPrescriptionSpy = () => {
    return jest.spyOn(MedicalFilesApi, 'getPrescription').mockResolvedValue({} as Blob)
  }

  async function renderComponent() {
    render(<PrescriptionList patientId="patientId" teamId="teamId" />)
    await waitFor(() => expect(getPrescriptionsSpy()).toHaveBeenCalled())
  }

  beforeEach(() => {
    getPrescriptionSpy()
    getPrescriptionsSpy();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true } as User }
    })
  })

  it('should render an empty list if no medical records are saved', async () => {
    getPrescriptionsSpy().mockResolvedValueOnce([])
    await renderComponent()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('should render a list if some medical records are saved', async () => {
    await renderComponent()
    expect(screen.queryAllByRole('listitem')).toHaveLength(1)
  })

  it('should download prescriptions as a pdf when clicking on a list item', async () => {
    const createObjectURLMock = jest.fn().mockReturnValue('fake/url')
    window.URL.createObjectURL = createObjectURLMock
    await renderComponent()
    const listItem = screen.getByRole('listitem', { name: 'prescription-fakeId' })
    fireEvent.click(listItem)
    expect(getPrescriptionSpy()).toHaveBeenCalled()
    await waitFor(() => expect(createObjectURLMock).toHaveBeenCalled())
  })
})
