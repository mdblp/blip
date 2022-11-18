/*
 * Copyright (c) 2021-2022, Diabeloop
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

import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { useAuth } from '../../lib/auth'
import PatientFilters from '../header-bars/patient-filters'
import AccessTime from '@material-ui/icons/AccessTime'
import { Box } from '@material-ui/core'

export interface PatientListBarProps {
  filter: string
  onFilter: (text: string) => void
  onInvitePatient: () => Promise<void>
}

const pageBarStyles = makeStyles(
  (theme: Theme) => {
    return {
      topBar: {
        display: 'flex',
        margin: theme.spacing(1)
      },
      toolBarLeft: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.grey[800]
      },
      toolBarMiddle: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        flex: '1 1'
      },
      buttonAddPatient: {
        marginLeft: 'auto'
      },
      buttonAddPatientText: {
        [theme.breakpoints.down('xs')]: {
          display: 'none'
        }
      },
      modalAddPatient: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  }
)

function PatientsSecondaryBar(props: PatientListBarProps): JSX.Element {
  const { filter, onFilter, onInvitePatient } = props
  const { t } = useTranslation('yourloops')
  const classes = pageBarStyles()
  const authHook = useAuth()

  const handleOpenModalAddPatient = (): void => {
    onInvitePatient()
  }

  return (
    <Box className={classes.topBar} data-testid="patients-secondary-bar">
      <div id="patients-list-toolbar-item-left" className={classes.toolBarLeft}>
        <AccessTime className="subnav-icon" />
        <span aria-label={t('secondary-bar-period-text')}>{t('secondary-bar-period-text')}</span>
      </div>
      <Box className={classes.toolBarMiddle}>
        <PatientFilters
          filter={filter}
          onFilter={onFilter}
        />
      </Box>
      {authHook.user?.isUserHcp() &&
        <Button
          color="primary"
          variant="contained"
          disableElevation
          className={classes.buttonAddPatient}
          onClick={handleOpenModalAddPatient}
        >
          <PersonAddIcon />
          <Box component="span" className={classes.buttonAddPatientText}>&nbsp;{t('add-patient')}</Box>
        </Button>
      }
    </Box>
  )
}

export default PatientsSecondaryBar
