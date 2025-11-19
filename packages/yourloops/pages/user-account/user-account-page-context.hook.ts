/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { getCurrentLang } from '../../lib/language'
import { isEqual, some } from 'lodash'
import { type UserAccountErrors, type UserAccountForm } from './models/user-account-form.model'
import { type UserAccountFormKey } from './models/enums/user-account-form-key.enum'
import { HcpProfession } from '../../lib/auth/models/enums/hcp-profession.enum'
import { UserAccount } from '../../lib/auth/models/user-account.model'
import { type Settings } from '../../lib/auth/models/settings.model'
import { type Preferences } from '../../lib/auth/models/preferences.model'
import { Unit } from 'medical-domain'

interface UseUserAccountPageContextHookReturn {
  canSave: boolean
  errors: UserAccountErrors
  userAccountForm: UserAccountForm
  saveUserAccount: () => Promise<void>
  saving: boolean
  updateUserAccountForm: (key: UserAccountFormKey, value: unknown) => void
}

const useUserAccountPageContextHook = (): UseUserAccountPageContextHookReturn => {
  const alert = useAlert()
  const { t, i18n } = useTranslation('yourloops')
  const { user, updateUserAccount, updatePreferences, updateSettings } = useAuth()
  const isUserPatient = user.isUserPatient()
  const isUserHcp = user.isUserHcp()

  const [userAccountForm, setUserAccountForm] = useState<UserAccountForm>({
    feedbackAccepted: !!user?.account?.contactConsent?.isAccepted,
    firstName: user.firstName,
    hcpProfession: user.account?.hcpProfession ?? HcpProfession.empty,
    lang: user.preferences?.displayLanguageCode ?? getCurrentLang(),
    lastName: user.lastName,
    sex: user.account?.patient?.sex ?? undefined,
    units: user.settings?.units?.bg ?? Unit.MilligramPerDeciliter,
    country: user.settings.country
  })
  const [saving, setSaving] = useState<boolean>(false)

  const errors: UserAccountErrors = {
    firstName: !userAccountForm.firstName,
    hcpProfession: isUserHcp && userAccountForm.hcpProfession === HcpProfession.empty,
    lastName: !userAccountForm.lastName
  }

  const updatedUserAccount = useMemo<UserAccount>(() => {
    const userAccount: UserAccount = {
      ...user.account,
      firstName: userAccountForm.firstName,
      lastName: userAccountForm.lastName,
      fullName: `${userAccountForm.firstName} ${userAccountForm.lastName}`
    }

    if (isUserPatient) {
      userAccount.patient = {
        ...userAccount.patient,
        sex: userAccountForm.sex
      }
    }

    if (user.isUserHcp()) {
      userAccount.hcpProfession = userAccountForm.hcpProfession
    }

    if (isUserHcp && !!user?.account?.contactConsent?.isAccepted !== userAccountForm.feedbackAccepted) {
      userAccount.contactConsent = {
        isAccepted: userAccountForm.feedbackAccepted,
        acceptanceTimestamp: new Date().toISOString()
      }
    }

    return userAccount
  }, [isUserHcp, isUserPatient, userAccountForm.feedbackAccepted, userAccountForm.firstName, userAccountForm.hcpProfession, userAccountForm.lastName, userAccountForm.sex, user])

  const updatedSettings: Settings = {
    ...user.settings,
    units: { bg: userAccountForm.units },
    country: userAccountForm.country
  }
  const updatedPreferences: Preferences = {
    ...user.preferences,
    displayLanguageCode: userAccountForm.lang
  }

  const userAccountChanged: boolean = !isEqual(user.account, updatedUserAccount)
  const preferencesChanged: boolean = !isEqual(user.preferences, updatedPreferences)
  const settingsChanged: boolean = !isEqual(user.settings, updatedSettings)
  const canSave: boolean = (preferencesChanged || userAccountChanged || settingsChanged) && !some(errors)

  const updateUserAccountForm = (key: UserAccountFormKey, value: unknown): void => {
    setUserAccountForm(prevState => ({ ...prevState, [key]: value }))
  }

  const saveUserAccount = async (): Promise<void> => {
    try {
      setSaving(true)
      if (userAccountChanged) {
        await updateUserAccount(updatedUserAccount)
      }

      if (settingsChanged) {
        await updateSettings(updatedSettings)
      }

      if (preferencesChanged) {
        await updatePreferences(updatedPreferences)
        await i18n.changeLanguage(userAccountForm.lang)
      }

      alert.success(t('profile-updated'))
    } catch (err) {
      alert.error(t('profile-update-failed'))
    } finally {
      setSaving(false)
    }
  }

  return { userAccountForm, updateUserAccountForm, errors, canSave, saving, saveUserAccount }
}

export default useUserAccountPageContextHook
