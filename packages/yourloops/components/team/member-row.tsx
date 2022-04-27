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

import React, { useState } from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

import { Team, TeamMember, useTeam } from "../../lib/team";
import { StyledTableCell } from "../../pages/hcp/patients/table";
import { UserInvitationStatus } from "../../models/generic";
import Checkbox from "@material-ui/core/Checkbox";
import { TeamMemberRole } from "../../models/team";
import { useAuth } from "../../lib/auth";
import { StyledTableRow } from "./common";

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    width: "56px",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCell: {
    alignItems: "center",
    display: "flex",
    width: "67px",
    justifyContent: "center",
  },
  tableRow: {
    height: "55px",
  },
  typography: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: theme.palette.common.black,
  },
}));

export interface TeamMembersProps {
  team: Team;
  teamMember: TeamMember;
}

function MemberRow(props: TeamMembersProps): JSX.Element {
  const { teamMember, team } = props;
  const classes = useStyles();
  const rowId = teamMember.user.userid.replace(/@/g, "_");
  const teamHook = useTeam();
  const authContext = useAuth();
  const [userUpdateInProgress, setUserUpdateInProgress] = useState<boolean>(false);
  const currentUserId = teamMember.user.userid;
  const loggedInUserId = authContext.user?.userid as string;
  const loggedInUserIsAdmin = teamHook.isUserAdministrator(team, loggedInUserId);
  const currentUserIsAdmin = teamHook.isUserAdministrator(team, currentUserId);
  const currentUserIsPending = teamMember.status === UserInvitationStatus.pending;
  const checkboxAdminDisabled = !loggedInUserIsAdmin || currentUserIsPending
    || (loggedInUserId === currentUserId && teamHook.isUserTheOnlyAdministrator(team, loggedInUserId))
    || userUpdateInProgress;

  const switchRole = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const isAdmin = event.target.checked;
    setUserUpdateInProgress(true);
    await teamHook.changeMemberRole(teamMember, isAdmin ? TeamMemberRole.admin : TeamMemberRole.member);
    setUserUpdateInProgress(false);
  };

  return (
    <React.Fragment>
      <StyledTableRow
        id={`member-row-${rowId}`}
        className={classes.tableRow}
        hover
      >
        <StyledTableCell
          id={`${rowId}-member-full-name`}
          className={classes.typography}
          size="small"
        >
          {teamMember.user.profile?.fullName}
        </StyledTableCell>
        <StyledTableCell
          size="small"
          id={`${rowId}-icon`}
          className={classes.iconCell}
        >
          {currentUserIsPending &&
            <AccessTimeIcon id={`${rowId}-pending-icon`} className={classes.icon} />
          }
        </StyledTableCell>
        <StyledTableCell
          size="small"
          id={`${rowId}-member-email`}
          className={classes.typography}
        >
          {teamMember.user.username}
        </StyledTableCell>
        <StyledTableCell
          size="small"
          id={`${rowId}-checkbox`}
          className={classes.typography}
        >
          <Checkbox
            disabled={checkboxAdminDisabled}
            id={`members-row-${rowId}-role-checkbox`}
            color="primary"
            checked={currentUserIsAdmin}
            onChange={switchRole}
          />
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}

export default MemberRow;
