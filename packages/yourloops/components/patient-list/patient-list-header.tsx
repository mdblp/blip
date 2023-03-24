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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import FilterList from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { usePatientContext } from '../../lib/patient/patient.provider'
import { type PatientListTabs } from './enums/patient-list.enum'
import { makeStyles } from 'tss-react/mui'
import { AddPatientDialog } from '../patient/add-dialog'
import TeamCodeDialog from '../patient/team-code-dialog'
import { type Team } from '../../lib/team'
import { useAuth } from '../../lib/auth'

interface PatientListHeaderProps {
  selectedTab: PatientListTabs
  inputSearch: string
  onChangingTab: (newTab: PatientListTabs) => void
  setInputSearch: (value: string) => void
}

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

export const PatientListHeader: FunctionComponent<PatientListHeaderProps> = (props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { selectedTab, inputSearch, onChangingTab, setInputSearch } = props
  const { classes } = useStyles()
  const { patientsFilterStats } = usePatientContext()
  const [showAddPatientDialog, setShowAddPatientDialog] = useState<boolean>(false)
  const [showTeamCodeDialog, setShowTeamCodeDialog] = useState<boolean>(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const onAddPatientSuccessful = (team: Team): void => {
    setShowAddPatientDialog(false)
    setSelectedTeam(team)
    setShowTeamCodeDialog(true)
  }

  return (
    <React.Fragment>
      <Box
        data-testid="patient-list-header"
        padding={theme.spacing(4, 4, 0, 4)}
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
              value={inputSearch}
              className={classes.customTextField}
              InputProps={{
                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                sx: { height: '42px', borderRadius: '28px' }
              }}
              onChange={event => { setInputSearch(event.target.value) }}
            />
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              endIcon={<FilterList />}
            >
              {t('filters')}
            </Button>
          </Box>
          <Box>
            {user.isUserHcp() &&
              <Button
                startIcon={<PersonAddIcon />}
                variant="contained"
                size="large"
                disableElevation
                onClick={() => { setShowAddPatientDialog(true) }}
              >
                {t('button-add-new-patient')}
              </Button>
            }
            <Button
              data-testid="column-settings-button"
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
            value={selectedTab}
            onChange={(event, newValue) => {
              onChangingTab(newValue)
            }}
          >
            <Tab
              icon={<HowToRegIcon />}
              iconPosition="start"
              label={t('current')}
              aria-label={t('current')}
              classes={{ root: classes.tab }}
            />
            <Tab
              data-testid="patient-list-pending-tab"
              icon={<HourglassEmptyIcon />}
              iconPosition="start"
              label={<>
                {t('pending')} <Badge badgeContent={patientsFilterStats.pending} color="primary" sx={{ marginLeft: theme.spacing(2) }} />
              </>}
              aria-label={t('pending')}
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
      {showAddPatientDialog &&
        <AddPatientDialog
          onAddPatientSuccessful={onAddPatientSuccessful}
          onClose={() => { setShowAddPatientDialog(false) }}
        />
      }
      {selectedTeam && showTeamCodeDialog &&
        <TeamCodeDialog
          code={selectedTeam.code}
          name={selectedTeam.name}
          onClose={() => { setShowTeamCodeDialog(false) }}
        />
      }
    </React.Fragment>
  )
}
