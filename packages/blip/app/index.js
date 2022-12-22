/**
 * Copyright (c) 2021, Diabeloop
 * Minimum Redux implementation for blip v1 compat
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

/**
 * @typedef { import('redux').Store } Store
 */

import * as React from 'react'
import PropTypes from 'prop-types'
import bows from 'bows'
import { Provider } from 'react-redux'
import { useHistory } from 'react-router-dom'

import '../../viz/src/styles/colors.css'
import '../../tideline/css/tideline.less'
import './style.less'

import { updateConfig } from './config'
import { cleanStore, initStore } from './redux'
import PatientData from './components/patient-data'

const log = bows('Blip')

/**
 * @param {import('./index').BlipProperties} props For blip view
 */
function ReduxProvider(props) {
  const store = initStore()
  const historyHook = useHistory()
  return (
    <Provider store={store}>
      <PatientData
        key={props.patient.userid}
        api={props.api}
        store={store}
        patient={props.patient}
        setPatient={props.setPatient}
        patients={props.patients}
        userIsHCP={props.userIsHCP}
        isSelectedTeamMedical={props.isSelectedTeamMedical}
        prefixURL={props.prefixURL}
        history={historyHook}
        dialogDatePicker={props.dialogDatePicker}
        dialogRangeDatePicker={props.dialogRangeDatePicker}
        dialogPDFOptions={props.dialogPDFOptions}
        patientInfoWidget={props.patientInfoWidget}
        chatWidget={props.chatWidget}
        alarmCard={props.alarmCard}
        medicalFilesWidget={props.medicalFilesWidget}
      />
    </Provider>
  )
}

ReduxProvider.propTypes = {
  api: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  setPatient: PropTypes.func.isRequired,
  patients: PropTypes.array.isRequired,
  userIsHCP: PropTypes.bool.isRequired,
  isSelectedTeamMedical: PropTypes.bool.isRequired,
  prefixURL: PropTypes.string.isRequired,
  dialogDatePicker: PropTypes.func.isRequired,
  dialogRangeDatePicker: PropTypes.func.isRequired,
  dialogPDFOptions: PropTypes.func.isRequired,
  patientInfoWidget: PropTypes.func.isRequired,
  chatWidget: PropTypes.func.isRequired,
  alarmCard: PropTypes.func.isRequired,
  medicalFilesWidget: PropTypes.func.isRequired
}

/**
 * @param {import('./index').BlipProperties} props For blip view
 */
function Blip(props) {
  if (typeof props === 'object') {
    try {
      const { config, api, patient, setPatient, patients, userIsHCP, isSelectedTeamMedical, prefixURL, dialogDatePicker, dialogRangeDatePicker, dialogPDFOptions, chatWidget, alarmCard, patientInfoWidget, medicalFilesWidget } = props
      updateConfig(config)

      return (
        <ReduxProvider
          api={api}
          patient={patient}
          patients={patients}
          setPatient={setPatient}
          userIsHCP={userIsHCP}
          isSelectedTeamMedical={isSelectedTeamMedical}
          prefixURL={prefixURL}
          dialogDatePicker={dialogDatePicker}
          dialogRangeDatePicker={dialogRangeDatePicker}
          dialogPDFOptions={dialogPDFOptions}
          patientInfoWidget={patientInfoWidget}
          chatWidget={chatWidget}
          alarmCard={alarmCard}
          medicalFilesWidget={medicalFilesWidget}
        />
      )
    } catch (err) {
      log.error(err)
    }
  } else {
    log.error('Blip: Missing props')
  }
  return null
}

Blip.propTypes = {
  config: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  setPatient: PropTypes.func.isRequired,
  patients: PropTypes.array.isRequired,
  userIsHCP: PropTypes.bool.isRequired,
  isSelectedTeamMedical: PropTypes.bool.isRequired,
  prefixURL: PropTypes.string.isRequired,
  dialogDatePicker: PropTypes.func.isRequired,
  dialogRangeDatePicker: PropTypes.func.isRequired,
  dialogPDFOptions: PropTypes.func.isRequired,
  patientInfoWidget: PropTypes.func.isRequired,
  chatWidget: PropTypes.func.isRequired,
  alarmCard: PropTypes.func.isRequired,
  medicalFilesWidget: PropTypes.func.isRequired
}

export { cleanStore }
export default Blip
