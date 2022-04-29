import React from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import Box from "@material-ui/core/Box";
import PatientStatistics from "./patientStatistics";
import Header from "./header";

const PatientDashboard = (props) => {
  //eslint-disable-next-line
  const { patient, user, teams, prefixURL, profileDialog, bgPrefs, loading, chartPrefs, dataUtil, epochLocation, msRange, chatWidget: ChatWidget} = props;
  const getEndpoints = () => {
    const start = moment.utc(epochLocation - msRange / 2).toISOString();
    const end = moment.utc(epochLocation + msRange / 2).toISOString();
    return [start, end];
  };
  /*TODO : retrieve only team with a filter on isMonitored (not present in front today so taking the first ...)*/
  /*Tricky for hcp, there could be more than one monitoring team. \
  See if it's possible to search for the team with the patient in it*/
  const monitoringTeam = teams[0];

  const endpoints = getEndpoints();
  return (
    <div id="patient-dashboard" className="patient-dashboard">
      <Header
        profileDialog={profileDialog}
        chartType={"dashboard"}
        patient={patient}
        prefixURL={prefixURL}
        canPrint={true}
      />
      <Box id="patient-dashboard-content">
        <PatientStatistics
          bgPrefs={bgPrefs}
          //eslint-disable-next-line
          bgSource={dataUtil.bgSource}
          chartPrefs={chartPrefs}
          chartType="daily"
          dataUtil={dataUtil}
          endpoints={endpoints}
          loading={loading}
        />
        {monitoringTeam &&
          /* eslint-disable-next-line react/prop-types */
          <ChatWidget patientId={patient.userid} userId={user.userid} teamId={monitoringTeam.id} userRole={user.role}/>
        }
      </Box>
    </div>
  );
};

PatientDashboard.propType = {
  loading: PropTypes.bool.isRequired,
  patient: PropTypes.object,
  teams: PropTypes.object,
  prefixURL:  PropTypes.string,
  profileDialog: PropTypes.func,
  bgPrefs: PropTypes.object.isRequired,
  chartPrefs: PropTypes.object.isRequired,
  dataUtil: PropTypes.object,
  epochLocation: PropTypes.number.isRequired,
  msRange: PropTypes.number.isRequired,
};

export default PatientDashboard;
