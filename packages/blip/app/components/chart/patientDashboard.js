import React from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import Box from "@material-ui/core/Box";
import PatientStatistics from "./patientStatistics";
import Header from "./header";

const PatientDashboard = (props) => {
  //eslint-disable-next-line
  const { patient, user, prefixURL, profileDialog, bgPrefs, loading, chartPrefs, dataUtil, epochLocation, msRange, chatWidget: ChatWidget} = props;
  const getEndpoints = () => {
    const start = moment.utc(epochLocation - msRange / 2).toISOString();
    const end = moment.utc(epochLocation + msRange / 2).toISOString();
    return [start, end];
  };
  /*retrieve for the patient the first monitoring team found (only one monitoring team is allowed)*/
  // eslint-disable-next-line react/prop-types
  const teamId = patient.members.filter(member => member.role === "patient" /*&& member.team.isMonitored === true*/)[0].team.id;

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
        {/* eslint-disable-next-line react/prop-types */}
        <ChatWidget patientId={patient.userid} teamId={teamId} userId={user.userid} role={user.role}/>
      </Box>
    </div>
  );
};

PatientDashboard.propType = {
  loading: PropTypes.bool.isRequired,
  patient: PropTypes.object,
  prefixURL:  PropTypes.string,
  profileDialog: PropTypes.func,
  bgPrefs: PropTypes.object.isRequired,
  chartPrefs: PropTypes.object.isRequired,
  dataUtil: PropTypes.object,
  epochLocation: PropTypes.number.isRequired,
  msRange: PropTypes.number.isRequired,
};

export default PatientDashboard;
