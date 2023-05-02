/*
 * Copyright (c) 2023, Diabeloop
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

import React, { useCallback, useMemo, useState } from 'react'
import {
  type GridColDef,
  type GridRenderCellParams,
  type GridRowParams,
  type GridRowsProp,
  type GridValueFormatterParams
} from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { usePatientListStyles } from './patient-list.styles'
import { PatientListColumns, PatientListTabs } from './models/enums/patient-list.enum'
import { usePatientContext } from '../../lib/patient/patient.provider'
import { getMedicalValues } from '../patient/utils'
import { ActionsCell, FlagIconCell, MessageCell, MonitoringAlertsCell, PendingIconCell } from './custom-cells'
import { useAuth } from '../../lib/auth'
import { type Patient } from '../../lib/patient/models/patient.model'
import PatientUtils from '../../lib/patient/patient.util'
import { type GridRowModel } from './models/grid-row.model'
import { type UserToRemove } from '../dialogs/remove-direct-share-dialog'
import { formatBirthdate, getPatientFullName } from 'dumb'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { usePatientListContext } from '../../lib/providers/patient-list.provider'
import { AppUserRoute } from '../../models/enums/routes.enum'
import { sortByDateOfBirth, sortByFlag, sortByMonitoringAlertsCount, sortByUserName } from './sort-comparators.util'
import { getUserName } from '../../lib/auth/user.util'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { TeamType } from '../../lib/team/models/enums/team-type.enum'

interface SharedColumns {
  patientColumn: GridColDef
  actionColumn: GridColDef
}

interface PatientListHookReturns {
  columns: GridColDef[]
  selectedTab: PatientListTabs
  inputSearch: string
  patientsDisplayedCount: number
  patientToRemoveForHcp: Patient | null
  patientToRemoveForCaregiver: UserToRemove | null
  rowsProps: GridRowsProp
  setInputSearch: (value: string) => void
  onChangingTab: (newTab: PatientListTabs) => void
  onCloseRemoveDialog: () => void
  onRowClick: (params: GridRowParams) => void
}

export const usePatientListHook = (): PatientListHookReturns => {
  const { t } = useTranslation()
  const { classes } = usePatientListStyles()
  const { getFlagPatients, user } = useAuth()
  const { getPatientById, searchPatients } = usePatientContext()
  const { updatePendingFilter } = usePatientListContext()
  const { selectedTeam } = useSelectedTeamContext()
  const navigate = useNavigate()
  const trNA = t('N/A')

  const [selectedTab, setSelectedTab] = useState<PatientListTabs>(PatientListTabs.Current)
  const [inputSearch, setInputSearch] = useState<string>('')
  const [patientToRemoveForHcp, setPatientToRemoveForHcp] = useState<Patient | null>(null)
  const [patientToRemoveForCaregiver, setPatientToRemoveForCaregiver] = useState<UserToRemove | null>(null)

  const flaggedPatients = getFlagPatients()

  const filteredPatients = useMemo(() => {
    const searchedPatients = searchPatients(inputSearch)
    return PatientUtils.computeFlaggedPatients(searchedPatients, flaggedPatients).sort(sortByUserName)
  }, [searchPatients, inputSearch, flaggedPatients])

  const onChangingTab = (newTab: PatientListTabs): void => {
    setSelectedTab(newTab)
    switch (newTab) {
      case PatientListTabs.Current:
        updatePendingFilter(false)
        return
      case PatientListTabs.Pending:
        updatePendingFilter(true)
    }
  }

  const onClickRemovePatient = useCallback((patientId: string): void => {
    const patient = getPatientById(patientId)
    if (user.isUserHcp()) {
      setPatientToRemoveForHcp(patient)
      return
    }
    setPatientToRemoveForCaregiver({
      id: patient.userid,
      fullName: getPatientFullName(patient),
      email: patient.profile.email
    })
  }, [getPatientById, user])

  const onCloseRemoveDialog = (): void => {
    setPatientToRemoveForHcp(null)
    setPatientToRemoveForCaregiver(null)
  }

  const onRowClick = (params: GridRowParams): void => {
    navigate(`${AppUserRoute.Patient}/${params.id}/dashboard`)
  }

  const sharedColumns = useMemo((): SharedColumns => {
    const patientColumn = {
      field: PatientListColumns.Patient,
      headerName: t('patient'),
      hideable: false,
      flex: 1,
      headerClassName: classes.mandatoryCellBorder,
      cellClassName: classes.mandatoryCellBorder,
      renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
        const { firstName, fullName, lastName, email } = params.value.profile
        const name = selectedTab === PatientListTabs.Current ? getUserName(firstName, lastName, fullName) : email
        return <Box data-email={email}>{name}</Box>
      },
      sortComparator: sortByUserName
    }

    const actionColumn = {
      type: 'actions',
      field: PatientListColumns.Actions,
      headerName: t('actions'),
      headerClassName: classes.mandatoryCellBorder,
      cellClassName: classes.mandatoryCellBorder,
      renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
        return <ActionsCell patient={params.value} onClickRemove={onClickRemovePatient} />
      }
    }

    return { patientColumn, actionColumn }
  }, [classes.mandatoryCellBorder, onClickRemovePatient, selectedTab, t])

  const buildPendingColumns = useCallback((): GridColDef[] => {
    return [
      {
        field: PatientListColumns.Icon,
        type: 'actions',
        headerName: '',
        width: 55,
        hideable: false,
        sortable: false,
        renderCell: (): JSX.Element => {
          return <PendingIconCell />
        }
      },
      sharedColumns.patientColumn,
      sharedColumns.actionColumn
    ]
  }, [sharedColumns.actionColumn, sharedColumns.patientColumn])

  const medicalTeamsCurrentColumns = useMemo((): GridColDef[] => {
    return [
      {
        field: PatientListColumns.Flag,
        type: 'actions',
        headerName: '',
        width: 55,
        hideable: false,
        sortable: true,
        sortComparator: sortByFlag,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>): JSX.Element => {
          const patient = params.value
          return <FlagIconCell isFlagged={patient.metadata.flagged} patient={patient} />
        }
      },
      sharedColumns.patientColumn,
      {
        field: PatientListColumns.Age,
        type: 'number',
        headerName: t('age'),
        flex: 0.2
      },
      {
        field: PatientListColumns.DateOfBirth,
        headerName: t('date-of-birth'),
        flex: 0.3,
        sortComparator: sortByDateOfBirth,
        valueFormatter: (params: GridValueFormatterParams<Patient>): string => {
          const patient = params.value
          return formatBirthdate(patient.profile.birthdate)
        }
      },
      {
        field: PatientListColumns.Gender,
        headerName: t('gender'),
        flex: 0.3
      },
      {
        field: PatientListColumns.System,
        headerName: t('system'),
        flex: 0.3
      },
      {
        field: PatientListColumns.MonitoringAlerts,
        headerName: t('monitoring-alerts'),
        description: t('monitoring-alerts-tooltip'),
        flex: 0.3,
        sortComparator: sortByMonitoringAlertsCount,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
          const patient = params.value
          return <MonitoringAlertsCell monitoringAlerts={patient.monitoringAlerts} />
        }
      },
      {
        type: 'boolean',
        field: PatientListColumns.Messages,
        headerName: t('messages'),
        flex: 0.3,
        width: 55,
        renderCell: (params: GridRenderCellParams<GridRowModel, boolean>) => {
          return <MessageCell hasNewMessages={params.value} />
        }
      },
      {
        type: 'string',
        field: PatientListColumns.LastDataUpdate,
        headerName: t('last-data-update'),
        flex: 0.8
      },
      sharedColumns.actionColumn
    ]
  }, [sharedColumns.actionColumn, sharedColumns.patientColumn, t])

  const buildCurrentPrivateTeamColumns = useCallback((): GridColDef[] => {
    const fieldsNotWanted = [PatientListColumns.Messages, PatientListColumns.MonitoringAlerts]
    return medicalTeamsCurrentColumns.filter(column => !fieldsNotWanted.includes(column.field as PatientListColumns))
  }, [medicalTeamsCurrentColumns])

  const buildCurrentColumns = useCallback((): GridColDef[] => {
    return user.isUserCaregiver() || selectedTeam.type === TeamType.private ? buildCurrentPrivateTeamColumns() : medicalTeamsCurrentColumns
  }, [user, selectedTeam, buildCurrentPrivateTeamColumns, medicalTeamsCurrentColumns])

  const columns: GridColDef[] = useMemo(() => {
    return selectedTab === PatientListTabs.Current ? buildCurrentColumns() : buildPendingColumns()
  }, [selectedTab, buildCurrentColumns, buildPendingColumns])

  const buildMedicalTeamCurrentRows = useCallback((): GridRowsProp => {
    return filteredPatients.map((patient): GridRowModel => {
      const { lastUpload } = getMedicalValues(patient.metadata.medicalData, trNA)
      const birthdate = patient.profile.birthdate
      return {
        id: patient.userid,
        [PatientListColumns.Flag]: patient,
        [PatientListColumns.Patient]: patient,
        [PatientListColumns.DateOfBirth]: patient,
        [PatientListColumns.Age]: PatientUtils.computeAge(birthdate),
        [PatientListColumns.Gender]: PatientUtils.getGenderLabel(patient.profile.sex),
        [PatientListColumns.MonitoringAlerts]: patient,
        [PatientListColumns.System]: patient.settings.system ?? trNA,
        [PatientListColumns.LastDataUpdate]: lastUpload,
        [PatientListColumns.Messages]: patient.metadata.hasSentUnreadMessages,
        [PatientListColumns.Actions]: patient
      }
    })
  }, [filteredPatients, trNA])

  const buildPrivateTeamCurrentRows = useCallback((): GridRowsProp => {
    return filteredPatients.map((patient): GridRowModel => {
      const { lastUpload } = getMedicalValues(patient.metadata.medicalData, trNA)
      const birthdate = patient.profile.birthdate
      return {
        id: patient.userid,
        [PatientListColumns.Flag]: patient,
        [PatientListColumns.Patient]: patient,
        [PatientListColumns.DateOfBirth]: patient,
        [PatientListColumns.Age]: PatientUtils.computeAge(birthdate),
        [PatientListColumns.Gender]: PatientUtils.getGenderLabel(patient.profile.sex),
        [PatientListColumns.System]: patient.settings.system ?? trNA,
        [PatientListColumns.LastDataUpdate]: lastUpload,
        [PatientListColumns.Actions]: patient
      }
    })
  }, [filteredPatients, trNA])

  const buildPendingRows = useCallback((): GridRowsProp => {
    return filteredPatients.map((patient): GridRowModel => {
      return {
        id: patient.userid,
        [PatientListColumns.Patient]: patient,
        [PatientListColumns.Actions]: patient
      }
    })
  }, [filteredPatients])

  const rowsProps: GridRowsProp = useMemo(() => {
    if (selectedTab === PatientListTabs.Pending) {
      return buildPendingRows()
    }
    if (user.isUserCaregiver() || selectedTeam.type === TeamType.private) {
      return buildPrivateTeamCurrentRows()
    }
    return buildMedicalTeamCurrentRows()
  }, [buildMedicalTeamCurrentRows, buildPendingRows, buildPrivateTeamCurrentRows, selectedTab, selectedTeam, user])

  return {
    columns,
    selectedTab,
    inputSearch,
    patientsDisplayedCount: rowsProps.length,
    patientToRemoveForHcp,
    patientToRemoveForCaregiver,
    rowsProps,
    onChangingTab,
    onCloseRemoveDialog,
    onRowClick,
    setInputSearch
  }
}
