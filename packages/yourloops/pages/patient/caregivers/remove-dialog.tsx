/**
 * Copyright (c) 2021, Diabeloop
 * Patient care givers page: Remove a caregiver dialog
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
import { useTranslation } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeButtonsStyles } from "../../../components/theme";

import { getUserFirstLastName } from "../../../lib/utils";
import { RemoveDialogContentProps } from "./types";

export interface RemoveDialogProps {
  actions: RemoveDialogContentProps | null;
}

const makeButtonsClasses = makeStyles(makeButtonsStyles, { name: "ylp-dialog-buttons" });

/**
 * Remove a caregiver dialog / modale
 */
function RemoveDialog(props: RemoveDialogProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const buttonsClasses = makeButtonsClasses();

  const handleClose = () => {
    props.actions?.onDialogResult(false);
  };
  const handleRemoveCaregiver = () => {
    props.actions?.onDialogResult(true);
  };

  const dialogIsOpen = props.actions !== null;
  const userName = props.actions !== null ? getUserFirstLastName(props.actions.caregiver.user) : { firstName: "", lastName: "" };
  const name = t("user-name", userName);

  return (
    <Dialog
      id="patient-remove-caregiver-dialog"
      open={dialogIsOpen}
      aria-labelledby={t("modal-patient-remove-caregiver-title")}
      onClose={handleClose}
    >
      <DialogTitle id="patient-remove-caregiver-dialog-title">
        <strong>{t("modal-patient-remove-caregiver-title")}</strong>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t("modal-remove-caregiver-question", { name })}
        </DialogContentText>
        <DialogContentText>
          {t("modal-patient-remove-caregiver-info-2")}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          id="patient-remove-caregiver-dialog-button-cancel"
          onClick={handleClose}
        >
          {t("button-cancel")}
        </Button>
        <Button
          id="patient-remove-caregiver-dialog-button-remove"
          className={buttonsClasses.alertActionButton}
          variant="contained"
          disableElevation
          onClick={handleRemoveCaregiver}
        >
          {t("modal-patient-remove-caregiver-remove")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveDialog;
