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
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import FilterList from '@mui/icons-material/FilterList'
import { useTranslation } from 'react-i18next'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import Settings from '@mui/icons-material/Settings'
import InputAdornment from '@mui/material/InputAdornment'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { PatientListTabs } from './patient-list-tabs.enum'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import { usePatientContext } from '../../lib/patient/patient.provider'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles()((theme) => {
  const TAB_HEIGHT = theme.spacing(6)

  return {
    customTextField: {
      marginRight: theme.spacing(2),
      width: '350px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'inherit !important'
      }
    },
    resetButton: {
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.common.black
      }
    },
    tab: {
      minHeight: TAB_HEIGHT,
      height: TAB_HEIGHT
    }
  }
})

export const HomePage: FunctionComponent = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const { patientsFilterStats } = usePatientContext()
  const [filter, setFilter] = useState<string>('')
  const [currentTab, setCurrentTab] = useState<PatientListTabs>(PatientListTabs.Current)

  return (
    <React.Fragment>
      <Box
        padding={theme.spacing(4, 4, 0, 4)}
        borderBottom={`1px solid ${theme.palette.divider}`}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <TextField
              data-testid="search-patient-bar"
              aria-label={t('patient-list-searchbar')}
              placeholder={t('placeholder-search')}
              inputProps={{ 'aria-label': t('aria-search') }}
              value={filter}
              className={classes.customTextField}
              InputProps={{
                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                sx: { height: '42px', borderRadius: '28px' }
              }}
              onChange={event => { setFilter(event.target.value) }}
            />
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              endIcon={<FilterList />}
            >
              {t('Filters')}
            </Button>
          </Box>
          <Box>
            <Button
              startIcon={<PersonAddIcon />}
              variant="contained"
              size="large"
              disableElevation
            >
              {t('button-add-new-patient')}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ marginLeft: theme.spacing(2), minWidth: 0, padding: theme.spacing(1) }}
            >
              <Settings />
            </Button>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          paddingTop={1}
        >
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => { setCurrentTab(newValue) }}
          >
            <Tab
              icon={<HowToRegIcon />}
              iconPosition="start"
              label={t('current')}
              classes={{ root: classes.tab }}
            />
            <Tab
              icon={<HourglassEmptyIcon />}
              iconPosition="start"
              label={<>
                {t('pending')} <Badge badgeContent={patientsFilterStats.pending} color="primary" sx={{ marginLeft: theme.spacing(2) }} />
              </>}
              classes={{ root: classes.tab }}
            />
          </Tabs>
          <Box
            display="flex"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Filters activated: X patients out of Y
            </Typography>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ marginInline: theme.spacing(2) }}
            />
            <Link
              color="inherit"
              underline="always"
              className={classes.resetButton}
            >
              Reset
            </Link>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  )
}
