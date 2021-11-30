/**
 * Copyright (c) 2021, Diabeloop
 * Remove a patient for an HCP - Dialog
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

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { TeamUser, useTeam } from "../../../lib/team";
import { makeButtonsStyles } from "../../../components/theme";
import { useAlert } from "../../../components/utils/snackbar";

interface RemoveDialogProps {
  isOpen: boolean;
  patient: TeamUser | null;
  onClose: () => void;
}

const makeButtonClasses = makeStyles(makeButtonsStyles, { name: "ylp-dialog-remove-patient-dialog-buttons" });
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    progressButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

function RemoveDialog(props: RemoveDialogProps): JSX.Element {
  const { isOpen, onClose, patient } = props;
  const { t } = useTranslation("yourloops");
  const alert = useAlert();
  const teamHook = useTeam();
  const buttonClasses = makeButtonClasses();
  const classes = useStyles();
  const teamMembers = patient?.members;
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  const handleOnClose = (): void => {
    onClose();
    setSelectedTeamId("");
  };

  const handleOnClickRemove = async (): Promise<void> => {
    try {
      setProcessing(true);
      alert.success(t("alert-remove-patient-success"));
      await teamHook.removePatient(patient as TeamUser, selectedTeamId);
      onClose();
    } catch (err) {
      alert.error(t("alert-remove-patient-failure"));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleOnClose}>
      <DialogTitle>
        <strong>{t("remove-patient")}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t("team-remove-selection-info", { name: patient?.profile?.fullName })}
        </DialogContentText>
      </DialogContent>

      <DialogContent>
        <FormControl
          fullWidth
          required
          variant="outlined"
        >
          <InputLabel>{t("team")}</InputLabel>
          <Select
            label={t("team")}
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value as string)}
          >
            {teamMembers?.map((teamMember, index) => (
              <MenuItem value={teamMember.team.id} key={index}>
                {teamMember.team.code === "private" ? t("private-practice") : teamMember.team.name}
              </MenuItem>
            ))
            }
          </Select>
        </FormControl>
      </DialogContent>

      <DialogContent>
        <DialogContentText>
          {t("modal-remove-patient-info-2")}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleOnClose}
          color="secondary"
          variant="contained"
        >
          {t("button-cancel")}
        </Button>
        <div className={classes.wrapper}>
          <Button
            onClick={handleOnClickRemove}
            className={buttonClasses.buttonRedAction}
            disabled={!selectedTeamId || processing}
            variant="contained"
          >
            {t("remove-patient")}
          </Button>
          {processing && <CircularProgress size={24} className={classes.progressButton} />}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveDialog;
