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

import React, { type FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import Box from '@mui/material/Box'
import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import Typography from '@mui/material/Typography'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTeam } from '../../lib/team'
import TeamInformation from '../../components/team/team-information'
import TeamMembers from '../../components/team/team-members'
import { commonComponentStyles } from '../../components/common'
import { useAuth } from '../../lib/auth'
import TeamMonitoringAlertsConfiguration from '../../components/team/team-monitoring-alerts-configuration'
import { useParams } from 'react-router-dom'
import { setPageTitle } from '../../lib/utils'
import SpinningLoader from '../../components/loaders/spinning-loader'

const useStyles = makeStyles()((theme) => ({
  activeLink: {
    color: theme.palette.primary.main
  },
  disableRipple: {
    paddingLeft: 0,
    '&:hover': {
      backgroundColor: 'transparent'
    },
    color: theme.palette.common.black
  },
  drawer: {
    position: 'sticky',
    height: '200px',
    top: '80px'
  },
  drawerTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  refElement: {
    scrollMarginTop: '70px'
  },
  separator: {
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6)
  },
  teamDetails: {
    maxWidth: '1140px',
    padding: '0 20px'
  },
  teamInformation: {
    marginTop: '32px'
  },
  title: {
    fontWeight: 600,
    lineHeight: '20px',
    textTransform: 'uppercase'
  }
}))

export const CareTeamSettingsPage: FC = () => {
  const { getTeam } = useTeam()

  const { teamId } = useParams()
  const team = getTeam(teamId)

  const { classes } = useStyles()
  const { classes: commonTeamClasses } = commonComponentStyles()
  const { user } = useAuth()
  const isUserHcp = user?.isUserHcp()

  const { t } = useTranslation('yourloops')

  setPageTitle(t('header-tab-care-team-settings'))

  const [activeLink, setActiveLink] = useState<string>('information')

  const teamInformation = useRef<HTMLDivElement>(null)
  const teamMembers = useRef<HTMLDivElement>(null)
  const teamMonitoringAlerts = useRef<HTMLDivElement>(null)

  const scrollTo = (ref: React.RefObject<HTMLDivElement>): void => {
    setActiveLink(ref.current?.dataset.link)
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box role="main" sx={{ paddingLeft: 2 }}>
      <Box sx={{ display: "flex" }}>
        {isUserHcp &&
          <div className={classes.drawer} role="navigation">
            <div
              role="link"
              aria-label="information"
              className={`${classes.drawerTitle} ${activeLink === 'information' ? classes.activeLink : ''}`}
              tabIndex={0}
              onKeyDown={() => {
                scrollTo(teamInformation)
              }}
              onClick={() => {
                scrollTo(teamInformation)
              }}
            >
              <InfoOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.title}>
                {t('information')}
              </Typography>
            </div>
            <div
              role="link"
              aria-label="members"
              className={`${classes.drawerTitle} ${activeLink === 'members' ? classes.activeLink : ''}`}
              tabIndex={0}
              onClick={() => {
                scrollTo(teamMembers)
              }}
              onKeyDown={() => {
                scrollTo(teamMembers)
              }}
            >
              <GroupOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.title}>
                {t('members')}
              </Typography>
            </div>
            <div
              role="link"
              className={`${classes.drawerTitle} ${activeLink === 'configuration' ? classes.activeLink : ''}`}
              tabIndex={0}
              onClick={() => {
                scrollTo(teamMonitoringAlerts)
              }}
              onKeyDown={() => {
                scrollTo(teamMonitoringAlerts)
              }}
            >
              <DesktopMacOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.title}>
                {t('monitoring-alerts-configuration')}
              </Typography>
            </div>
          </div>
        }
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "auto"
          }}>
          {team ?
            <div className={classes.teamDetails}>
              <div
                role="region"
                aria-label="information"
                ref={teamInformation}
                data-link="information"
                className={`${classes.teamInformation} ${classes.refElement}`}
              >
                <TeamInformation team={team} />
              </div>
              {isUserHcp &&
                <div>
                  <div className={classes.separator} />
                  <div
                    ref={teamMembers}
                    role="region"
                    aria-label="members"
                    data-link="members"
                    className={classes.refElement}
                  >
                    <TeamMembers team={team} />
                  </div>
                  <div>
                    <div className={classes.separator} />
                    <div
                      ref={teamMonitoringAlerts}
                      role="region"
                      data-link="configuration"
                      className={classes.refElement}
                    >
                      <TeamMonitoringAlertsConfiguration team={team} />
                    </div>
                  </div>
                </div>
              }
            </div>
            : <SpinningLoader />
          }
        </Box>
      </Box>
    </Box>
  )
}
