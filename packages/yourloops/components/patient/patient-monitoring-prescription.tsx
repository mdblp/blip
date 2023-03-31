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

import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Theme } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import BasicDropdown from '../dropdown/basic-dropdown'
import Dropdown from '../dropdown/dropdown'
import { type Team, type TeamMember, useTeam } from '../../lib/team'
import { RemoteMonitoringDialogAction } from '../dialogs/remote-monitoring-dialog'

const useStyles = makeStyles()((theme: Theme) => ({
  categoryTitle: {
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  dropdown: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  fileTextField: {
    marginRight: theme.spacing(2),
    width: 240
  },
  fileTextFieldOutlined: {
    fontSize: 13,
    color: 'var(--text-color-primary)'
  },
  input: {
    display: 'none'
  },
  label: {
    fontWeight: 600,
    fontSize: '13px',
    width: '180px'
  },
  subCategoryTitle: {
    fontWeight: 600,
    fontSize: '13px',
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2)
  },
  valueSelection: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: theme.spacing(3)
  }
}))

export interface PrescriptionInfo {
  teamId?: string
  memberId?: string
  file?: File
  numberOfMonth: number
}

export interface PatientMonitoringPrescriptionProps {
  defaultTeamId?: string
  action: RemoteMonitoringDialogAction
  setPrescriptionInfo: (prescriptionInfo: PrescriptionInfo) => void
}

function PatientMonitoringPrescription(props: PatientMonitoringPrescriptionProps): JSX.Element {
  const { defaultTeamId, action, setPrescriptionInfo } = props
  const { classes } = useStyles()
  const { t } = useTranslation('yourloops')
  const teamHook = useTeam()
  const month = t('month').toLowerCase()
  const monthValues = [...new Array(6)].map((_each, index) => `${index + 1} ${month}`)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [membersMap, setMembersMap] = useState<Map<string, string>>(new Map<string, string>())
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [prescription, setPrescription] = useState<File | undefined>(undefined)
  const [numberOfMonthSelected, setNumberOfMonthSelected] = useState(3)
  const teams = useMemo<Team[]>(() => teamHook.getRemoteMonitoringTeams(), [teamHook])
  const teamsMap: Map<string, string> = new Map<string, string>()
  teams.forEach(team => teamsMap.set(team.id, team.name))
  // only set team Id for a renew
  const defaultKey = action === RemoteMonitoringDialogAction.renew ? defaultTeamId : undefined

  useEffect(() => {
    const prescriptionInfo: PrescriptionInfo = {
      teamId: selectedTeam?.id,
      memberId: selectedMember?.userId,
      file: prescription,
      numberOfMonth: numberOfMonthSelected
    }
    if (prescriptionInfo.teamId && prescriptionInfo.memberId && prescriptionInfo.file && prescriptionInfo.numberOfMonth) {
      setPrescriptionInfo(prescriptionInfo)
    }
  }, [selectedMember, selectedTeam, prescription, numberOfMonthSelected, setPrescriptionInfo])

  const selectMember = (userId: string): void => {
    const member = selectedTeam?.members.find(member => member.userId === userId)
    if (!member) {
      throw new Error(`The selected member with the name ${userId} does not exists`)
    }
    setSelectedMember(member)
  }

  const selectTeam = (teamId: string): void => {
    const team = teams.find(team => team.id === teamId)
    if (!team) {
      throw new Error(`The selected team with the name ${teamId} does not exists`)
    }
    setSelectedTeam(team)
    const membersHasMap = new Map<string, string>()
    team.members
      .filter(member => member.profile?.fullName)
      .forEach(member => membersHasMap.set(member.userId, member.profile?.fullName ?? ''))
    setMembersMap(membersHasMap)
  }

  useEffect(() => {
    if (defaultTeamId !== undefined) {
      selectTeam(defaultTeamId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setPrescription(file)
    }
  }

  const onMonthDropdownSelect = (value: string): void => {
    setNumberOfMonthSelected(+value.charAt(0))
  }

  return (
    <>
      <Typography className={classes.categoryTitle}>
        2. {t('prescription')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>A. {t('choice-of-remote-monitoring-team')}:</Typography>
          <Box className={classes.valueSelection}>
            <Typography>{t('requesting-team')}</Typography>
            <div className={classes.dropdown}>
              <Dropdown
                id="team"
                defaultKey={defaultKey}
                disabled={action === RemoteMonitoringDialogAction.renew}
                values={teamsMap}
                onSelect={selectTeam}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>B. {t('choice-of-healthcare-professional')}:</Typography>
          <div className={classes.valueSelection}>
            <Typography>{t('requesting-team-member')}</Typography>
            <div className={classes.dropdown}>
              <Dropdown
                id="team-member"
                values={membersMap}
                onSelect={selectMember}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>
            C. {t('upload-prescription')}
          </Typography>
          <div className={classes.valueSelection}>
            <Typography>{t('prescription')}:</Typography>
            <Box display="flex" alignItems="center">
              <TextField
                size="small"
                classes={{ root: classes.fileTextField }}
                InputProps={{
                  classes: {
                    root: classes.fileTextFieldOutlined,
                    disabled: classes.fileTextFieldOutlined
                  }
                }}
                value={prescription?.name ?? t('file-uploaded-pdf-jpeg-png')}
                disabled
              />
              <input
                id="upload-file-input-id"
                data-testid="upload-file-input"
                accept="image/jpeg,image/png,application/pdf"
                className={classes.input}
                onChange={handleFileSelected}
                type="file"
              />
              <label htmlFor="upload-file-input-id">
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  component="span"
                >
                  {t('button-browse')}
                </Button>
              </label>
            </Box>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subCategoryTitle}>
            D. {t('prescription-duration')}
          </Typography>
          <div className={classes.valueSelection}>
            <Typography>{t('remote-monitoring-prescription-duration')}:</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id="prescription-duration"
                defaultValue={`${numberOfMonthSelected} ${month}`}
                values={monthValues}
                onSelect={onMonthDropdownSelect}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default PatientMonitoringPrescription
