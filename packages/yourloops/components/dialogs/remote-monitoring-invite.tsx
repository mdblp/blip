/**
 * Copyright (c) 2022, Diabeloop
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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { commonComponentStyles } from "../common";
import { Patient } from "../../lib/data/patient";
import PatientInfo from "../patient/patient-info";
import PatientMonitoringPrescription, { PrescriptionInfo } from "../patient/patient-monitoring-prescription";
import { useNotification } from "../../lib/notifications";
import { useTeam } from "../../lib/team";
import { MonitoringStatus } from "../../models/monitoring";

const useStyles = makeStyles((theme: Theme) => ({
  categoryTitle: {
    fontWeight: 600,
    textTransform: "uppercase",
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  subCategoryContainer: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  title: {
    alignSelf: "center",
  },
  valueSelection: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    marginLeft: theme.spacing(3),
  },
}));

export interface RemoteMonitoringPatientInviteDialogProps {
  patient: Patient,
  onClose: () => void
}

function RemoteMonitoringPatientInviteDialog(props: RemoteMonitoringPatientInviteDialogProps): JSX.Element {
  const commonClasses = commonComponentStyles();
  const { patient, onClose } = props;
  const classes = useStyles();
  const { t } = useTranslation("yourloops");
  const notificationHook = useNotification();
  const teamHook = useTeam();
  const [physician, setPhysician] = useState("");
  let prescriptionInfo: PrescriptionInfo = {
    teamId: undefined,
    memberId: undefined,
    file: undefined,
    numberOfMonth: 3,
  };
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  const onSave = async () => {
    console.log(prescriptionInfo.teamId);
    console.log(prescriptionInfo.memberId);
    console.log(prescriptionInfo.file);
    console.log(prescriptionInfo.numberOfMonth);
    console.log(physician);
    const monitoringEnd = new Date();
    monitoringEnd.setMonth(monitoringEnd.getMonth() + 3);
    if (!prescriptionInfo.teamId) {
      throw Error("Cannot invite patient as remote monitoring team id has not been defined");
    }
    await notificationHook.inviteRemoteMonitoring(prescriptionInfo.teamId, patient.userid, monitoringEnd);
    patient.monitoring =
      {
        enabled: false,
        status: MonitoringStatus.pending,
        monitoringEnd,
      };
    teamHook.editPatientRemoteMonitoring(patient);
    onClose();
  };

  const updatePrescriptionInfo = (prescriptionInformation: PrescriptionInfo) => {
    prescriptionInfo = {
      teamId: prescriptionInformation.teamId,
      memberId: prescriptionInformation.memberId,
      file: prescriptionInformation.file,
      numberOfMonth: prescriptionInformation.numberOfMonth,
    };
    setSaveButtonDisabled(!prescriptionInfo.teamId || !prescriptionInfo.memberId || !prescriptionInfo.file || !prescriptionInfo.numberOfMonth);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open
      onClose={onClose}
    >
      <DialogTitle id="remote-monitoring-dialog-invite-title" className={classes.title}>
        <Box display="flex">
          <DesktopMacIcon />
          <Typography className={commonClasses.title}>
            {t("remote-monitoring-patient-invite")}
          </Typography>
        </Box>
      </DialogTitle>

      <Box paddingX={4}>
        <PatientInfo patient={patient} />

        <Divider variant="middle" className={classes.divider} />

        <PatientMonitoringPrescription setPrescriptionInfo={updatePrescriptionInfo} />

        <Divider variant="middle" className={classes.divider} />

        <Typography className={classes.categoryTitle}>
          3. {t("attending-physician")} ({t("optional")})
        </Typography>
        <Box display="flex" marginTop={2}>
          <Box className={classes.subCategoryContainer}>
            <Box className={classes.valueSelection}>
              <Typography>{t("attending-physician")}</Typography>
              <Box marginX={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  onChange={(e) => setPhysician(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <DialogActions>
        <Button
          onClick={onClose}
        >
          {t("button-cancel")}
        </Button>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          disabled={saveButtonDisabled}
          onClick={onSave}
        >
          {t("button-save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoteMonitoringPatientInviteDialog;
