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

import React, { type FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'
import DialogActions from '@mui/material/DialogActions'
import CardContent from '@mui/material/CardContent'
import { PatientListOptionToggle } from './patient-list-option-toggle'
import { PatientListColumns } from './models/enums/patient-list.enum'
import { usePatientListContext } from '../../lib/providers/patient-list.provider'
import { type GridColumnVisibilityModel } from '@mui/x-data-grid'
import { useAuth } from '../../lib/auth'
import Box from '@mui/material/Box'

interface ColumnSelectorPopoverProps {
  anchorEl: Element
  onClose: () => void
}

interface ColumnToggleDefinition {
  name: PatientListColumns
  checked: boolean
  disabled?: boolean
  hcpOnly?: true
  tooltip?: string
}

export const ColumnSelectorPopover: FunctionComponent<ColumnSelectorPopoverProps> = (props) => {
  const { anchorEl, onClose } = props
  const { user } = useAuth()
  const { t } = useTranslation()
  const { displayedColumns, saveColumnsPreferences } = usePatientListContext()
  const [updatedColumnsModel, setUpdatedColumnsModel] = useState<GridColumnVisibilityModel>({ ...displayedColumns })

  const columnToggles: ColumnToggleDefinition[] = [
    {
      name: PatientListColumns.Patient,
      checked: true,
      disabled: true,
      tooltip: t('un-removable-column')
    },
    {
      name: PatientListColumns.PatientProfile,
      checked: updatedColumnsModel[PatientListColumns.PatientProfile],
      hcpOnly: true
    },
    {
      name: PatientListColumns.Age,
      checked: updatedColumnsModel[PatientListColumns.Age]
    },
    {
      name: PatientListColumns.DateOfBirth,
      checked: updatedColumnsModel[PatientListColumns.DateOfBirth]
    },
    {
      name: PatientListColumns.Gender,
      checked: updatedColumnsModel[PatientListColumns.Gender]
    },
    {
      name: PatientListColumns.System,
      checked: updatedColumnsModel[PatientListColumns.System]
    },
    {
      name: PatientListColumns.MonitoringAlerts,
      checked: updatedColumnsModel[PatientListColumns.MonitoringAlerts],
      hcpOnly: true
    },
    {
      name: PatientListColumns.Messages,
      checked: updatedColumnsModel[PatientListColumns.Messages],
      hcpOnly: true
    },
    {
      name: PatientListColumns.TimeInRange,
      checked: updatedColumnsModel[PatientListColumns.TimeInRange]
    },
    {
      name: PatientListColumns.GlucoseManagementIndicator,
      checked: updatedColumnsModel[PatientListColumns.GlucoseManagementIndicator]
    },
    {
      name: PatientListColumns.BelowRange,
      checked: updatedColumnsModel[PatientListColumns.BelowRange]
    },
    {
      name: PatientListColumns.Variance,
      checked: updatedColumnsModel[PatientListColumns.Variance]
    },
    {
      name: PatientListColumns.LastDataUpdate,
      checked: updatedColumnsModel[PatientListColumns.LastDataUpdate]
    }
  ]

  const updateColumnVisibility = (column: PatientListColumns): void => {
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
        {columnToggles.map((toggle, index) => (
          <Box key={index}>
            {(user.isUserHcp() || (user.isUserCaregiver() && !toggle.hcpOnly)) &&
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
