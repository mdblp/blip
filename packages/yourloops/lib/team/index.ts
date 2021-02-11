/**
 * Copyright (c) 2021, Diabeloop
 * Teams management & helpers
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

import bows from "bows";
import { TeamMemberRole, TeamType } from "../../models/team";
import apiClient from "../auth/api";

import Team from "./team";
import TeamMember from "./team-member";
import TeamUser from "./team-user";

class Teams {
  private static teams: Team[] = [];
  private static privateTeam: Team = Team.createVirtualPrivateTeam();
  private static log: Console = bows("Teams");

  /**
   * Reset the teams list.
   *
   * *For Test code only  - For your eyes only!*
   */
  public static reset(): void {
    Teams.teams = [];
    Teams.privateTeam = Team.createVirtualPrivateTeam();
  }

  /**
   * Initially fetch the teams list, or return the already cached ones.
   * @param force if true, always refetch the teams list from the API
   */
  public static async refresh(force = false): Promise<Team[]> {
    if (Teams.teams.length < 1 || force) {
      const users = new Map<string, TeamUser>();
      Teams.privateTeam = Team.createVirtualPrivateTeam();
      Teams.teams = [Teams.privateTeam];

      Teams.log.info("Fetching teams & patients...");
      const [iTeams, patientsMembers] = await Promise.all([apiClient.fetchTeams(), apiClient.getUserShares()]);
      Teams.log.info("Fetching teams & patients: done");

      const nTeams = iTeams.length;
      for (let i = 0; i < nTeams; i++) {
        const iTeam = iTeams[i];
        const team = new Team(iTeam);

        // Detect duplicate users, and update the member if needed
        team.members.forEach((tm) => {
          const userId = tm.userId;
          if (users.has(userId)) {
            tm.user = users.get(userId) as TeamUser;
          } else {
            users.set(userId, tm.user);
          }
        });
        Teams.teams.push(team);
      }

      // Merge patients
      const nPatients = patientsMembers.length;
      for (let i = 0; i < nPatients; i++) {
        const patientsMember = patientsMembers[i];
        const userId = patientsMember.userId;

        let team: Team | null;
        if (patientsMember.teamId === TeamType.private) {
          team = Teams.privateTeam;
        } else {
          team = Teams.getTeam(patientsMember.teamId);
        }

        if (team === null) {
          Teams.log.error(`Missing teamId ${patientsMember.teamId} for patient member`, patientsMember);
          // Use the private team
          team = Teams.privateTeam;
        }

        // Add this patient, with the user we already have, if any
        const user = this.getUser(userId);
        team.addMember(patientsMember, user);
      }

      users.clear();
    }
    return Teams.teams;
  }

  public static getTeam(teamId: string): Team | null {
    if (teamId === TeamType.private) {
      return Teams.privateTeam;
    }
    return Teams.teams.find((t) => t.id === teamId) ?? null;
  }

  public static getMembers(userId: string): Readonly<TeamMember>[] | null {
    const tms: Readonly<TeamMember>[] = [];
    const nTeams = Teams.teams.length;
    for (let i = 0; i < nTeams; i++) {
      const team = Teams.teams[i];
      const tm = team.getMember(userId);
      if (tm !== null) {
        tms.push(tm);
        continue;
      }
    }
    return tms;
  }

  public static getUser(userId: string): Readonly<TeamUser> | null {
    const nTeams = Teams.teams.length;
    for (let i = 0; i < nTeams; i++) {
      const team = Teams.teams[i];
      const tu = team.getUser(userId);
      if (tu !== null) {
        return tu;
      }
    }
    return null;
  }

  public static getPatients(): Readonly<TeamUser>[] {
    const patients = new Map<string, TeamUser>();
    const nTeams = Teams.teams.length;
    for (let i = 0; i < nTeams; i++) {
      const team = Teams.teams[i];
      const members = team.members;
      const nMembers = members.length;
      for (let j = 0; j < nMembers; j++) {
        const member = members[j];
        if (member.role === TeamMemberRole.patient && !patients.has(member.userId)) {
          patients.set(member.userId, member.user);
        }
      }
    }
    return Array.from(patients.values());
  }
}

export {
  Teams,
  Team,
  TeamMember,
  TeamUser,
};

export default Teams;
