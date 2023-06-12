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

import HttpService, { ErrorMessageStatus } from '../../../../lib/http/http.service'
import { type AxiosResponse } from 'axios'
import { type INotification } from '../../../../lib/notifications/models/i-notification.model'
import { getCurrentLang } from '../../../../lib/language'
import PatientApi from '../../../../lib/patient/patient.api'
import { type ITeamMember } from '../../../../lib/team/models/i-team-member.model'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { HttpHeaderKeys } from '../../../../lib/http/models/enums/http-header-keys.enum'
import { type Patient } from '../../../../lib/patient/models/patient.model'

describe('PatientApi', () => {
  const userId = 'userId'
  const teamId = 'teamId'
  const email = 'email@test.com'

  describe('getPatients', () => {
    it('should get a list a patients', async () => {
      const data: ITeamMember[] = [
        { email: 'member1@team.com' } as ITeamMember,
        { email: 'member2@team.com' } as ITeamMember
      ]
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)

      const patients = await PatientApi.getPatients()
      expect(patients).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({ url: '/v0/my-patients' })
    })

    it('should return an empty array if not found', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error(ErrorMessageStatus.NotFound))
      const response = await PatientApi.getPatients()
      expect(response).toEqual([])
    })

    it('should throw an error if http call failed', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await PatientApi.getPatients()
      }).rejects.toThrowError('This error was thrown by a mock on purpose')
    })
  })

  describe('invitePatient', () => {
    it('should invite a new patient in a team and get a notification if success', async () => {
      const data = { creatorId: 'creatorId' } as INotification
      jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data } as AxiosResponse)

      const notification = await PatientApi.invitePatient({ teamId, email })
      expect(notification).toEqual(data)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: '/confirm/send/team/invite',
        payload: { teamId, email, role: UserRole.Patient },
        config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } }
      }, [409])
    })
  })

  describe('removePatient', () => {
    it('should remove a patient from a team', async () => {
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)
      await PatientApi.removePatient(teamId, userId)
      expect(HttpService.delete).toHaveBeenCalledWith({ url: `/crew/v0/teams/${teamId}/patients/${userId}` })
    })
  })
})
