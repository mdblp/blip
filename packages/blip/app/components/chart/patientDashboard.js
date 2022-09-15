import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import Box from '@material-ui/core/Box'
import PatientStatistics from './patientStatistics'
import Header from './header'
import DeviceUsage from './deviceUsage'
import './patientDashboardVars.css'

const PatientDashboard = (props) => {
  const {
    //eslint-disable-next-line
    patient,
    user,
    prefixURL,
    profileDialog,
    bgPrefs,
    loading,
    chartPrefs,
    dataUtil,
    epochLocation,
    msRange,
    chatWidget: ChatWidget,
    alarmCard: AlarmCard,
    medicalFilesWidget: MedicalFilesWidget,
    canPrint,
    onClickPrint,
    //eslint-disable-next-line
    timePrefs, tidelineData, permsOfLoggedInUser, trackMetric, onSwitchToTrends, onSwitchToDaily, patients, userIsHCP, onSwitchPatient, onClickNavigationBack, patientInfoWidget: PatientInfoWidget
  } = props
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
      <Header
        id="dashboard-header"
        profileDialog={profileDialog}
        chartType={'dashboard'}
        patient={patient}
        patients={patients}
        userIsHCP={userIsHCP}
        prefixURL={prefixURL}
        canPrint={canPrint}
        onClickPrint={onClickPrint}
        onClickTrends={onSwitchToTrends}
        onClickOneDay={handleClickDaily}
        onClickDashboard={handleClickDashboard}
        onSwitchPatient={onSwitchPatient}
        onClickNavigationBack={onClickNavigationBack}
        trackMetric={trackMetric}
      />
      <Box id="patient-dashboard-content">
        {<PatientInfoWidget patient={patient} />}
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
        {patient.monitoring?.enabled &&
          <AlarmCard patient={patient} />
        }
        {patient.monitoring?.enabled &&
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
  profileDialog: PropTypes.func,
  bgPrefs: PropTypes.object.isRequired,
  chartPrefs: PropTypes.object.isRequired,
  dataUtil: PropTypes.object,
  epochLocation: PropTypes.number.isRequired,
  msRange: PropTypes.number.isRequired,
  patientInfoWidget: PropTypes.func.isRequired,
  onSwitchToTrends: PropTypes.func.isRequired,
  onSwitchToDaily: PropTypes.func.isRequired,
  onSwitchPatient: PropTypes.func.isRequired,
  onClickNavigationBack: PropTypes.func.isRequired,
  canPrint: PropTypes.bool,
  onClickPrint: PropTypes.func.isRequired
}

export default PatientDashboard
