/*
 * Copyright (c) 2021-2026, Diabeloop
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
import StethoscopeIcon from '../icons/stethoscope-icon'
import { PatientListOptionToggle } from './patient-list-option-toggle'
import Divider from '@mui/material/Divider'
import DialogActions from '@mui/material/DialogActions'
import { TimeSpentOufOfRangeIcon } from '../icons/diabeloop/time-spent-ouf-of-range-icon'
import { HypoglycemiaIcon } from '../icons/diabeloop/hypoglycemia-icon'
import { NoDataIcon } from '../icons/diabeloop/no-data-icon'
import { MessageIcon } from '../icons/diabeloop/message-icon'
import AnalyticsApi, { ElementType } from '../../lib/analytics/analytics.api'
import { HyperglycemiaIcon } from '../icons/diabeloop/hyperglycemia-icon'
import useMediaQuery from '@mui/material/useMediaQuery'

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isWeb = !isMobile
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
      data-testid="filters-popover"
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
        {isWeb &&
          <>
            <Typography variant="h6" className={classes.title}>{t('personal-settings')}</Typography>
            <PatientListOptionToggle
              ariaLabel={t('filter-flagged')}
              checked={filters.manualFlagEnabled}
              icon={<FlagIcon />}
              label={t('manual-flag')}
              disabled={isMobile}
              onToggleChange={() => {
                setFilters({ ...filters, manualFlagEnabled: !filters.manualFlagEnabled })
                AnalyticsApi.trackClick('patient-filters-flagged', ElementType.Toggle)
              }}
            />
          </>
        }

        {!isSelectedTeamPrivate &&
          <>
            {isWeb &&
              <>
                <Typography variant="h6" className={classes.title}>{t('lead-clinicians')}</Typography>
                <PatientListOptionToggle
                  ariaLabel={t('filter-my-patients')}
                  checked={filters.myPatientsEnabled}
                  icon={<StethoscopeIcon />}
                  label={t('my-patients')}
                  disabled={isMobile}
                  onToggleChange={() => {
                    setFilters({ ...filters, myPatientsEnabled: !filters.myPatientsEnabled })
                    AnalyticsApi.trackClick('patient-filters-my-patients', ElementType.Toggle)
                  }}
                />
              </>
            }

            <Typography variant="h6" className={classes.title}>{t('monitoring-alerts')}</Typography>
            <PatientListOptionToggle
              ariaLabel={t('filter-out-of-range')}
              checked={filters.timeOutOfTargetEnabled}
              icon={<TimeSpentOufOfRangeIcon />}
              label={t('time-out-of-range-target')}
              onToggleChange={() => {
                setFilters({ ...filters, timeOutOfTargetEnabled: !filters.timeOutOfTargetEnabled })
                AnalyticsApi.trackClick('patient-filters-out-of-range', ElementType.Toggle)
              }}
            />
            <PatientListOptionToggle
              ariaLabel={t('filter-hyperglycemia')}
              checked={filters.hyperglycemiaEnabled}
              icon={<HyperglycemiaIcon />}
              label={t('hyperglycemia')}
              onToggleChange={() => {
                setFilters({ ...filters, hyperglycemiaEnabled: !filters.hyperglycemiaEnabled })
                AnalyticsApi.trackClick('patient-filters-hyperglycemia', ElementType.Toggle)
              }}
            />
            <PatientListOptionToggle
              ariaLabel={t('filter-hypoglycemia')}
              checked={filters.hypoglycemiaEnabled}
              icon={<HypoglycemiaIcon />}
              label={t('hypoglycemia')}
              onToggleChange={() => {
                setFilters({ ...filters, hypoglycemiaEnabled: !filters.hypoglycemiaEnabled })
                AnalyticsApi.trackClick('patient-filters-hypoglycemia', ElementType.Toggle)
              }}
            />
            <PatientListOptionToggle
              ariaLabel={t('filter-data-not-transmitted')}
              checked={filters.dataNotTransferredEnabled}
              icon={<NoDataIcon />}
              label={t('data-not-transmitted')}
              onToggleChange={() => {
                setFilters(prevFilters => ({
                  ...prevFilters,
                  dataNotTransferredEnabled: !prevFilters.dataNotTransferredEnabled
                }))
                AnalyticsApi.trackClick('patient-filters-data-not-transmitted', ElementType.Toggle)
              }}
            />
            {isWeb &&
              <>
                <Typography variant="h6" className={classes.title}>{t('notification')}</Typography>
                <PatientListOptionToggle
                  ariaLabel={t('filter-unread-messages')}
                  checked={filters.messagesEnabled}
                  icon={<MessageIcon />}
                  label={t('messages')}
                  disabled={isMobile}
                  onToggleChange={() => {
                    setFilters({ ...filters, messagesEnabled: !filters.messagesEnabled })
                    AnalyticsApi.trackClick('patient-filters-unread-messages', ElementType.Toggle)
                  }}
                />
              </>
            }
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
