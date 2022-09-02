import { useEffect, useState } from 'react'
import { useTeam } from '../../lib/team'
import { useAuth } from '../../lib/auth'
import { useQueryParams } from '../../lib/custom-hooks'
import { MainDrawerProps } from './main-drawer'
import { PatientFilterStats } from '../../lib/team/models'

interface MainDrawerHookReturn {
  fullDrawer: boolean
  onHover: boolean
  setOnHover: Function
  patientFiltersStats: PatientFilterStats
  numberOfFlaggedPatients: number
  loggedUserIsHcpInMonitoring: boolean
  selectedFilter: string | null
}

const useMainDrawer = ({ miniVariant }: MainDrawerProps): MainDrawerHookReturn => {
  const [fullDrawer, setFullDrawer] = useState<boolean>(!miniVariant)
  const [onHover, setOnHover] = useState<boolean>(false)
  const teamHook = useTeam()
  const authHook = useAuth()
  const queryParams = useQueryParams()
  const patientFiltersStats = teamHook.patientsFilterStats
  const numberOfFlaggedPatients = authHook.getFlagPatients().length
  const loggedUserIsHcpInMonitoring = !!(authHook.user?.isUserHcp() && teamHook.getRemoteMonitoringTeams().find(team => team.members.find(member => member.user.userid === authHook.user?.id)))
  const selectedFilter: string | null = queryParams.get('filter')

  useEffect(() => setFullDrawer(!miniVariant), [miniVariant])

  return {
    fullDrawer,
    onHover,
    setOnHover,
    patientFiltersStats,
    numberOfFlaggedPatients,
    loggedUserIsHcpInMonitoring,
    selectedFilter
  }
}

export default useMainDrawer
