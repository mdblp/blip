import React from "react";
import moment from "moment-timezone";
import PatientStatistics from "./patientStatistics";

export default function PatientDashboard(props) {
  const { bgPrefs, loading, chartPrefs, dataUtil, epochLocation, msRange, chatWidget } = props;
  const getEndpoints = () => {
    const start = moment.utc(epochLocation - msRange / 2).toISOString();
    const end = moment.utc(epochLocation + msRange / 2).toISOString();
    return [start, end];
  }
  const endpoints = getEndpoints();
  return (
    <div id="tidelineMain" className="patient-dashboard">
      <PatientStatistics
        bgPrefs={bgPrefs}
        bgSource={dataUtil.bgSource}
        chartPrefs={chartPrefs}
        chartType="daily"
        dataUtil={dataUtil}
        endpoints={endpoints}
        loading={loading}
      />
      <chatWidget/>
    </div>
  )
}
