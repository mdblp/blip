/*
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

import React, { FunctionComponent, MouseEventHandler } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Today from '@mui/icons-material/Today'
import TrendingUp from '@mui/icons-material/TrendingUp'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { GenerateReportButton } from '../buttons/generate-report'

interface PatientNavBarTabsProps {
  chartType: string
  prefixURL: string
  onClickDashboard: MouseEventHandler<HTMLAnchorElement>
  onClickTrends: MouseEventHandler<HTMLAnchorElement>
  onClickDaily: MouseEventHandler<HTMLAnchorElement>
  onClickPrint: MouseEventHandler<HTMLButtonElement>
}

const styles = makeStyles()((theme: Theme) => {
  return {
    tabs: {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.common.white
    },
    tab: {
      fontWeight: 'bold',
      marginRight: theme.spacing(5),
      textTransform: 'capitalize',
      fontSize: '16px',
      color: 'var(--text-base-color)'
    },
    tabsRoot: {
      minHeight: '48px',
      height: '48px'
    },
    tabRoot: {
      minHeight: '48px',
      height: '48px'

    }
  }
})

export const PatientNavBarTabs: FunctionComponent<PatientNavBarTabsProps> = (
  {
    prefixURL = '',
    ...props
  }) => {
  const {
    chartType,
    onClickDashboard,
    onClickTrends,
    onClickDaily,
    onClickPrint
  } = props

  const { t } = useTranslation('yourloops')

  const { classes } = styles()

  const selectedTab = (): number => {
    switch (chartType) {
      case 'dashboard':
        return 0
      case 'daily':
        return 1
      case 'trends':
        return 2
    }
  }

  return (
    <Box className={classes.tabs} width="100%" paddingLeft={7}>
      <Box display="flex">
        <Tabs value={selectedTab()} classes={{
          root: classes.tabsRoot
        }}>
          <Tab
            className={classes.tab}
            data-testid="dashboard-tab"
            href={`${prefixURL}/dashboard`}
            iconPosition="start"
            label={t('dashboard')}
            icon={<DashboardOutlinedIcon />}
            onClick={onClickDashboard}
            classes={{
              root: classes.tabRoot
            }}
          />
          <Tab
            className={classes.tab}
            data-testid="daily-tab"
            href={`${prefixURL}/daily`}
            iconPosition="start"
            label={t('Daily')}
            icon={<Today />}
            onClick={onClickDaily}
            classes={{
              root: classes.tabRoot
            }}
          />
          <Tab
            className={classes.tab}
            data-testid="trends-tab"
            href={`${prefixURL}/trends`}
            iconPosition="start"
            label={t('Trends')}
            icon={<TrendingUp />}
            onClick={onClickTrends}
            classes={{
              root: classes.tabRoot
            }}
          />
        </Tabs>
        <GenerateReportButton onClickPrint={onClickPrint} />
      </Box>
    </Box>
  )
}
