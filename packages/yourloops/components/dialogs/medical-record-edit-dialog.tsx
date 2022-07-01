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

import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles, Theme } from "@material-ui/core/styles";

import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Divider from "@material-ui/core/Divider";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { MedicalRecord } from "../../lib/medical-files/model";
import MedicalFilesApi from "../../lib/medical-files/medical-files-api";
import { CategoryProps } from "../dashboard-widgets/medical-files/medical-files-widget";
import ProgressIconButtonWrapper from "../buttons/progress-icon-button-wrapper";
import { useAlert } from "../utils/snackbar";

export interface MedicalRecordEditDialogProps extends CategoryProps {
  onClose: () => void;
  onSaved: (payload: MedicalRecord) => void;
  readonly: boolean;
  medicalRecord?: MedicalRecord;
}

const classes = makeStyles((theme: Theme) => ({
  divider: {
    margin: "30px 0 10px 16px",
  },
  title: {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "& > svg": {
      marginRight: theme.spacing(1),
    },
  },
  textArea: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));

export default function MedicalRecordEditDialog(props: MedicalRecordEditDialogProps): JSX.Element {
  const { title, textArea, divider } = classes();
  const { t } = useTranslation("yourloops");
  const alert = useAlert();
  const { onClose, onSaved, medicalRecord, teamId, patientId, readonly } = props;

  const [diagnosis, setDiagnosis] = useState<string>(medicalRecord?.diagnosis || "");
  const [progressionProposal, setProgressionProposal] = useState<string>(medicalRecord?.progressionProposal || "");
  const [trainingSubject, setTrainingSubject] = useState<string>(medicalRecord?.trainingSubject || "");
  const [inProgress, setInProgress] = useState<boolean>(false);
  const disabled = useMemo<boolean>(
    () => readonly || inProgress || !diagnosis && !trainingSubject && !progressionProposal,
    [diagnosis, inProgress, progressionProposal, readonly, trainingSubject]);

  const saveMedicalRecord = async () => {
    try {
      setInProgress(true);
      let payload: MedicalRecord;
      if (medicalRecord) {
        payload = await MedicalFilesApi.updateMedicalRecord({
          ...medicalRecord,
          diagnosis,
          progressionProposal,
          trainingSubject,
        });
      } else {
        payload = await MedicalFilesApi.createMedicalRecord({
          teamId,
          patientId,
          diagnosis,
          progressionProposal,
          trainingSubject,
        });
      }
      setInProgress(false);
      alert.success(t("medical-record-save-success"));
      onSaved(payload);
    } catch (err) {
      console.log(err);
      setInProgress(false);
      alert.error(t("medical-record-save-failed"));
    }
  };

  useEffect(() => {
    return () => {
      setProgressionProposal("");
      setDiagnosis("");
      setTrainingSubject("");
    };
  }, []);

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      onClose={onClose}
    >
      <DialogTitle>
        <Box className={title}>
          <DescriptionOutlinedIcon />
          <Typography variant="h5">
            {t("write-medical-record")}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6">
          1. {t("diagnosis")}
        </Typography>
        <TextField
          value={diagnosis}
          className={textArea}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          disabled={readonly}
          onChange={(event) => setDiagnosis(event.target.value)}
        />

        <Divider className={divider} />

        <Typography variant="h6">
          2. {t("progression-proposal")}
        </Typography>
        <TextField
          value={progressionProposal}
          className={textArea}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          disabled={readonly}
          onChange={(event) => setProgressionProposal(event.target.value)}
        />

        <Divider className={divider} />

        <Typography variant="h6">
          3. {t("training-subject")}
        </Typography>
        <TextField
          value={trainingSubject}
          className={textArea}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          disabled={readonly}
          onChange={(event) => setTrainingSubject(event.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          disableElevation
          onClick={onClose}
        >
          {t("cancel")}
        </Button>
        <ProgressIconButtonWrapper inProgress={inProgress}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={disabled}
            onClick={saveMedicalRecord}
          >
            {t("save")}
          </Button>
        </ProgressIconButtonWrapper>
      </DialogActions>
    </Dialog>
  );
}
