/**
 * Copyright (c) 2021, Diabeloop
 * Teams list for HCPs
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
import bows from "bows";
import { RouteComponentProps } from "react-router-dom";

import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";

import { Team, TeamMemberRole } from "../../models/team";
import { t } from "../../lib/language";
import { errorTextFromException } from "../../lib/utils";
import apiClient from "../../lib/auth/api";

import { SwitchRoleDialogContentProps, AddMemberDialogContentProps, TeamEditModalContentProps } from "./types";
import AddMemberDialog from "./team-member-add-dialog";
import TeamCard from "./team-card";
import TeamEditModal from "./team-edit-modal";
import TeamsListBar from "./teams-list-bar";
import TeamMembers from "./team-members-table";
import RemoveMemberDialog from "./team-member-remove-dialog";
import LeaveTeamDialog from "./team-leave-dialog";
import SwitchRoleDialog from "./team-member-switch-role-dialog";

interface TeamsListPageState {
  loading: boolean;
  errorMessage: string | null;
  teams: Team[];
  apiReturnAlert: null | {
    message: string;
    severity: "error" | "warning" | "info" | "success";
  };
  userToBeRemoved: null | {
    team: Team;
    userId: string;
  };
  addMember: null | AddMemberDialogContentProps;
  switchAdminRole: null | SwitchRoleDialogContentProps;
  teamToLeave: Team | null;
  teamToEdit: TeamEditModalContentProps | null;
}

/**
 * HCP page to manage teams
 */
class TeamsListPage extends React.Component<RouteComponentProps, TeamsListPageState> {
  private log: Console;

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = TeamsListPage.initialState();

    this.log = bows("TeamsListPage");

