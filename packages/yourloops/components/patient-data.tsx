/*
 * Copyright (c) 2021-2023, Diabeloop
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

import React from 'react'
import bows from 'bows'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'
import Container from '@mui/material/Container'

import Blip from 'blip'
import appConfig from '../lib/config/config'
import { useAuth } from '../lib/auth'
import { useData } from '../lib/data/data.hook'
import { setPageTitle } from '../lib/utils'

import DialogDatePicker from './date-pickers/dialog-date-picker'
import DialogRangeDatePicker from './date-pickers/dialog-range-date-picker'
import DialogPDFOptions from './dialogs/pdf-print-options'
import { usePatientContext } from '../lib/patient/patient.provider'
import { type Patient } from '../lib/patient/models/patient.model'
import { useUserName } from '../lib/custom-hooks/user-name.hook'

const patientDataStyles = makeStyles()(() => {
  return {
    container: {
      padding: 0
    }
  }
})

interface PatientDataParam {
  patientId?: string
}

interface PatientDataPageErrorProps {
  msg: string
}

const log = bows('PatientDataPage')

function PatientDataPageError({ msg }: PatientDataPageErrorProps): JSX.Element {
  return (
    <Container maxWidth="lg">
      <strong>{msg}</strong>
    </Container>
  )
}

function PatientDataPage(): JSX.Element | null {
  const { t } = useTranslation('yourloops')
  const paramHook = useParams()
  const { user, isLoggedIn } = useAuth()
  const { getPatientById } = usePatientContext()
  const dataHook = useData()
  const { classes } = patientDataStyles()

  const [patient, setPatient] = React.useState<Readonly<Patient> | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const { blipApi } = dataHook
  const { patientId: paramPatientId = null } = paramHook as PatientDataParam
  const userId = user?.id ?? null
  const userIsPatient = user?.isUserPatient()
  const prefixURL = userIsPatient ? '' : `/patient/${paramPatientId}`
  const { getUserName } = useUserName()

  const initialized = isLoggedIn && blipApi

  React.useEffect(() => {
    if (!initialized) {
      return
    }

    let patientId = paramPatientId ?? userId
    if (userIsPatient && user) {
      patientId = user.id
    }
    if (!patientId) {
      log.error('Invalid patient Id')
      setError('Invalid patient Id')
      return
    }
    const patientToSet = getPatientById(patientId)
    if (patientToSet) {
      setPatient(patientToSet)
    } else {
      log.error('Patient not found')
      setError('Patient not found')
    }
  }, [initialized, paramPatientId, userId, user, userIsPatient, getPatientById])

  React.useEffect(() => {
    if (patient && patient.userid !== userId) {
      const { firstName, fullName, lastName } = patient?.profile
      const pageTitle = getUserName(firstName, lastName, fullName)
      setPageTitle(pageTitle, 'PatientName')
    } else {
      setPageTitle()
    }
  }, [getUserName, patient, t, userId])

  if (error) {
    return <PatientDataPageError msg={error} />
  }

  if (!blipApi || !patient) {
    return null
  }

  return (
    <Container className={classes.container} maxWidth={false}>
      <Blip
        config={appConfig}
        api={blipApi}
        patient={patient}
        setPatient={setPatient}
        prefixURL={prefixURL}
        dialogDatePicker={DialogDatePicker}
        dialogRangeDatePicker={DialogRangeDatePicker}
        dialogPDFOptions={DialogPDFOptions}
      />
    </Container>
  )
}

export default PatientDataPage
