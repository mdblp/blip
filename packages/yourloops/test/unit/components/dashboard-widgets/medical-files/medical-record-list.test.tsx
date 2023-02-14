/*
 * Copyright (c) 2022-2023, Diabeloop
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
import { render, screen, waitFor } from '@testing-library/react'
import { buildTeam, buildTeamMember, createPatient } from '../../../common/utils'
import { type CategoryProps } from '../../../../../components/dashboard-widgets/medical-files/medical-files-widget'
import MedicalRecordList from '../../../../../components/dashboard-widgets/medical-files/medical-record-list'
import * as authHookMock from '../../../../../lib/auth'
import type User from '../../../../../lib/auth/models/user.model'
import MedicalFilesApi from '../../../../../lib/medical-files/medical-files.api'
import { type MedicalRecord } from '../../../../../lib/medical-files/model'
import { type MedicalRecordEditDialogProps } from '../../../../../components/dialogs/medical-record-edit-dialog'
import { type MedicalRecordDeleteDialogProps } from '../../../../../components/dialogs/medical-record-delete-dialog'

/* eslint-disable react/display-name */
jest.mock('../../../../../lib/auth')
jest.mock('../../../../../components/dialogs/medical-record-edit-dialog', () => (props: MedicalRecordEditDialogProps) => {
  return (
    <div aria-label="mock-edit-dialog">
      <button onClick={() => {
        props.onSaved({
          id: 'whateverId',
          authorId: 'whateverAuthorId',
          creationDate: new Date().toISOString(),
          patientId: 'patientId',
          teamId: 'teamId',
          diagnosis: 'diagnosis',
          progressionProposal: 'proposal',
          trainingSubject: 'trainingSubject'
        })
      }}>mock-save-button
      </button>
      <button onClick={() => {
        props.onClose()
      }}>mock-cancel-button
      </button>
    </div>
  )
})
jest.mock('../../../../../components/dialogs/medical-record-delete-dialog', () => (props: MedicalRecordDeleteDialogProps) => {
  return (
    <div aria-label="mock-delete-dialog">
      <button onClick={() => {
        props.onDelete('fakeId')
      }}>mock-delete-button
      </button>
      <button onClick={() => {
        props.onClose()
      }}>mock-cancel-button
      </button>
    </div>
  )
})

describe('Medical Record list', () => {
  const patient = createPatient('fakePatientId')
  const adminMember = buildTeamMember()
  const patientMember = buildTeamMember(patient.userid)
  const remoteMonitoringTeam = buildTeam('fakeTeamId', [adminMember, patientMember])
  const medicalRecords: MedicalRecord[] = [
    {
      id: 'fakeId',
      authorId: 'fakeAuthorId',
      creationDate: '2022-05-23',
      patientId: 'PatientId',
      teamId: 'teamId',
      diagnosis: 'diag1',
      progressionProposal: 'proposal1',
      trainingSubject: 'training1'
    },
    {
      id: 'fakeId2',
      authorId: 'fakeAuthorId2',
      creationDate: '2022-05-24',
      patientId: 'PatientId2',
      teamId: 'teamId2',
      diagnosis: 'diag2',
      progressionProposal: 'proposal2',
      trainingSubject: 'training2'
    }
  ]

  const getMedicalRecordsSpy = () => {
    return jest.spyOn(MedicalFilesApi, 'getMedicalRecords').mockResolvedValue([...medicalRecords])
  }

  function getMedicalRecordListJSX(props: CategoryProps = {
    patientId: patient.userid,
    teamId: remoteMonitoringTeam.id
  }): JSX.Element {
    return <MedicalRecordList {...props} />
  }

  async function renderComponent() {
    render(getMedicalRecordListJSX())
    await waitFor(() => {
      expect(getMedicalRecordsSpy()).toHaveBeenCalled()
    })
  }

  function checkListLength(length: number) {
    expect(screen.queryAllByRole('listitem')).toHaveLength(length)
  }

  beforeEach(() => {
    getMedicalRecordsSpy();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true } as User }
    })
  })

  it('should render an empty list if no medical records are saved', async () => {
    getMedicalRecordsSpy().mockResolvedValueOnce([])
    await renderComponent()
    checkListLength(0)
  })

  it('should render a list if some medical records are saved', async () => {
    await renderComponent()
    checkListLength(2)
  })
})
