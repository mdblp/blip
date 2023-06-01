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

import * as usePatientContextMock from '../../../../lib/patient/patient.provider'
import PatientAPI from '../../../../lib/patient/patient.api'
import { act, renderHook } from '@testing-library/react'
import {
  useCancelInvitePatientDialog
} from '../../../../components/patient/cancel-invite-patient-dialog/cancel-invite-patient-dialog.hook'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import * as alertMock from '../../../../components/utils/snackbar'
import { type Patient } from '../../../../lib/patient/models/patient.model'

jest.mock('../../../../lib/patient/patient.provider')
jest.mock('../../../../components/utils/snackbar')
describe('Cancel invite patient dialog hook', () => {
  jest.spyOn(PatientAPI, 'removePatient').mockResolvedValue(undefined)
  const removePatientMock = jest.fn()
  const onInfoMock = jest.fn()

  beforeEach(() => {
    (usePatientContextMock.usePatientContext as jest.Mock).mockImplementation(() => ({
      removePatient: removePatientMock
    }));
    (alertMock.useAlert as jest.Mock).mockImplementation(() => ({
      info: onInfoMock
    }))
  })

  describe('handleOnClickCancelInvite', () => {
    it('should show info alert when removing a pending patient (canceling an invite)', async () => {
      const patient = { profile: { email: 'patient@email.com ' }, invitationStatus: UserInviteStatus.Pending } as Patient
      const onClose = jest.fn()

      const { result } = renderHook(() => useCancelInvitePatientDialog({ patient, onClose }))
      await act(async () => {
        await result.current.handleOnClickCancelInvite()
      })

      expect(removePatientMock).toHaveBeenCalledWith(patient)
      expect(onInfoMock).toHaveBeenCalledWith('alert-remove-patient-pending-invite-success')
    })
  })
})
