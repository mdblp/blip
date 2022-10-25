import React, { createContext, FunctionComponent, useContext, useMemo, useState } from 'react'
import { ProfileErrors, ProfileForm, ProfileFormKey } from './models'
import { useAuth } from '../../lib/auth'
import { Units } from '../../models/generic'
import { getCurrentLang } from '../../lib/language'
import { LanguageCodes } from '../../models/locales'
import { HcpProfession } from '../../models/hcp-profession'
import { Profile, UserRoles, Settings, Preferences } from '../../models/user'
import { REGEX_BIRTHDATE } from '../../lib/utils'
import { isEqual, some } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAlert } from '../../components/utils/snackbar'

interface ProfilePageContext {
  canSave: boolean
  errors: ProfileErrors
  profileForm: ProfileForm
  saveProfile: () => Promise<void>
  saving: boolean
  updateProfileForm: (key: ProfileFormKey, value: boolean | string | LanguageCodes | Units | HcpProfession) => void
}

const ProfilePageStateContext = createContext<ProfilePageContext>({} as ProfilePageContext)

export const ProfilePageContextProvider: FunctionComponent = ({ children }) => {
  const alert = useAlert()
  const { t, i18n } = useTranslation('yourloops')
  const { user, updateProfile, updatePreferences, updateSettings } = useAuth()

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: user.firstName,
    lastName: user.lastName,
    units: user.settings?.units?.bg ?? Units.gram,
    birthday: user.birthday,
    birthPlace: user.profile?.patient?.birthPlace ?? '',
    lang: user.preferences?.displayLanguageCode ?? getCurrentLang(),
    hcpProfession: user.profile?.hcpProfession ?? HcpProfession.empty,
    referringDoctor: user.profile?.patient?.referringDoctor ?? undefined,
    feedbackAccepted: !!user?.profile?.contactConsent?.isAccepted,
    sex: user.profile?.patient?.sex ?? undefined,
    ins: user.profile?.patient?.ins ?? undefined,
    ssn: user.profile?.patient?.ssn ?? undefined
  })
  const [saving, setSaving] = useState<boolean>(false)

  const errors: ProfileErrors = {
    firstName: !profileForm.firstName,
    lastName: !profileForm.lastName,
    hcpProfession: user.role === UserRoles.hcp && profileForm.hcpProfession === HcpProfession.empty,
    birthday: user.role === UserRoles.patient && !REGEX_BIRTHDATE.test(profileForm.birthday),
    ins: user.role === UserRoles.patient && profileForm.ins && profileForm.ins.length > 0 && profileForm.ins.length !== 15,
    ssn: user.role === UserRoles.patient && profileForm.ssn && profileForm.ssn.length > 0 && profileForm.ssn.length !== 15
  }

  const updatedProfile = useMemo<Profile>(() => {
    let profile: Profile = {
      ...user.profile,
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      fullName: `${profileForm.firstName} ${profileForm.lastName}`
    }

    if (user.isUserPatient()) {
      profile = {
        ...profile,
        patient: {
          birthday: profileForm.birthday,
          birthPlace: profileForm.birthPlace,
          ins: profileForm.ins,
          sex: profileForm.sex,
          ssn: profileForm.ssn,
          referringDoctor: profileForm.referringDoctor
        }
      }
    }

    if (user.isUserHcp()) {
      profile = { ...profile, hcpProfession: profileForm.hcpProfession }
    }

    if (user.isUserHcp() && !!user?.profile?.contactConsent?.isAccepted !== profileForm.feedbackAccepted) {
      profile = {
        ...profile,
        contactConsent: {
          isAccepted: profileForm.feedbackAccepted,
          acceptanceTimestamp: new Date().toISOString()
        }
      }
    }

    return profile
  }, [profileForm.birthPlace, profileForm.birthday, profileForm.feedbackAccepted, profileForm.firstName, profileForm.hcpProfession, profileForm.ins, profileForm.lastName, profileForm.referringDoctor, profileForm.sex, profileForm.ssn, user])

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
      alert.success(t('profile-updated'))
    } catch (err) {
      alert.error(t('profile-update-failed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProfilePageStateContext.Provider value={{ profileForm, updateProfileForm, errors, canSave, saving, saveProfile }}>
      {children}
    </ProfilePageStateContext.Provider>
  )
}

export const useProfilePageState = (): ProfilePageContext => useContext(ProfilePageStateContext)
