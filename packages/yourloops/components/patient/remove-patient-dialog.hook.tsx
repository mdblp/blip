import { useTranslation } from 'react-i18next'
import { UserInvitationStatus } from '../../models/generic'
import { useEffect, useState } from 'react'
import { useAlert } from '../utils/snackbar'
import { usePatientContext } from '../../lib/patient/provider'
import { Team, useTeam } from '../../lib/team'
import { Patient } from '../../lib/data/patient'
import TeamUtils from '../../lib/team/utils'

interface RemovePatientDialogHookProps {
  onClose: () => void
  patient: Patient
}

interface RemovePatientDialogHookReturn {
  handleOnClickRemove: () => Promise<void>
  patientName: string
  processing: boolean
  selectedTeamId: string
  setSelectedTeamId: Function
  sortedTeams: Team[]
}

const useRemovePatientDialog = ({ patient, onClose }: RemovePatientDialogHookProps): RemovePatientDialogHookReturn => {
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { removePatient } = usePatientContext()
  const { getTeam } = useTeam()

  const [selectedTeamId, setSelectedTeamId] = useState<string>('')
  const [processing, setProcessing] = useState<boolean>(false)

  const userName = patient ? {
    firstName: patient.profile.firstName,
    lastName: patient.profile.lastName
  } : { firstName: '', lastName: '' }
  const patientName = t('user-name', userName)
  const patientTeam = patient.teams.find(team => team.teamId === selectedTeamId)
  const teams = patient.teams.map(team => getTeam(team.teamId))

  const getSuccessAlertMessage = (): void => {
    if (patientTeam.status === UserInvitationStatus.pending) {
      alert.success(t('alert-remove-patient-pending-invitation-success'))
      return
    }
    const team = getTeam(selectedTeamId)
    if (team.code === 'private') {
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

  const sortedTeams = TeamUtils.sortTeams(teams)

  useEffect(() => {
    if (teams?.length === 1 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id)
    }
  }, [selectedTeamId, teams])

  return { sortedTeams, processing, selectedTeamId, patientName, handleOnClickRemove, setSelectedTeamId }
}

export default useRemovePatientDialog
