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

import { useTranslation } from 'react-i18next'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useAlert } from '../utils/snackbar'
import { usePatientContext } from '../../lib/patient/patient.provider'
import { type Team, useTeam } from '../../lib/team'
import TeamUtils from '../../lib/team/team.util'
import { UserInvitationStatus } from '../../lib/team/models/enums/user-invitation-status.enum'
import { type Patient } from '../../lib/patient/models/patient.model'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'

interface RemovePatientDialogHookProps {
  onClose: () => void
  patient: Patient
}

interface RemovePatientDialogHookReturn {
  handleOnClickRemove: () => Promise<void>
  patientName: string
  processing: boolean
  selectedTeamId: string
  setSelectedTeamId: Dispatch<SetStateAction<string>>
  sortedTeams: Team[]
}

const useRemovePatientDialog = ({ patient, onClose }: RemovePatientDialogHookProps): RemovePatientDialogHookReturn => {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { removePatient } = usePatientContext()
  const { getTeam } = useTeam()
  const { selectedTeam } = useSelectedTeamContext()

  const [selectedTeamId, setSelectedTeamId] = useState<string>(selectedTeam.id)
  const [processing, setProcessing] = useState<boolean>(false)

  const userName = patient ? {
    firstName: patient.profile.firstName,
    lastName: patient.profile.lastName
  } : { firstName: '', lastName: '' }
  const patientName = t('user-name', userName)
  const patientTeam = patient.teams.find(team => team.teamId === selectedTeamId)
  const teams = patient.teams.map(team => getTeam(team.teamId))
  const sortedTeams = TeamUtils.sortTeamsByName(teams)

  const getSuccessAlertMessage = (): void => {
    if (patientTeam.status === UserInvitationStatus.pending) {
      alert.success(t('alert-remove-patient-pending-invitation-success'))
      return
    }
    const team = getTeam(selectedTeamId)
    if (TeamUtils.isPrivate(team)) {
      alert.success(t('alert-remove-private-practice-success', { patientName }))
    } else {
      alert.success(t('alert-remove-patient-from-team-success', { teamName: team.name, patientName }))
    }
  }

  const handleOnClickRemove = async (): Promise<void> => {
    try {
      setProcessing(true)
      await removePatient(patient, patientTeam)
      getSuccessAlertMessage()
      onClose()
    } catch (err) {
      alert.error(t('alert-remove-patient-failure'))
      setProcessing(false)
    }
  }

  useEffect(() => {
    if (teams?.length === 1 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id)
    }
  }, [selectedTeamId, teams])

  return { sortedTeams, processing, selectedTeamId, patientName, handleOnClickRemove, setSelectedTeamId }
}

export default useRemovePatientDialog
