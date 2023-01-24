/**
 * Copyright (c) 2022, Diabeloop
 * Patient Statistics widget component
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

import React from 'react'
import PropTypes from 'prop-types'
import CardContent from '@mui/material/CardContent'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import { useTranslation } from 'react-i18next'
import Stats from './stats'
import GenericDashboardCard from 'yourloops/components/dashboard-widgets/generic-dashboard-card'

const PatientStatistics = (props) => {
  //eslint-disable-next-line
  const { bgPrefs, loading, chartPrefs, dataUtil, endpoints, parametersConfig } = props
  const { t } = useTranslation()

  return (
    <GenericDashboardCard
      avatar={<InsertChartOutlinedIcon />}
      title={t('patient-statistics')}
      data-testid="patient-statistics"
    >
      <CardContent id="patient-statistics-content">
        <Stats
          bgPrefs={bgPrefs}
          //eslint-disable-next-line
          bgSource={dataUtil.bgSource}
          chartPrefs={chartPrefs}
          chartType="patientStatistics"
          dataUtil={dataUtil}
          endpoints={endpoints}
          loading={loading}
          hideToolTips
          parametersConfig={parametersConfig}
        />
      </CardContent>
    </GenericDashboardCard>
  )
}

PatientStatistics.propType = {
  bgPrefs: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  chartPrefs: PropTypes.object.isRequired,
  dataUtil: PropTypes.object.isRequired,
  endpoints: PropTypes.arrayOf(PropTypes.string),
  parametersConfig: PropTypes.object
}

export default PatientStatistics
