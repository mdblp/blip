/*
 * Copyright (c) 2022-2026, Diabeloop
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

import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'

import { type Team, useTeam } from '../../lib/team'
import { commonComponentStyles } from '../common'
import { useAlert } from '../utils/snackbar'
import { useAuth } from '../../lib/auth'
import LeaveTeamButton from './leave-team-button'
import TeamUtils from '../../lib/team/team.util'
import { errorTextFromException, PhonePrefixCode } from '../../lib/utils'
import { logError } from '../../utils/error.util'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import {
  AccountCircleRounded,
  BadgeRounded,
  EmailRounded,
  FileCopyRounded,
  LocalPhoneRounded,
  LocationCityRounded,
  LocationOnRounded,
  PublicRounded,
  SaveRounded
} from '@mui/icons-material'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { Chip } from '@mui/material'
import IconActionButton from '../buttons/icon-action'
import { formatCode } from '../../utils/format.utils'
import { useTeamCreateEdit } from './team-create-edit.hook'

const useStyles = makeStyles()((theme) => ({
  fieldItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  inputField: {
    flexGrow: 1
  }
}))

export interface TeamInformationProps {
  team: Team
}

export const TeamInformation: FC<TeamInformationProps> = (props) => {
  const { team } = props
  const teamHook = useTeam()
  const alert = useAlert()
  const { classes } = useStyles()
  const authContext = useAuth()
  const loggedInUserId = authContext.user?.id
  const isUserPatient = authContext.user?.isUserPatient()
  const isUserAdmin = TeamUtils.isUserAdministrator(team, loggedInUserId)
  const isReadonly = isUserPatient || !isUserAdmin
  const { classes: commonTeamClasses } = commonComponentStyles()
  const { t } = useTranslation('yourloops')

  const onSaveTeam = async (editedTeam: Partial<Team> | null): Promise<void> => {
    try {
      await teamHook.updateTeam(editedTeam as Team)
      alert.success(t('team-page-success-edit'))
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'team-information-edit')

      alert.error(t('team-page-failed-edit'))
    }
  }

  const {
    teamName,
    teamPhone,
    teamEmail,
    addrLine1,
    addrLine2,
    addrZipCode,
    addrCity,
    addrCountry,
    setTeamName,
    setTeamPhone,
    setTeamEmail,
    setAddrLine1,
    setAddrLine2,
    setAddrZipCode,
    setAddrCity,
    setAddrCountry,
    optionsCountries,
    phoneNumberInputOnError,
    emailInputOnError,
    zipcodeInputOnError,
    isFormInvalid,
    handleValidateModal
  } = useTeamCreateEdit({ team, onSaveTeam })

  const formattedTeamCode = formatCode(team.code)

  const commonSlotProps = { input: { readOnly: isReadonly } }

  const hasUpdates = () => {
    return teamName !== team.name
      || teamEmail !== team.email
      || teamPhone !== team.phone
      || addrLine1 !== team.address.line1
      || addrLine2 !== team.address.line2
      || addrZipCode !== team.address.zip
      || addrCity !== team.address.city
      || addrCountry !== team.address.country
  }

  const onCopyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedTeamCode)
      alert.success(t('identification-code-copied-to-clipboard'))
    } catch (err) {
      console.log(err)
      alert.error(t('error-http-40x'))
    }
  }

  return (
    <Box data-testid="team-information">
      <Box className={commonTeamClasses.root}>
        <Box className={commonTeamClasses.categoryHeader}>
          <CardHeader title={t('team-information')} />
          {isUserPatient &&
            <LeaveTeamButton team={team} />
          }
        </Box>

        {!isUserPatient &&
          <Box sx={{ px: 2, pb: 3, width: 'fit-content' }} data-testid="team-information-alert">
            <Alert severity="info">
              {isUserAdmin ? t('team-modal-create-info') : t('only-admins-can-edit')}
            </Alert>
          </Box>
        }

        <Box sx={{ display: 'flex', px: 2, pb: 3, alignItems: 'center' }}>
          <BadgeRounded className={commonTeamClasses.icon} />
          <Typography variant="subtitle2">
            {t('identification-code')}
          </Typography>
          <Chip
            label={formattedTeamCode}
            sx={{ fontWeight: 'bold', mx: 2 }}
            data-testid="team-information-identification-code"
          />
          {
            !isUserPatient &&
            <IconActionButton
              data-testid="copy-team-code-button"
              aria-label={t('copy-to-clipboard')}
              color="inherit"
              size="small"
              icon={<FileCopyRounded fontSize="small" />}
              tooltip={t('copy-to-clipboard')}
              onClick={onCopyCodeToClipboard}
            />
          }
        </Box>

        <Box
          sx={{ display: 'flex', width: '100%', px: 2 }}
          data-testid="team-info-form"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box className={classes.fieldItem}>
              <AccountCircleRounded className={commonTeamClasses.icon} />
              <TextField
                data-testid="team-information-name-input"
                className={classes.inputField}
                onChange={(e) => {
                  setTeamName(e.target.value)
                }}
                name="name"
                value={teamName}
                label={t('team-edit-dialog-placeholder-name')}
                required
                aria-required="true"
                slotProps={commonSlotProps}
              />
            </Box>

            <Box className={classes.fieldItem}>
              <PublicRounded className={commonTeamClasses.icon} />
              <FormControl
                data-testid="team-information-country-select"
                className={classes.inputField}
                required
              >
                <InputLabel htmlFor="team-select-country">
                  {t('team-edit-dialog-placeholder-addr-country')}
                </InputLabel>
                <Select
                  data-testid="team-select-country"
                  name="country"
                  label={t('team-edit-dialog-placeholder-addr-country')}
                  value={addrCountry}
                  onChange={(e) => {
                    setAddrCountry(e.target.value)
                  }}
                  slotProps={commonSlotProps}
                >
                  {optionsCountries}
                </Select>
              </FormControl>
            </Box>

            <Box className={classes.fieldItem}>
              <LocalPhoneRounded className={commonTeamClasses.icon} />
              <TextField
                data-testid="team-information-phone-input"
                className={classes.inputField}
                onChange={(e) => {
                  setTeamPhone(e.target.value)
                }}
                error={phoneNumberInputOnError}
                helperText={phoneNumberInputOnError ? t('invalid-phone-number') : null}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">{PhonePrefixCode[addrCountry]}</InputAdornment>,
                    readOnly: isReadonly
                  }
                }}

                name="phone"
                value={teamPhone}
                label={t('phone-number')}
                required
                aria-required="true"
              />
            </Box>

            <Box className={classes.fieldItem}>
              <EmailRounded className={commonTeamClasses.icon} />
              <TextField
                data-testid="team-information-email-input"
                className={classes.inputField}
                onChange={(e) => {
                  setTeamEmail(e.target.value)
                }}
                error={emailInputOnError}
                helperText={emailInputOnError ? t('invalid-email') : null}
                name="email"
                value={teamEmail}
                label={t('email')}
                aria-required="false"
                slotProps={commonSlotProps}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', marginLeft: 4 }}>
            <Box className={classes.fieldItem}>
              <LocationOnRounded className={commonTeamClasses.icon} />
              <TextField
                data-testid="team-information-addr1-input"
                className={classes.inputField}
                onChange={(e) => {
                  setAddrLine1(e.target.value)
                }}
                name="addr-line1"
                value={addrLine1}
                label={t('team-edit-dialog-placeholder-addr-line1')}
                required
                aria-required="true"
                slotProps={commonSlotProps}
              />
            </Box>

            <Box className={classes.fieldItem}>
              <LocationOnRounded className={commonTeamClasses.icon} />
              <TextField
                data-testid="team-information-addr2-input"
                className={classes.inputField}
                onChange={(e) => {
                  setAddrLine2(e.target.value)
                }}
                name="addr-line2"
                value={addrLine2}
                label={t('team-edit-dialog-placeholder-addr-line2')}
                aria-required="false"
                slotProps={commonSlotProps}
              />
            </Box>

            <Box className={classes.fieldItem}>
              <LocationOnRounded className={commonTeamClasses.icon} />
              <TextField
                data-testid="team-information-zipCode-input"
                className={classes.inputField}
                onChange={(e) => {
                  setAddrZipCode(e.target.value)
                }}
                error={zipcodeInputOnError}
                helperText={zipcodeInputOnError ? t('invalid-zipcode') : null}
                name="addr-zip"
                value={addrZipCode}
                label={t('team-edit-dialog-placeholder-addr-zip')}
                required
                aria-required="true"
                slotProps={commonSlotProps}
              />
            </Box>

            <Box className={classes.fieldItem}>
              <LocationCityRounded className={commonTeamClasses.icon} />
              <TextField
                data-testid="team-information-city-input"
                className={classes.inputField}
                onChange={(e) => {
                  setAddrCity(e.target.value)
                }}
                name="addr-city"
                value={addrCity}
                label={t('team-edit-dialog-placeholder-addr-city')}
                required
                aria-required="true"
                slotProps={commonSlotProps}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {isUserAdmin &&
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', px: 2, pt: 2 }}
          data-testid="team-information-save-button"
        >
          <Button
            disabled={!hasUpdates() || isFormInvalid}
            color="primary"
            variant="contained"
            disableElevation
            onClick={handleValidateModal}
            startIcon={<SaveRounded />}
          >
            {t('button-save')}
          </Button>
        </Box>
      }
    </Box>
  )
}
