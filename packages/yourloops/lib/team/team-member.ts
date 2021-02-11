/**
 * Copyright (c) 2021, Diabeloop
 * A team member
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

import { ITeamMember, TeamMemberStatus, TeamMemberRole } from "../../models/team";
import Team from "./team";
import TeamUser from "./team-user";

class TeamMember {
  private parent: Team;
  private teamUser: TeamUser;
  private mRole: TeamMemberRole;
  private mStatus: TeamMemberStatus;

  constructor(team: Team, member: ITeamMember) {
    this.parent = team;
    this.mRole = member.role;
    this.mStatus = member.invitationStatus;
    this.teamUser = new TeamUser(this, member.user);
  }

  public get role(): TeamMemberRole {
    return this.mRole;
  }

  public get status(): TeamMemberStatus {
    return this.mStatus;
  }

  public get userId(): string {
    return this.teamUser.userId;
  }

  public get firstName(): string {
    return this.teamUser.firstName;
  }

  public get lastName(): string {
    return this.teamUser.lastName;
  }

  public get email(): string {
    return this.teamUser.email;
  }

  public get team(): Team {
    return this.parent;
  }

  public get user(): TeamUser {
    return this.teamUser;
  }

  /**
   * Update our underlying user (shared with other teams)
   */
  public set user(tu: TeamUser) {
    const tm = tu.memberships.find((m) => m.team.id === this.team.id);
    if (typeof tm === "undefined") {
      tu.memberships.push(this);
    }
    this.teamUser = tu;
  }
}

export default TeamMember;
