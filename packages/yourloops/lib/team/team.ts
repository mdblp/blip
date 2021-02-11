/**
 * Copyright (c) 2021, Diabeloop
 * A team
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

import _ from "lodash";
import { PostalAddress } from "models/generic";
import { ITeam, ITeamMember, TeamMemberRole, TeamType } from "../../models/team";
import TeamMember from "./team-member";
import TeamUser from "./team-user";

class Team {
  private iTeam: ITeam;
  // ownerId: string;
  // description?: string;

  private teamMembers: TeamMember[];

  /**
   * Create the virtual private team (1 to 1 share)
   */
  public static createVirtualPrivateTeam(): Team {
    const iTeam: ITeam = {
      code: "0",
      id: TeamType.private,
      members: [],
      name: TeamType.private,
      ownerId: "",
      type: TeamType.private,
    };
    return new Team(iTeam);
  }

  constructor(team: Readonly<ITeam>) {
    this.iTeam = team;
    this.teamMembers = [];

    if (Array.isArray(team.members)) {
      team.members.forEach((itm) => {
        const tm = new TeamMember(this, itm);
        this.teamMembers.push(tm);
      });
    }
  }

  public get id(): string {
    return this.iTeam.id;
  }

  public get code(): string {
    return this.iTeam.code;
  }

  public get type(): TeamType {
    return this.iTeam.type;
  }

  public get name(): string {
    return this.iTeam.name;
  }

  public get address(): PostalAddress | null {
    return this.iTeam.address ?? null;
  }

  public get phone(): string | null {
    return this.iTeam.phone ?? null;
  }

  public get email(): string | null {
    return this.iTeam.email ?? null;
  }

  /**
   * Return all members of this team
   */
  public get members(): Readonly<TeamMember[]> {
    return this.teamMembers;
  }

  /**
   * Return the medical members (eg. not patients)
   */
  public get medicalMembers(): Readonly<TeamMember>[] {
    return this.teamMembers.filter((member) => member.role !== TeamMemberRole.patient);
  }

  /**
   * Return the number of medical members
   */
  public get numMedicalMembers(): number {
    return this.teamMembers.reduce<number>((num, member) => {
      return member.role === TeamMemberRole.patient ? num : num + 1;
    }, 0);
  }

  public addMember(itm: ITeamMember, user?: TeamUser | null): void {
    const tm = new TeamMember(this, itm);
    if (user) {
      tm.user = user;
    }
    this.teamMembers.push(tm);
  }

  public getMember(userId: string): Readonly<TeamMember> | null {
    const tm = this.teamMembers.find((tm) => tm.userId === userId);
    return tm ?? null;
  }

  public getUser(userId: string): Readonly<TeamUser> | null {
    const tm = this.getMember(userId);
    return tm?.user ?? null;
  }

  public toJSON(): ITeam {
    const cpTeam = _.cloneDeep(this.iTeam);
    cpTeam.members = [];
    return cpTeam;
  }

  /**
   * Return true if the userId is an administrator of this team.
   * @param userId The user id to test
   */
  isUserAdministrator(userId: string): boolean {
    const result = this.teamMembers.find((member) => member.role === TeamMemberRole.admin && member.userId === userId);
    return typeof result === "object";
  }

  /**
   * Return true if the userId is the only administrator of this team.
   * @param userId The user id to test
   */
  isUserTheOnlyAdministrator(userId: string): boolean {
    const admins = this.teamMembers.filter((member) => member.role === TeamMemberRole.admin);
    return admins.length === 1 && admins[0].userId === userId;
  }
}

export default Team;
