import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import i18next from 'i18next'
import Box from '@mui/material/Box'
import PatientStatistics from './patientStatistics'
import DeviceUsage from './deviceUsage'
import './patientDashboardVars.css'
import AccessTime from '@mui/icons-material/AccessTime'
import RemoteMonitoringWidget from 'yourloops/components/dashboard-widgets/remote-monitoring-widget'
import { useTeam } from 'yourloops/lib/team'

const t = i18next.t.bind(i18next)

const PatientDashboard = (props) => {
  const {
    //eslint-disable-next-line
    patient,
    user,
    bgPrefs,
    loading,
    chartPrefs,
    dataUtil,
    epochLocation,
    msRange,
    chatWidget: ChatWidget,
    alarmCard: AlarmCard,
    medicalFilesWidget: MedicalFilesWidget,
    //eslint-disable-next-line
    timePrefs, tidelineData, trackMetric, onSwitchToDaily, userIsHCP, isSelectedTeamMedical
  } = props
  const isMonitoringEnabled = patient.monitoring?.enabled
  const shouldDisplayChatWidget = isMonitoringEnabled && (!userIsHCP || isSelectedTeamMedical)

  const { getMedicalTeams } = useTeam()

  const showRemoteMonitoringWidget = !user.isUserCaregiver() && getMedicalTeams().some(team => team.monitoring?.enabled)

  const getEndpoints = () => {
    const start = moment.utc(epochLocation - msRange).toISOString()
    const end = moment.utc(epochLocation).toISOString()
    return [start, end]
  }

  const endpoints = getEndpoints()
  return (
    <div className="patient-dashboard" data-testid="patient-dashboard">
      <Box display="flex" marginLeft="20px" alignItems="center">
        <AccessTime fontSize="small" className="subnav-icon" />
        <span id="subnav-period-label">{t('dashboard-header-period-text')}</span>
      </Box>
      <Box id="patient-dashboard-content">
        {showRemoteMonitoringWidget && <RemoteMonitoringWidget patient={patient} /> }
        {patient.monitoring?.enabled &&
          <MedicalFilesWidget
            id="dashboard-medical-files-widget"
            patient={patient}
            userRole={user.role}
          />
        }
        <PatientStatistics
          bgPrefs={bgPrefs}
          bgSource={dataUtil.bgSource}
          chartPrefs={chartPrefs}
          chartType="patientStatistics"
          dataUtil={dataUtil}
          endpoints={endpoints}
          loading={loading}
          parametersConfig={tidelineData.medicalData?.pumpSettings[0]?.payload?.parameters}
        />
        <DeviceUsage
          bgPrefs={bgPrefs}
          timePrefs={timePrefs}
          patient={patient}
          tidelineData={tidelineData}
          trackMetric={trackMetric}
          dataUtil={dataUtil}
          chartPrefs={chartPrefs}
          endpoints={endpoints}
          loading={loading}
          onSwitchToDaily={onSwitchToDaily}
        />
        {isMonitoringEnabled &&
          <AlarmCard patient={patient} />
        }
        {shouldDisplayChatWidget &&
          <ChatWidget
            id="dashboard-chat-widget"
            patient={patient}
            userId={user.id}
            userRole={user.role}
          />
        }
      </Box>
    </div>
  )
}

PatientDashboard.propTypes = {
  user: PropTypes.object,
  chatWidget: PropTypes.func.isRequired,
  alarmCard: PropTypes.func.isRequired,
  medicalFilesWidget: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  patient: PropTypes.object,
  bgPrefs: PropTypes.object.isRequired,
  chartPrefs: PropTypes.object.isRequired,
  dataUtil: PropTypes.object,
  epochLocation: PropTypes.number.isRequired,
  msRange: PropTypes.number.isRequired,
  onSwitchToDaily: PropTypes.func.isRequired,
  canPrint: PropTypes.bool,
  tidelineData: PropTypes.object.isRequired
}

export default PatientDashboard
