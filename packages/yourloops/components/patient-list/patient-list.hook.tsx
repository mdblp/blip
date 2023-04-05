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

import React, { useCallback, useEffect, useMemo, useState, type MutableRefObject } from 'react'
import {
  type GridApiCommon,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowParams,
  type GridRowsProp,
  useGridApiRef
} from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { usePatientListStyles } from './patient-list.styles'
import { PatientListColumns, PatientListTabs, PatientListFilters } from './enums/patient-list.enum'
import { usePatientContext } from '../../lib/patient/patient.provider'
import { useUserName } from '../../lib/custom-hooks/user-name.hook'
import { getMedicalValues } from '../patient/utils'
import { ActionsCell, AlarmPercentageCell, FlagIconCell, MessageCell, PendingIconCell } from './custom-cells'
import { type Alarms } from '../../lib/patient/models/alarms.model'
import { useAuth } from '../../lib/auth'
import { type Patient } from '../../lib/patient/models/patient.model'
import PatientUtils from '../../lib/patient/patient.util'
import { type GridRowModel } from './models/grid-row.model'
import { type UserToRemove } from '../dialogs/remove-direct-share-dialog'
import { getPatientFullName } from 'dumb/dist/src/utils/patient/patient.util'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { useSortComparatorsHook } from '../../lib/custom-hooks/sort-comparators.hook'
import { useQueryParams } from '../../lib/custom-hooks/query-params.hook'

interface PatientListHookReturns {
  columns: GridColDef[]
  selectedTab: PatientListTabs
  inputSearch: string
  gridApiRef: MutableRefObject<GridApiCommon>
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
  const { getPatientById, filterPatients } = usePatientContext()
  const { getUserName } = useUserName()
  const { sortByUserName } = useSortComparatorsHook()
  const navigate = useNavigate()
  const gridApiRef = useGridApiRef()
  const queryParams = useQueryParams()
  const trNA = t('N/A')

  const [selectedTab, setSelectedTab] = useState<PatientListTabs>(PatientListTabs.Current)
  const [selectedFilter, setSelectedFilter] = useState<PatientListFilters>(PatientListFilters.All)
  const [inputSearch, setInputSearch] = useState<string>('')
  const [patientToRemoveForHcp, setPatientToRemoveForHcp] = useState<Patient | null>(null)
  const [patientToRemoveForCaregiver, setPatientToRemoveForCaregiver] = useState<UserToRemove | null>(null)

  const flaggedPatients = getFlagPatients()

  const filteredPatients = useMemo(() => {
    const filteredPatients = filterPatients(selectedFilter, inputSearch, flaggedPatients)
    return PatientUtils.computeFlaggedPatients(filteredPatients, flaggedPatients).sort(sortByUserName)
  }, [filterPatients, selectedFilter, inputSearch, flaggedPatients, sortByUserName])

