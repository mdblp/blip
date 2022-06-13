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
import { makeStyles, Theme } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import FolderSharedOutlinedIcon from "@material-ui/icons/FolderSharedOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import LocalPhoneOutlinedIcon from "@material-ui/icons/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import EditIcon from "@material-ui/icons/Edit";

import { Team, useTeam } from "../../lib/team";
import TeamEditDialog from "../../pages/hcp/team-edit-dialog";
import { TeamEditModalContentProps } from "../../pages/hcp/types";
import { commonComponentStyles } from "../common";
import { useAlert } from "../utils/snackbar";
import { useAuth } from "../../lib/auth";
import LeaveTeamButton from "./leave-team-button";

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: "flex",
    flexWrap: "wrap",
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  label: {
    fontWeight: 600,
    fontSize: "13px",
    width: "180px",
  },
  value: {
    fontSize: "13px",
  },
  teamInfo: {
    "display": "flex",
    "alignItems": "top",
    "width": "50%",
    "marginBottom": theme.spacing(4),
    "& > div": {
      display: "flex",
      alignItems: "center",
    },
  },
}));

export interface TeamInformationProps {
  team: Team;
  refreshParent: () => void;
}

function TeamInformation(props: TeamInformationProps): JSX.Element {
  const { team, refreshParent } = props;
  const teamHook = useTeam();
  const alert = useAlert();
  const classes = useStyles();
  const authContext = useAuth();
  const loggedInUserId = authContext.user?.userid as string;
  const isUserPatient = authContext.user?.isUserPatient();
  const isUserAdmin = teamHook.isUserAdministrator(team, loggedInUserId);
  const commonTeamClasses = commonComponentStyles();
  const { t } = useTranslation("yourloops");
  const address = `${team.address?.line1}\n${team.address?.line2}\n${team.address?.zip}\n${team.address?.city}\n${team.address?.country}`;
  const [teamToEdit, setTeamToEdit] = React.useState<TeamEditModalContentProps | null>(null);

  const onSaveTeam = async (editedTeam: Partial<Team> | null) => {
    if (editedTeam) {
      try {
        await teamHook.editTeam(editedTeam as Team);
        alert.success(t("team-page-success-edit"));
        refreshParent();
      } catch (reason: unknown) {
        alert.error(t("team-page-failed-edit"));
      }
    }
    setTeamToEdit(null);
  };

  const editTeam = () => {
    setTeamToEdit({ team, onSaveTeam });
  };

  return (
    <React.Fragment>
      <div className={commonTeamClasses.root}>
        <div className={commonTeamClasses.categoryHeader}>
          <div>
            <InfoOutlinedIcon />
            <Typography className={commonTeamClasses.title}>
              {t("information")}
            </Typography>
          </div>
          {isUserAdmin &&
            <Button
              id="edit-team-button"
              variant="contained"
              color="primary"
              disableElevation
              onClick={editTeam}
              className={commonTeamClasses.button}
            >
              <EditIcon className={commonTeamClasses.icon} />
              {t("edit-information")}
            </Button>
          }
          {isUserPatient && <div id="leave-team-button">
            <LeaveTeamButton team={team} />
          </div>
          }
        </div>

        <div className={classes.body}>
          <div className={classes.teamInfo}>
            <div>
              <FolderSharedOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t("team-name")}
              </Typography>
            </div>
            <Typography id={`team-information-${team.id}-name`} className={classes.value}>
              {team.name}
            </Typography>
          </div>
          <div className={classes.teamInfo}>
            <div>
              <LocalPhoneOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t("phone-number")}
              </Typography>
            </div>
            <Typography id={`team-information-${team.id}-phone`} className={classes.value}>
              {team.phone}
            </Typography>
          </div>
          <div className={classes.teamInfo}>
            <div>
              <VerifiedUserOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t("identification-code")}
              </Typography>
            </div>
            <Typography id={`team-information-${team.id}-code`} className={classes.value}>
              {team.code}
            </Typography>
          </div>
          <div className={classes.teamInfo}>
            <div>
              <LocationOnOutlinedIcon className={commonTeamClasses.icon} />
              <Typography className={classes.label}>
                {t("address")}
              </Typography>
            </div>
            <Typography
              id={`team-information-${team.id}-address`}
              className={classes.value}
            >
              {address}
            </Typography>
          </div>
        </div>
      </div>
      {teamToEdit &&
        <TeamEditDialog teamToEdit={teamToEdit} />
      }
    </React.Fragment>
  );
}

export default TeamInformation;
