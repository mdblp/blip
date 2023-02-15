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
import { patientListCommonStyle } from './table'
import { useAuth } from '../../lib/auth'
import { type ClassNameMap } from '@mui/material'
import { type Patient } from '../../lib/patient/models/patient.model'

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
  const { classes: patientListCommonClasses } = patientListCommonStyle()
  const isFlagged = getFlagPatients().includes(patient.userid)

  const computeRowInformation = (): ComputedRow => {
    const mediumCellWithAlertClasses = `${classes.typography} ${patientListCommonClasses.mediumCell} ${classes.alert}`
    const mediumCellClasses = `${classes.typography} ${patientListCommonClasses.mediumCell}`
    const largeCellWithAlertClasses = `${classes.typography} ${classes.alert} ${patientListCommonClasses.largeCell}`
    const largeCellClasses = `${classes.typography} ${patientListCommonClasses.largeCell}`

    const timeSpentAwayFromTargetActive = patient.monitoringAlerts?.timeSpentAwayFromTargetActive ? patient.monitoringAlerts?.timeSpentAwayFromTargetActive : false
    const frequencyOfSevereHypoglycemiaActive = patient.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive ? patient.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive : false
    const nonDataTransmissionActive = patient.monitoringAlerts?.nonDataTransmissionActive ? patient.monitoringAlerts?.nonDataTransmissionActive : false
    const hasAlert = timeSpentAwayFromTargetActive || frequencyOfSevereHypoglycemiaActive || nonDataTransmissionActive

    const patientFullNameClasses = isUserHcp && hasAlert ? largeCellWithAlertClasses : largeCellClasses
    const timeSpentAwayFromTargetRateClasses = isUserHcp && timeSpentAwayFromTargetActive ? mediumCellWithAlertClasses : mediumCellClasses
    const frequencyOfSevereHypoglycemiaRateClasses = isUserHcp && frequencyOfSevereHypoglycemiaActive ? mediumCellWithAlertClasses : mediumCellClasses
    const dataNotTransferredRateClasses = isUserHcp && nonDataTransmissionActive ? mediumCellWithAlertClasses : mediumCellClasses

    return {
      patientSystem: patient.settings.system ?? trNA,
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
