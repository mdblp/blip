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

import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { Team, useTeam } from "../../lib/team";
import { TeamLeaveDialogContentProps } from "../../pages/hcp/types";
import { commonComponentStyles } from "../common";
import { useAlert } from "../utils/snackbar";
import { useHistory } from "react-router-dom";
import LeaveTeamDialog from "../../pages/hcp/team-leave-dialog";

export interface TeamInformationProps {
  team: Team;
}

function LeaveTeamButton(props: TeamInformationProps): JSX.Element {
  const { team } = props;
  const teamHook = useTeam();
  const alert = useAlert();
  const historyHook = useHistory();
  const commonTeamClasses = commonComponentStyles();
  const { t } = useTranslation("yourloops");
  const [teamToLeave, setTeamToLeave] = React.useState<TeamLeaveDialogContentProps | null>(null);

  const onTeamLeft = async (hasLeft: boolean) => {
    if (hasLeft) {
      const onlyMember = !((team.members.length ?? 0) > 1);
      try {
        await teamHook.leaveTeam(team);
        const message = teamHook.teamHasOnlyOneMember(team)
          ? t("team-page-success-deleted")
          : t("team-page-leave-success");
        alert.success(message);
        historyHook.push("/");
      } catch (reason: unknown) {
        const message = onlyMember
          ? t("team-page-failure-deleted")
          : t("team-page-failed-leave");
        alert.error(message);
      }
    }
    setTeamToLeave(null);
  };

  const openLeaveTeamDialog = () => {
    setTeamToLeave({ team, onDialogResult: onTeamLeft });
  };

  return (
    <React.Fragment>
      <Button
        className={commonTeamClasses.button}
        variant="contained"
        color="primary"
        disableElevation
        onClick={openLeaveTeamDialog}
      >
        <ExitToAppIcon className={commonTeamClasses.icon} />{t("button-team-leave")}
      </Button>
      <LeaveTeamDialog teamToLeave={teamToLeave} />
    </React.Fragment>
  );
}

export default LeaveTeamButton;
