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

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { TeamUser } from "../../../lib/team";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { makeButtonsStyles } from "../../../components/theme";

interface RemoveDialogProps {
  isOpen: boolean;
  patient: TeamUser | null;
  onClose: (confirmed: boolean) => void;
}

const makeButtonClasses = makeStyles(makeButtonsStyles, { name: "ylp-dialog-remove-patient-dialog-buttons" });

function RemoveDialog(props: RemoveDialogProps): JSX.Element {
  const buttonClasses = makeButtonClasses();
  const { isOpen, onClose, patient } = props;
  const { t } = useTranslation("yourloops");
  const teamMembers = patient?.members;
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  const handleOnClose = (confirmed: boolean): void => {
    onClose(confirmed);
    setSelectedTeam("");
  };

  const handleOnClickRemove = (): void => {
    // TODO remove patient
    onClose(true);
  };

  return (
    <Dialog open={isOpen} onClose={() => handleOnClose(false)} fullWidth>
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
            placeholder={t("team")}
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value as string)}
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
          onClick={() => handleOnClose(false)}
          color="secondary"
          variant="contained"
        >
          {t("button-cancel")}
        </Button>
        <Button
          onClick={handleOnClickRemove}
          className={buttonClasses.buttonRedAction}
          disabled={!selectedTeam}
          variant="contained"
        >
          {t("remove-patient")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveDialog;
