/*
 * Copyright (c) 2021-2022, Diabeloop
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
import { tz } from 'moment-timezone'
import { useTranslation } from 'react-i18next'

import { ClassNameMap } from '@mui/styles/withStyles'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { User } from '../../lib/auth'
import { Errors } from './models'

interface PatientProfileFormProps {
  user: User
  classes: ClassNameMap<'formInput'>
  birthDate?: string
  birthPlace?: string
  ins?: string
  sex?: string
  ssn?: string
  referringDoctor?: string
  setBirthDate: React.Dispatch<string>
  setBirthPlace: React.Dispatch<string>
  setIns: React.Dispatch<string>
  setSex: React.Dispatch<string>
  setSsn: React.Dispatch<string>
  setReferringDoctor: React.Dispatch<string>
  errors: Errors
}

function PatientProfileForm(props: PatientProfileFormProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const {
    user, classes, errors,
    birthDate, birthPlace, ins, sex, ssn, referringDoctor,
    setBirthDate, setBirthPlace, setIns, setSex, setSsn, setReferringDoctor
  } = props

  const browserTimezone = React.useMemo(() => new Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const a1cDate = user.settings?.a1c?.date
  const a1cValue = user.settings?.a1c?.value
  const country = user.settings?.country ?? ''
  return (
    <React.Fragment>
      <TextField
        id="profile-textfield-birthdate"
        label={t('birthdate')}
        variant="standard"
        value={birthDate}
        onChange={event => setBirthDate(event.target.value)}
        error={errors.birthDate}
        helperText={errors.birthDate && t('required-field')}
        className={classes.formInput}
      />
      <TextField
        id="profile-textfield-birthplace"
        label={t('birthplace')}
        variant="standard"
        value={birthPlace}
        onChange={event => setBirthPlace(event.target.value)}
        className={classes.formInput}
        inputProps={{ maxlength: '50' }}
      />
      <FormControl variant="standard" className={`${props.classes.formInput}`}>
        <InputLabel id="profile-select-gender-label" htmlFor="profile-select-gender">{t('gender')}</InputLabel>
        <Select
          id="profile-select-gender"
          labelId="profile-select-gender-label"
          value={sex}
          onChange={event => setSex(event.target.value)}
        >
          <MenuItem value="" aria-label={t('none')}>{t('none')}</MenuItem>
          <MenuItem value="M" aria-label={t('male')}>{t('male')}</MenuItem>
          <MenuItem value="F" aria-label={t('female')}>{t('female')}</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="profile-textfield-referring-doctor"
        label={t('referring-doctor')}
        variant="standard"
        value={referringDoctor}
        onChange={event => setReferringDoctor(event.target.value)}
        className={classes.formInput}
        inputProps={{ maxlength: '50' }}
      />
      {country === 'FR' &&
      <>
        <TextField
          id="profile-textfield-ins"
          label={t('ins')}
          variant="standard"
          value={ins}
          onChange={event => setIns(event.target.value)}
          className={classes.formInput}
          inputProps={{ maxlength: '15' }}
          error={errors.ins}
          helperText={errors.ins && t('field-with-exactly-15-characters')}
        />
        <TextField
          id="profile-textfield-ssn"
          label={t('ssn')}
          variant="standard"
          value={ssn}
          onChange={event => setSsn(event.target.value)}
          className={classes.formInput}
          inputProps={{ maxlength: '15' }}
          error={errors.ssn}
          helperText={errors.ssn && t('field-with-exactly-15-characters')}
        />
      </>
      }
      {a1cValue && a1cDate &&
        <TextField
          id="hbA1c"
          label={t('patient-profile-hba1c', { hba1cMoment: tz(a1cDate, browserTimezone).format('L') })}
          variant="standard"
          disabled
          value={`${a1cValue}%`}
          className={classes.formInput}
        />
      }
    </React.Fragment>
  )
}

export default PatientProfileForm
