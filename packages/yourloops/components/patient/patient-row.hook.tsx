import moment from 'moment'
import { ClassNameMap } from '@material-ui/styles/withStyles'
import { useTranslation } from 'react-i18next'
import { Patient } from '../../lib/data/patient'
import { patientListCommonStyle } from './table'
import { useAuth } from '../../lib/auth'
import { Monitoring } from '../../models/monitoring'

interface PatientRowHookProps {
  classes: ClassNameMap
  patient: Patient
}

interface PatientRowHookReturn {
  computeRowInformation: () => ComputedRow
  flagPatient: () => Promise<void>
  isFlagged: boolean
  isUserHcp: boolean
  isUserCaregiver: boolean
  trNA: string
}

interface ComputedRow {
  patientSystem: string
  patientRemoteMonitoring: string
  timeSpentAwayFromTargetActive: boolean
  frequencyOfSevereHypoglycemiaActive: boolean
  nonDataTransmissionActive: boolean
  patientFullNameClasses: string
  timeSpentAwayFromTargetRateClasses: string
  frequencyOfSevereHypoglycemiaRateClasses: string
  dataNotTransferredRateClasses: string
}

const usePatientRow = ({ patient, classes }: PatientRowHookProps): PatientRowHookReturn => {
  const { t } = useTranslation('yourloops')
  const { user, flagPatient: flagPatientAuth, getFlagPatients } = useAuth()
  const trNA = t('N/A')
  const isUserHcp = user?.isUserHcp()
  const isUserCaregiver = user?.isUserCaregiver()
  const patientIsMonitored = patient.monitoring?.enabled
  const patientListCommonClasses = patientListCommonStyle()
  const isFlagged = getFlagPatients().includes(patient.userid)

  const getMonitoringLabel = (monitoring: Monitoring): string => {
    if (!monitoring?.enabled) {
      return t('no')
    }
    if (monitoring.monitoringEnd) {
      const enDate = moment.utc(patient.monitoring.monitoringEnd).format(moment.localeData().longDateFormat('ll')).toString()
      return `${t('yes')}\n(${t('until')} ${enDate})`
    }
    return t('yes')
  }

  const computeRowInformation = (): ComputedRow => {
    const mediumCellWithAlertClasses = `${classes.typography} ${patientListCommonClasses.mediumCell} ${classes.alert}`
    const mediumCellClasses = `${classes.typography} ${patientListCommonClasses.mediumCell}`
    const largeCellWithAlertClasses = `${classes.typography} ${classes.alert} ${patientListCommonClasses.largeCell}`
    const largeCellClasses = `${classes.typography} ${patientListCommonClasses.largeCell}`

    const timeSpentAwayFromTargetActive = patientIsMonitored && patient.metadata.alarm?.timeSpentAwayFromTargetActive ? patient.metadata.alarm?.timeSpentAwayFromTargetActive : false
    const frequencyOfSevereHypoglycemiaActive = patientIsMonitored && patient.metadata.alarm?.frequencyOfSevereHypoglycemiaActive ? patient.metadata.alarm?.frequencyOfSevereHypoglycemiaActive : false
    const nonDataTransmissionActive = patientIsMonitored && patient.metadata.alarm?.nonDataTransmissionActive ? patient.metadata.alarm?.nonDataTransmissionActive : false
    const patientRemoteMonitoring = getMonitoringLabel(patient.monitoring)
    const hasAlert = timeSpentAwayFromTargetActive || frequencyOfSevereHypoglycemiaActive || nonDataTransmissionActive

    const patientFullNameClasses = isUserHcp && hasAlert ? largeCellWithAlertClasses : largeCellClasses
    const timeSpentAwayFromTargetRateClasses = isUserHcp && timeSpentAwayFromTargetActive ? mediumCellWithAlertClasses : mediumCellClasses
    const frequencyOfSevereHypoglycemiaRateClasses = isUserHcp && frequencyOfSevereHypoglycemiaActive ? mediumCellWithAlertClasses : mediumCellClasses
    const dataNotTransferredRateClasses = isUserHcp && nonDataTransmissionActive ? mediumCellWithAlertClasses : mediumCellClasses

    return {
      patientSystem: patient.settings.system ?? trNA,
      patientRemoteMonitoring,
      timeSpentAwayFromTargetActive,
      frequencyOfSevereHypoglycemiaActive,
      nonDataTransmissionActive,
      patientFullNameClasses,
      timeSpentAwayFromTargetRateClasses,
      frequencyOfSevereHypoglycemiaRateClasses,
      dataNotTransferredRateClasses
    }
  }

  const flagPatient = async (): Promise<void> => {
    await flagPatientAuth(patient.userid)
  }

  return {
    computeRowInformation,
    isFlagged,
    isUserHcp,
    isUserCaregiver,
    flagPatient,
    trNA
  }
}

export default usePatientRow
