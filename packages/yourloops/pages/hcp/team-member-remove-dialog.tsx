/**
 * Copyright (c) 2021, Diabeloop
 * Dialog to confirm to remove a member from a team
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

import * as React from "react";
import { Trans, useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { Team, TeamMember } from "../../models/team";

interface RemoveMemberDialogProps {
  userToBeRemoved: null | {
    team: Team;
    userId: string;
  };
  handleClose: () => void;
  handleRemoveTeamMember: () => Promise<void>;
}

const removeMemberDialogClasses = makeStyles((theme: Theme) => {
  return {
    buttonCancel: {
      marginRight: theme.spacing(2),
    },
  };
});

function RemoveMemberDialog(props: RemoveMemberDialogProps): JSX.Element {
  const { userToBeRemoved, handleClose, handleRemoveTeamMember } = props;
  const classes = removeMemberDialogClasses();
  const { t } = useTranslation("yourloops");

  let hcpFirstName = "n/a";
  let hcpLastName = "n/a";
  let teamName = "n/a";
  if (userToBeRemoved !== null) {
    teamName = userToBeRemoved.team.name ?? "";
    const teamMember = userToBeRemoved.team.members?.find((tm: TeamMember) => tm.userId === userToBeRemoved.userId);

    hcpLastName = teamMember?.user?.profile?.lastName ?? teamMember?.user?.profile?.fullName ?? teamMember?.user?.username ?? userToBeRemoved.userId;
    hcpFirstName = teamMember?.user?.profile?.firstName ?? "";
  }

  const [buttonsDisabled, setButtonsDisabled] = React.useState(false);
  const handleClickRemoveTeamMember = async (): Promise<void> => {
    setButtonsDisabled(true);
    await handleRemoveTeamMember();
    setButtonsDisabled(false);
  };

  return (
    <Dialog
      id="team-members-dialog-rmmember"
      open={userToBeRemoved !== null}
      aria-labelledby={t("aria-team-members-dialog-rmmember-title", { teamName })}
      aria-describedby={t("aria-team-members-dialog-rmmember-question", { hcpFirstName, hcpLastName })}>
      <DialogTitle id="team-members-dialog-rmmember-title">
        <Trans i18nKey="team-members-dialog-rmmember-title" t={t} components={{ strong: <strong /> }} parent={React.Fragment}>
          Remove a healthcare professional from the team <strong>{{ teamName }}</strong>
        </Trans>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="team-members-dialog-rmmember-question">
          <Trans
            i18nKey="team-members-dialog-rmmember-question"
            t={t}
            components={{ strong: <strong /> }}
            values={{ hcpFirstName, hcpLastName }}
            parent={React.Fragment}>
            Are you sure you want to remove <strong>{hcpFirstName} {hcpLastName}</strong> from this medical team?
          </Trans>
        </DialogContentText>
        <DialogContentText id="team-members-dialog-rmmember-consequences">
          {t("team-members-dialog-rmmember-consequences")}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          id="team-members-dialog-rmmember-button-cancel"
          onClick={handleClose}
          disabled={buttonsDisabled}
          className={classes.buttonCancel}
          color="secondary"
          variant="contained">
          {t("Cancel")}
        </Button>
        <Button
          id="team-members-dialog-rmmember-button-remove"
          onClick={handleClickRemoveTeamMember}
          disabled={buttonsDisabled}
          color="primary"
          variant="contained">
          {t("team-members-dialog-rmmember-button-remove")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveMemberDialog;
