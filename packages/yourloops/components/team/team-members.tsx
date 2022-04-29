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

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

import { Team, TeamMember, useTeam } from "../../lib/team";
import { StyledTableCell } from "../../pages/hcp/patients/table";
import MemberRow from "./member-row";
import TableBody from "@material-ui/core/TableBody";
import { TeamMemberRole, TypeTeamMemberRole } from "../../models/team";
import AddMemberDialog from "../../pages/hcp/team-member-add-dialog";
import { AddMemberDialogContentProps, TeamLeaveDialogContentProps } from "../../pages/hcp/types";
import LeaveTeamDialog from "../../pages/hcp/team-leave-dialog";
import { useAlert } from "../utils/snackbar";
import { useHistory } from "react-router-dom";
import { commonTeamStyles } from "./common";

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonLeaveTeam: {
    marginRight: "23px",
  },
  groupOutlinedIcon: {
    margin: "0px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  headerTiltleIcon: {
    display: "flex",
    flexDirection: "row",
  },
  tableCellHeader: {
    backgroundColor: theme.palette.common.white,
    fontSize: "15px",
    fontWeight: 600,
    height: "49px",
    padding: 0,
    paddingLeft: "11px",
  },
  tableCellIcon: {
    width: "67px",
  },
  tableContainer: {
    boxShadow: theme.shadows[2],
  },
  tableRowHeader: {
    padding: 0,
  },
}));

interface TeamMembersProps {
  team: Team;
}

function TeamMembers(props: TeamMembersProps): JSX.Element {
  const { team } = props;
  const teamHook = useTeam();
  const alert = useAlert();
  const historyHook = useHistory();
  const classes = useStyles();
  const commonTeamClasses = commonTeamStyles();
  const { t } = useTranslation("yourloops");
  const [addMember, setAddMember] = React.useState<AddMemberDialogContentProps | null>(null);
  const [teamToLeave, setTeamToLeave] = React.useState<TeamLeaveDialogContentProps | null>(null);

  const getNonPatientMembers = (team? : Team) => {
    return team ? team.members.filter(teamMember => teamMember.role === TeamMemberRole.admin || teamMember.role === TeamMemberRole.member) : [];
  };

  const [members, setMembers] = React.useState<TeamMember[]>(getNonPatientMembers(team));

  const onMemberInvited = async (member: { email: string; role: Exclude<TypeTeamMemberRole, "patient">, team: Team } | null) => {
    if (member) {
      await teamHook.inviteMember(member.team, member.email, member.role);
    }
    setAddMember(null);
  };

  const openInviteMemberDialog = () => {
    setAddMember({ team, onMemberInvited });
  };

  useEffect(() => {
    setMembers(getNonPatientMembers(team));
  }, [team]);

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

  const refresh = () => {
    setMembers(getNonPatientMembers(teamHook.getTeam(team.id) ?? undefined));
  };

  return (
    <React.Fragment>
      <div className={commonTeamClasses.root}>
        <div className={classes.header}>
          <div className={classes.headerTiltleIcon}>
            <GroupOutlinedIcon className={classes.groupOutlinedIcon} />
            <Typography className={commonTeamClasses.title}>
              {t("members").toUpperCase()} ({members.length})
            </Typography>
          </div>
          <div>
            <Button className={`${commonTeamClasses.button} ${classes.buttonLeaveTeam}`} onClick={openLeaveTeamDialog}>
              <ExitToAppIcon className={commonTeamClasses.icon} />{t("button-team-leave")}
            </Button>
            <Button className={commonTeamClasses.button} onClick={openInviteMemberDialog}>
              <GroupAddIcon className={commonTeamClasses.icon} />
              {t("button-team-add-member")}
            </Button>
          </div>
        </div>
        <div className={classes.body}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table id="patients-list-table" aria-label={t("aria-table-list-patient")}
              stickyHeader>
              <TableHead>
                <TableRow className={classes.tableRowHeader}>
                  <StyledTableCell id="team-members-full-name" className={classes.tableCellHeader}>
                    {t("member")}
                  </StyledTableCell>
                  <StyledTableCell id="team-members-status"
                    className={`${classes.tableCellHeader} ${classes.tableCellIcon}`}>
                  </StyledTableCell>
                  <StyledTableCell id="team-members-email" className={classes.tableCellHeader}>
                    {t("email")}
                  </StyledTableCell>
                  <StyledTableCell id="team-members-admin" className={classes.tableCellHeader}>
                    {t("admin")}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map(
                  (teamMember: TeamMember): JSX.Element => (
                    <MemberRow
                      key={teamMember.user.userid}
                      teamMember={teamMember}
                      team={team}
                      refreshParent={refresh}
                    />
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <LeaveTeamDialog teamToLeave={teamToLeave} />
      <AddMemberDialog addMember={addMember} />
    </React.Fragment>
  );
}

export default TeamMembers;
