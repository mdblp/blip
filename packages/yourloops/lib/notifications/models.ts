import { Session } from "../../lib/auth/models";
import { Profile, UserRoles } from "../../models/shoreline";

export enum NotificationType {
  directshare = "careteam_invitation",
  careteam = "medicalteam_invitation",
}

export interface INotification {
  type: NotificationType;
  creator: {
    userid: string;
    profile: Profile;
    role: UserRoles;
  };
  created: string;
  target?: string;
}


export interface NotificationContext {
  getInvitations: ( userId: string | undefined) => Promise<INotification[]>;
  accept: (creatorId: string | undefined, type: NotificationType) => Promise<void>;
  decline: (creatorId: string | undefined, type: NotificationType) => Promise<void>;
}

export interface NotificationAPI {
  getInvitations: (auth: Readonly<Session>, userId: string) => Promise<INotification[]>;
  accept: (auth: Readonly<Session>, creatorId: string | undefined, type: NotificationType) => Promise<void>;
  decline: (auth: Readonly<Session>, creatorId: string | undefined, type: NotificationType) => Promise<void>;
}


export interface NotificationProvider {
  children: React.ReactNode;
  /** Used to test the hook */
  api?: NotificationAPI;
  /** Used for test components which need this hook */
  value?: NotificationContext;
}
