/**
 * Copyright (c) 2021, Diabeloop
 * Yourloops API client
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

import { v4 as uuidv4, validate as validateUuid } from "uuid";
import bows from "bows";
import _ from "lodash";

import { PatientData } from "models/device-data";
import { APIErrorResponse } from "models/error";
import { MessageNote } from "models/message";
import { User, UserRoles, Profile, Preferences, Settings } from "../../models/shoreline";
import { ITeam, ITeamMember, TeamMemberRole, TeamMemberStatus, TeamType } from "../../models/team";

import { Team } from "../team";
import { defer, waitTimeout } from "../utils";
import appConfig from "../config";
import { t } from "../language";
import HttpStatus from "../http-status-codes";

const SESSION_TOKEN_KEY = "session-token";
const TRACE_TOKEN_KEY = "trace-token";
const LOGGED_IN_USER = "logged-in-user";
const SESSION_TOKEN_HEADER = "x-tidepool-session-token";
const TRACE_SESSION_HEADER = "x-tidepool-trace-session";

export class PatientDataLoadedEvent extends Event {
  public user: User;
  public patientData: PatientData;

  constructor(user: User, patientData: PatientData) {
    super("patient-data-loaded");
    this.user = user;
    this.patientData = patientData;
  }
}

class AuthApi extends EventTarget {
  /** JWT token as a string */
  private sessionToken: string | null;
  /** Trace token is used to trace the calls betweens different microservices API calls for debug purpose. */
  private traceToken: string | null;
  /** Logged-in user information */
  private user: User | null;
  private log: Console;
  private loginLock: boolean;
  /** number of wrong tentative connection */
  private wrongCredentialCount: number;
  /** patients list */
  private patients: ITeamMember[] | null;
  private teams: ITeam[] | null;

  constructor() {
    super();

    this.user = null;
    this.patients = null;
    this.teams = null;
    this.log = bows("API");
    this.loginLock = false;
    this.wrongCredentialCount = 0;

    this.sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    this.traceToken = sessionStorage.getItem(TRACE_TOKEN_KEY);
    const loggedInUser = sessionStorage.getItem(LOGGED_IN_USER);

    if (this.sessionToken !== null && this.sessionToken.length < 1) {
      this.sessionToken = null;
      this.log.warn("Invalid session token in session storage");
    }
    if (this.traceToken !== null && validateUuid(this.traceToken) === false) {
      this.traceToken = null;
      this.log.warn("Invalid trace token in session storage");
    }
    if (loggedInUser !== null) {
      try {
        this.user = JSON.parse(loggedInUser);
      } catch (e) {
        this.log.warn("Invalid user in session storage", e);
      }
    }

    if (!this.isLoggedIn) {
      this.removeAuthInfoFromSessionStorage();
    }

    // Listen to storage events, to be able to monitor
    // logout on others tabs.
    window.addEventListener("storage", this.onStorageChange.bind(this));

    this.log.info("Auth API initialized");
  }

  /**
   * @returns {string|null} the session token or null
   */
  public get token(): string | null {
    return this.sessionToken;
  }

  public get whoami(): User | null {
    return _.cloneDeep(this.user);
  }

  /**
   * @returns {boolean} true if the user is logged in.
   */
  public get isLoggedIn(): boolean {
    return this.sessionToken !== null && this.traceToken !== null && this.user !== null;
  }

  public get userIsPatient(): boolean {
    return this.isLoggedIn && !_.isEmpty(this.user?.profile?.patient);
  }

  public get havePatientsShare(): boolean {
    return !_.isEmpty(this.patients);
  }

  /**
   * Listen to session storage events, to know if another tab is logged out.
   * @param {StorageEvent} ev A change in the storage
   */
  private onStorageChange(ev: StorageEvent): void {
    this.log.debug("onStorageChange", ev);
    if (!this.loginLock && ev.storageArea === sessionStorage) {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
      if (token === null) {
        this.logout();
      } else if (token !== this.token) {
        // We should not see this
      }
    }
  }

  /**
   * Perform a login.
   * @param {string} username Generally an email
   * @param {string} password The account password
   * @return {Promise<User>} Return the logged-in user or a promise rejection.
   */
  private async authenticate(username: string, password: string): Promise<User> {
    let reason: string | null = null;
    this.logout(); // To be sure to reset the values

    if (!_.isString(username) || _.isEmpty(username)) {
      reason = t("no-username") as string;
      return Promise.reject(new Error(reason));
    }

    if (!_.isString(password) || _.isEmpty(password)) {
      reason = t("no-password") as string;
      return Promise.reject(new Error(reason));
    }

    this.traceToken = uuidv4();
    sessionStorage.setItem(TRACE_TOKEN_KEY, this.traceToken);

    this.log.debug("login: /auth/login", appConfig.API_HOST);
    const authURL = new URL("/auth/login", appConfig.API_HOST);

    const response = await fetch(authURL.toString(), {
      method: "POST",
      headers: {
        [TRACE_SESSION_HEADER]: this.traceToken,
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });

    if (!response.ok || response.status !== HttpStatus.StatusOK) {
      switch (response.status) {
      case HttpStatus.StatusUnauthorized:
        if (_.isNumber(appConfig.MAX_FAILED_LOGIN_ATTEMPTS)) {
          if (++this.wrongCredentialCount >= appConfig.MAX_FAILED_LOGIN_ATTEMPTS) {
            reason = t(
              "Your account has been locked for {{numMinutes}} minutes. You have reached the maximum number of login attempts.",
              { numMinutes: appConfig.DELAY_BEFORE_NEXT_LOGIN_ATTEMPT }
            );
          } else {
            reason = t("Wrong username or password");
          }
        }
        break;
      // missing handling 403 status => email not verified
      default:
        reason = t("An error occurred while logging in.");
        break;
      }

      if (reason === null) {
        reason = t("Login Failed");
      }

      this.sendMetrics("Login failed", reason);
      return Promise.reject(new Error(reason as string));
    }

    this.wrongCredentialCount = 0;
    this.sessionToken = response.headers.get(SESSION_TOKEN_HEADER);
    this.user = (await response.json()) as User;

    if (!Array.isArray(this.user.roles)) {
      this.user.roles = [UserRoles.patient];
    }

    // ???
    if (this.sessionToken !== null) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, this.sessionToken);
    }
    sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(this.user));

    this.sendMetrics("setUserId", this.user.userid);

    return this.user;
  }

  /**
   * Perform a login.
   * @param {string} username Generally an email
   * @param {string} password The account password
   * @return {Promise<User>} Return the logged-in user or a promise rejection.
   */
  async login(username: string, password: string): Promise<User> {
    this.loginLock = true;
    return this.authenticate(username, password)
      .then(async (user: User) => {
        const [profile, preferences, settings] = await Promise.all([
          this.getUserProfile(user),
          this.getUserPreferences(user),
          this.getUserSettings(user),
        ]);
        if (profile !== null) {
          user.profile = profile;
        }
        if (preferences !== null) {
          user.preferences = preferences;
        }
        if (settings !== null) {
          user.settings = settings;
        }
        sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(user));
        return user;
      })
      .finally(() => {
        this.loginLock = false;
      });
  }

  /**
   * Logout the user => Clear the session & trace tokens
   */
  logout(): void {
    this.log.debug("debug logout");
    if (this.loginLock && this.isLoggedIn) {
      this.log.debug("logout with a loginlock ");
      this.removeAuthInfoFromSessionStorage();
    } else if (this.isLoggedIn) {
      this.log.debug("logout with no loginlock");
      this.loginLock = true;
      this.sendMetrics("resetUserId");
      this.removeAuthInfoFromSessionStorage();
      this.dispatchEvent(new Event("logout"));
      this.loginLock = false;
    }
  }

  /**
   * Clear the session & trace tokens
   */
  private removeAuthInfoFromSessionStorage() {
    this.sessionToken = null;
    this.traceToken = null;
    this.user = null;
    this.patients = null;
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(TRACE_TOKEN_KEY);
    sessionStorage.removeItem(LOGGED_IN_USER);
  }

  public async getUserShares(): Promise<ITeamMember[]> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("not-logged-in"));
    }

    this.log.info("Fetching patients...");

    const seagullURL = new URL(`/metadata/users/${this.user?.userid}/users`, appConfig.API_HOST);
    const response = await fetch(seagullURL.toString(), {
      method: "GET",
      headers: {
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
    });

    this.patients = [];
    if (response.ok) {
      const users = (await response.json()) as User[];
      // FIXME will be removed with the team API call
      const nPatients = users.length;
      let nPrivate = 0;
      for (let i = 0; i < nPatients; i++) {
        const user = users[i];

        // Randomize the teams associations
        const val = (Math.random() * 10) | 0;
        let teamIds = [];
        if (i < 2) {
          teamIds = ["private"];
        } else if (val < 6) { // eslint-disable-line no-magic-numbers
          teamIds = ["team-0"];
        } else if (val < 8) { // eslint-disable-line no-magic-numbers
          teamIds = ["team-1"];
        } else {
          teamIds = ["team-0", "team-1"];
        }
        // eslint-disable-next-line no-magic-numbers
        if (nPrivate < 3 && !teamIds.includes("private")) {
          nPrivate++;
          teamIds.push("private");
        }

        teamIds.forEach((teamId) => {
          const member: ITeamMember = {
            invitationStatus: TeamMemberStatus.accepted,
            role: TeamMemberRole.patient,
            teamId,
            userId: user.userid,
            user,
          };

          this.patients?.push(member);
        });
      }
      // Pending invite patient
      this.patients.push({
        invitationStatus: TeamMemberStatus.pending,
        role: TeamMemberRole.patient,
        teamId: "team-0",
        userId: "a0a0a0b0",
        user: {
          userid: "a0a0a0b0",
          username: "gerard.dumoulin@example.com",
          termsAccepted: "2021-01-05T15:00:00.000Z",
          profile: {
            firstName: "Gerard",
            lastName: "Dumoulin",
            fullName: "Gerard D.",
          },
        },
      });
      // FIXME end
      return this.patients;
    }

    const responseBody = (await response.json()) as APIErrorResponse;
    throw new Error(t(responseBody.reason));
  }

  public async getUserProfile(user: User): Promise<Profile | null> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("not-logged-in"));
    }

    const seagullURL = new URL(`/metadata/${user.userid}/profile`, appConfig.API_HOST);

    const response = await fetch(seagullURL.toString(), {
      method: "GET",
      headers: {
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
    });

    let profile: Profile | null = null;
    if (response.ok) {
      try {
        profile = (await response.json()) as Profile;
      } catch (e) {
        this.log.debug(e);
      }
    } else if (response.status === HttpStatus.StatusNotFound) {
      this.log.debug("Error : 404 not found");
    } else {
      const responseBody = (await response.json()) as APIErrorResponse;
      throw new Error(t(responseBody.reason));
    }

    return profile;
  }

  public async getUserPreferences({ userid }: User): Promise<Preferences | null> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("You are not logged-in"));
    }
    const seagullURL = new URL(`/metadata/${userid}/preferences`, appConfig.API_HOST);
    const response = await fetch(seagullURL.toString(), {
      method: "GET",
      headers: {
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
    });

    let preferences: Preferences | null = null;
    if (response.ok) {
      try {
        preferences = (await response.json()) as Preferences;
      } catch (e) {
        this.log.debug(e);
      }
    } else if (response.status === HttpStatus.StatusNotFound) {
      this.log.debug("Error : 404 not found");
    } else {
      const responseBody = (await response.json()) as APIErrorResponse;
      throw new Error(t(responseBody.reason));
    }

    return preferences;
  }

  public async getUserSettings({ userid }: User): Promise<Settings | null> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("You are not logged-in"));
    }
    const seagullURL = new URL(`/metadata/${userid}/settings`, appConfig.API_HOST);
    const response = await fetch(seagullURL.toString(), {
      method: "GET",
      headers: {
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
    });

    let settings: Settings | null = null;
    if (response.ok) {
      try {
        settings = (await response.json()) as Settings;
      } catch (e) {
        this.log.debug(e);
      }
    } else if (response.status === HttpStatus.StatusNotFound) {
      this.log.debug("Error : 404 not found");
    } else {
      const responseBody = (await response.json()) as APIErrorResponse;
      throw new Error(t(responseBody.reason));
    }

    return settings;
  }

  public async flagPatient(userId: string): Promise<string[]> {
    if (!this.isLoggedIn || this.user === null) {
      // Users should never see this:
      throw new Error(t("not-logged-in"));
    }
    if (typeof this.user.preferences !== "object" || this.user.preferences === null) {
      this.user.preferences = {
        patientsStarred: [],
      };
    }
    if (!Array.isArray(this.user.preferences.patientsStarred)) {
      this.user.preferences.patientsStarred = [];
    }
    const userIdIdx = this.user.preferences.patientsStarred.indexOf(userId);
    if (userIdIdx > -1) {
      this.user.preferences.patientsStarred.splice(userIdIdx, 1);
      this.log.info("Unflag patient", userId);
    } else {
      this.user.preferences.patientsStarred.push(userId);
      this.log.info("Flag patient", userId);
    }

    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(50 + Math.random() * 100);

    return this.user.preferences.patientsStarred;
  }

  public async loadPatientData(userID: string): Promise<PatientData> {
    let patient: User | null | undefined = null;

    if (this.userIsPatient) {
      patient = this.user;
    } else if (this.isLoggedIn && this.patients !== null) {
      patient = this.patients.find((member: ITeamMember) => member.userId === userID)?.user;
    }

    if (_.isEmpty(patient)) {
      throw new Error(`Missing patient ${userID}`);
    }

    this.dispatchEvent(new Event("patient-data-loading"));

    const dataURL = new URL(`/data/${userID}`, appConfig.API_HOST);
    const response = await fetch(dataURL.toString(), {
      method: "GET",
      headers: {
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
    });

    if (response.ok) {
      const patientData = (await response.json()) as PatientData;

      defer(() => {
        this.dispatchEvent(new PatientDataLoadedEvent(patient as User, patientData));
      });

      return patientData;
    }

    const responseBody = (await response.json()) as APIErrorResponse;
    throw new Error(t(responseBody.reason));
  }

  /**
   * Create a new note
   * @param message The note to send
   */
  public async startMessageThread(message: MessageNote): Promise<string> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("not-logged-in"));
    }

    const messageURL = new URL(`/message/send/${message.groupid}`, appConfig.API_HOST);
    const response = await fetch(messageURL.toString(), {
      method: "POST",
      headers: {
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
      body: JSON.stringify({
        message: {
          ...message,
          guid: uuidv4(),
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return result.id as string;
    }

    const responseBody = (await response.json()) as APIErrorResponse;
    throw new Error(t(responseBody.reason));
  }

  public async fetchTeams(): Promise<ITeam[]> {
    this.log.info("Fetching teams...");
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(1000 + Math.random() * 200);

    if (this.teams === null) {
      this.teams = [
        {
          // FIXME
          id: "team-0",
          name: "CHU Grenoble",
          code: "123456789",
          ownerId: "abcdef",
          type: TeamType.medical,
          address: {
            line1: "Boulevard de la Chantourne",
            line2: "Cedex 38703",
            zip: "38700",
            city: "La Tronche",
            country: "FR",
          },
          phone: "+33 (0)4 76 76 75 75",
          email: "secretariat-diabethologie@chu-grenoble.fr",
          members: [
            {
              teamId: "team-0",
              userId: "a0a0a0a0",
              role: TeamMemberRole.viewer,
              invitationStatus: TeamMemberStatus.accepted,
              user: {
                userid: "a0a0a0a0",
                username: "jean.dupont@chu-grenoble.fr",
                termsAccepted: "2019-01-25T17:47:56+01:00",
                roles: [ UserRoles.hcp ],
                profile: { firstName: "Jean", lastName: "Dupont", fullName: "Jean Dupont" },
              },
            },
            {
              // Pending member invitation -> user not validated (missing termsAccepted field)
              teamId: "team-0",
              userId: "a0a0a0a1",
              role: TeamMemberRole.viewer,
              invitationStatus: TeamMemberStatus.pending,
              user: {
                userid: "a0a0a0a1",
                roles: [ UserRoles.hcp ],
                username: "michelle.dupuis@chu-grenoble.fr",
              },
            },
          ],
        },
        {
          id: "team-1",
          name: "Charité – Universitätsmedizin Berlin",
          code: "987654321",
          phone: "+49 30 450 - 50",
          address: {
            line1: "Charitéplatz 1",
            city: "Berlin",
            zip: "10117",
            country: "DE",
          },
          ownerId: "abcdef",
          type: TeamType.medical,
          members: [
            {
              teamId: "team-1",
              userId: "b0b1b2b3",
              role: TeamMemberRole.admin,
              invitationStatus: TeamMemberStatus.accepted,
              user: {
                userid: "b0b1b2b3",
                roles: [ UserRoles.hcp ],
                username: "adelheide.alvar@charite.de",
                termsAccepted: "2019-01-25T17:47:56+01:00",
                profile: { firstName: "Adelheide", lastName: "Alvar", fullName: "Adelheide Alvar" },
              },
            },
          ],
        },
      ];

      // Add ourselves to the teams:
      if (this.user !== null) {
        const me = _.cloneDeep(this.user);
        this.teams[0].members.push({
          teamId: "team-0",
          userId: me.userid,
          role: TeamMemberRole.admin,
          invitationStatus: TeamMemberStatus.accepted,
          user: me,
        });
        this.teams[1].members.push({
          teamId: "team-1",
          userId: me.userid,
          role: TeamMemberRole.admin,
          invitationStatus: TeamMemberStatus.accepted,
          user: me,
        });
      }
    }
    return _.cloneDeep(this.teams);
  }

  public async invitePatient(username: string, teamId: string): Promise<void> {
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
    // For future!
    const team = this.teams?.find(t => t.id === teamId);
    if (typeof team === "object") {
      team.members.push({
        invitationStatus: TeamMemberStatus.pending,
        role: TeamMemberRole.patient,
        teamId,
        userId: username,
        user: {
          userid: username,
          username,
        },
      });
    }
  }

  public async createTeam(team: Partial<ITeam>): Promise<void> {
    if (this.teams === null) {
      this.teams = [];
    }

    // id, code, owner fields will be set by the back-end API
    const tmpTeam = {
      ...team,
      id: `team-${Math.round(Math.random() * 1000)}`, // eslint-disable-line no-magic-numbers
      code: "123-456-789",
      ownerId: this.user?.userid as string,
    };

    this.teams.push(tmpTeam as ITeam);
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
  }

  public async editTeam(editedTeam: ITeam): Promise<void> {
    if (this.teams === null || this.teams.length < 1) {
      throw new Error("Empty team list!");
    }
    const nTeams = this.teams.length;
    for (let i = 0; i < nTeams; i++) {
      const team = this.teams[i];
      if (editedTeam.id === team.id) {
        this.teams[i] = editedTeam;
        break;
      }
    }
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
  }

  public async leaveTeam(team: Team): Promise<void> {
    if (this.teams === null || this.teams.length < 1) {
      throw new Error("Empty team list !");
    }
    if (this.user === null) {
      throw new Error("Not logged-in !");
    }

    // eslint-disable-next-line no-magic-numbers
    if (Math.random() < 0.2) {
      // eslint-disable-next-line no-magic-numbers
      await waitTimeout(500 + Math.random() * 200);
      throw new Error("A random error");
    }

    const nTeams = this.teams.length;
    for (let i = 0; i < nTeams; i++) {
      const thisTeam = this.teams[i];
      if (thisTeam.id === team.id) {
        this.log.debug(`Removing team ${thisTeam.id}`);
        this.teams.splice(i, 1);
        break;
      }
    }

    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
  }

  public async removeTeamMember(team: Team, userId: string): Promise<void> {
    if (this.teams === null || this.teams.length < 1) {
      throw new Error("Empty team list!");
    }

    // eslint-disable-next-line no-magic-numbers
    if (Math.random() < 0.2) {
      // eslint-disable-next-line no-magic-numbers
      await waitTimeout(500 + Math.random() * 200);
      throw new Error("A random error");
    }

    const nTeams = this.teams.length;
    for (let i = 0; i < nTeams; i++) {
      const thisTeam = this.teams[i];
      if (thisTeam.id === team.id) {
        if (Array.isArray(thisTeam.members)) {
          const idx = thisTeam.members.findIndex((tm: ITeamMember): boolean => tm.userId === userId);
          if (idx > -1) {
            thisTeam.members.splice(idx, 1);
          }
        }
        break;
      }
    }
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
  }

  public async changeTeamUserRole(team: Team, userId: string, admin: boolean): Promise<void> {
    if (this.teams === null || this.teams.length < 1) {
      throw new Error("Empty team list!");
    }

    // eslint-disable-next-line no-magic-numbers
    if (Math.random() < 0.2) {
      // eslint-disable-next-line no-magic-numbers
      await waitTimeout(500 + Math.random() * 200);
      throw new Error("A random error");
    }

    const nTeams = this.teams.length;
    for (let i = 0; i < nTeams; i++) {
      const thisTeam = this.teams[i];
      if (thisTeam.id === team.id) {
        if (!Array.isArray(thisTeam.members)) {
          throw new Error("No member for this team !");
        }
        for (const member of thisTeam.members) {
          if (member.userId === userId) {
            member.role = admin ? TeamMemberRole.admin : TeamMemberRole.viewer;
            break;
          }
        }
        break;
      }
    }
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
  }

  public async inviteHcpTeamMember(team: Team, email: string, role: TeamMemberRole): Promise<void> {
    if (this.teams === null || this.teams.length < 1) {
      throw new Error("Empty team list!");
    }

    // eslint-disable-next-line no-magic-numbers
    if (Math.random() < 0.2) {
      // eslint-disable-next-line no-magic-numbers
      await waitTimeout(500 + Math.random() * 200);
      throw new Error("A random error");
    }

    this.log.info(`Invite ${email} to ${team.name} with role ${role}`);
    // eslint-disable-next-line no-magic-numbers
    await waitTimeout(500 + Math.random() * 200);
  }

  /**
   * Record something for the tracking metrics
   * @param {string} eventName the text to send
   * @param {any=} properties optional parameter
   */
  sendMetrics(eventName: string, properties?: unknown): void {
    /** @type {any[]|null} */
    let matomoPaq = null;
    this.log.info("Metrics:", eventName, properties);
    switch (appConfig.METRICS_SERVICE) {
    case "matomo":
      matomoPaq = window._paq;
      if (!_.isObject(matomoPaq)) {
        this.log.error("Matomo do not seems to be available, wrong configuration");
        return;
      }
      if (eventName === "CookieConsent") {
        matomoPaq.push(["setConsentGiven", properties]);
      } else if (eventName === "setCustomUrl") {
        matomoPaq.push(["setCustomUrl", properties]);
      } else if (eventName === "setUserId") {
        matomoPaq.push(["setUserId", properties]);
      } else if (eventName === "resetUserId") {
        matomoPaq.push(["resetUserId"]);
      } else if (eventName === "setDocumentTitle" && typeof properties === "string") {
        matomoPaq.push(["setDocumentTitle", properties]);
      } else if (typeof properties === "undefined") {
        matomoPaq.push(["trackEvent", eventName]);
      } else {
        matomoPaq.push(["trackEvent", eventName, JSON.stringify(properties)]);
      }
      break;
    }
  }

  public async updateUserProfile({ userid, profile }: User): Promise<void> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("You are not logged-in"));
    }

    const seagullURL = new URL(`/metadata/${userid}/profile`, appConfig.API_HOST);

    const response = await fetch(seagullURL.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
      body: JSON.stringify(profile),
    });

    if (response.ok) {
      profile = (await response.json()) as Profile;
      if (this.user?.userid === userid) {
        this.user.profile = profile;
        sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(this.user));
      }
    } else {
      const responseBody = (await response.json()) as APIErrorResponse;
      throw new Error(t(responseBody.reason));
    }
  }

  public async updateUserSettings({ userid, settings }: User): Promise<void> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("You are not logged-in"));
    }

    const seagullURL = new URL(`/metadata/${userid}/settings`, appConfig.API_HOST);

    const response = await fetch(seagullURL.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      settings = (await response.json()) as Settings;
      if (this.user?.userid === userid) {
        this.user.settings = settings;
        sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(this.user));
      }
    } else {
      const responseBody = (await response.json()) as APIErrorResponse;
      throw new Error(t(responseBody.reason));
    }
  }

  public async updateUserPreferences({ userid, preferences }: User): Promise<void> {
    if (!this.isLoggedIn) {
      // Users should never see this:
      throw new Error(t("You are not logged-in"));
    }

    const seagullURL = new URL(`/metadata/${userid}/preferences`, appConfig.API_HOST);

    const response = await fetch(seagullURL.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        [TRACE_SESSION_HEADER]: this.traceToken as string,
        [SESSION_TOKEN_HEADER]: this.sessionToken as string,
      },
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      preferences = (await response.json()) as Preferences;
      if (this.user?.userid === userid) {
        this.user.preferences = preferences;
        sessionStorage.setItem(LOGGED_IN_USER, JSON.stringify(this.user));
      }
    } else {
      const responseBody = (await response.json()) as APIErrorResponse;
      throw new Error(t(responseBody.reason));
    }
  }
}

const apiClient = new AuthApi();

export default apiClient;
export { AuthApi as API, apiClient };
