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

import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import Button from '@mui/material/Button'

import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'

interface BarProps {
  /** Add a caregiver */
  onShowAddCaregiverDialog: () => Promise<void>
}

const pageBarStyles = makeStyles({ name: 'ylp-patient-caregivers-secondary-bar' })((theme) => {
  return {
    topBar: {
      display: 'flex',
      flexDirection: 'row-reverse',
      margin: theme.spacing(1)
    },
    buttonAddCaregiver: {
      marginLeft: 'auto'
    },
    buttonAddCaregiverText: {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    }
  }
})

function SecondaryBar(props: BarProps): JSX.Element {
  const { classes } = pageBarStyles()
  const { t } = useTranslation('yourloops')

  const handleOpenAddCaregiverDialog = async (): Promise<void> => {
    await props.onShowAddCaregiverDialog()
  }

  return (
    <div id="patient-navbar-item-right" data-testid="patient-caregivers-secondary-bar" className={classes.topBar}>
      <Button
        id="patient-navbar-add-caregiver"
        color="primary"
        variant="contained"
        disableElevation
        className={classes.buttonAddCaregiver}
        onClick={handleOpenAddCaregiverDialog}
      >
        <AddIcon className="marginTop-2" />
        <Box component="span" className={classes.buttonAddCaregiverText}>&nbsp;{t('button-add-caregiver')}</Box>
      </Button>
    </div>
  )
}

export default SecondaryBar
