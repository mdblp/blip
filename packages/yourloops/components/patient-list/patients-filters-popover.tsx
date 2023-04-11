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
import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined'
import Box from '@mui/material/Box'
import { usePatientsFiltersContext } from '../../lib/providers/patient-list.provider'
import { type PatientsFilters } from '../../lib/providers/models/patients-filters.model'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft'
import FlagIcon from '@mui/icons-material/Flag'
import Popover from '@mui/material/Popover'
import { useTheme } from '@mui/material/styles'
import EmailIcon from '@mui/icons-material/Email'
import { makeStyles } from 'tss-react/mui'
import { PatientsListOptionToggle } from './patients-list-option-toggle'
import Divider from '@mui/material/Divider'
import DialogActions from '@mui/material/DialogActions'

interface PatientsFiltersDialogProps {
  anchorEl: Element
  onClose: () => void
}

const useStyles = makeStyles()((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3)
  }
}))

export const PatientsFiltersPopover: FunctionComponent<PatientsFiltersDialogProps> = (props) => {
  const { anchorEl, onClose } = props
  const { t } = useTranslation()
  const { filters: patientsFiltersContext, updatePatientsFilters } = usePatientsFiltersContext()
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
      <Box marginX={theme.spacing(3)} marginTop={theme.spacing(3)}>
        <Typography variant="h6" className={classes.title}>{t('type-of-care')}</Typography>
        <PatientsListOptionToggle
          ariaLabel={t('filter-flagged')}
          checked={filters.manualFlagEnabled}
          icon={<FlagIcon />}
          label={t('manual-flag')}
          onToggleChange={() => {
            setFilters({ ...filters, manualFlagEnabled: !filters.manualFlagEnabled })
          }}
        />
        <PatientsListOptionToggle
          ariaLabel={t('filter-telemonitored')}
          checked={filters.telemonitoredEnabled}
          icon={<DesktopMacOutlinedIcon />}
          label={t('telemonitored')}
          onToggleChange={() => {
            setFilters({ ...filters, telemonitoredEnabled: !filters.telemonitoredEnabled })
          }}
        />
        <Typography variant="h6" className={classes.title}>{t('monitoring-alerts')}</Typography>
        <PatientsListOptionToggle
          ariaLabel={t('filter-out-of-range')}
          checked={filters.timeOutOfTargetEnabled}
          icon={<UnfoldMoreIcon />}
          label={t('time-out-of-range-target')}
          onToggleChange={() => {
            setFilters({ ...filters, timeOutOfTargetEnabled: !filters.timeOutOfTargetEnabled })
          }}
        />
        <PatientsListOptionToggle
          ariaLabel={t('filter-hypoglycemia')}
          checked={filters.hypoglycemiaEnabled}
          icon={<ArrowDownwardIcon />}
          label={t('hypoglycemia')}
          onToggleChange={() => {
            setFilters({ ...filters, hypoglycemiaEnabled: !filters.hypoglycemiaEnabled })
          }}
        />
        <PatientsListOptionToggle
          ariaLabel={t('filter-data-not-transferred')}
          checked={filters.dataNotTransferredEnabled}
          icon={<SubdirectoryArrowLeftIcon />}
          label={t('data-not-transferred')}
          onToggleChange={() => {
            setFilters({ ...filters, dataNotTransferredEnabled: !filters.dataNotTransferredEnabled })
          }}
        />
        <Typography variant="h6" className={classes.title}>{t('notification')}</Typography>
        <PatientsListOptionToggle
          ariaLabel={t('filter-unread-messages')}
          checked={filters.messagesEnabled}
          icon={<EmailIcon />}
          label={t('messages')}
          onToggleChange={() => {
            setFilters({ ...filters, messagesEnabled: !filters.messagesEnabled })
          }}
        />
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
