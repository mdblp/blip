/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'

import { type Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import EmailIcon from '@mui/icons-material/Email'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import TimelineIcon from '@mui/icons-material/Timeline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import FeedbackIcon from '@mui/icons-material/Feedback'
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff'
import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined'
import HistoryIcon from '@mui/icons-material/History'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import DrawerLinkItem from './drawer-link-item'
import useMainDrawer from './main-drawer.hook'
import DrawerCategoryItem from './drawer-category-item'
import { PatientListFilters } from '../../patient-list/enums/patient-list.enum'

export interface MainDrawerProps {
  miniVariant?: boolean
}

export const mainDrawerDefaultWidth = '300px'
export const mainDrawerMiniVariantWidth = '57px'

const styles = makeStyles()((theme: Theme) => ({
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
    classes: {
      divider,
      drawer,
      drawerPaper,
      miniDrawer,
      miniDrawerPaper,
      enterTransition,
      leaveTransition,
      drawerBoxShadow
    }
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
      filter: PatientListFilters.All,
      ariaLabel: t('all-patients-filter')
    },
    {
      icon: <FlagOutlinedIcon />,
      text: `${t('flagged')} (${numberOfFlaggedPatients})`,
      filter: PatientListFilters.Flagged,
      ariaLabel: t('flagged-patients-filter')
    }
  ]

  const drawerRemoteMonitoringItems = [
    {
      icon: <SupervisedUserCircleIcon />,
      text: `${t('monitored-patients')} (${patientFiltersStats.remoteMonitored})`,
      filter: PatientListFilters.RemoteMonitored,
      ariaLabel: t('remote-monitoring-patients-filter')
    },
    {
      icon: <HistoryIcon />,
      count: patientFiltersStats.renew,
      text: t('incoming-renewal'),
      filter: PatientListFilters.Renew
    }
  ]

  const drawerEventsItems = [
    {
      icon: <HourglassEmptyIcon />,
      count: patientFiltersStats.outOfRange,
      text: t('time-away-from-target'),
      filter: PatientListFilters.OutOfRange
    },
    {
      icon: <TimelineIcon />,
      count: patientFiltersStats.severeHypoglycemia,
      text: t('alert-hypoglycemic'),
      filter: PatientListFilters.SevereHypoglycemia
    },
    {
      icon: <SignalWifiOffIcon />,
      count: patientFiltersStats.dataNotTransferred,
      text: t('data-not-transferred'),
      filter: PatientListFilters.DataNotTransferred
    }
  ]

  const drawerMessagingItems = [
    {
      icon: <EmailIcon />,
      count: patientFiltersStats.unread,
      text: t('unread-messages'),
      filter: PatientListFilters.UnreadMessages
    }
  ]

  const onMouseEnter = (): void => {
    if (miniVariant) {
      setOnHover(true)
    }
  }

  const onMouseLeave = (): void => {
    if (miniVariant) {
      setOnHover(false)
    }
  }

  return (
    <Drawer
      id="main-left-drawer"
      data-testid="main-left-drawer"
      variant="permanent"
      className={drawerClass}
      classes={{ paper: paperClass }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
          <Box bgcolor="#FFF9F3" marginTop={2}>
            <DrawerCategoryItem
              icon={<DesktopMacOutlinedIcon />}
              text={t('remote-monitoring')}
            />
            {drawerRemoteMonitoringItems.map((item, index) => (
              <DrawerLinkItem
                key={index}
                selectedFilter={selectedFilter}
                {...item}
              />
            ))}

            <Divider variant="middle" className={divider} />

            <DrawerCategoryItem
              icon={<FeedbackIcon />}
              text={t('events')}
            />
            {drawerEventsItems.map((item, index) => (
              <DrawerLinkItem
                key={index}
                selectedFilter={selectedFilter}
                {...item}
              />
            ))}

            <Divider variant="middle" className={divider} />

            <DrawerCategoryItem
              icon={<ContactMailIcon />}
              text={t('messaging')}
            />
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
