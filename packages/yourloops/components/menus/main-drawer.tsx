/**
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

import React, { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, Theme } from '@material-ui/core/styles'
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import EmailIcon from '@material-ui/icons/Email'
import ContactMailIcon from '@material-ui/icons/ContactMail'
import TimelineIcon from '@material-ui/icons/Timeline'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import FeedbackIcon from '@material-ui/icons/Feedback'
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff'
import DesktopMacIcon from '@material-ui/icons/DesktopMac'
import HistoryIcon from '@material-ui/icons/History'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'

import MedicalServiceIcon from '../icons/MedicalServiceIcon'
import PendingIcon from '../icons/PendingIcon'
import { PatientFilterTypes } from '../../models/generic'
import DrawerLinkItem from './drawer-link-item'
import useMainDrawer from './main-drawer.hook'

export interface MainDrawerProps {
  miniVariant?: boolean
}

export const mainDrawerDefaultWidth = '300px'
export const mainDrawerMiniVariantWidth = '57px'

const styles = makeStyles((theme: Theme) => ({
  monitoringFilters: {
    marginTop: 20
  },
  divider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  drawer: {
    width: mainDrawerDefaultWidth,
    whiteSpace: 'nowrap'
  },
  drawerPaper: {
    width: mainDrawerDefaultWidth,
    overflowX: 'hidden'
  },
  drawerBoxShadow: {
    boxShadow: theme.shadows[5]
  },
  messagingTitle: {
    fontWeight: 700,
    lineHeight: '20px',
    textTransform: 'uppercase'
  },
  monitoringTitleIcon: {
    color: theme.palette.grey[600]
  },
  miniDrawer: {
    width: mainDrawerMiniVariantWidth,
    whiteSpace: 'nowrap'
  },
  miniDrawerPaper: {
    width: mainDrawerMiniVariantWidth,
    overflowX: 'hidden'
  },
  enterTransition: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  leaveTransition: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  }
}))

const MainDrawer: FunctionComponent<MainDrawerProps> = ({ miniVariant }) => {
  const { t } = useTranslation('yourloops')
  const {
    divider,
    drawer,
    drawerPaper,
    messagingTitle,
    monitoringFilters,
    monitoringTitleIcon,
    miniDrawer,
    miniDrawerPaper,
    enterTransition,
    leaveTransition,
    drawerBoxShadow
  } = styles()

  const {
    fullDrawer,
    onHover,
    setOnHover,
    patientFiltersStats,
    numberOfFlaggedPatients,
    loggedUserIsHcpInMonitoring,
    selectedFilter
  } = useMainDrawer({ miniVariant })

  const drawerClass = fullDrawer ? `${drawer} ${leaveTransition}` : `${miniDrawer} ${leaveTransition}`
  const paperClass = fullDrawer || onHover
    ? `${drawerPaper} ${enterTransition} ${onHover && !fullDrawer ? drawerBoxShadow : ''}`
    : `${miniDrawerPaper} ${enterTransition}`

  const drawerCommonItems = [
    {
      icon: <SupervisedUserCircleIcon />,
      text: `${t('all-patients')} (${patientFiltersStats.all})`,
      filter: PatientFilterTypes.all,
      ariaLabel: t('all-patients-filter')
    },
    {
      icon: <FlagOutlinedIcon />,
      text: `${t('flagged')} (${numberOfFlaggedPatients})`,
      filter: PatientFilterTypes.flagged,
      ariaLabel: t('flagged-patients-filter')
    },
    {
      icon: <PendingIcon />,
      text: `${t('pending')} (${patientFiltersStats.pending})`,
      filter: PatientFilterTypes.pending,
      ariaLabel: t('pending-patients-filter')
    },
    {
      icon: <MedicalServiceIcon />,
      text: `${t('private-practice')} (${patientFiltersStats.directShare})`,
      filter: PatientFilterTypes.private,
      ariaLabel: t('private-practice-patients-filter')
    }
  ]

  const drawerRemoteMonitoringItems = [
    {
      icon: <SupervisedUserCircleIcon />,
      text: `${t('monitored-patients')} (${patientFiltersStats.remoteMonitored})`,
      filter: PatientFilterTypes.remoteMonitored,
      ariaLabel: t('remote-monitoring-patients-filter')
    },
    {
      icon: <HistoryIcon />,
      count: patientFiltersStats.renew,
      text: t('incoming-renewal'),
      filter: PatientFilterTypes.renew
    }
  ]

  const drawerEventsItems = [
    {
      icon: <HourglassEmptyIcon />,
      count: patientFiltersStats.outOfRange,
      text: t('time-away-from-target'),
      filter: PatientFilterTypes.outOfRange
    },
    {
      icon: <TimelineIcon />,
      count: patientFiltersStats.severeHypoglycemia,
      text: t('alert-hypoglycemic'),
      filter: PatientFilterTypes.severeHypoglycemia
    },
    {
      icon: <SignalWifiOffIcon />,
      count: patientFiltersStats.dataNotTransferred,
      text: t('data-not-transferred'),
      filter: PatientFilterTypes.dataNotTransferred
    }
  ]

  const drawerMessagingItems = [
    {
      icon: <EmailIcon />,
      count: patientFiltersStats.unread,
      text: t('unread-messages'),
      filter: PatientFilterTypes.unread
    }
  ]

  return (
    <Drawer
      id="main-left-drawer"
      data-testid="main-left-drawer"
      variant="permanent"
      className={drawerClass}
      classes={{ paper: paperClass }}
      onMouseEnter={() => miniVariant ? setOnHover(true) : undefined}
      onMouseLeave={() => miniVariant ? setOnHover(false) : undefined}
    >
      <Toolbar />
      <List>
        {drawerCommonItems.map((item, index) => (
          <DrawerLinkItem
            key={index}
            selectedFilter={selectedFilter}
            {...item}
          />
        ))}

        {loggedUserIsHcpInMonitoring &&
          <Box bgcolor="var(--monitoring-filter-bg-color)" className={monitoringFilters}>
            <ListItem>
              <ListItemIcon>
                <DesktopMacIcon className={monitoringTitleIcon} />
              </ListItemIcon>
              <ListItemText>
                <Box className={messagingTitle}>
                  {t('remote-monitoring')}
                </Box>
              </ListItemText>
            </ListItem>

            {drawerRemoteMonitoringItems.map((item, index) => (
              <DrawerLinkItem
                key={index}
                selectedFilter={selectedFilter}
                {...item}
              />
            ))}

            <Divider variant="middle" className={divider} />

            <ListItem>
              <ListItemIcon>
                <FeedbackIcon className={monitoringTitleIcon} />
              </ListItemIcon>
              <ListItemText>
                <Box className={messagingTitle}>
                  {t('events')}
                </Box>
              </ListItemText>
            </ListItem>

            {drawerEventsItems.map((item, index) => (
              <DrawerLinkItem
                key={index}
                selectedFilter={selectedFilter}
                {...item}
              />
            ))}

            <Divider variant="middle" className={divider} />

            <ListItem>
              <ListItemIcon>
                <ContactMailIcon className={monitoringTitleIcon} />
              </ListItemIcon>
              <ListItemText>
                <Box className={messagingTitle}>
                  {t('messaging')}
                </Box>
              </ListItemText>
            </ListItem>

            {drawerMessagingItems.map((item, index) => (
              <DrawerLinkItem
                key={index}
                selectedFilter={selectedFilter}
                {...item}
              />
            ))}
          </Box>
        }
      </List>
    </Drawer>
  )
}

export default MainDrawer
