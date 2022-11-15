import moment from 'moment'
import { ClassNameMap } from '@material-ui/styles/withStyles'
import { useTranslation } from 'react-i18next'
import { Patient } from '../../lib/data/patient'
import { patientListCommonStyle } from './table'
import { useAuth } from '../../lib/auth'

interface PatientRowHookProps {
  classes: ClassNameMap
  patient: Patient
}

interface PatientRowHookReturn {
  computeRowInformation: () => ComputedRow
  flagPatient: () => Promise<void>
  isFlagged: boolean
  isUserHcp: boolean
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
  const authHook = useAuth()
  const trNA = t('N/A')
  const isUserHcp = authHook.user?.isUserHcp()
  const patientIsMonitored = patient.monitoring?.enabled
  const patientListCommonClasses = patientListCommonStyle()
  const flaggedPatients = authHook.getFlagPatients()
  const isFlagged = flaggedPatients.includes(patient.userid)

  const computeRowInformation = (): ComputedRow => {
    const mediumCellWithAlertClasses = `${classes.typography} ${patientListCommonClasses.mediumCell} ${classes.alert}`
    const mediumCellWithClasses = `${classes.typography} ${patientListCommonClasses.mediumCell}`
    const timeSpentAwayFromTargetActive = patientIsMonitored && patient.alarms?.timeSpentAwayFromTargetActive ? patient.alarms?.timeSpentAwayFromTargetActive : false
    const frequencyOfSevereHypoglycemiaActive = patientIsMonitored && patient.alarms?.frequencyOfSevereHypoglycemiaActive ? patient.alarms?.frequencyOfSevereHypoglycemiaActive : false
    const nonDataTransmissionActive = patientIsMonitored && patient.alarms?.nonDataTransmissionActive ? patient.alarms?.nonDataTransmissionActive : false
    let patientRemoteMonitoring
    if (patient.monitoring?.enabled) {
      if (patient.monitoring.monitoringEnd) {
        const enDate = moment.utc(patient.monitoring.monitoringEnd).format(moment.localeData().longDateFormat('ll')).toString()
        patientRemoteMonitoring = `${t('yes')}\n(${t('until')} ${enDate})`
      } else {
        patientRemoteMonitoring = t('yes')
      }
    } else {
      patientRemoteMonitoring = t('no')
    }

    let patientFullNameClasses = `${classes.typography} ${patientListCommonClasses.largeCell}`
    let timeSpentAwayFromTargetRateClasses = mediumCellWithClasses
    let frequencyOfSevereHypoglycemiaRateClasses = mediumCellWithClasses
    let dataNotTransferredRateClasses = mediumCellWithClasses
    if (isUserHcp) {
      const hasAlert = timeSpentAwayFromTargetActive || frequencyOfSevereHypoglycemiaActive || nonDataTransmissionActive
      patientFullNameClasses = hasAlert ? `${classes.typography} ${classes.alert} ${patientListCommonClasses.largeCell}` : `${classes.typography} ${patientListCommonClasses.largeCell}`
      timeSpentAwayFromTargetRateClasses = timeSpentAwayFromTargetActive ? mediumCellWithAlertClasses : mediumCellWithClasses
      frequencyOfSevereHypoglycemiaRateClasses = frequencyOfSevereHypoglycemiaActive ? mediumCellWithAlertClasses : mediumCellWithClasses
      dataNotTransferredRateClasses = nonDataTransmissionActive ? mediumCellWithAlertClasses : mediumCellWithClasses
    }
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
    await authHook.flagPatient(patient.userid)
  }

  return {
    computeRowInformation,
    isFlagged,
    isUserHcp,
    flagPatient,
    trNA
  }
}

export default usePatientRow
