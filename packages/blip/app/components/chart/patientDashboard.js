import React from "react";
import moment from "moment-timezone";
import PatientStatistics from "./patientStatistics";
import Header from "./header";
import chatWidget from "yourloops/components/chat/chat-widget";

export default function PatientDashboard(props) {
  const { patient, prefixURL, profileDialog, bgPrefs, loading, chartPrefs, dataUtil, epochLocation, msRange, chatWidget: ChatWidget} = props;
  const getEndpoints = () => {
    const start = moment.utc(epochLocation - msRange / 2).toISOString();
    const end = moment.utc(epochLocation + msRange / 2).toISOString();
    return [start, end];
  };

  console.log(props);
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
      <PatientStatistics
        bgPrefs={bgPrefs}
        bgSource={dataUtil.bgSource}
        chartPrefs={chartPrefs}
        chartType="daily"
        dataUtil={dataUtil}
        endpoints={endpoints}
        loading={loading}
      />
      <ChatWidget/>
    </div>
  );
}
