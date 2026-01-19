/*
 * Copyright (c) 2021-2025, Diabeloop
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
import Box from '@mui/material/Box'
import { usePatientListContext } from '../../lib/providers/patient-list.provider'
import { type PatientsFilters } from '../../lib/providers/models/patients-filters.model'
import FlagIcon from '@mui/icons-material/Flag'
import Popover from '@mui/material/Popover'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { PatientListOptionToggle } from './patient-list-option-toggle'
import Divider from '@mui/material/Divider'
import DialogActions from '@mui/material/DialogActions'
import { TimeSpentOufOfRangeIcon } from '../icons/diabeloop/time-spent-ouf-of-range-icon'
import { HypoglycemiaIcon } from '../icons/diabeloop/hypoglycemia-icon'
import { NoDataIcon } from '../icons/diabeloop/no-data-icon'
import { MessageIcon } from '../icons/diabeloop/message-icon'

interface PatientsFiltersDialogProps {
  anchorEl: Element
  onClose: () => void
  isSelectedTeamPrivate: boolean
}

const useStyles = makeStyles()((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3)
  }
}))

export const PatientFiltersPopover: FunctionComponent<PatientsFiltersDialogProps> = (props) => {
  const { anchorEl, onClose, isSelectedTeamPrivate } = props
  const { t } = useTranslation()
  const { filters: patientsFiltersContext, updatePatientsFilters } = usePatientListContext()
  const theme = useTheme()
  const { classes } = useStyles()

  const [filters, setFilters] = useState<PatientsFilters>(patientsFiltersContext)

  const updateFilters = (): void => {
    onClose()
    updatePatientsFilters(filters)
  }

  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{ vertical: -10, horizontal: 0 }}
    >
      <Box
        sx={{
          marginX: theme.spacing(3),
          marginTop: theme.spacing(3)
        }}>
        <Typography variant="h6" className={classes.title}>{t('personal-settings')}</Typography>
        <PatientListOptionToggle
          ariaLabel={t('filter-flagged')}
          checked={filters.manualFlagEnabled}
          icon={<FlagIcon />}
          label={t('manual-flag')}
          onToggleChange={() => {
            setFilters({ ...filters, manualFlagEnabled: !filters.manualFlagEnabled })
          }}
        />

        {!isSelectedTeamPrivate &&
          <>
            <Typography variant="h6" className={classes.title}>{t('monitoring-alerts')}</Typography>
            <PatientListOptionToggle
              ariaLabel={t('filter-out-of-range')}
              checked={filters.timeOutOfTargetEnabled}
              icon={<TimeSpentOufOfRangeIcon />}
              label={t('time-out-of-range-target')}
              onToggleChange={() => {
                setFilters({ ...filters, timeOutOfTargetEnabled: !filters.timeOutOfTargetEnabled })
              }}
            />
            <PatientListOptionToggle
              ariaLabel={t('filter-hypoglycemia')}
              checked={filters.hypoglycemiaEnabled}
              icon={<HypoglycemiaIcon />}
              label={t('hypoglycemia')}
              onToggleChange={() => {
                setFilters({ ...filters, hypoglycemiaEnabled: !filters.hypoglycemiaEnabled })
              }}
            />
            <PatientListOptionToggle
              ariaLabel={t('filter-data-not-transmitted')}
              checked={filters.dataNotTransferredEnabled}
              icon={<NoDataIcon />}
              label={t('data-not-transmitted')}
              onToggleChange={() => {
                setFilters({ ...filters, dataNotTransferredEnabled: !filters.dataNotTransferredEnabled })
              }}
            />
            <Typography variant="h6" className={classes.title}>{t('notification')}</Typography>
            <PatientListOptionToggle
              ariaLabel={t('filter-unread-messages')}
              checked={filters.messagesEnabled}
              icon={<MessageIcon />}
              label={t('messages')}
              onToggleChange={() => {
                setFilters({ ...filters, messagesEnabled: !filters.messagesEnabled })
              }}
            />
          </>
        }
      </Box>
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
          onClick={updateFilters}
        >
          {t('button-apply')}
        </Button>
      </DialogActions>
    </Popover>
  )
}
