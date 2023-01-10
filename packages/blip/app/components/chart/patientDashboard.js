import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import i18next from 'i18next'
import Box from '@mui/material/Box'
import PatientStatistics from './patientStatistics'
import DeviceUsage from './deviceUsage'
import './patientDashboardVars.css'
import { PatientNavBarMemoized } from 'yourloops/components/header-bars/patient-nav-bar'
import AccessTime from '@mui/icons-material/AccessTime'
import RemoteMonitoringWidget from 'yourloops/components/dashboard-widgets/remote-monitoring-widget'
import { useTeam } from 'yourloops/lib/team'

const t = i18next.t.bind(i18next)

const PatientDashboard = (props) => {
  const {
    //eslint-disable-next-line
    patient,
    user,
    prefixURL,
    bgPrefs,
    loading,
    chartPrefs,
    dataUtil,
    epochLocation,
    msRange,
    chatWidget: ChatWidget,
    alarmCard: AlarmCard,
    medicalFilesWidget: MedicalFilesWidget,
    onClickPrint,
    //eslint-disable-next-line
    timePrefs, tidelineData, permsOfLoggedInUser, trackMetric, onSwitchToTrends, onSwitchToDaily, userIsHCP, isSelectedTeamMedical, onSwitchPatient
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

  const handleClickDashboard = (e) => {
    e.preventDefault()
  }

  const handleClickDaily = (e) => {
    e.preventDefault()
    onSwitchToDaily(epochLocation)
  }

  const endpoints = getEndpoints()
  return (
    <div id="patient-dashboard" className="patient-dashboard" data-testid="patient-dashboard">
      <PatientNavBarMemoized
        chartType="dashboard"
        onClickDashboard={handleClickDashboard}
        onClickDaily={handleClickDaily}
        onClickPrint={onClickPrint}
        onClickTrends={onSwitchToTrends}
        onSwitchPatient={onSwitchPatient}
        currentPatient={patient}
        prefixURL={prefixURL}
      />
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
          id="dashboard-patient-statistics"
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
          id="dashboard-device-usage"
          bgPrefs={bgPrefs}
          timePrefs={timePrefs}
          patient={patient}
          tidelineData={tidelineData}
          permsOfLoggedInUser={permsOfLoggedInUser}
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
  prefixURL: PropTypes.string,
  bgPrefs: PropTypes.object.isRequired,
  chartPrefs: PropTypes.object.isRequired,
  dataUtil: PropTypes.object,
  epochLocation: PropTypes.number.isRequired,
  msRange: PropTypes.number.isRequired,
  onSwitchToTrends: PropTypes.func.isRequired,
  onSwitchToDaily: PropTypes.func.isRequired,
  onSwitchPatient: PropTypes.func.isRequired,
  onClickNavigationBack: PropTypes.func.isRequired,
  canPrint: PropTypes.bool,
  onClickPrint: PropTypes.func.isRequired,
  tidelineData: PropTypes.object.isRequired
}

export default PatientDashboard
