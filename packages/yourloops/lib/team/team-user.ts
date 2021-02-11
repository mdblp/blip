/**
 * Copyright (c) 2021, Diabeloop
 * A team -> member -> user
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

import { Profile, Settings, Preferences, User } from "models/shoreline";
import { TeamMemberStatus } from "../../models/team";
import TeamMember from "./team-member";

class TeamUser {
  public user: User;
  public memberships: TeamMember[];

  // /** The user id */
  // readonly userid: string;
  // /** The username (login) */
  // readonly username: string;
  // /** Roles of the users  */
  // /*readonly*/ roles?: UserRoles[];
  // /** Emails of the users */
  // emails?: string[];
  // /** Date of the last accepted terms */
  // readonly termsAccepted?: string;
  // /** true if the account has been verified */
  // readonly emailVerified?: boolean;
  // /** User profile */
  // profile?: Profile;
  // /** User settings (read-only for patient only?) */
  // settings?: Settings;
  // /** User preferences */
  // preferences?: Preferences;

  constructor(member: TeamMember, user: User) {
    this.user = user;
    this.memberships = [member];
  }

  public get userId(): string {
    return this.user.userid;
  }

  public get username(): string {
    return this.user.username;
  }

  public get email(): string {
    return this.username;
  }

  public get firstName(): string {
    return this.profile?.firstName ?? "";
  }

  public get lastName(): string {
    return this.profile?.lastName ?? this.profile?.fullName ?? this.username;
  }

  public get profile(): Profile | null {
    return this.user.profile ?? null;
  }

  public get settings(): Settings | null {
    return this.user.settings ?? null;
  }

  public get preferences(): Preferences | null {
    return this.user.preferences ?? null;
  }

  /**
   * @returns true is the user has an invitation pending on one team
   */
  public isInvitationPending(): boolean {
    const tm = this.memberships.find((tm) => tm.status === TeamMemberStatus.pending);
    return typeof tm === "object";
  }

  /**
   * Return true if this user is in a specific team
   * @param teamId A team id
   */
  public isInTeam(teamId: string): boolean {
    const tm = this.memberships.find((tm) => tm.team.id === teamId);
    return typeof tm === "object";
  }
}

export default TeamUser;
