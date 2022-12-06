/*
 * Copyright (c) 2021-2022, Diabeloop
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

import _ from 'lodash'
import React, { FunctionComponent, useMemo } from 'react'
import bows from 'bows'
import { useTranslation } from 'react-i18next'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import metrics from '../lib/metrics'
import { useAlert } from '../components/utils/snackbar'
import { errorTextFromException, setPageTitle } from '../lib/utils'
import { Team, useTeam } from '../lib/team'
import { AddPatientDialogContentProps, AddPatientDialogResult } from './hcp/types'
import PatientsSecondaryBar from '../components/patient/secondary-bar'
import AddPatientDialog from '../components/patient/add-dialog'
import TeamCodeDialog from '../components/patient/team-code-dialog'
import PatientList from '../components/patient/list'
import { useLocation } from 'react-router-dom'
import { usePatientContext } from '../lib/patient/patient.provider'
import { PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE } from '../lib/patient/patient.api'
import { PatientFilterTypes } from '../lib/patient/models/enums/patient-filter-type.enum'

const log = bows('PatientListPage')

const throttledMetrics = _.throttle(metrics.send, 60000) // No more than one per minute

const HomePage: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const teamHook = useTeam()
  const patientHook = usePatientContext()
  const alert = useAlert()
  const { search } = useLocation()
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState<string>('')
  const [patientToAdd, setPatientToAdd] = React.useState<AddPatientDialogContentProps | null>(null)
  const [teamCodeToDisplay, setTeamCodeToDisplay] = React.useState<Team | null>(null)

  const filterType = useMemo(() => new URLSearchParams(search).get('filter') as PatientFilterTypes ?? PatientFilterTypes.all, [search])

  const handleRefresh = async (force = false): Promise<void> => {
    log.debug('handleRefresh:', { force })
    setErrorMessage(null)
    try {
      await patientHook.refresh()
    } catch (reason: unknown) {
      log.error('handleRefresh', reason)
      const errorMessage = t('error-failed-display-patients', { errorMessage: errorTextFromException(reason) })
      setErrorMessage(errorMessage)
    }
  }

  const handleInvitePatient = async (): Promise<void> => {
    const getPatientEmailAndTeam = async (): Promise<AddPatientDialogResult | null> => {
      const teams = teamHook.getMedicalTeams()
      return await new Promise((resolve: (value: AddPatientDialogResult | null) => void) => {
        setPatientToAdd({ onDialogResult: resolve, teams })
      })
    }

    const result = await getPatientEmailAndTeam()
    setPatientToAdd(null) // Close the dialog

    if (!result) {
      return
    }

    try {
      const { email, teamId } = result
      const team = teamHook.getTeam(teamId)
      await patientHook.invitePatient(team as Team, email)
      alert.success(t('alert-invitation-sent-success'))
      metrics.send('invitation', 'send_invitation', 'patient')
      setTeamCodeToDisplay(team)
    } catch (err) {
      const error = err as Error
      log.error(error)

      if (error.message === PATIENT_ALREADY_IN_TEAM_ERROR_MESSAGE) {
        alert.error(t('alert-invitation-patient-failed-already-invited'))
        return
      }
      alert.error(t('alert-invitation-patient-failed'))
    }
  }

  const handleFilter = (filter: string): void => {
    log.info('Filter patients name', filter)
    throttledMetrics('patient_selection', 'search_patient', 'by-name')
    setFilter(filter)
  }

  const handleCloseTeamCodeDialog = (): void => {
    setTeamCodeToDisplay(null)
  }

  React.useEffect(() => {
    if (patientHook.errorMessage !== null) {
      const message = t('error-failed-display-patients', { errorMessage: patientHook.errorMessage })
      if (message !== errorMessage) {
        log.error('errorMessage', message)
        setErrorMessage(message)
      }
    } else if (errorMessage !== null) {
      setErrorMessage(null)
    }
  }, [patientHook.errorMessage, errorMessage, t])

  React.useEffect(() => {
    setPageTitle(t('hcp-tab-patients'))
  }, [t])

  if (errorMessage !== null) {
    return (
      <Box id="div-api-error-message" className="api-error-message">
        <Box marginBottom={1}>
          <Alert id="alert-api-error-message" severity="error">
            {errorMessage}
          </Alert>
        </Box>
        <Button
          id="button-api-error-message"
          variant="contained"
          color="secondary"
          disableElevation
          onClick={async () => await handleRefresh(true)}
        >
          {t('button-refresh-page-on-error')}
        </Button>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <Box marginTop={2} marginBottom={3}>
        <PatientsSecondaryBar
          filter={filter}
          onFilter={handleFilter}
          onInvitePatient={handleInvitePatient}
        />
      </Box>
      <PatientList filter={filter} filterType={filterType} />
      <AddPatientDialog actions={patientToAdd} />
      <TeamCodeDialog
        onClose={handleCloseTeamCodeDialog}
        code={teamCodeToDisplay?.code ?? ''}
        name={teamCodeToDisplay?.name ?? ''}
      />
    </React.Fragment>
  )
}

export default HomePage
