/*
 * Copyright (c) 2022, Diabeloop
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

import { useAlert } from '../../components/utils/snackbar'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/auth'
import { useMemo, useState } from 'react'
import { ProfileErrors, ProfileForm, ProfileFormKey } from './models'
import { HcpProfession } from '../../models/hcp-profession'
import { getCurrentLang } from '../../lib/language'
import { Units } from '../../models/generic'
import { REGEX_BIRTHDATE } from '../../lib/utils'
import { Preferences, Profile, Settings } from '../../models/user'
import { isEqual, some } from 'lodash'
import { CountryCodes } from '../../models/locales'
import { usePatientContext } from '../../lib/patient/provider'

interface UseProfilePageContextHookReturn {
  canSave: boolean
  errors: ProfileErrors
  profileForm: ProfileForm
  saveProfile: () => Promise<void>
  saving: boolean
  updateProfileForm: (key: ProfileFormKey, value: unknown) => void
}

const useProfilePageContextHook = (): UseProfilePageContextHookReturn => {
  const alert = useAlert()
  const { t, i18n } = useTranslation('yourloops')
  const { user, updateProfile, updatePreferences, updateSettings } = useAuth()
  const patientHook = usePatientContext()
  const isUserPatient = user.isUserPatient()
  const isUserHcp = user.isUserHcp()

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    birthday: user.birthday,
    birthPlace: user.profile?.patient?.birthPlace ?? '',
    feedbackAccepted: !!user?.profile?.contactConsent?.isAccepted,
    firstName: user.firstName,
    hcpProfession: user.profile?.hcpProfession ?? HcpProfession.empty,
    ins: user.profile?.patient?.ins ?? undefined,
    lang: user.preferences?.displayLanguageCode ?? getCurrentLang(),
    lastName: user.lastName,
    referringDoctor: user.profile?.patient?.referringDoctor ?? undefined,
    sex: user.profile?.patient?.sex ?? undefined,
    ssn: user.profile?.patient?.ssn ?? undefined,
    units: user.settings?.units?.bg ?? Units.gram
  })
  const [saving, setSaving] = useState<boolean>(false)

  const errors: ProfileErrors = {
    birthday: isUserPatient && !REGEX_BIRTHDATE.test(profileForm.birthday),
    firstName: !profileForm.firstName,
    hcpProfession: isUserHcp && profileForm.hcpProfession === HcpProfession.empty,
    ins: isUserPatient && user.settings?.country === CountryCodes.France && (!profileForm.ins || (profileForm.ins && profileForm.ins.length !== 15)),
    lastName: !profileForm.lastName,
    ssn: isUserPatient && user.settings?.country === CountryCodes.France && (!profileForm.ssn || (profileForm.ssn && profileForm.ssn.length !== 15))
  }

  const updatedProfile = useMemo<Profile>(() => {
    const profile: Profile = {
      ...user.profile,
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      fullName: `${profileForm.firstName} ${profileForm.lastName}`
    }

    if (isUserPatient) {
      profile.patient = {
        ...profile.patient,
        birthday: profileForm.birthday,
        birthPlace: profileForm.birthPlace,
        ins: profileForm.ins,
        sex: profileForm.sex,
        ssn: profileForm.ssn,
        referringDoctor: profileForm.referringDoctor
      }
    }

    if (user.isUserHcp()) {
      profile.hcpProfession = profileForm.hcpProfession
    }

    if (isUserHcp && !!user?.profile?.contactConsent?.isAccepted !== profileForm.feedbackAccepted) {
      profile.contactConsent = {
        isAccepted: profileForm.feedbackAccepted,
        acceptanceTimestamp: new Date().toISOString()
      }
    }

    return profile
  }, [isUserHcp, isUserPatient, profileForm.birthPlace, profileForm.birthday, profileForm.feedbackAccepted, profileForm.firstName, profileForm.hcpProfession, profileForm.ins, profileForm.lastName, profileForm.referringDoctor, profileForm.sex, profileForm.ssn, user])

  const updatedSettings: Settings = {
    ...user.settings,
    units: { bg: profileForm.units }
  }
  const updatedPreferences: Preferences = {
    ...user.preferences,
    displayLanguageCode: profileForm.lang
  }

  const profileChanged: boolean = !isEqual(user.profile, updatedProfile)
  const preferencesChanged: boolean = !isEqual(user.preferences, updatedPreferences)
  const settingsChanged: boolean = !isEqual(user.settings, updatedSettings)
  const canSave: boolean = (preferencesChanged || profileChanged || settingsChanged) && !some(errors)

  const updateProfileForm = (key: ProfileFormKey, value: unknown): void => {
    setProfileForm(prevState => ({ ...prevState, [key]: value }))
  }

  const saveProfile = async (): Promise<void> => {
    try {
      setSaving(true)
      if (profileChanged) {
        await updateProfile(updatedProfile)
      }

      if (settingsChanged) {
        await updateSettings(updatedSettings)
      }

      if (preferencesChanged) {
        await updatePreferences(updatedPreferences)
        await i18n.changeLanguage(profileForm.lang)
      }

      if (isUserPatient) {
        patientHook.refresh()
      }
      alert.success(t('profile-updated'))
    } catch (err) {
      alert.error(t('profile-update-failed'))
    } finally {
      setSaving(false)
    }
  }

  return { profileForm, updateProfileForm, errors, canSave, saving, saveProfile }
}

export default useProfilePageContextHook
