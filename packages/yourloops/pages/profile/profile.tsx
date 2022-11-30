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

import React, { useMemo, useEffect, useState } from 'react'
import _ from 'lodash'
import bows from 'bows'
import { Link as LinkRedirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import DialogTitle from '@mui/material/DialogTitle'
import Link from '@mui/material/Link'

import { Errors } from './models'
import { Units } from '../../models/generic'
import { HcpProfession } from '../../models/hcp-profession'
import { LanguageCodes } from '../../models/locales'
import { Preferences, Profile, Settings, UserRoles } from '../../models/user'
import { getCurrentLang } from '../../lib/language'
import { REGEX_BIRTHDATE, setPageTitle } from '../../lib/utils'
import { useAuth } from '../../lib/auth'
import metrics from '../../lib/metrics'
import { useAlert } from '../../components/utils/snackbar'
import PersonalInfoForm from './personal-info-form'
import PreferencesForm from './preferences-form'
import ProgressIconButtonWrapper from '../../components/buttons/progress-icon-button-wrapper'
import SwitchRoleDialogs from '../../components/switch-role'
import { usePatientContext } from '../../lib/patient/provider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(2)
    },
    cancelLink: {
      textDecoration: 'unset'
    },
    formInput: {
      marginTop: theme.spacing(2)
    },
    title: {
      color: theme.palette.primary.main,
      textAlign: 'center',
      width: '100%'
    },
    container: {
      backgroundColor: 'white',
      marginTop: '32px',
      padding: 0,
      [theme.breakpoints.up('sm')]: {
        border: 'solid',
        borderRadius: '15px',
        borderColor: theme.palette.grey[300],
        borderWidth: '1px',
        padding: '0 64px'
      }
    },
    uppercase: {
      textTransform: 'uppercase'
    },
    halfWide: {
      [theme.breakpoints.up('sm')]: {
        width: 'calc(50% - 16px)'
      }
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      [theme.breakpoints.only('xs')]: {
        flexDirection: 'column'
      }
    },
    categoryLabel: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(5),
      '& > :nth-child(2)': {
        marginLeft: theme.spacing(1)
      }
    }
  })
)

const log = bows('ProfilePage')

