import React from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import Box from "@material-ui/core/Box";
import PatientStatistics from "./patientStatistics";
import Header from "./header";
import DeviceUsage from "./deviceUsage";
import "./patientDashboardVars.css";

const PatientDashboard = (props) => {
  //eslint-disable-next-line
  const {
    patient, prefixURL, profileDialog, bgPrefs, loading, chartPrefs, dataUtil, epochLocation, msRange,
    timePrefs, tidelineData, permsOfLoggedInUser, trackMetric
  } = props;
  const getEndpoints = () => {
    const start = moment.utc(epochLocation - msRange / 2).toISOString();
    const end = moment.utc(epochLocation + msRange / 2).toISOString();
    return [start, end];
  };
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
        <DeviceUsage
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
        />
        {/*<chatWidget/>*/}
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
