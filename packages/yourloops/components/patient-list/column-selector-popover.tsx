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

import React, { type FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'
import DialogActions from '@mui/material/DialogActions'
import CardContent from '@mui/material/CardContent'
import { PatientListOptionToggle } from './patient-list-option-toggle'
import { PatientListColumns } from './enums/patient-list.enum'
import { usePatientListContext } from '../../lib/providers/patient-list.provider'
import { type GridColumnVisibilityModel } from '@mui/x-data-grid'
import { useAuth } from '../../lib/auth'

interface ColumnSelectorPopoverProps {
  anchorEl: Element
  onClose: () => void
}

interface ColumnTogglesDefinition {
  name: PatientListColumns
  ariaLabel: string
  checked: boolean
  disabled?: boolean
  label: string
  tooltip?: string
}

export const ColumnSelectorPopover: FunctionComponent<ColumnSelectorPopoverProps> = (props) => {
  const { anchorEl, onClose } = props
  const { user } = useAuth()
  const { t } = useTranslation()
  const { displayedColumns, setDisplayedColumns } = usePatientListContext()
  const [updatedColumnsModel, setUpdatedColumnsModel] = useState<GridColumnVisibilityModel>({ ...displayedColumns })

  const columnToggles: ColumnTogglesDefinition[] = [
    {
      name: PatientListColumns.Patient,
      ariaLabel: t(PatientListColumns.Patient),
      checked: true,
      disabled: true,
      label: t(PatientListColumns.Patient),
      tooltip: t('un-removable-column')
    },
    {
      name: PatientListColumns.System,
      ariaLabel: t(PatientListColumns.System),
      checked: updatedColumnsModel[PatientListColumns.System],
      label: t(PatientListColumns.System)
    },
    {
      name: PatientListColumns.TimeOutOfRange,
      ariaLabel: t(PatientListColumns.TimeOutOfRange),
      checked: updatedColumnsModel[PatientListColumns.TimeOutOfRange],
      label: t(PatientListColumns.TimeOutOfRange)
    },
    {
      name: PatientListColumns.DataNotTransferred,
      ariaLabel: t(PatientListColumns.DataNotTransferred),
      checked: updatedColumnsModel[PatientListColumns.DataNotTransferred],
      label: t(PatientListColumns.DataNotTransferred)
    },
    {
      name: PatientListColumns.SevereHypoglycemia,
      ariaLabel: t(PatientListColumns.SevereHypoglycemia),
      checked: updatedColumnsModel[PatientListColumns.SevereHypoglycemia],
      label: t(PatientListColumns.SevereHypoglycemia)
    },
    {
      name: PatientListColumns.LastDataUpdate,
      ariaLabel: t(PatientListColumns.LastDataUpdate),
      checked: updatedColumnsModel[PatientListColumns.LastDataUpdate],
      label: t(PatientListColumns.LastDataUpdate)
    }
  ]

  if (user.isUserHcp()) {
    columnToggles.push(
      {
        name: PatientListColumns.Messages,
        ariaLabel: t(PatientListColumns.Messages),
        checked: updatedColumnsModel[PatientListColumns.Messages],
        label: t(PatientListColumns.Messages)
      })
  }

  const updateColumnVisibility = (column: PatientListColumns): void => {
    setUpdatedColumnsModel(prevState => ({ ...prevState, [column]: !prevState[column] }))
  }

  const refreshDisplayedColumns = (): void => {
    setDisplayedColumns(updatedColumnsModel)
    onClose()
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
    >
      <CardContent>
        <Typography variant="h6">{t('show-column')}</Typography>
        {columnToggles.map((toggle, index) => (
          <PatientListOptionToggle
            key={index}
            ariaLabel={toggle.ariaLabel}
            checked={toggle.checked}
            disabled={toggle.disabled}
            label={toggle.label}
            tooltip={toggle.tooltip}
            onToggleChange={() => {
              updateColumnVisibility(toggle.name)
            }}
          />
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
