/*
 * Copyright (c) 2023-2026, Diabeloop
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
import FilterList from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import Badge from '@mui/material/Badge'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { type PatientListTabs } from '../models/enums/patient-list.enum'
import { makeStyles } from 'tss-react/mui'
import Tooltip from '@mui/material/Tooltip'
import { PatientListHeaderFiltersLabel } from '../patient-list-header-filters-label'
import { ColumnSelectorPopover } from '../column-selector-popover'
import { useParams } from 'react-router-dom'
import TeamUtils from '../../../lib/team/team.util'
import AnalyticsApi, { ElementType } from '../../../lib/analytics/analytics.api'
import { FiltersDialogSlot } from './modal-management-display'
import { usePatientListHeaderHook } from './patient-list-header.hook'
import { SearchBar } from './patient-list-search-tooltip'

interface PatientListHeaderProps {
  selectedTab: PatientListTabs
  inputSearch: string
  patientsDisplayedCount: number
  onChangingTab: (newTab: PatientListTabs) => void
  setInputSearch: (value: string) => void
}

const useStyles = makeStyles()((theme) => {
  const TAB_HEIGHT = theme.spacing(6)
  return {
    customTextFieldSpecific: {
      marginRight: theme.spacing(2),
      width: '350px',
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
  const { selectedTab, inputSearch, patientsDisplayedCount, onChangingTab, setInputSearch } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { pendingPatientsCount } = usePatientsContext()
  const [isColumnSelectorOpened, setIsColumnSelectorOpened] = useState<boolean>(false)
  const { teamId } = useParams()
  const isSelectedTeamPrivate = TeamUtils.isPrivate(teamId)

  const init = usePatientListHeaderHook()

  return (
    <React.Fragment>
      <Box
        data-testid="patient-list-header"
        sx={{ padding: theme.spacing(4, 4, 0, 4) }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
          <Box>
            <SearchBar
              inputSearch = {inputSearch}
              setInputSearch = {setInputSearch}
              classNameSpecific = {classes.customTextFieldSpecific}
            />
            {init.isUserHcp &&
              <Tooltip title={init.filterButtonTooltipTitle}>
                <span>
                  <Button
                    variant="outlined"
                    size="large"
                    color="inherit"
                    endIcon={<FilterList />}
                    onClick={init.openFiltersDialog}
                    disabled={init.filters.pendingEnabled}
                    ref={init.filtersRef}
                  >
                    {t('filters')}
                  </Button>
                </span>
              </Tooltip>
            }
          </Box>
          <Box>
            {init.isUserHcp &&
              <Tooltip
                title={isSelectedTeamPrivate ? t('add-new-patient-disabled-info') : ''}
                placement="left"
              >
                <span data-testid="add-patient-button">
                  <Button
                    startIcon={<PersonAddIcon />}
                    variant="contained"
                    size="large"
                    disableElevation
                    disabled={isSelectedTeamPrivate}
                    onClick={() => {
                      init.setShowAddPatientDialog(true)
                    }}
                  >
                    {t('button-add-new-patient')}
                  </Button>
                </span>
              </Tooltip>
            }
            <Tooltip title={init.columnSettingsButtonTooltipTitle}>
                <span>
                  <Button
                    data-testid="column-settings-button"
                    aria-label={t('change-columns-settings')}
                    variant="outlined"
                    color="inherit"
                    sx={{ marginLeft: theme.spacing(2), minWidth: 0, padding: theme.spacing(1) }}
                    ref={init.columnsRef}
                    disabled={init.filters.pendingEnabled}
                    onClick={() => {
                      setIsColumnSelectorOpened(true)
                      AnalyticsApi.trackClick('patient-list-column-settings', ElementType.Button)
                    }}
                  >
                    <Settings />
                  </Button>
                </span>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 1
          }}>
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
            {init.isUserHcp && !isSelectedTeamPrivate &&
              <Tab
                data-testid="patient-list-pending-tab"
                icon={<HourglassEmptyIcon />}
                iconPosition="start"
                label={
                  <>
                    {t('pending')}
                    <Badge
                      badgeContent={pendingPatientsCount}
                      color="primary"
                      sx={{ marginLeft: theme.spacing(2) }} />
                  </>
                }
                aria-label={t('pending')}
                classes={{ root: classes.tab }}
              />
            }
          </Tabs>
          {init.isUserHcp &&
            <PatientListHeaderFiltersLabel patientsDisplayedCount={patientsDisplayedCount} />
          }
        </Box>
      </Box>
      <FiltersDialogSlot
        isFiltersDialogOpen={init.isFiltersDialogOpen}
        teamCodeDialogSelectedTeam={init.teamCodeDialogSelectedTeam}
        anchorEl={init.filtersRef.current}
        onPatientFiltersClose={init.closeFiltersDialog}
        isSelectedTeamPrivate={isSelectedTeamPrivate}
        setTeamCodeDialogSelectedTeam={init.setTeamCodeDialogSelectedTeam}
        showAddPatientDialog={init.showAddPatientDialog}
        setShowAddPatientDialog={init.setShowAddPatientDialog}
        onAddPatientSuccessful={init.onAddPatientSuccessful}
      />
      {isColumnSelectorOpened &&
        <ColumnSelectorPopover
          anchorEl={init.columnsRef.current}
          isSelectedTeamPrivate={isSelectedTeamPrivate}
          onClose={() => {
            setIsColumnSelectorOpened(false)
          }}
        />
      }
    </React.Fragment>
  )
}
