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

import React, { FC } from 'react'
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
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { type Team } from '../../lib/team'
import { PhonePrefixCode } from '../../lib/utils'
import { ExternalFilesService } from '../../lib/external-files/external-files.service'
import { useTeamCreateEdit } from './team-create-edit.hook'

export interface TeamCreateDialogProps {
  onSaveTeam: (createdTeam: Partial<Team> | null) => void
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

/**
 * Show a dialog to create a team.
 */
export const TeamCreateDialog: FC<TeamCreateDialogProps> = (props: TeamCreateDialogProps) => {
  const { onSaveTeam } = props
  const { classes } = modalStyles()
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const isXSBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  const termsOfUseUrl = ExternalFilesService.getTermsOfUseUrl()

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
  } = useTeamCreateEdit({ team: null, onSaveTeam })

  const handleCancelModal = (): void => {
    onSaveTeam(null)
  }

  const termsOfUse = t('terms-of-use')
  const linkTerms = (
    <Link aria-label={termsOfUse} href={termsOfUseUrl} target="_blank" rel="noreferrer">
      {termsOfUse}
    </Link>
  )
  const warningLines = (
    <Box sx={{ px: 2 }}>
      <p>{t('team-modal-create-warning-line1')}</p>
      <p>
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

  return (
    <Dialog
      aria-labelledby={t('button-create-a-team')}
      open={true}
      scroll="paper"
      onClose={handleCancelModal}
      maxWidth="sm"
      fullWidth
      fullScreen={isXSBreakpoint}
      data-testid="team-create-dialog"
    >
      <DialogTitle>
        <strong>{t('team-modal-add-title')}</strong>
      </DialogTitle>

      <Box sx={{ px: 2, pb: 2 }}>
        <span>{t('team-modal-create-info')}</span>
      </Box>

      <DialogContent className={classes.dialogContent}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column"
          }}>
          <TextField
            className={classes.formChild}
            onChange={(e) => {
              setTeamName(e.target.value)
            }}
            name="name"
            value={teamName}
            label={t('team-edit-dialog-placeholder-name')}
            required
            aria-required="true"
            data-testid="team-create-dialog-name-input"
          />
          <TextField
            className={classes.formChild}
            onChange={(e) => {
              setAddrLine1(e.target.value)
            }}
            name="addr-line1"
            value={addrLine1}
            label={t('team-edit-dialog-placeholder-addr-line1')}
            required
            aria-required="true"
            data-testid="team-create-dialog-addr1-input"
          />
          <TextField
            className={classes.formChild}
            onChange={(e) => {
              setAddrLine2(e.target.value)
            }}
            name="addr-line2"
            value={addrLine2}
            label={t('team-edit-dialog-placeholder-addr-line2')}
            aria-required="false"
            data-testid="team-create-dialog-addr2-input"
          />
          <TextField
            className={classes.formChild}
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
            data-testid="team-create-dialog-zipcode-input"
          />
          <TextField
            className={classes.formChild}
            onChange={(e) => {
              setAddrCity(e.target.value)
            }}
            name="addr-city"
            value={addrCity}
            label={t('team-edit-dialog-placeholder-addr-city')}
            required
            aria-required="true"
            data-testid="team-create-dialog-city-input"
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
              data-testid="team-create-dialog-country-select"
              name="country"
              label={t('team-edit-dialog-placeholder-addr-country')}
              value={addrCountry}
              onChange={(e) => {
                setAddrCountry(e.target.value)
              }}
            >
              {optionsCountries}
            </Select>
          </FormControl>
          <TextField
            className={classes.formChild}
            onChange={(e) => {
              setTeamPhone(e.target.value)
            }}
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
            data-testid="team-create-dialog-phone-input"
          />
          <TextField
            className={classes.formChild}
            onChange={(e) => {
              setTeamEmail(e.target.value)
            }}
            error={emailInputOnError}
            helperText={emailInputOnError ? t('invalid-email') : null}
            name="email"
            value={teamEmail}
            label={t('email')}
            aria-required="false"
          data-testid="team-create-dialog-email-input"
          />
        </Box>
      </DialogContent>

      {warningLines}

      <DialogActions>
        <Button
          data-testid="team-create-dialog-cancel-button"
          variant="outlined"
          onClick={handleCancelModal}
        >
          {t('button-cancel')}
        </Button>
        <Button
          data-testid="team-create-dialog-save-button"
          disabled={isFormInvalid}
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleValidateModal}
        >
          {t('button-create-team')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
