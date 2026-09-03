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

import { useTranslation } from 'react-i18next'
import { GenericListCard } from '../../components/generic-list-card/generic-list-card'
import React from 'react'
import { generatePath, useParams } from 'react-router-dom'
import { AppUserRoute } from '../../models/enums/routes.enum'
import TeamUtils from '../../lib/team/team.util'
import { type Team, type TeamMember, useTeam } from '../../lib/team'
import { errorTextFromException } from '../../lib/utils'
import { logError } from '../../utils/error.util'
import { formatCode } from '../../utils/format.utils'
import { useTeamCreateEdit } from '../../components/team/team-create-edit.hook'
import { useAlert } from '../../components/utils/snackbar'
import { TeamMemberRole } from '../../lib/team/models/enums/team-member-role.enum'
import { ViewMoreLink } from '../../components/buttons/view-more-link'
import { Unit } from 'medical-domain'
import { useAuth } from '../../lib/auth'
import { cardStyle } from '../card-style'
import Typography from '@mui/material/Typography'
import { UserInviteStatus } from '../../lib/team/models/enums/user-invite-status.enum'

export const CareTeamSettingsSectionsOverviewCards = () => {
  const { getTeam } = useTeam()
  const teamHook = useTeam()
  const alert = useAlert()
  const { teamId } = useParams()
  const team = getTeam(teamId)
  const { t } = useTranslation()
  const { classes } = cardStyle()
  const { user } = useAuth()
  const userBgUnit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter

  const getNonPatientMembers = (team?: Team): TeamMember[] => {
    return team ? team.members.filter(teamMember =>
      (teamMember.role === TeamMemberRole.admin || teamMember.role === TeamMemberRole.member) && teamMember.status != UserInviteStatus.Pending) : []
  }

  const members = getNonPatientMembers(team)

  const adminCount = members.filter((member) => TeamUtils.isUserAdministrator(team, member.userId)).length

  const onSaveTeam = async (editedTeam: Partial<Team> | null): Promise<void> => {
    try {
      await teamHook.updateTeam(editedTeam as Team)
      alert.success(t('team-page-success-edit'))
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      logError(errorMessage, 'team-information-edit')

      alert.error(t('team-page-failed-edit'))
    }
  }

  const {
    teamPhone,
    addrLine1,
    addrCity
  } = useTeamCreateEdit({ team, onSaveTeam })

  const formattedTeamCode = formatCode(team.code)

  const getTableTeamInformation = (): { value: string, label: string }[] => {
    return [
      { label: t('identification-code'), value: formattedTeamCode },
      { label: t('address'), value: addrLine1 },
      { label: t('city'), value: addrCity },
      { label: t('phone-number'), value: teamPhone }
    ]
  }

  const getTableMembers = (): { value: string, label: string }[] => {
    return [
      { label: t('admin-number'), value: `${adminCount}` },
      { label: t('member-number'), value: `${members.length}` }
    ]
  }

  /*
  const getTableAlerts = (): { value: string, label: string }[] => {
    return [
      {
        label: userBgUnit === Unit.MilligramPerDeciliter ? t('default-values-applied') : t('custom-values-applied'),
        value: ''
      }
    ]
  }

   */

  return (
    <>
      <GenericListCard
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        title={t('team-information')}
        tableLines={getTableTeamInformation()}
        data-testid="care-team-settings-menu-mobile-team-information"
        headerAction={
          <ViewMoreLink dataTestId="link-team-info"
                        targetRoute={generatePath(AppUserRoute.CareTeamSettingsInformationsSection, { teamId })} />
        }
      />

      <GenericListCard
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        title={t('members')}
        tableLines={getTableMembers()}
        data-testid="care-team-settings-menu-mobile-members"
        headerAction={
          <ViewMoreLink dataTestId="link-team-members"
                        targetRoute={generatePath(AppUserRoute.CareTeamSettingsMembersSection, { teamId })} />
        }
      />
      <GenericListCard
        cardClassName={classes.cards}
        cardHeaderClassName={classes.cardsHeader}
        title={`${t('alerts')} (${userBgUnit})`}
        data-testid="care-team-settings-menu-mobile-alerts"
        headerAction={
          <ViewMoreLink dataTestId="link-team-alerts"
                        targetRoute={generatePath(AppUserRoute.CareTeamSettingsAlertsSection, { teamId })} />
        }
      >
        <Typography variant="body2">
          {userBgUnit === Unit.MilligramPerDeciliter ?
            t('default-values-applied') :
            t('custom-values-applied')}
        </Typography>
      </GenericListCard>
    </>
  )
}
