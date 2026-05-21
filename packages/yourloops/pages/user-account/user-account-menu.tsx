/*
 * Copyright (c) 2026, Diabeloop
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
import { UserAccountSection } from './models/enums/user-account-section.enum'
import { AccountCircle, Share } from '@mui/icons-material'
import { SectionMenu } from '../../components/menus/section-menu/section-menu'
import { useTranslation } from 'react-i18next'

interface UserAccountMenuProps {
  selectedSection: UserAccountSection
  selectSection: (section: UserAccountSection) => void
}

export const UserAccountMenu: FC<UserAccountMenuProps> = (props) => {
  const { selectedSection, selectSection } = props
  const { t } = useTranslation()

  const sections = [
    {
      label: t('account'),
      value: UserAccountSection.Account,
      testId: 'account-menu-button',
      icon: <AccountCircle fontSize="small" />
    },
    {
      label: t('data-sharing'),
      value: UserAccountSection.DataSharing,
      testId: 'data-sharing-menu-button',
      icon: <Share fontSize="small" />
    }
  ]

  return (
    <SectionMenu<UserAccountSection>
      title={t('user-account')}
      sections={sections}
      selectedSection={selectedSection}
      selectSection={selectSection}
      testId="user-account-menu"
    />
  )
}
