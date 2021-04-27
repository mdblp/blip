/**
 * Copyright (c) 2020, Diabeloop
 * Notification models
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import { Profile } from "../../models/shoreline";
import { TeamMemberRole } from "../../models/team";
import { Team } from "../../lib/team";

export enum NotificationType {
  teamMemberInvitation = "medicalteam_invitation",
  teamPatientInvitation = "medicalteam_patient_invitation",
  caregiverInvitation = "careteam_invitation",
}

export interface INotification {
  key: string;
  type: NotificationType;
  email: string;
  creatorId: string;
  context?: null;
  created: string;
  teamId: string;
  role: TeamMemberRole;
  shortKey: string;
  creator: {
    userid: string;
    profile?: Profile;
  };
  careteam?: Team | null;
}
