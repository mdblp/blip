/*
 * Copyright (c) 2021-2023, Diabeloop
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
import bows from 'bows'

import { type HcpProfession } from '../../lib/auth/models/enums/hcp-profession.enum'
import { type SwitchRoleDialogsProps, SwitchRoleToHcpSteps } from './models'
import metrics from '../../lib/metrics'
import { useAuth } from '../../lib/auth'
import { useAlert } from '../utils/snackbar'
import SwitchRoleConsequencesDialog from './consequences-dialog'
import SwitchRoleConsentDialog from './consent-dialog'
import SwitchRoleProfessionDialog from './profession-dialog'
import { useNavigate } from 'react-router-dom'
import { logError } from '../../utils/error.util'
import { errorTextFromException } from '../../lib/utils'

const log = bows('SwitchRoleDialogs')

const SwitchRoleDialogs: FunctionComponent<SwitchRoleDialogsProps> = (props) => {
  const { t } = useTranslation('yourloops')
  const { switchRoleToHCP, user } = useAuth()
  const navigate = useNavigate()
  const alert = useAlert()
  const [switchRoleStep, setSwitchRoleStep] = useState<SwitchRoleToHcpSteps>(SwitchRoleToHcpSteps.consequences)
  const [feedbackConsent, setFeedbackConsent] = useState<boolean>(false)
  const [inProgress, setInProgress] = useState<boolean>(false)

  if (!user) {
    throw new Error('User must be logged-in')
  }

  const handleSwitchRoleToConditions = (): void => {
    setSwitchRoleStep(SwitchRoleToHcpSteps.consent)
  }

  const handleSwitchRoleToUpdate = async (hcpProfession: HcpProfession): Promise<void> => {
    try {
      setInProgress(true)
      await switchRoleToHCP(feedbackConsent, hcpProfession)
      metrics.send('switch_account', 'accept_terms')
      alert.success(t('switch-role-success'))
      navigate('/')
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'switch-hcp')

      setInProgress(false)
      alert.error(t('modal-switch-hcp-failure'))
    }
  }

  const handleSwitchRoleToProfession = (feedback: boolean): void => {
    setFeedbackConsent(feedback)
    setSwitchRoleStep(SwitchRoleToHcpSteps.profession)
  }

  return (
    <React.Fragment>
      <SwitchRoleConsequencesDialog
        open={switchRoleStep === SwitchRoleToHcpSteps.consequences}
        onAccept={handleSwitchRoleToConditions}
        onCancel={props.onCancel}
      />
      <SwitchRoleConsentDialog
        open={switchRoleStep === SwitchRoleToHcpSteps.consent}
        onAccept={handleSwitchRoleToProfession}
        onCancel={props.onCancel}
      />
      <SwitchRoleProfessionDialog
        open={switchRoleStep === SwitchRoleToHcpSteps.profession}
        inProgress={inProgress}
        onAccept={handleSwitchRoleToUpdate}
        onCancel={props.onCancel}
      />
    </React.Fragment>
  )
}

export default SwitchRoleDialogs
