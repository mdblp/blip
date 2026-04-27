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

import { Team, TeamMember, useTeam } from '../../../../../../../lib/team'
import { useAuth } from '../../../../../../../lib/auth'
import { useParams } from 'react-router-dom'
import { LeadCliniciansApi } from '../../../../../../../lib/lead-clinicians/lead-clinicians.api'
import { useAlert } from '../../../../../../../components/utils/snackbar'
import { useTranslation } from 'react-i18next'
import { errorTextFromException } from '../../../../../../../lib/utils'
import { logError } from '../../../../../../../utils/error.util'
import { UserInviteStatus } from '../../../../../../../lib/team/models/enums/user-invite-status.enum'

interface AddClinicianDialogHookProps {
  patientId: string
  clinicianIds: string[]
  selectedHcpId: string
  onSuccess: () => void
  onClose: () => void
}

interface AddClinicianDialogHookReturn {
  getAvailableHcps: () => TeamMember[]
  onClickAddClinician: () => Promise<void>
}

export const useAddClinicianDialog = (props: AddClinicianDialogHookProps): AddClinicianDialogHookReturn => {
  const { patientId, clinicianIds, selectedHcpId, onSuccess, onClose } = props
  const { user } = useAuth()
  const { teamId } = useParams()
  const { getTeam, teams } = useTeam()
  const alert = useAlert()
  const { t } = useTranslation()

  const getValidMembers = (hcps: TeamMember[]): TeamMember[] => {
    return hcps
      .filter((hcp: TeamMember) => !clinicianIds.includes(hcp.userId))
      .filter((hcp: TeamMember) => hcp.status === UserInviteStatus.Accepted)
  }

  const isHcpInList = (hcpId: string, members: TeamMember[]): boolean => {
    return members.some((member) => member.userId === hcpId)
  }

  const getAvailableHcps = (): TeamMember[] => {
    if (user.isUserHcp()) {
      const selectedTeam = getTeam(teamId)

      return getValidMembers(selectedTeam.members)
    }

    if (user.isUserPatient()) {
      const allHcpsHavingAccessToPatient = teams.reduce((acc: TeamMember[], team: Team) => {
        team.members?.forEach((currentTeamMember) => {
          if (!isHcpInList(currentTeamMember.userId, acc)) {
            acc.push(currentTeamMember)
          }
        })
        return acc
      }, [])

      return getValidMembers(allHcpsHavingAccessToPatient)
    }

    return []
  }

  const onClickAddClinician = async () => {
    try {
      await LeadCliniciansApi.addClinician(patientId, selectedHcpId)
      alert.success(t('clinician-add-success'))

      onSuccess()
    } catch (err) {
      const errorMessage = errorTextFromException(err)
      logError(errorMessage, 'add-clinician')

      alert.error(t('error-occurred'))
      onClose()
    }
  }

  return {
    getAvailableHcps,
    onClickAddClinician
  }
}
