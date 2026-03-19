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

import React, { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'

import { type Team, useTeam } from '../../lib/team'
import { commonComponentStyles } from '../common'
import { useAlert } from '../utils/snackbar'
import { useAuth } from '../../lib/auth'
import LeaveTeamButton from './leave-team-button'
import TeamUtils from '../../lib/team/team.util'
import { errorTextFromException, isZipCodeValid, PhonePrefixCode, REGEX_EMAIL, REGEX_PHONE } from '../../lib/utils'
import { logError } from '../../utils/error.util'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { CountryCodes } from '../../lib/auth/models/country.model'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import locales from '../../../../locales/languages.json'
import MenuItem from '@mui/material/MenuItem'
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

type LocalesCountries = Record<string, {
  name: string
}>

const useStyles = makeStyles()((theme) => ({
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  label: {
    fontWeight: 600,
    fontSize: '13px',
    width: '180px'
  },
  value: {
    fontSize: '13px'
  },
  teamInfo: {
    display: 'flex',
    alignItems: 'top',
    width: '50%',
    marginBottom: theme.spacing(4),
    '& > div': {
      display: 'flex',
      alignItems: 'center'
    }
  },
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

const teamFieldsLimits = {
  name: { min: 1, max: 64 },
  phone: { min: 3, max: 32 },
  addLine1: { min: 1, max: 128 },
  addLine2: { min: -1, max: 128 },
  zipCode: { min: 1, max: 16 },
  city: { min: 1, max: 128 },
  country: { min: 1, max: 4 },
  email: { min: 0, max: 64 }
}

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

  const [teamName, setTeamName] = useState(team?.name ?? '')
  const [teamPhone, setTeamPhone] = useState(team?.phone ?? '')
  const [teamEmail, setTeamEmail] = useState(team?.email ?? '')
  const [addrLine1, setAddrLine1] = useState(team?.address?.line1 ?? '')
  const [addrLine2, setAddrLine2] = useState(team?.address?.line2 ?? '')
  const [addrZipCode, setAddrZipCode] = useState(team?.address?.zip ?? '')
  const [addrCity, setAddrCity] = useState(team?.address?.city ?? '')
  const [addrCountry, setAddrCountry] = useState(team?.address?.country ?? authContext.user?.settings?.country ?? CountryCodes.France)

  const countries: LocalesCountries = locales.countries
  const optionsCountries: JSX.Element[] = []
  const isPhoneNumberValid: boolean = REGEX_PHONE.test(teamPhone)
  const isEmailValid: boolean = REGEX_EMAIL.test(teamEmail)
  const zipcodeInputOnError: boolean = !(addrZipCode.length === 0 || isZipCodeValid(addrCountry, addrZipCode))
  const phoneNumberInputOnError: boolean = !(teamPhone.length === 0 || isPhoneNumberValid)
  const emailInputOnError: boolean = (!(teamEmail.length === 0 || isEmailValid))

  const formattedTeamCode = formatCode(team.code)

  const commonSlotProps = { input: { readOnly: isReadonly } }

  for (const entry in countries) {
    if (Object.hasOwn(countries, entry)) {
      const { name } = countries[entry]
      optionsCountries.push(
        <MenuItem
          id={`team-edit-dialog-select-country-item-${entry}`}
          value={entry}
          key={name}
          aria-label={name}
        >
          {name}
        </MenuItem>
      )
    }
  }
  optionsCountries.sort((a: JSX.Element, b: JSX.Element) => {
    const aName = a.key
    const bName = b.key
    return aName.localeCompare(bName)
  })

  const isFormIsIncomplete = (): boolean => {
    const inLimit = (value: string, limits: { min: number, max: number }): boolean => {
      const len = value.length
      return len > limits.min && len < limits.max
    }
    let valid = inLimit(teamName.trim(), teamFieldsLimits.name)
    valid = valid && inLimit(teamPhone.trim(), teamFieldsLimits.phone)
    valid = valid && inLimit(addrLine1.trim(), teamFieldsLimits.addLine1)
    valid = valid && inLimit(addrLine2.trim(), teamFieldsLimits.addLine2)
    valid = valid && inLimit(addrZipCode.trim(), teamFieldsLimits.zipCode)
    valid = valid && inLimit(addrCity.trim(), teamFieldsLimits.city)
    valid = valid && inLimit(addrCountry.trim(), teamFieldsLimits.country)
    const email = teamEmail.trim()
    if (valid && inLimit(email, teamFieldsLimits.email)) {
      valid = REGEX_EMAIL.test(email)
    }
    return (zipcodeInputOnError || phoneNumberInputOnError) || !valid
  }

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

  const formIsIncomplete = useMemo(isFormIsIncomplete, [
    teamName,
    teamEmail,
    teamPhone,
    addrCity,
    addrCountry,
    addrLine1,
    addrLine2,
    addrZipCode,
    zipcodeInputOnError,
    phoneNumberInputOnError
  ])

  const handleValidateModal = (): void => {
    const updatedTeam = team === null ? {} as Partial<Team> : { ...team, members: [] }
    updatedTeam.name = teamName.trim()
    updatedTeam.phone = teamPhone.trim()

    const email = teamEmail.trim()
    if (email.length > 0) {
      updatedTeam.email = email
    } else {
      delete updatedTeam.email
    }

    updatedTeam.address = {
      line1: addrLine1.trim(),
      line2: addrLine2.trim(),
      zip: addrZipCode.trim(),
      city: addrCity.trim(),
      country: addrCountry.trim()
    }
    if ((updatedTeam.address.line2?.length ?? 0) < 1) {
      delete updatedTeam.address.line2
    }
    onSaveTeam(updatedTeam)
  }

  const onSaveTeam = async (editedTeam: Partial<Team> | null): Promise<void> => {
    if (editedTeam) {
      try {
        await teamHook.updateTeam(editedTeam as Team)
        alert.success(t('team-page-success-edit'))
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason)
        logError(errorMessage, 'team-information-edit')

        alert.error(t('team-page-failed-edit'))
      }
    }
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
    <React.Fragment>
      <Box className={commonTeamClasses.root} data-testid="team-information">
        <Box className={commonTeamClasses.categoryHeader}>
          <CardHeader title={t('team-information')} />
          {isUserPatient &&
            <Box id="leave-team-button">
              <LeaveTeamButton team={team} />
            </Box>
          }
        </Box>

        {!isUserAdmin && !isUserPatient &&
          <Box sx={{ px: 2, width: 'fit-content' }}>
            <Alert severity="info">
              {t('only-admins-can-edit')}
            </Alert>
          </Box>
        }

        <Box sx={{ display: 'flex', px: 2, py: 3, alignItems: 'center' }}>
          <BadgeRounded className={commonTeamClasses.icon} />
          <Typography variant="subtitle2">
            {t('identification-code')}
          </Typography>
          <Chip label={formattedTeamCode} sx={{ fontWeight: 'bold', mx: 2 }} />
          <IconActionButton
            color="inherit"
            size="small"
            icon={<FileCopyRounded fontSize="small" />}
            tooltip={t('copy-to-clipboard')}
            onClick={onCopyCodeToClipboard}
          />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', px: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box className={classes.fieldItem}>
              <AccountCircleRounded className={commonTeamClasses.icon} />
              <TextField
                id="team-edit-dialog-field-name"
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
                data-testid="country"
                className={classes.inputField}
                required
              >
                <InputLabel htmlFor="team-edit-dialog-select-country">
                  {t('team-edit-dialog-placeholder-addr-country')}
                </InputLabel>
                <Select
                  id="team-edit-dialog-select-country"
                  data-testid="team-edit-dialog-select-country"
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
                id="team-edit-dialog-field-phone"
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
                id="team-edit-dialog-field-email"
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
                id="team-edit-dialog-field-line1"
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
                id="team-edit-dialog-field-line2"
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
                id="team-edit-dialog-field-zip"
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
                id="team-edit-dialog-field-city"
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', px: 2, pt: 2 }}>
          <Button
            disabled={!hasUpdates() || formIsIncomplete}
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
    </React.Fragment>
  )
}
