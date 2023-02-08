/*
 * Copyright (c) 2023, Diabeloop
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
import React, { useState } from 'react'
import { getDisplayTeamCode, REGEX_TEAM_CODE_DISPLAY, Team, useTeam } from '../../../lib/team'
import { useAlert } from '../../utils/snackbar'
import { useTranslation } from 'react-i18next'

interface useConfirmCodeTeamProps {
  onCompleteStep: (team: Team, teamId?: string) => void
}

interface useConfirmCodeTeamReturn {
  handleChangeCode: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleClickJoinTeam: () => Promise<void | string>
  joinButtonDisabled: boolean
  idCode: string
}

const useConfirmCodeTeam = ({ onCompleteStep }: useConfirmCodeTeamProps): useConfirmCodeTeamReturn => {
  const [numericCode, setNumericCode] = useState<string>('')
  const teamHook = useTeam()
  const alert = useAlert()
  const [idCode, setIdCode] = useState<string>('')
  const { t } = useTranslation()
  const joinButtonDisabled = !idCode.match(REGEX_TEAM_CODE_DISPLAY)
  const getNumericCode = (value: string): string => {
    let numericCode = ''
    for (let i = 0; i < value.length; i++) {
      if (value[i].match(/^[0-9]$/)) {
        numericCode += value[i]
      }
    }
    return numericCode
  }

  const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const numericCode = getNumericCode(event.target.value)
    const displayCode = getDisplayTeamCode(numericCode)
    setIdCode(displayCode)
    setNumericCode(numericCode)
  }

  const handleClickJoinTeam = async (): Promise<void | string> => {
    if (numericCode !== '') {
      const team = teamHook.teams.find((team) => team.code === numericCode)
      if (team) {
        return alert.error(t('modal-patient-add-team-failure-exists'))
      }
      await teamHook
        .getTeamFromCode(numericCode)
        .then((team) => {
          if (team === null) {
            return alert.error(t('modal-patient-add-team-failure'))
          } else {
            onCompleteStep(team, team.id)
          }
        })
        .catch((reason: unknown) => {
          console.error(reason)
          alert.error(t('modal-patient-add-team-failure'))
        })
    }
  }
  return {
    handleChangeCode,
    handleClickJoinTeam,
    joinButtonDisabled,
    idCode
  }
}
export default useConfirmCodeTeam
