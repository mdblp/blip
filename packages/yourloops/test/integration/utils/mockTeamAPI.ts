import TeamAPI from '../../../lib/team/team-api'
import { UNITS_TYPE } from '../../../lib/units/utils'
import { MIN_HIGH_BG, MIN_LOW_BG, MIN_VERY_LOW_BG } from '../../../components/alarm/alarms-content-configuration'
import { ITeam, TeamMemberRole, TeamType } from '../../../models/team'
import { loggedInUserId } from './mockAuth0Hook'
import { HcpProfession } from '../../../models/hcp-profession'
import { UserInvitationStatus } from '../../../models/generic'
import { MonitoringStatus } from '../../../models/monitoring'

export const monitoringParameters = {
  bgUnit: UNITS_TYPE.MGDL,
  lowBg: MIN_LOW_BG,
  highBg: MIN_HIGH_BG,
  outOfRangeThreshold: 5,
  veryLowBg: MIN_VERY_LOW_BG,
  hypoThreshold: 10,
  nonDataTxThreshold: 15,
  reportingPeriod: 7
}

export const mySecondTeamId = '62fe00defc9374b2fed32bcd'
export const myThirdTeamId = '62fe00defc9374b2fed32bce'

export const teamOne: ITeam = {
  name: 'MyTeam',
  id: '62fe00defc9374b2fed32bcc',
  code: '036038775',
  type: TeamType.medical,
  owner: loggedInUserId,
  phone: '0476000000',
  email: 'hey@hey.hey',
  address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
  description: 'Test MyTeam',
  members: [{
    userId: loggedInUserId,
    teamId: '62fe00defc9374b2fed32bcc',
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.0',
      fullName: 'Yourloops UI 28.0 HCP 0',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 0',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    },
    settings: null,
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28@diabeloop.fr',
    idVerified: false,
    unreadMessages: 0
  }]
}

export const teamTwo: ITeam = {
  name: 'MySecondTeam',
  id: mySecondTeamId,
  code: '241548778',
  type: TeamType.medical,
  owner: loggedInUserId,
  phone: '0476000000',
  email: 'hey@hey.hey',
  address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
  description: 'Test My second Team',
  members: [{
    userId: loggedInUserId,
    teamId: mySecondTeamId,
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.0',
      fullName: 'Yourloops UI 28.0 HCP 0',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 0',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    },
    settings: null,
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28@diabeloop.fr',
    idVerified: false,
    unreadMessages: 0
  }],
  monitoring: {
    enabled: true,
    monitoringEnd: null,
    status: MonitoringStatus.accepted,
    parameters: monitoringParameters
  }
}

export const teamThree: ITeam = {
  name: 'MyThirdTeam - to be deleted',
  id: myThirdTeamId,
  code: '263381988',
  type: TeamType.medical,
  owner: loggedInUserId,
  phone: '0476000000',
  email: 'hey@third.hey',
  address: { line1: 'Guiness Road', line2: '', zip: 'W1D 1BS', city: 'Dublin', country: 'IE' },
  description: 'Test My third Team',
  members: [{
    userId: loggedInUserId,
    teamId: myThirdTeamId,
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.0',
      fullName: 'Yourloops UI 28.0 HCP 0',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 0',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    },
    settings: null,
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28@diabeloop.fr',
    idVerified: false,
    unreadMessages: 0
  }, {
    userId: '4d9afc649ae4',
    teamId: myThirdTeamId,
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.1',
      fullName: 'Yourloops UI 28.1 HCP 1',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 1',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    },
    settings: null,
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28.1@diabeloop.fr',
    idVerified: false,
    unreadMessages: 0
  }]
}

export const mockTeamAPI = () => {
  jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([teamOne, teamTwo, teamThree])
}
