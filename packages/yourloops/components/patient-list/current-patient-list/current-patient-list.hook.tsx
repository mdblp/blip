/*
 * Copyright (c) 2023-2026, Diabeloop
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

import { Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import { type GridColDef, type GridRenderCellParams, type GridRowParams, type GridRowsProp } from '@mui/x-data-grid'
import { formatBirthdate } from 'dumb'
import { DiabeticType } from 'medical-domain'
import moment from 'moment-timezone'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../lib/auth'

import { getUserName } from '../../../lib/auth/user.util'
import { LeadClinician } from '../../../lib/lead-clinicians/models/lead-clinician.model'
import { type Patient } from '../../../lib/patient/models/patient.model'
import PatientUtils from '../../../lib/patient/patient.util'
import { AppUserRoute } from '../../../models/enums/routes.enum'
import { PatientDiabeticProfileChip } from '../../chips/patient-diabetic-profile-chip'
import { ActionsCell } from '../custom-cells/actions-cell'
import { FlagIconCell } from '../custom-cells/flag-icon-cell'
import { LeadCliniciansCell } from '../custom-cells/lead-clinicians-cell'
import { MessageCell } from '../custom-cells/message-cell'
import { MonitoringAlertsCell } from '../custom-cells/monitoring-alerts-cell'
import { MonitoringAlertsSkeletonCell } from '../custom-cells/monitoring-alerts-skeleton-cell'
import { PatientListColumn } from '../models/enums/patient-list.enum'
import { type GridRowModel } from '../models/grid-row.model'
import { usePatientListStyles } from '../patient-list.styles'
import {
  sortByDateOfBirth,
  sortByFlag,
  sortByLastDataUpdate,
  sortByMonitoringAlertsCount,
  sortByUserName
} from '../utils/sort-comparators.util'

interface CurrentPatientListProps {
  patients: Patient[]
  onClickRemovePatient: (patientId: string) => void
}

interface CurrentPatientListHookReturns {
  allRows: GridRowsProp
  allColumns: GridColDef[]
  onRowClick: (params: GridRowParams) => void
}

const SKELETON_PERCENTAGE_VALUE_WIDTH_PX = 50
const SKELETON_HEIGHT_PX = 15

const GLYCEMIA_INDICATOR_NO_DATA_VALUE = null

export const useCurrentPatientListHook = (props: CurrentPatientListProps): CurrentPatientListHookReturns => {
  const { patients, onClickRemovePatient } = props
  const { t } = useTranslation()
  const { classes } = usePatientListStyles()
  const { getFlagPatients } = useAuth()
  const navigate = useNavigate()
  const noDataLabel = t('N/A')

  const flaggedPatients = getFlagPatients()
  const sortedPatients = PatientUtils.computeFlaggedPatients(patients, flaggedPatients).sort(sortByUserName)

  const allRows = useMemo(() => {
    return sortedPatients.map((patient): GridRowModel => {
      const birthdate = patient.profile.birthdate
      return {
        id: patient.userid,
        [PatientListColumn.Flag]: patient,
        [PatientListColumn.Patient]: patient,
        [PatientListColumn.DateOfBirth]: patient,
        [PatientListColumn.Age]: PatientUtils.computeAge(birthdate),
        [PatientListColumn.Gender]: PatientUtils.getGenderLabel(patient.profile.sex),
        [PatientListColumn.MonitoringAlerts]: patient,
        [PatientListColumn.System]: patient.settings.system ?? noDataLabel,
        [PatientListColumn.LastDataUpdate]: PatientUtils.getLastUploadDate(patient.medicalData),
        [PatientListColumn.Messages]: patient.hasSentUnreadMessages,
        [PatientListColumn.TimeInRange]: patient.glycemiaIndicators?.timeInRange,
        [PatientListColumn.GlucoseManagementIndicator]: patient.glycemiaIndicators?.glucoseManagementIndicator,
        [PatientListColumn.BelowRange]: patient.glycemiaIndicators?.hypoglycemia,
        [PatientListColumn.Variance]: patient.glycemiaIndicators?.coefficientOfVariation,
        [PatientListColumn.Actions]: patient,
        [PatientListColumn.PatientProfile]: patient.diabeticProfile?.type ?? DiabeticType.DT1DT2,
        [PatientListColumn.Clinicians]: patient.leadClinicians
      }
    })
  }, [noDataLabel, sortedPatients])

  const isNumberValueDefined = (value: number): boolean => {
    return !!value || value === 0 || value === GLYCEMIA_INDICATOR_NO_DATA_VALUE
  }

  const allColumns = useMemo((): GridColDef[] => {
    return [
      {
        field: PatientListColumn.Flag,
        type: 'actions',
        headerName: '',
        width: 55,
        hideable: false,
        sortable: true,
        sortComparator: sortByFlag,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>): JSX.Element => {
          const patient = params.value
          return <FlagIconCell isFlagged={patient.flagged} patient={patient} />
        }
      },
      {
        field: PatientListColumn.Patient,
        headerName: t('patient'),
        hideable: false,
        width: 250,
        headerClassName: classes.mandatoryCellBorder,
        cellClassName: classes.mandatoryCellBorder,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
          const { firstName, fullName, lastName, email } = params.value.profile
          const name = getUserName(firstName, lastName, fullName)
          return <Box data-email={email}>{name}</Box>
        },
        sortComparator: sortByUserName
      },
      {
        field: PatientListColumn.PatientProfile,
        headerName: t('patient-profile'),
        width: 150,
        align: 'left',
        renderCell: (params: GridRenderCellParams<GridRowModel, DiabeticType>) => {
          return <PatientDiabeticProfileChip
            patientDiabeticType={params.value}
            sx={{ ml: '0 !important' }} /> // override default margin-left
        }
      },
      {
        field: PatientListColumn.Age,
        type: 'string',
        headerName: t('age'),
        width: 80
      },
      {
        field: PatientListColumn.DateOfBirth,
        headerName: t('date-of-birth'),
        sortComparator: sortByDateOfBirth,
        width: 150,
        valueFormatter: (patient: Patient): string => formatBirthdate(patient.profile.birthdate)
      },
      {
        field: PatientListColumn.Gender,
        headerName: t('gender')
      },
      {
        field: PatientListColumn.System,
        headerName: t('system')
      },
      {
        field: PatientListColumn.Clinicians,
        headerName: t('lead-clinicians'),
        align: 'left',
        width: 130,
        sortable: false,
        renderCell: (params: GridRenderCellParams<GridRowModel, LeadClinician[]>) => {
          const clinicians = params.value

          return <LeadCliniciansCell clinicians={clinicians} />
        }
      },
      {
        field: PatientListColumn.MonitoringAlerts,
        headerName: t('monitoring-alerts'),
        description: t('monitoring-alerts-tooltip'),
        sortComparator: sortByMonitoringAlertsCount,
        width: 150,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
          const patient = params.value
          const isLoading = !patient.monitoringAlertsParameters || !patient.monitoringAlerts

          return isLoading ? <MonitoringAlertsSkeletonCell /> : <MonitoringAlertsCell patient={patient} />
        }
      },
      {
        type: 'boolean',
        field: PatientListColumn.Messages,
        headerName: t('messages'),
        renderCell: (params: GridRenderCellParams<GridRowModel, boolean>) => {
          return <MessageCell hasNewMessages={params.value} />
        }
      },
      {
        type: 'number',
        field: PatientListColumn.TimeInRange,
        headerName: t('time-in-range'),
        description: t('time-in-range-tooltip'),
        headerAlign: 'left',
        align: 'left',
        valueFormatter: (value: number): string => PatientUtils.formatPercentageValue(value),
        renderCell: (params: GridRenderCellParams<GridRowModel, number>) => {
          const value = params.value
          return isNumberValueDefined(value)
            ? PatientUtils.formatPercentageValue(params.value)
            : <Skeleton data-testid="time-in-range-cell-skeleton"
                        variant="rounded"
                        width={SKELETON_PERCENTAGE_VALUE_WIDTH_PX}
                        height={SKELETON_HEIGHT_PX} />
        }
      },
      {
        type: 'number',
        field: PatientListColumn.GlucoseManagementIndicator,
        headerName: t('column-header-glucose-management'),
        description: t('glucose-management-indicator'),
        headerAlign: 'left',
        align: 'left',
        width: 120,
        valueFormatter: (value: number): string => PatientUtils.formatPercentageValue(value),
        renderCell: (params: GridRenderCellParams<GridRowModel, number>) => {
          const value = params.value
          return isNumberValueDefined(value)
            ? PatientUtils.formatPercentageValue(params.value)
            : <Skeleton data-testid="glucose-management-indicator-cell-skeleton"
                        variant="rounded"
                        width={SKELETON_PERCENTAGE_VALUE_WIDTH_PX}
                        height={SKELETON_HEIGHT_PX} />
        }
      },
      {
        type: 'number',
        field: PatientListColumn.BelowRange,
        headerName: t('below-range'),
        description: t('below-range-tooltip'),
        headerAlign: 'left',
        align: 'left',
        width: 120,
        valueFormatter: (value: number): string => PatientUtils.formatPercentageValue(value),
        renderCell: (params: GridRenderCellParams<GridRowModel, number>) => {
          const value = params.value
          return isNumberValueDefined(value)
            ? PatientUtils.formatPercentageValue(params.value)
            : <Skeleton data-testid="hypoglycemia-cell-skeleton"
                        variant="rounded"
                        width={SKELETON_PERCENTAGE_VALUE_WIDTH_PX}
                        height={SKELETON_HEIGHT_PX} />
        }
      },
      {
        type: 'number',
        field: PatientListColumn.Variance,
        headerName: t('variance'),
        description: t('coefficient-of-variation'),
        headerAlign: 'left',
        align: 'left',
        valueFormatter: (value: number): string => PatientUtils.formatPercentageValue(value),
        renderCell: (params: GridRenderCellParams<GridRowModel, number>) => {
          const value = params.value
          return isNumberValueDefined(value)
            ? PatientUtils.formatPercentageValue(params.value)
            : <Skeleton data-testid="variance-cell-skeleton"
                        variant="rounded"
                        width={SKELETON_PERCENTAGE_VALUE_WIDTH_PX}
                        height={SKELETON_HEIGHT_PX} />
        }
      },
      {
        type: 'string',
        field: PatientListColumn.LastDataUpdate,
        width: 180,
        headerName: t('last-data-update'),
        description: t('last-data-update-tooltip'),
        sortable: true,
        sortComparator: sortByLastDataUpdate,
        renderCell: (params: GridRenderCellParams<GridRowModel, moment.Moment | null>) => {
          const value = params.value
          let dateToDisplay = noDataLabel
          if (value !== null) {
            const browserTimezone = new Intl.DateTimeFormat().resolvedOptions().timeZone
            const date = moment.tz(value, browserTimezone)
            if (date.isValid()) {
              dateToDisplay = date.format('lll')
            }
          }
          return dateToDisplay ?? <Skeleton data-testid="last-data-update-cell-skeleton"
                                            variant="rounded"
                                            width={150}
                                            height={SKELETON_HEIGHT_PX} />
        }
      },
      {
        type: 'actions',
        field: PatientListColumn.Actions,
        headerName: t('actions'),
        headerClassName: classes.mandatoryCellBorder,
        cellClassName: classes.mandatoryCellBorder,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
          return <ActionsCell patient={params.value} onClickRemove={onClickRemovePatient} />
        }
      }
    ]
  }, [classes.mandatoryCellBorder, onClickRemovePatient, t, noDataLabel])

  const onRowClick = (params: GridRowParams): void => {
    navigate(`${params.id}${AppUserRoute.Dashboard}`)
  }

  return { allRows, allColumns, onRowClick }
}
