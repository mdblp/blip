import React from "react";
import moment from "moment-timezone";
import PatientStatistics from "./patientStatistics";
import Header from "./header";

export default function PatientDashboard(props) {
  const { patient, user, prefixURL, profileDialog, bgPrefs, loading, chartPrefs, dataUtil, epochLocation, msRange, chatWidget: ChatWidget} = props;
  const getEndpoints = () => {
    const start = moment.utc(epochLocation - msRange / 2).toISOString();
    const end = moment.utc(epochLocation + msRange / 2).toISOString();
    return [start, end];
  };
  /*retrieve for the patient the first monitoring team found (only one monitoring team is allowed)*/
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
      <PatientStatistics
        bgPrefs={bgPrefs}
        bgSource={dataUtil.bgSource}
        chartPrefs={chartPrefs}
        chartType="daily"
        dataUtil={dataUtil}
        endpoints={endpoints}
        loading={loading}
      />
      <ChatWidget patientId={patient.userid} teamId={teamId} userId={user.userid} role={user.role}/>
    </div>
  );
}
