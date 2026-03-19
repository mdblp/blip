/*
 * Copyright (c) 2021-2026, Diabeloop
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

import _ from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'

import locales from '../../../../locales/languages.json'
import { type Team } from '../../lib/team'
import { isZipCodeValid, PhonePrefixCode, REGEX_EMAIL, REGEX_PHONE } from '../../lib/utils'
import { useAuth } from '../../lib/auth'
import { type TeamEditModalContentProps } from './types'
import { CountryCodes } from '../../lib/auth/models/country.model'
import { ExternalFilesService } from '../../lib/external-files/external-files.service'

type LocalesCountries = Record<string, {
  name: string
}>

export interface TeamInformationEditModalProps {
  teamToEdit: TeamEditModalContentProps | null
}

const modalStyles = makeStyles()((theme) => {
  return {
    dialogContent: {
      maxHeight: '28em'
    },
    formChild: {
      marginBottom: theme.spacing(2)
    }
  }
})

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

/**
 * Show a dialog to edit a team.
 * If the team in props.team is empty, the modal is used to create a team.
 * @param props null to hide the modal
 */
function TeamInformationEditDialog(props: TeamInformationEditModalProps): JSX.Element {
  const { teamToEdit } = props
  const { team, onSaveTeam } = teamToEdit ?? ({ team: null, onSaveTeam: _.noop } as TeamEditModalContentProps)
  const { classes } = modalStyles()
  const auth = useAuth()
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const isXSBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  const [modalOpened, setModalOpened] = useState(false)
  const [teamName, setTeamName] = useState(team?.name ?? '')
  const [teamPhone, setTeamPhone] = useState(team?.phone ?? '')
  const [teamEmail, setTeamEmail] = useState(team?.email ?? '')
  const [addrLine1, setAddrLine1] = useState(team?.address?.line1 ?? '')
  const [addrLine2, setAddrLine2] = useState(team?.address?.line2 ?? '')
  const [addrZipCode, setAddrZipCode] = useState(team?.address?.zip ?? '')
  const [addrCity, setAddrCity] = useState(team?.address?.city ?? '')
  const [addrCountry, setAddrCountry] = useState(team?.address?.country ?? auth.user?.settings?.country ?? CountryCodes.France)
  const isPhoneNumberValid: boolean = REGEX_PHONE.test(teamPhone)
  const isEmailValid: boolean = REGEX_EMAIL.test(teamEmail)
  const countries: LocalesCountries = locales.countries
  const optionsCountries: JSX.Element[] = []
  const zipcodeInputOnError: boolean = !(addrZipCode.length === 0 || isZipCodeValid(addrCountry, addrZipCode))
  const phoneNumberInputOnError: boolean = !(teamPhone.length === 0 || isPhoneNumberValid)
  const emailInputOnError: boolean = (!(teamEmail.length === 0 || isEmailValid))

  const termsOfUseUrl = ExternalFilesService.getTermsOfUseUrl()

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

  const handleCancelModal = (): void => {
    onSaveTeam(null)
  }

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

  useEffect((): void => {
    setModalOpened(teamToEdit !== null)
  }, [teamToEdit])

  let ariaModal: string
  let modalTitle: string
  let modalButtonValidate: string
  let warningLines = null
  if (team === null) {
    // Create a new team
    ariaModal = t('button-create-a-team')
    modalTitle = t('team-modal-add-title')
    modalButtonValidate = t('button-create-team')
    const termsOfUse = t('terms-of-use')
    const linkTerms = (
      <Link aria-label={termsOfUse} href={termsOfUseUrl} target="_blank" rel="noreferrer">
        {termsOfUse}
      </Link>
    )
    warningLines = (
      <Box sx={{ px: 2 }}>
        <p id="team-edit-dialog-warning-line1">{t('team-modal-create-warning-line1')}</p>
        <p id="team-edit-dialog-warning-line2">
          <Trans
            i18nKey="team-modal-create-warning-line2"
            t={t}
            components={{ linkTerms }}
            values={{ terms: termsOfUse }}
            parent={React.Fragment}
          >
            By accepting our {termsOfUse} you confirm you are a registered healthcare professional in your country
            and have the right to create a care team.
          </Trans>
        </p>
      </Box>
    )
  } else {
    ariaModal = t('aria-modal-team-edit')
    modalTitle = t('modal-team-edit-title')
    modalButtonValidate = t('button-save')
  }

  return (
    <Dialog
      id="team-edit-dialog"
      aria-labelledby={ariaModal}
      open={modalOpened}
      scroll="paper"
      onClose={handleCancelModal}
      maxWidth="sm"
      fullWidth
      fullScreen={isXSBreakpoint}
    >
      <DialogTitle>
        <strong>{modalTitle}</strong>
      </DialogTitle>

      {team
        ? <Box
        sx={{
          paddingX: 2,
          paddingBottom: 2
        }}>
          <span id="team-edit-dialog-info-line">{t('team-modal-create-info')}</span>
        </Box>
        : <Box />
      }

      <DialogContent className={classes.dialogContent}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}>
          <TextField
            id="team-edit-dialog-field-name"
            className={classes.formChild}
            onChange={(e) => { setTeamName(e.target.value) }}
            name="name"
            value={teamName}
            label={t('team-edit-dialog-placeholder-name')}
            required
            aria-required="true"
          />
          <TextField
            id="team-edit-dialog-field-line1"
            className={classes.formChild}
            onChange={(e) => { setAddrLine1(e.target.value) }}
            name="addr-line1"
            value={addrLine1}
            label={t('team-edit-dialog-placeholder-addr-line1')}
            required
            aria-required="true"
          />
          <TextField
            id="team-edit-dialog-field-line2"
            className={classes.formChild}
            onChange={(e) => { setAddrLine2(e.target.value) }}
            name="addr-line2"
            value={addrLine2}
            label={t('team-edit-dialog-placeholder-addr-line2')}
            aria-required="false"
          />
          <TextField
            id="team-edit-dialog-field-zip"
            className={classes.formChild}
            onChange={(e) => { setAddrZipCode(e.target.value) }}
            error={zipcodeInputOnError}
            helperText={zipcodeInputOnError ? t('invalid-zipcode') : null}
            name="addr-zip"
            value={addrZipCode}
            label={t('team-edit-dialog-placeholder-addr-zip')}
            required
            aria-required="true"
          />
          <TextField
            id="team-edit-dialog-field-city"
            className={classes.formChild}
            onChange={(e) => { setAddrCity(e.target.value) }}
            name="addr-city"
            value={addrCity}
            label={t('team-edit-dialog-placeholder-addr-city')}
            required
            aria-required="true"
          />
          <FormControl
            data-testid="country"
            className={classes.formChild}
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
              onChange={(e) => { setAddrCountry(e.target.value) }}
            >
              {optionsCountries}
            </Select>
          </FormControl>
          <TextField
            id="team-edit-dialog-field-phone"
            className={classes.formChild}
            onChange={(e) => { setTeamPhone(e.target.value) }}
            error={phoneNumberInputOnError}
            helperText={phoneNumberInputOnError ? t('invalid-phone-number') : null}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{PhonePrefixCode[addrCountry]}</InputAdornment>
              }
            }}

            name="phone"
            value={teamPhone}
            label={t('phone-number')}
            required
            aria-required="true"
          />
          <TextField
            id="team-edit-dialog-field-email"
            className={classes.formChild}
            onChange={(e) => { setTeamEmail(e.target.value) }}
            error={emailInputOnError}
            helperText={emailInputOnError ? t('invalid-email') : null}
            name="email"
            value={teamEmail}
            label={t('email')}
            aria-required="false"
          />
        </Box>
      </DialogContent>

      {warningLines}

      <DialogActions>
        <Button
          id="team-edit-dialog-button-close"
          variant="outlined"
          onClick={handleCancelModal}
        >
          {t('button-cancel')}
        </Button>
        <Button
          id="team-edit-dialog-button-validate"
          disabled={formIsIncomplete}
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleValidateModal}
        >
          {modalButtonValidate}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TeamInformationEditDialog