    this.onCloseAlert = this.onCloseAlert.bind(this);
    this.onShowModalRemoveMember = this.onShowModalRemoveMember.bind(this);
    this.onHideModalRemoveMember = this.onHideModalRemoveMember.bind(this);
    this.onShowModalLeaveTeam = this.onShowModalLeaveTeam.bind(this);
    this.onRemoveTeamMember = this.onRemoveTeamMember.bind(this);
    this.onShowModalEditTeam = this.onShowModalEditTeam.bind(this);
    this.onLeaveTeam = this.onLeaveTeam.bind(this);
    this.onSwitchAdminRole = this.onSwitchAdminRole.bind(this);
    this.onShowAddMemberDialog = this.onShowAddMemberDialog.bind(this);
  }

  private static initialState(): TeamsListPageState {
    return {
      loading: true,
      errorMessage: null,
      teams: [],
      userToBeRemoved: null,
      apiReturnAlert: null,
      addMember: null,
      switchAdminRole: null,
      teamToLeave: null,
      teamToEdit: null,
    };
  }

  componentDidMount(): void {
    this.onRefresh();
  }

  render(): JSX.Element {
    const {
      loading,
      errorMessage,
      teams,
      apiReturnAlert,
      userToBeRemoved,
      teamToLeave,
      switchAdminRole,
      addMember,
      teamToEdit,
    } = this.state;

    if (loading) {
      return (
        <CircularProgress disableShrink style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }} />
      );
    }
    if (errorMessage !== null) {
      return (
        <div id="div-api-error-message" className="api-error-message">
          <Alert id="alert-api-error-message" severity="error" style={{ marginBottom: "1em" }}>
            {errorMessage}
          </Alert>
          <Button id="button-api-error-message" variant="contained" color="secondary" onClick={this.onRefresh}>
            {t("button-refresh-page-on-error")}
          </Button>
        </div>
      );
    }

    const teamsItems: JSX.Element[] = [];
    for (const team of teams) {
      teamsItems.push(
        <Grid item xs={12} key={team.id}>
          <TeamCard
            team={team}
            onShowModalEditTeam={this.onShowModalEditTeam}
            onShowModalLeaveTeam={this.onShowModalLeaveTeam}
            onShowAddMemberDialog={this.onShowAddMemberDialog}
          />
          <TeamMembers
            team={team}
            onSwitchAdminRole={this.onSwitchAdminRole}
            onShowModalRemoveMember={this.onShowModalRemoveMember}
          />
        </Grid>
      );
    }

    return (
      <React.Fragment>
        <TeamsListBar onShowModalEditTeam={this.onShowModalEditTeam} />
        <Container maxWidth="lg" style={{ marginTop: "4em", marginBottom: "2em" }}>
          <Grid container spacing={3}>
            {teamsItems}
          </Grid>
        </Container>

        <RemoveMemberDialog
          userToBeRemoved={userToBeRemoved}
          handleClose={this.onHideModalRemoveMember}
          handleRemoveTeamMember={this.onRemoveTeamMember}
        />

        <TeamEditModal teamToEdit={teamToEdit} />
        <LeaveTeamDialog team={teamToLeave} onLeaveTeam={this.onLeaveTeam} onShowModalLeaveTeam={this.onShowModalLeaveTeam} />
        <SwitchRoleDialog switchAdminRole={switchAdminRole} />
        <AddMemberDialog addMember={addMember} />

        <Snackbar
          open={apiReturnAlert !== null}
          autoHideDuration={6000}
          onClose={this.onCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={this.onCloseAlert} severity={apiReturnAlert?.severity}>
            {apiReturnAlert?.message}
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }

  onRefresh(): void {
    this.log.info("Refreshing the page");
    this.setState(TeamsListPage.initialState(), async () => {
      try {
        const teams = await apiClient.fetchTeams();
        this.setState({ teams, loading: false });
      } catch (reason: unknown) {
        this.log.error("onRefresh", reason);
        let errorMessage: string;
        if (reason instanceof Error) {
          errorMessage = reason.message;
        } else {
          const s = new String(reason);
          errorMessage = s.toString();
        }
        this.setState({ loading: false, errorMessage });
      }
    });
  }

  onCloseAlert(): void {
    this.setState({ apiReturnAlert: null });
  }

  onShowModalRemoveMember(team: Team, userId: string): void {
    this.log.debug("onShowModalRemoveMember", userId, team);
    this.setState({ userToBeRemoved: { team, userId } });
  }

  onHideModalRemoveMember(): void {
    this.log.debug("onHideModalRemoveMember");
    this.setState({ userToBeRemoved: null });
  }

  onShowModalLeaveTeam(teamToLeave: Team | null): void {
    this.log.debug("onShowModalLeaveTeam", { teamToLeave });
    this.setState({ teamToLeave });
  }

  async onRemoveTeamMember(): Promise<void> {
    const { userToBeRemoved } = this.state;
    this.log.info("onRemoveTeamMember", userToBeRemoved);

    if (userToBeRemoved !== null) {
      try {
        const teams = await apiClient.removeTeamMember(userToBeRemoved.team, userToBeRemoved.userId);
        const message = t("team-list-success-remove-member");
        this.setState({ teams, apiReturnAlert: { message, severity: "success" } });
      } catch (reason: unknown) {
        const errorMessage = errorTextFromException(reason);
        const message = t("team-list-failed-remove-member", { errorMessage });
        this.setState({ apiReturnAlert: { message, severity: "error" } });
      }
    }
    this.onHideModalRemoveMember();
  }

  async onShowModalEditTeam(team: Team | null): Promise<void> {
    this.log.debug("onShowModalEditTeam:", team);

    // Promise which show the modal to edit a team, and return the edited team infos
    const getEditedTeamInfo = () => new Promise((resolve: (result: Partial<Team> | null) => void) => {
      const teamToEdit = { team: team ?? {}, onSaveTeam: resolve };
      this.setState({ teamToEdit });
    });

    const editedTeam = await getEditedTeamInfo();
    this.setState({ teamToEdit: null });
    apiClient.sendMetrics("edit-medical-team", { cancel: editedTeam === null, mode: team === null ? "create" : "edit" });

    if (editedTeam === null) {
      // Edit cancelled
      return;
    }

    try {
      let teams: Team[] = [];
      if (team === null) {
        editedTeam.type = "medical";
        teams = await apiClient.createTeam(editedTeam);
      } else {
        teams = await apiClient.editTeam(editedTeam as Team);
      }
      this.setState({ teams, apiReturnAlert: { message: t("team-list-success-edit"), severity: "success" } });
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason);
      const message = t("team-list-failed-edit", { errorMessage });
      this.setState({ apiReturnAlert: { message, severity: "error" } });
    }
  }

  async onLeaveTeam(): Promise<void> {
    const { teamToLeave } = this.state;
    this.log.info("onLeaveTeam", { teamToLeave });

    if (teamToLeave === null) {
      this.log.error("onLeaveTeam: Should not have been called with no team to leave");
      return;
    }

    try {
      const onlyMember = !((teamToLeave.members?.length ?? 0) > 1);
      const teams = await apiClient.leaveTeam(teamToLeave);
      const message = onlyMember ? t("team-list-success-deleted") : t("team-list-success-leave");
      this.setState({ teams, apiReturnAlert: { message, severity: "success" } });
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason);
      const message = t("team-list-failed-leave", { errorMessage });
      this.setState({ apiReturnAlert: { message, severity: "error" } });
    }

    // Hide the dialog:
    this.setState({ teamToLeave: null });
  }

  async onSwitchAdminRole(team: Team, userId: string, admin: boolean): Promise<void> {
    this.log.info("onSwitchAdminRole", { team, userId, admin });

    const confirm = await this.getConfirmSwitchAdminRole(team, userId, admin);
    this.setState({ switchAdminRole: null });
    if (!confirm) {
      this.log.info("Change not confirmed");
      return;
    }

    try {
      const teams = await apiClient.changeTeamUserRole(team, userId, admin);
      this.setState({ teams });
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason);
      const message = t("team-list-failed-update-role", { errorMessage });
      this.setState({ apiReturnAlert: { message, severity: "error" } });
    }
  }

  getConfirmSwitchAdminRole(team: Team, userId: string, admin: boolean): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void): void => {
      const switchAdminRole = { team, userId, admin, onDialogResult: resolve };
      this.setState({ switchAdminRole });
    });
  }

  async onShowAddMemberDialog(team: Team): Promise<void> {
    const getMemberEmail = () =>
      new Promise((resolve: (result: { email: string | null; role: TeamMemberRole }) => void): void => {
        const addMember = { team, onDialogResult: resolve };
        this.setState({ addMember });
      });

    const { email, role } = await getMemberEmail();
    this.setState({ addMember: null });
    if (email === null) {
      return;
    }

    try {
      await apiClient.inviteHcpTeamMember(team, email, role);
      this.setState({ apiReturnAlert: { message: t("team-list-success-invite-hcp", { email }), severity: "success" } });
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason);
      const message = t("team-list-failed-invite-hcp", { errorMessage });
      this.setState({ apiReturnAlert: { message, severity: "error" } });
    }
  }
}

export default TeamsListPage;
