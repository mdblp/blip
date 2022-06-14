/**
 * Copyright (c) 2021, Diabeloop
 * Patient data page
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

import React from "react";
import bows from "bows";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";

import Blip from "blip";
import appConfig from "../lib/config";
import { useAuth } from "../lib/auth";
import { useTeam } from "../lib/team";
import { useData } from "../lib/data/hook";
import { setPageTitle } from "../lib/utils";

import ProfileDialog from "./dialogs/patient-profile";
import DialogDatePicker from "./date-pickers/dialog-date-picker";
import DialogRangeDatePicker from "./date-pickers/dialog-range-date-picker";
import DialogPDFOptions from "./dialogs/pdf-print-options";
import PatientInfoWidget from "./dashboard-widgets/patient-info-widget";
import ChatWidget from "./chat/chat-widget";
import { Patient } from "../lib/data/patient";
import AlarmCard from "./alarm/alarm-card";
import MedicalFilesWidget from "./dashboard-widgets/medical-files/medical-files-widget";

const patientDataStyles = makeStyles(() => {
  return {
    container: {
      padding: 0,
    },
  };
});

interface PatientDataParam {
  patientId?: string;
}

interface PatientDataPageErrorProps {
  msg: string;
}

const log = bows("PatientDataPage");

function PatientDataPageError({ msg }: PatientDataPageErrorProps): JSX.Element {
  return (
    <Container maxWidth="lg">
      <strong>{msg}</strong>
    </Container>
  );
}

function PatientDataPage(): JSX.Element | null {
  const { t } = useTranslation("yourloops");
  const paramHook = useParams();
  const authHook = useAuth();
  const teamHook = useTeam();
  const dataHook = useData();
  const classes = patientDataStyles();

  const [patient, setPatient] = React.useState<Readonly<Patient> | null>(null);
  const [patients, setPatients] = React.useState<Readonly<Patient>[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const { blipApi } = dataHook;
  const { patientId: paramPatientId = null } = paramHook as PatientDataParam;
  const authUser = authHook.user;
  const userId = authUser?.userid ?? null;
  const userIsPatient = authHook.user?.isUserPatient();
  const userIsHCP = authHook.user?.isUserHcp();
  const prefixURL = userIsPatient ? "" : `/patient/${paramPatientId}`;

  const initialized = authHook.isLoggedIn && teamHook.initialized && blipApi;

  React.useEffect(() => {
    if (!initialized) {
      return;
    }

    setPatients(teamHook.getPatients());
    let patientId = paramPatientId ?? userId;
    if (userIsPatient && authUser) {
      patientId = authUser.userid;
    }
    if (!patientId) {
      log.error("Invalid patient Id");
      setError("Invalid patient Id");
      return;
    }
    const patientToSet = teamHook.getPatient(patientId);
    if (patientToSet) {
      setPatient(patientToSet);
    } else {
      log.error("Patient not found");
      setError("Patient not found");
    }
  }, [initialized, paramPatientId, userId, teamHook, authUser, userIsPatient]);

  React.useEffect(() => {
    if (patient && patient.userid !== userId) {
      setPageTitle(t("user-name", patient.profile.lastName), "PatientName");
    } else {
      setPageTitle();
    }

  }, [userId, patient, t]);

  if (error) {
    return <PatientDataPageError msg={error} />;
  }

  if (!blipApi || !patient) {
    return null;
  }

  return (
    <Container className={classes.container} maxWidth={false}>
      <Blip
        config={appConfig}
        api={blipApi}
        patient={patient}
        userIsHCP={!!userIsHCP}
        patients={patients}
        setPatient={setPatient}
        profileDialog={ProfileDialog}
        prefixURL={prefixURL}
        dialogDatePicker={DialogDatePicker}
        dialogRangeDatePicker={DialogRangeDatePicker}
        dialogPDFOptions={DialogPDFOptions}
        patientInfoWidget={PatientInfoWidget}
        chatWidget={ChatWidget}
        alarmCard={AlarmCard}
        medicalFilesWidget={MedicalFilesWidget}
      />
    </Container>
  );
}

export default PatientDataPage;
