/**
 * Copyright (c) 2021, Diabeloop
 * Commons data for all tests
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

import { User } from '../../lib/auth'
import { Units, UserInvitationStatus } from '../../models/generic'
import { UserMetadata, UserRoles } from '../../models/user'
import { ITeam, ITeamMember, TeamMemberRole, TeamType } from '../../models/team'
import { HcpProfession } from '../../models/hcp-profession'
import { Alarm } from '../../models/alarm'

const getNewHcp = (): User => {
  return new User({
    email: 'john.doe@example.com',
    emailVerified: true,
    sub: 'auth0|123456789',
    [UserMetadata.Roles]: [UserRoles.hcp]
  })
}

const getHcp = (): User => {
  const hcp = new User({
    email: 'john.doe@example.com',
    emailVerified: true,
    sub: 'auth0|a0000000',
    [UserMetadata.Roles]: [UserRoles.hcp]
  })
  hcp.frProId = 'ANS20211229094028'
  hcp.profile = { firstName: 'John', lastName: 'Doe', fullName: 'John Doe', hcpProfession: HcpProfession.diabeto }
  hcp.preferences = { displayLanguageCode: 'en' }
  hcp.settings = { units: { bg: Units.gram }, country: 'FR' }
  return hcp
}

const getCaregiver = (): User => {
  const caregiver = new User({
    email: 'caregiver@example.com',
    emailVerified: true,
    sub: 'auth0|b0000000',
    [UserMetadata.Roles]: [UserRoles.caregiver]
  })
  caregiver.profile = { firstName: 'Caregiver', lastName: 'Example', fullName: 'Caregiver Example' }
  caregiver.preferences = { displayLanguageCode: 'de' }
  caregiver.settings = { country: 'DE', units: { bg: Units.mole } }
  return caregiver
}

const getPatient = (): User => {
  const patient = new User({
    email: 'josephine.dupuis@example.com',
    emailVerified: true,
    sub: 'auth0|a0a0a0b0',
    [UserMetadata.Roles]: [UserRoles.patient]
  })
  patient.settings = { a1c: { date: '2020-01-01', value: '7.5' }, country: 'FR' }
  patient.profile = {
    firstName: 'Josephine',
    lastName: 'Dupuis',
    fullName: 'Josephine D.',
    patient: {
      birthday: '1964-12-01',
      birthPlace: 'Anywhere',
      diagnosisDate: '2020-12-02',
      diagnosisType: '1',
      referringDoctor: 'Dr Dre',
      sex: 'M',
      ins: '123456789012345',
      ssn: '012345678901234'
    }
  }
  patient.preferences = { displayLanguageCode: 'fr' }
  return patient
}

/**
 * Logged-in users for test, choose one suitable
 */
export const loggedInUsers = { getHcp, getPatient, getCaregiver, getNewHcp }

const hcp = getHcp()
const patient = getPatient()
/**
 * An example list of teams for the unit tests
 */
export const teams: ITeam[] = [
  {
    // FIXME
    id: 'team-0',
    name: 'CHU Grenoble',
    code: '123456789',
    owner: 'abcdef',
    type: TeamType.medical,
    address: {
      line1: 'Boulevard de la Chantourne',
      line2: 'Cedex 38703',
      zip: '38700',
      city: 'La Tronche',
      country: 'FR'
    },
    phone: '+33 (0)4 76 76 75 75',
    email: 'secretariat-diabethologie@chu-grenoble.fr',
    members: [
      {
        teamId: 'team-0',
        userId: hcp.id,
        role: TeamMemberRole.admin,
        invitationStatus: UserInvitationStatus.accepted,
        email: hcp.username,
        preferences: hcp.preferences,
        profile: hcp.profile,
        settings: hcp.settings,
        idVerified: true
      },
      {
        teamId: 'team-0',
        userId: 'a0a1a2a3',
        role: TeamMemberRole.member,
        invitationStatus: UserInvitationStatus.accepted,
        email: 'jean.dupont@chu-grenoble.fr',
        preferences: null,
        profile: { firstName: 'Jean', lastName: 'Dupont', fullName: 'Jean Dupont' },
        settings: null,
        idVerified: false
      },
      {
        teamId: 'team-0',
        userId: 'abcdef123',
        role: TeamMemberRole.member,
        invitationStatus: UserInvitationStatus.pending,
        email: 'macky.boy@chu-grenoble.fr',
        preferences: null,
        profile: { firstName: 'Macky', lastName: 'Boy', fullName: 'Macky Boy' },
        settings: null,
        idVerified: false
      }
    ]
  },
  {
    id: 'team-1',
    name: 'Charité – Universitätsmedizin Berlin',
    code: '987654321',
    phone: '+49 30 450 - 50',
    address: {
      line1: 'Charitéplatz 1',
      city: 'Berlin',
      zip: '10117',
      country: 'DE'
    },
    owner: 'abcdef',
    type: TeamType.medical,
    members: [
      {
        teamId: 'team-1',
        userId: hcp.id,
        role: TeamMemberRole.member,
        invitationStatus: UserInvitationStatus.accepted,
        email: hcp.username,
        preferences: hcp.preferences,
        profile: hcp.profile,
        settings: hcp.settings,
        idVerified: true
      },
      {
        teamId: 'team-1',
        userId: 'b0b1b2b3',
        role: TeamMemberRole.admin,
        invitationStatus: UserInvitationStatus.accepted,
        email: 'adelheide.alvar@charite.de',
        preferences: null,
        profile: { firstName: 'Adelheide', lastName: 'Alvar', fullName: 'Adelheide Alvar' },
        settings: null,
        idVerified: false
      }
    ]
  },
  {
    id: 'team-2-empty',
    name: 'Empty Team 2',
    code: '123654789',
    phone: '0000',
    address: {
      line1: 'Test',
      city: 'Test',
      zip: '00000',
      country: 'FR'
    },
    owner: hcp.id,
    type: TeamType.medical,
    members: [
      {
        teamId: 'team-2-empty',
        userId: hcp.id,
        role: TeamMemberRole.admin,
        invitationStatus: UserInvitationStatus.accepted,
        email: hcp.username,
        preferences: hcp.preferences,
        profile: hcp.profile,
        settings: hcp.settings,
        idVerified: true
      }
    ]
  }
]