  const onChangingTab = (newTab: PatientListTabs): void => {
    setSelectedTab(newTab)
    switch (newTab) {
      case PatientListTabs.Current:
        setSelectedFilter(PatientListFilters.All)
        return
      case PatientListTabs.Pending:
        setSelectedFilter(PatientListFilters.Pending)
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
    navigate(`/patient/${params.id}/dashboard`)
  }

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: PatientListColumns.Flag,
        type: 'actions',
        headerName: '',
        width: 55,
        hideable: false,
        sortable: false,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>): JSX.Element => {
          const patient = params.value
          return (
            <React.Fragment>
              {selectedTab === PatientListTabs.Pending
                ? <PendingIconCell />
                : <FlagIconCell isFlagged={patient.metadata.flagged} patient={patient} />
              }
            </React.Fragment>
          )
        }
      },
      {
        field: PatientListColumns.Patient,
        headerName: t('patient'),
        hideable: false,
        flex: 1,
        headerClassName: classes.mandatoryCellBorder,
        cellClassName: classes.mandatoryCellBorder,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
          const { firstName, fullName, lastName, email } = params.value.profile
          return <Box data-email={email}>{getUserName(firstName, lastName, fullName)}</Box>
        },
        sortComparator: sortByUserName
      },
      {
        field: PatientListColumns.System,
        headerName: t('system')
      },
      {
        field: PatientListColumns.TimeOutOfRange,
        type: 'number',
        headerName: t('time-out-of-range-target'),
        description: t('time-out-of-range-target-tooltip'),
        flex: 0.5,
        sortable: false,
        renderCell: (params: GridRenderCellParams<GridRowModel, Alarms>) => {
          const alarms = params.value
          return <AlarmPercentageCell value={alarms.timeSpentAwayFromTargetRate} isAlarmActive={alarms.timeSpentAwayFromTargetActive} />
        }
      },
      {
        field: PatientListColumns.SevereHypoglycemia,
        type: 'number',
        headerName: t('alert-hypoglycemic'),
        description: t('hypoglycemia-tooltip'),
        sortable: false,
        flex: 0.5,
        renderCell: (params: GridRenderCellParams<GridRowModel, Alarms>) => {
          const alarms = params.value
          return <AlarmPercentageCell value={alarms.frequencyOfSevereHypoglycemiaRate} isAlarmActive={alarms.frequencyOfSevereHypoglycemiaActive} />
        }
      },
      {
        field: PatientListColumns.DataNotTransferred,
        type: 'number',
        headerName: t('data-not-transferred'),
        description: t('data-not-transferred-tooltip'),
        sortable: false,
        flex: 0.5,
        renderCell: (params: GridRenderCellParams<GridRowModel, Alarms>) => {
          const alarms = params.value
          return <AlarmPercentageCell value={alarms.nonDataTransmissionRate} isAlarmActive={alarms.nonDataTransmissionActive} />
        }
      },
      {
        type: 'string',
        field: PatientListColumns.LastDataUpdate,
        headerName: t('last-data-update'),
        flex: 0.8
      },
      {
        type: 'boolean',
        field: PatientListColumns.Messages,
        headerName: '',
        width: 55,
        renderCell: (params: GridRenderCellParams<GridRowModel, boolean>) => <MessageCell hasNewMessages={params.value} />
      },
      {
        type: 'actions',
        field: PatientListColumns.Actions,
        headerName: 'Actions',
        headerClassName: classes.mandatoryCellBorder,
        cellClassName: classes.mandatoryCellBorder,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => <ActionsCell patient={params.value} onClickRemove={onClickRemovePatient} />
      }
    ]
  }, [t, classes.mandatoryCellBorder, sortByUserName, selectedTab, getUserName, onClickRemovePatient])

  const rowsProps: GridRowsProp = useMemo(() => {
    return filteredPatients.map((patient): GridRowModel => {
      const { lastUpload } = getMedicalValues(patient.metadata.medicalData, trNA)
      const alarms = patient.alarms
      return {
        id: patient.userid,
        [PatientListColumns.Flag]: patient,
        [PatientListColumns.Patient]: patient,
        [PatientListColumns.System]: patient.settings.system ?? trNA,
        [PatientListColumns.TimeOutOfRange]: alarms,
        [PatientListColumns.SevereHypoglycemia]: alarms,
        [PatientListColumns.DataNotTransferred]: alarms,
        [PatientListColumns.LastDataUpdate]: lastUpload,
        [PatientListColumns.Messages]: patient.metadata.hasSentUnreadMessages,
        [PatientListColumns.Actions]: patient
      }
    })
  }, [filteredPatients, trNA])

  useEffect(() => {
    const filter = queryParams.get('filter')
    if (Object.values(PatientListFilters).includes(filter as PatientListFilters)) {
      setSelectedFilter(filter as PatientListFilters)
    }
  }, [queryParams])

  return {
    columns,
    selectedTab,
    gridApiRef,
    inputSearch,
    patientToRemoveForHcp,
    patientToRemoveForCaregiver,
    rowsProps,
    onChangingTab,
    onCloseRemoveDialog,
    onRowClick,
    setInputSearch
  }
}