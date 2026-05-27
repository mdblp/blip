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

import React, { type FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setPageTitle } from '../../lib/utils'
import { useAuth } from '../../lib/auth'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import { UserAccountSection } from './models/enums/user-account-section.enum'
import { AccountSection } from './sections/account-section/account-section'
import { DataSharingSection } from './sections/data-sharing-section/data-sharing-section'
import Grid from '@mui/material/Grid'
import { UserAccountMenu } from './user-account-menu'
import { CountryCode } from '../../lib/auth/models/country.model'

export const UserAccountPage: FunctionComponent = () => {
  const { t } = useTranslation('yourloops')
  const { user } = useAuth()

  const shouldDisplayMenu = user.isUserPatient() && user.settings.country === CountryCode.France

  setPageTitle(t('user-account'))

  const [selectedSection, setSelectedSection] = useState(UserAccountSection.Account)

  const selectSection = (section: UserAccountSection): void => {
    setSelectedSection(section)
  }

  const displaySelectedSection = (): JSX.Element => {
    switch (selectedSection) {
      case UserAccountSection.Account:
        return <AccountSection />
      case UserAccountSection.DataSharing:
        return <DataSharingSection />
      default:
        return <></>
    }
  }

  return (
    <Container maxWidth="xl" sx={{ my: 6 }}>
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {shouldDisplayMenu &&
          <Grid size={3}>
            <UserAccountMenu
              selectedSection={selectedSection}
              selectSection={selectSection}
            />
          </Grid>
        }
        <Grid size={9}>
          <Card variant="outlined" sx={{ px: 2, pt: 2, pb: 4 }} data-testid="user-account-view">
            {displaySelectedSection()}
          </Card>
        </Grid>
      </Grid>

    </Container>
  )
}