export const emptyTeam3: ITeam = {
  id: 'team-3-empty',
  name: 'Empty Team 3',
  phone: '33 33 33 33',
  code: '333333333',
  address: {
    line1: 'Empty street 3',
    city: 'City Three',
    zip: '33333',
    country: 'FR'
  },
  owner: '33333333',
  type: TeamType.medical,
  members: []
}

export const members: ITeamMember[] = [
  {
    teamId: 'team-0',
    userId: 'b0b1b2b4',
    role: TeamMemberRole.admin,
    invitationStatus: UserInvitationStatus.pending,
    email: 'michelle.dufour@chu-grenoble.fr',
    preferences: null,
    profile: { firstName: 'Michelle', lastName: 'Dufour', fullName: 'Michelle Dufour' },
    settings: null,
    idVerified: true
  }
]
const alarms: Alarm = {
  timeSpentAwayFromTargetRate: 10,
  timeSpentAwayFromTargetActive: false,
  frequencyOfSevereHypoglycemiaRate: 0,
  frequencyOfSevereHypoglycemiaActive: false,
  nonDataTransmissionRate: 0,
  nonDataTransmissionActive: false
}

export const patients: ITeamMember[] = [
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: 'team-0',
    userId: patient.id,
    email: patient.username,
    preferences: patient.preferences,
    profile: patient.profile,
    settings: patient.settings,
    idVerified: false,
    alarms,
    monitoring: { enabled: false }
  },
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: 'team-1',
    userId: patient.id,
    email: patient.username,
    preferences: patient.preferences,
    profile: patient.profile,
    settings: patient.settings,
    idVerified: false,
    alarms,
    monitoring: { enabled: false }
  },
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: 'team-1',
    userId: 'a0a0a0b1',
    email: 'michel.dupont@example.com',
    profile: { firstName: 'Michel', lastName: 'Dupont', fullName: 'Michel D.' },
    idVerified: false,
    alarms,
    monitoring: { enabled: false }
  },
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: TeamType.private,
    userId: 'a0a0a0b2',
    email: 'marivone.duplessie@example.com',
    profile: { firstName: 'Marivone', lastName: 'Duplessie', fullName: 'Marivone Duplessie' },
    idVerified: false,
    alarms,
    monitoring: { enabled: false }
  },
  {
    invitationStatus: UserInvitationStatus.accepted,
    role: TeamMemberRole.patient,
    teamId: 'team-1',
    userId: 'a0a0a0b2',
    email: 'marivone.duplessie@example.com',
    profile: { firstName: 'Marivone', lastName: 'Duplessie', fullName: 'Marivone Duplessie' },
    idVerified: false,
    alarms,
    monitoring: { enabled: false }
  },
  {
    invitationStatus: UserInvitationStatus.pending,
    role: TeamMemberRole.patient,
    teamId: 'team-0',
    userId: 'a0a0a0b3',
    email: 'gerard.dumoulin@example.com',
    profile: { firstName: 'Gerard', lastName: 'Dumoulin', fullName: 'Gerard D.' },
    idVerified: false,
    alarms,
    monitoring: { enabled: false }
  }
]
