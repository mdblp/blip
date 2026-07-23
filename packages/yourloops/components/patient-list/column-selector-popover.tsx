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

import Box from '@mui/material/Box'

import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { type GridColumnVisibilityModel } from '@mui/x-data-grid'
import React, { type FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfigService } from '../../lib/config/config.service'
import { usePatientListContext } from '../../lib/providers/patient-list.provider'
import { PatientListColumn } from './models/enums/patient-list.enum'
import { PatientListOptionToggle } from './patient-list-option-toggle'
import { isMedicalTeamOnly } from './utils/columns.util'

interface ColumnSelectorPopoverProps {
  anchorEl: Element
  isSelectedTeamPrivate: boolean
  onClose: () => void
}

interface ColumnToggleItem {
  name: PatientListColumn
  checked: boolean
  disabled?: boolean
  tooltip?: string
}

export const ColumnSelectorPopover: FunctionComponent<ColumnSelectorPopoverProps> = (props) => {
  const { anchorEl, isSelectedTeamPrivate, onClose } = props
  const { t } = useTranslation()
  const { displayedColumns, saveColumnsPreferences } = usePatientListContext()
  const [updatedColumnsModel, setUpdatedColumnsModel] = useState<GridColumnVisibilityModel>({ ...displayedColumns })

  const columnToggles: ColumnToggleItem[] = [
    {
      name: PatientListColumn.Patient,
      checked: true,
      disabled: true,
      tooltip: t('un-removable-column')
    },
    {
      name: PatientListColumn.PatientProfile,
      checked: updatedColumnsModel[PatientListColumn.PatientProfile],
    },
    {
      name: PatientListColumn.Age,
      checked: updatedColumnsModel[PatientListColumn.Age]
    },
    ...(ConfigService.getDateOfBirthHidden() ? [] : [{
      name: PatientListColumn.DateOfBirth,
      checked: updatedColumnsModel[PatientListColumn.DateOfBirth]
    }]),
    {
      name: PatientListColumn.Gender,
      checked: updatedColumnsModel[PatientListColumn.Gender]
    },
    {
      name: PatientListColumn.System,
      checked: updatedColumnsModel[PatientListColumn.System]
    },
    {
      name: PatientListColumn.Clinicians,
      checked: updatedColumnsModel[PatientListColumn.Clinicians],
    },
    {
      name: PatientListColumn.MonitoringAlerts,
      checked: updatedColumnsModel[PatientListColumn.MonitoringAlerts],
    },
    {
      name: PatientListColumn.Messages,
      checked: updatedColumnsModel[PatientListColumn.Messages],
    },
    {
      name: PatientListColumn.TimeInRange,
      checked: updatedColumnsModel[PatientListColumn.TimeInRange]
    },
    {
      name: PatientListColumn.GlucoseManagementIndicator,
      checked: updatedColumnsModel[PatientListColumn.GlucoseManagementIndicator]
    },
    {
      name: PatientListColumn.BelowRange,
      checked: updatedColumnsModel[PatientListColumn.BelowRange]
    },
    {
      name: PatientListColumn.Variance,
      checked: updatedColumnsModel[PatientListColumn.Variance]
    },
    {
      name: PatientListColumn.LastDataUpdate,
      checked: updatedColumnsModel[PatientListColumn.LastDataUpdate]
    }
  ]

  const shouldDisplayToggle = (columnName: PatientListColumn): boolean => {
    const isMedicalTeamColumn = isMedicalTeamOnly(columnName)

    if (!isSelectedTeamPrivate) {
      return true
    }

    return !isMedicalTeamColumn
  }

  const updateColumnVisibility = (column: PatientListColumn): void => {
    setUpdatedColumnsModel(prevState => ({ ...prevState, [column]: !prevState[column] }))
  }

  const refreshDisplayedColumns = async (): Promise<void> => {
    onClose()
    await saveColumnsPreferences(updatedColumnsModel)
  }

  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{ vertical: -10, horizontal: 0 }}
      aria-label={t('show-column')}
    >
      <CardContent>
        <Typography variant="h6">{t('show-column')}</Typography>
        {columnToggles.map((toggle: ColumnToggleItem) => (
          <Box key={toggle.name}>
            {shouldDisplayToggle(toggle.name) &&
              <PatientListOptionToggle
                ariaLabel={t(toggle.name)}
                checked={toggle.checked}
                disabled={toggle.disabled}
                label={t(toggle.name)}
                tooltip={toggle.tooltip}
                onToggleChange={() => {
                  updateColumnVisibility(toggle.name)
                }}
              />
            }
          </Box>
        ))}
      </CardContent>
      <Divider variant="middle" />
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          {t('button-cancel')}
        </Button>
        <Button
          data-testid="column-selector-save-button"
          variant="contained"
          color="primary"
          disableElevation
          onClick={refreshDisplayedColumns}
        >
          {t('button-apply')}
        </Button>
      </DialogActions>
    </Popover>
  )
}
