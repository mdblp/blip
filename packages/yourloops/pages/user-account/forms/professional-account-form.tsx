/*
 * Copyright (c) 2025, Diabeloop
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

import Typography from '@mui/material/Typography'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import metrics from '../../../lib/metrics'
import SwitchRoleDialogs from '../../../components/switch-role'
import { Divider } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export const ProfessionalAccountForm: FC = () => {
  const { t } = useTranslation('yourloops')

  const [switchRoleOpen, setSwitchRoleOpen] = useState<boolean>(false)

  const handleSwitchRoleOpen = (): void => {
    setSwitchRoleOpen(true)
    metrics.send('switch_account', 'display_switch_preferences')
  }

  const handleSwitchRoleCancel = (): void => {
    setSwitchRoleOpen(false)
  }

  return (
    <>
      <Divider variant="middle" sx={{ marginY: 3 }} />
      <Box marginY={2}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>{t('professional-account')}</Typography>
        <span>{t('caregiver-upgrade-account-description')}</span>
        <Box display="flex" marginTop={2}>
          <Button
            data-testid="switch-role-button"
            variant="outlined"
            color="primary"
            disableElevation
            onClick={handleSwitchRoleOpen}
          >
            {t('modal-switch-hcp-title')}
          </Button>
        </Box>
      </Box>

      {switchRoleOpen && <SwitchRoleDialogs onCancel={handleSwitchRoleCancel} />}
    </>
  )
}