const ProfilePage = (): JSX.Element => {
  const { t, i18n } = useTranslation('yourloops')
  const classes = useStyles()
  const alert = useAlert()
  const {
    user,
    updatePreferences,
    updateProfile,
    updateSettings
  } = useAuth()

  const patientHook = usePatientContext()

  if (!user) {
    throw new Error('User must be logged-in')
  }

  const role = user.role
  const showFeedback = role === UserRoles.hcp

  const [firstName, setFirstName] = useState<string>(user.firstName)
  const [lastName, setLastName] = useState<string>(user.lastName)
  const [unit, setUnit] = useState<Units>(user.settings?.units?.bg ?? Units.gram)
  const [birthDate, setBirthDate] = useState<string>(user.profile?.patient?.birthday ?? '')
  const [birthPlace, setBirthPlace] = useState<string>(user.profile?.patient?.birthPlace ?? '')
  const [sex, setSex] = useState<string>(user.profile?.patient?.sex ?? '')
  const [ins, setIns] = useState<string>(user.profile?.patient?.ins ?? '')
  const [ssn, setSsn] = useState<string>(user.profile?.patient?.ssn ?? '')
  const [referringDoctor, setReferringDoctor] = useState<string>(user.profile?.patient?.referringDoctor ?? '')
  const [switchRoleOpen, setSwitchRoleOpen] = useState<boolean>(false)
  const [lang, setLang] = useState<LanguageCodes>(user.preferences?.displayLanguageCode ?? getCurrentLang())
  const [hcpProfession, setHcpProfession] = useState<HcpProfession>(user.profile?.hcpProfession ?? HcpProfession.empty)
  const [feedbackAccepted, setFeedbackAccepted] = useState<boolean>(!!user?.profile?.contactConsent?.isAccepted)
  const [saving, setSaving] = useState<boolean>(false)

  const errors: Errors = useMemo(() => ({
    firstName: !firstName,
    lastName: !lastName,
    hcpProfession: role === UserRoles.hcp && hcpProfession === HcpProfession.empty,
    birthDate: role === UserRoles.patient && !REGEX_BIRTHDATE.test(birthDate),
    ins: role === UserRoles.patient && ins.length > 0 && ins.length !== 15,
    ssn: role === UserRoles.patient && ssn.length > 0 && ssn.length !== 15
  }), [firstName, lastName, role, hcpProfession, birthDate, ins.length, ssn.length])

  const getUpdatedPreferences = (): Preferences => {
    const updatedPreferences = _.cloneDeep(user.preferences ?? {})
    updatedPreferences.displayLanguageCode = lang
    return updatedPreferences
  }

  const getUpdatedProfile = (): Profile => {
    const updatedProfile = _.cloneDeep(user.profile ?? {}) as Profile
    updatedProfile.firstName = firstName
    updatedProfile.lastName = lastName
    updatedProfile.fullName = `${firstName} ${lastName}`

    if (user.isUserPatient()) {
      if (!updatedProfile.patient) {
        updatedProfile.patient = {}
      }
      updatedProfile.patient.birthday = birthDate
      updatedProfile.patient.birthPlace = birthPlace
      updatedProfile.patient.ins = ins
      updatedProfile.patient.sex = sex
      updatedProfile.patient.ssn = ssn
      updatedProfile.patient.referringDoctor = referringDoctor
    }
    if (user.isUserHcp()) {
      updatedProfile.hcpProfession = hcpProfession
    }
    if (showFeedback && !!user?.profile?.contactConsent?.isAccepted !== feedbackAccepted) {
      updatedProfile.contactConsent = {
        isAccepted: feedbackAccepted,
        acceptanceTimestamp: new Date().toISOString()
      }
    }

    return updatedProfile
  }

  const getUpdatedSettings = (): Settings => {
    const updatedSettings = _.cloneDeep(user.settings ?? {})
    _.set(updatedSettings, 'units.bg', unit)
    return updatedSettings
  }

  const handleSwitchRoleOpen = (): void => {
    setSwitchRoleOpen(true)
    metrics.send('switch_account', 'display_switch_preferences')
  }

  const handleSwitchRoleCancel = (): void => setSwitchRoleOpen(false)

  const preferencesChanged = !_.isEqual(user.preferences, getUpdatedPreferences())
  const profileChanged = !_.isEqual(user.profile, getUpdatedProfile())
  const settingsChanged = !_.isEqual(user.settings, getUpdatedSettings())
  const isAnyError = useMemo(() => _.some(errors), [errors])
  const canSave = (preferencesChanged || profileChanged || settingsChanged) && !isAnyError && !saving

  const saveProfile = async (): Promise<void> => {
    try {
      await updateProfile(getUpdatedProfile())
      if (user.isUserPatient()) {
        patientHook.refresh()
      }
    } catch (err) {
      log.error('Updating profile:', err)
      alert.error(t('profile-update-failed'))
    }
  }

  const saveSettings = async (): Promise<void> => {
    try {
      await updateSettings(getUpdatedSettings())
    } catch (err) {
      log.error('Updating settings:', err)
      alert.error(t('profile-update-failed'))
    }
  }

  const savePreferences = async (): Promise<void> => {
    try {
      await updatePreferences(getUpdatedPreferences())
    } catch (err) {
      log.error('Updating preferences:', err)
      alert.error(t('profile-update-failed'))
    }
  }

  const onSave = async (): Promise<void> => {
    setSaving(true)
    if (profileChanged) {
      await saveProfile()
    }
    if (settingsChanged) {
      await saveSettings()
    }
    if (preferencesChanged) {
      await savePreferences()
      if (lang !== getCurrentLang()) {
        i18n.changeLanguage(lang)
      }
    }
    alert.success(t('profile-updated'))
    setSaving(false)
  }

  useEffect(() => setPageTitle(t('account-preferences')), [lang, t])

  useEffect(() => {
    // ISO date format is required from the user: It's not a very user-friendly format in all countries, We should change it
    if (role === UserRoles.patient && !!birthDate) {
      let birthday = birthDate
      if (birthday.length > 0 && birthday.indexOf('T') > 0) {
        birthday = birthday.split('T')[0]
      }
      REGEX_BIRTHDATE.test(birthday) ? setBirthDate(birthday) : setBirthDate('')
    }
    // No deps here, because we want the effect only when the component is mounting
    // If we set the deps, the patient won't be able to change its birthday.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <Container className={classes.container} maxWidth="sm">
        <Box display="flex" flexDirection="column" margin={2}>
          <DialogTitle className={classes.title} id="profile-title">
            {t('account-preferences')}
          </DialogTitle>

          <PersonalInfoForm
            birthDate={birthDate}
            birthPlace={birthPlace}
            ins={ins}
            sex={sex}
            ssn={ssn}
            referringDoctor={referringDoctor}
            classes={classes}
            errors={errors}
            firstName={firstName}
            hcpProfession={hcpProfession}
            lastName={lastName}
            role={role}
            user={user}
            setBirthDate={setBirthDate}
            setBirthPlace={setBirthPlace}
            setFirstName={setFirstName}
            setIns={setIns}
            setLastName={setLastName}
            setHcpProfession={setHcpProfession}
            setReferringDoctor={setReferringDoctor}
            setSex={setSex}
            setSsn={setSsn}
          />

          <PreferencesForm
            classes={classes}
            feedbackAccepted={feedbackAccepted}
            lang={lang}
            role={role}
            unit={unit}
            setFeedbackAccepted={setFeedbackAccepted}
            setLang={setLang}
            setUnit={setUnit}
          />

          <Box display="flex" justifyContent="flex-end" my={3}>
            <LinkRedirect className={classes.cancelLink} to="/">
              <Button
                id="profile-button-cancel"
              >
                {t('button-cancel')}
              </Button>
            </LinkRedirect>
            <ProgressIconButtonWrapper inProgress={saving}>
              <Button
                id="profile-button-save"
                variant="contained"
                disabled={!canSave}
                color="primary"
                disableElevation
                className={classes.button}
                onClick={onSave}
              >
                {t('button-save')}
              </Button>
            </ProgressIconButtonWrapper>
          </Box>

          {/** TODO role changing was performed with a call to shoreline.
           *    Now it has to be done with Auth0 since role is a part of auth0 user metadata.
           *    see YLP-1590 (https://diabeloop.atlassian.net/browse/YLP-1590)
           **/}
          {UserRoles.caregiver === role && false &&
            <Link id="profile-link-switch-role" component="button" onClick={handleSwitchRoleOpen}>
              {t('modal-switch-hcp-title')}
            </Link>
          }
        </Box>
      </Container>
      <SwitchRoleDialogs open={switchRoleOpen} onCancel={handleSwitchRoleCancel} />
    </React.Fragment>
  )
}

export default ProfilePage
