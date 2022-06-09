/**
 * Copyright (c) 2021, Diabeloop
 * Teams utility functions
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

import { LoadTeams, Team, TEAM_CODE_LENGTH, TeamUser } from "./models";
import { Session } from "../auth";
import TeamApi from "./team-api";
import { ITeam, TeamType } from "../../models/team";
import { iMemberToMember, iTeamToTeam } from "./hook";
import bows from "bows";

const log = bows("TeamUtils");
/**
 * Get the team code for display - Can be use with partial code.
 * @param code 9 digit string team code
 * @returns `123 - 456 - 789`
 */
export function getDisplayTeamCode(code: string): string {
  const SEP_POS = [2, 5]; // eslint-disable-line no-magic-numbers
  let displayCode = "";
  const codeLen = Math.min(code.length, TEAM_CODE_LENGTH);
  for (let i = 0 | 0; i < codeLen; i++) {
    displayCode += code[i];
    if (SEP_POS.includes(i) && i + 1 < codeLen) {
      displayCode += " - ";
    }
  }
  return displayCode;
}

export default class TeamUtils {

  static async loadTeams(session: Session): Promise<LoadTeams> {
    const getFlagPatients = (): string[] => {
      const flagged = session.user.preferences?.patientsStarred;
      if (Array.isArray(flagged)) {
        return Array.from(flagged);
      }
      return [];
    };

    const users = new Map<string, TeamUser>();
    const [apiTeams, apiPatients] = await Promise.all([TeamApi.getTeams(), TeamApi.getPatients()]);

    const nPatients = apiPatients.length;
    log.debug("loadTeams", { nPatients, nTeams: apiTeams.length });

    const privateTeam: Team = {
      code: TeamType.private,
      id: TeamType.private,
      members: [],
      name: TeamType.private,
      owner: session.user.userid,
      type: TeamType.private,
    };

    const teams: Team[] = [privateTeam];
    apiTeams.forEach((apiTeam: ITeam) => {
      const team = iTeamToTeam(apiTeam, users);
      teams.push(team);
    });

    const flaggedNotInResult = getFlagPatients();

    // Merge patients
    for (let i = 0; i < nPatients; i++) {
      const apiPatient = apiPatients[i];
      const userId = apiPatient.userId;

      if (flaggedNotInResult.includes(userId)) {
        flaggedNotInResult.splice(flaggedNotInResult.indexOf(userId), 1);
      }

      let team = teams.find((t) => t.id === apiPatient.teamId);
      if (typeof team === "undefined") {
        log.error(`Missing teamId ${apiPatient.teamId} for patient member`, apiPatient);
        // Use the private team
        team = privateTeam;
      }

      iMemberToMember(apiPatient, team, users);
    }

    // End, cleanup to help the garbage collector
    users.clear();
    return { teams, flaggedNotInResult };
  }
}
