import TeamAPI from '../../../lib/team/team-api'
import { TeamMemberRole, TeamType } from '../../../models/team'
import { UserInvitationStatus } from '../../../models/generic'
import { HcpProfession } from '../../../models/hcp-profession'
import { MonitoringStatus } from '../../../models/monitoring'
import { monitoringParameters } from './mockPatientAPI'

export const mockTeamAPI = () => {
  jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([{
    name: 'MyTeam',
    id: '62fe00defc9374b2fed32bcc',
    code: '036038775',
    type: TeamType.medical,
    owner: '919b1575bad58',
    phone: '0476000000',
    email: 'hey@hey.hey',
    address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
    description: 'Test MyTeam',
    members: [{
      userId: '919b1575bad58',
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
  }, {
    name: 'MySecondTeam',
    id: '62fe00defc9374b2fed32bcd',
    code: '241548778',
    type: TeamType.medical,
    owner: '919b1575bad58',
    phone: '0476000000',
    email: 'hey@hey.hey',
    address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
    description: 'Test My second Team',
    members: [{
      userId: '919b1575bad58',
      teamId: '62fe00defc9374b2fed32bcd',
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
  }, {
    name: 'MyThirdTeam - to be deleted',
    id: '62fe00defc9374b2fed32bce',
    code: '263381988',
    type: TeamType.medical,
    owner: '919b1575bad58',
    phone: '0476000000',
    email: 'hey@third.hey',
    address: { line1: 'Guiness Road', line2: '', zip: 'W1D 1BS', city: 'Dublin', country: 'IE' },
    description: 'Test My third Team',
    members: [{
      userId: '919b1575bad58',
      teamId: '62fe00defc9374b2fed32bce',
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
      teamId: '62fe00defc9374b2fed32bce',
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
  }])
}
