/*
 * Copyright (c) 2023-2025, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { usePatientListContext } from '../../lib/providers/patient-list.provider'
import Link from '@mui/material/Link'
import { usePatientListHeaderFiltersLabelHook } from './patient-list-header-filters-label.hook'
import { usePatientsContext } from '../../lib/patient/patients.provider'

interface PatientListHeaderFiltersLabelProps {
  patientsDisplayedCount: number
}

const useStyles = makeStyles()((theme) => {
  return {
    resetButton: {
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.common.black
      }
    }
  }
})

export const PatientListHeaderFiltersLabel: FunctionComponent<PatientListHeaderFiltersLabelProps> = (props) => {
  const { patientsDisplayedCount } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { filters, resetFilters, hasAnyNonPendingFiltersEnabled } = usePatientListContext()
  const { allNonPendingPatientsForSelectedTeamCount } = usePatientsContext()

  const { filtersLabel } = usePatientListHeaderFiltersLabelHook({
    allNonPendingPatientsForSelectedTeamCount,
    patientsDisplayedCount,
    pendingFilterEnabled: filters.pendingEnabled,
    hasAnyNonPendingFiltersEnabled
  })

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center"
      }}>
      <Typography
        data-testid="filters-label"
        variant="subtitle2"
        sx={{ color: "text.secondary" }}
      >
        {filtersLabel}
      </Typography>
      {!filters.pendingEnabled && hasAnyNonPendingFiltersEnabled &&
        <>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ marginInline: theme.spacing(2) }}
          />
          <Link
            data-testid="reset-filters-link"
            color="inherit"
            variant="subtitle2"
            underline="always"
            className={classes.resetButton}
            onClick={resetFilters}
          >
            {t('reset')}
          </Link>
        </>
      }
    </Box>
  )
}
