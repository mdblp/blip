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

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import TableBody from "@material-ui/core/TableBody";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

import { Team, TeamMember, useTeam } from "../../lib/team";
import MemberRow from "./member-row";
import { TeamMemberRole, TypeTeamMemberRole } from "../../models/team";
import AddMemberDialog from "../../pages/hcp/team-member-add-dialog";
import { AddMemberDialogContentProps } from "../../pages/hcp/types";
import { commonComponentStyles } from "../common";
import LeaveTeamButton from "./leave-team-button";
import { useAuth } from "../../lib/auth";
import { StyledTableCell } from "../styled-components";
import { useAlert } from "../utils/snackbar";
import { errorTextFromException } from "../../lib/utils";

const useStyles = makeStyles((theme: Theme) => ({
  addTeamMemberButton: {
    marginLeft: theme.spacing(2),
  },
  checkboxTableCellHeader: {
    padding: `0 ${theme.spacing(1)}px !important`,
  },
  tableCellHeader: {
    backgroundColor: theme.palette.common.white,
    fontWeight: 600,
  },
  tableCellIcon: {
    width: "67px",
  },
}));

interface TeamMembersProps {
  team: Team;
  refreshParent: () => void;
}

function TeamMembers(props: TeamMembersProps): JSX.Element {
  const { team, refreshParent } = props;
  const teamHook = useTeam();
  const classes = useStyles();
  const authContext = useAuth();
  const alert = useAlert();
  const loggedInUserId = authContext.user?.userid as string;
  const isUserAdmin = teamHook.isUserAdministrator(team, loggedInUserId);
  const commonTeamClasses = commonComponentStyles();
  const { t } = useTranslation("yourloops");
  const [addMember, setAddMember] = React.useState<AddMemberDialogContentProps | null>(null);

  const getNonPatientMembers = (team?: Team) => {
    return team ? team.members.filter(teamMember => teamMember.role === TeamMemberRole.admin || teamMember.role === TeamMemberRole.member) : [];
  };

  const [members, setMembers] = React.useState<TeamMember[]>(getNonPatientMembers(team));

  const onMemberInvited = async (member: { email: string; role: Exclude<TypeTeamMemberRole, "patient">, team: Team } | null) => {
    if (member) {
      try {
        await teamHook.inviteMember(member.team, member.email, member.role);
        setMembers(getNonPatientMembers(teamHook.getTeam(team.id) as Team));
        alert.success(t("team-page-success-invite-hcp", { email: member.email }));
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason);
        alert.error(t("team-page-failed-invite-hcp", { errorMessage }));
      }
    }
    setAddMember(null);
  };

  const openInviteMemberDialog = () => {
    setAddMember({ team, onMemberInvited });
  };

  useEffect(() => {
    setMembers(getNonPatientMembers(team));
  }, [team]);

  const refresh = () => {
    setMembers(getNonPatientMembers(teamHook.getTeam(team.id) ?? undefined));
    refreshParent();
  };

  return (
    <React.Fragment>
      <div className={commonTeamClasses.root}>
        <div className={commonTeamClasses.categoryHeader}>
          <div>
            <GroupOutlinedIcon />
            <Typography className={commonTeamClasses.title}>
              {t("members")} ({members.length})
            </Typography>
          </div>
          <div>
            <LeaveTeamButton team={team} />
            {isUserAdmin &&
              <Button
                className={`${commonTeamClasses.button} ${classes.addTeamMemberButton}`}
                variant="contained"
                color="primary"
                disableElevation
                onClick={openInviteMemberDialog}
              >
                <GroupAddIcon className={commonTeamClasses.icon} />
                {t("button-team-add-member")}
              </Button>
            }
          </div>
        </div>
        <Box paddingX={3}>
          <TableContainer component={Paper}>
            <Table
              id="team-members-list-table"
              aria-label={t("aria-table-list-members")}
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    id="team-members-full-name"
                    className={classes.tableCellHeader}
                  >
                    {t("member")}
                  </StyledTableCell>
                  <StyledTableCell
                    id="team-members-status"
                    className={`${classes.tableCellHeader} ${classes.tableCellIcon}`}
                  >
                  </StyledTableCell>
                  <StyledTableCell
                    id="team-members-email"
                    className={classes.tableCellHeader}
                  >
                    {t("email")}
                  </StyledTableCell>
                  <StyledTableCell
                    id="team-members-admin"
                    className={`${classes.tableCellHeader} ${classes.checkboxTableCellHeader}`}
                    padding="checkbox"
                  >
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
                    />)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
      <AddMemberDialog addMember={addMember} />
    </React.Fragment>
  );
}

export default TeamMembers;
