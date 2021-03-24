/**
 * Copyright (c) 2021, Diabeloop
 * Team card for HCPs
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
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import { TeamMemberRole } from "../../models/team";
import { Team } from "../../lib/team";
import GenericTeamCard from "../../components/team-card";

export interface TeamCardProps {
  team: Readonly<Team>;
  memberRole: TeamMemberRole;
  onShowEditTeamDialog: (team: Team | null) => Promise<void>;
  onShowLeaveTeamDialog: (team: Team) => Promise<boolean>;
  onShowAddMemberDialog: (team: Team) => Promise<void>;
}

export interface TeamInfoProps {
  id: string;
  label: string;
  value?: null | string | JSX.Element;
  icon: JSX.Element;
}

const teamCardStyles = makeStyles((theme: Theme) => {
  return {
    paper: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.primary.light,
    },
    paperRoot: {
      padding: "1em 3em",
    },
    firstRow: {
      display: "flex",
      flexDirection: "row",
      marginBottom: theme.spacing(2), // eslint-disable-line no-magic-numbers
    },
    secondRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    teamName: {
      minWidth: "8em",
    },
    teamInfoIcon: {
      fill: "#2e2e2e",
    },
    buttonActionFirstRow: {
      alignSelf: "center",
      marginRight: "1em",
      textTransform: "initial",
    },
    divActions: {
      marginLeft: "2em",
      display: "flex",
      flexGrow: 1,
      justifyContent: "flex-start",
    },
  };
});

const teamInfoStyles = makeStyles((theme: Theme) => {
  return {
    card: {
      display: "flex",
      flexDirection: "row",
      marginRight: theme.spacing(3), // eslint-disable-line no-magic-numbers
    },
    avatar: {
      backgroundColor: "#e4e4e5",
    },
    divLabelValue: {
      display: "flex",
      flexDirection: "column",
      marginLeft: theme.spacing(2),
      fontSize: theme.typography.fontSize,
    },
    spanValue: {
      fontWeight: 500,
    },
  };
});

export function TeamInfo(props: TeamInfoProps): JSX.Element | null {
  const { id, label, value, icon } = props;
  const classes = teamInfoStyles();
  const { t } = useTranslation("yourloops");

  if (value === null || typeof value === "undefined") {
    return null;
  }

  return (
    <div id={`team-card-info-${id}-${label}`} className={classes.card}>
      <Avatar className={classes.avatar}>{icon}</Avatar>
      <div className={classes.divLabelValue}>
        <span id={`team-card-info-${id}-${label}-label`}>{t(`team-card-label-${label}`)}</span>
        <span id={`team-card-info-${id}-${label}-value`} className={classes.spanValue}>
          {value}
        </span>
      </div>
    </div>
  );
}

function TeamCard(props: TeamCardProps): JSX.Element {
  const { team, memberRole, onShowEditTeamDialog, onShowLeaveTeamDialog, onShowAddMemberDialog } = props;
  const classes = teamCardStyles();
  const { t } = useTranslation("yourloops");
  const [buttonsDisabled, setButtonsDisabled] = React.useState(false);

  const handleClickEdit = async (): Promise<void> => {
    setButtonsDisabled(true);
    await onShowEditTeamDialog(team);
    setButtonsDisabled(false);
  };
  const handleClickLeaveTeam = async (): Promise<void> => {
    setButtonsDisabled(true);
    const result = await onShowLeaveTeamDialog(team);
    if (!result) {
      setButtonsDisabled(false);
    }
  };
  const handleClickAddMember = async (): Promise<void> => {
    setButtonsDisabled(true);
    await onShowAddMemberDialog(team);
    setButtonsDisabled(false);
  };

  const { id } = team;

  if (memberRole === TeamMemberRole.admin) {
    return (
      <GenericTeamCard team={team}>
        <Button
          id={`team-card-${id}-button-edit`}
          className={classes.buttonActionFirstRow}
          startIcon={<EditIcon color="primary" />}
          onClick={handleClickEdit}
          disabled={buttonsDisabled}>
          {t("button-team-edit")}
        </Button>
        <Button
          id={`team-card-${id}-button-add-member`}
          className={classes.buttonActionFirstRow}
          startIcon={<PersonAddIcon color="primary" />}
          onClick={handleClickAddMember}
          disabled={buttonsDisabled}>
          {t("button-team-add-member")}
        </Button>
        <Button
          id={`team-card-${id}-button-leave-team`}
          className={classes.buttonActionFirstRow}
          startIcon={<ExitToAppIcon color="primary" />}
          onClick={handleClickLeaveTeam}
          disabled={buttonsDisabled}>
          {t("button-team-leave")}
        </Button>
      </GenericTeamCard>
    );
  }

  return <GenericTeamCard team={team} />;
}

export default TeamCard;
