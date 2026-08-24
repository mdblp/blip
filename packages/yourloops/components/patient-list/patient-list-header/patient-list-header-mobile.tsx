/*
 * Copyright (c) 2026, Diabeloop
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
import IconButton from '@mui/material/IconButton'
import FilterList from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import Tooltip from '@mui/material/Tooltip'
import { FiltersDialogSlot } from './filters-dialog-slot'
import { useParams } from 'react-router-dom'
import TeamUtils from '../../../lib/team/team.util'
import { usePatientListHeaderHook } from './patient-list-header.hook'
import { PatientListSearchBar } from './patient-list-search-bar'

interface PatientListHeaderProps {
  inputSearch: string
  setInputSearch: (value: string) => void
}

const useStyles = makeStyles()((theme) => {
  return {
    customTextFieldSpecific: {
      width: 'auto',
    },
    patientListHeaderButton: {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      marginRight: theme.spacing(1),
      borderColor: 'var(--text-color-primary)',
      borderRadius: '24px'
    }
  }
})

export const PatientListHeaderMobile: FunctionComponent<PatientListHeaderProps> = (props) => {
  const { inputSearch, setInputSearch } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { teamId } = useParams()
  const isSelectedTeamPrivate = TeamUtils.isPrivate(teamId)

  const init = usePatientListHeaderHook()

  return (
    <React.Fragment>
      <Box
        data-testid="patient-list-header"
        sx={{
          padding: theme.spacing(3, 1, 4, 2),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            width: '100%'
          }}>
          <Box sx={{ flexShrink: 1, marginRight: theme.spacing(1) }}>
            <PatientListSearchBar
              inputSearch = {inputSearch}
              setInputSearch = {setInputSearch}
              classNameSpecific = {classes.customTextFieldSpecific}
            />
          </Box>
          {init.isUserHcp &&
            <>
              <Tooltip
                title={init.filterButtonTooltipTitle}
              >
                <IconButton
                  size="large"
                  onClick={init.openFiltersDialog}
                  disabled={init.filters.pendingEnabled}
                  data-testid="filters-button"
                  ref={init.filtersRef}
                  className={classes.patientListHeaderButton}
                  sx={{ border: '1px solid' }}
                >
                  <FilterList />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={isSelectedTeamPrivate ? t('add-new-patient-disabled-info') : ''}
                placement="left"
              >
                <IconButton
                  size="large"
                  disabled={isSelectedTeamPrivate}
                  data-testid="add-patient-button"
                  onClick={() => {
                    init.setShowAddPatientDialog(true)
                  }}
                  className={classes.patientListHeaderButton}
                  sx={{ backgroundColor: 'var(--info-color-main)' }}
                >
                  <PersonAddIcon sx={{ color: theme.palette.common.white }} />
                </IconButton>
              </Tooltip>
            </>
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
    </React.Fragment>
  )
}
