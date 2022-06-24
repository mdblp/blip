import {
  AuthenticatedUser,
  Consent,
  Preferences,
  Profile,
  Settings,
  UserMetadata,
  UserRoles,
} from "../../models/user";
import { MedicalData } from "../../models/device-data";
import config from "../config";

export default class User {
  readonly email: string;
  readonly emailVerified: boolean;
  readonly latestConsentChangeDate: Date;
  readonly username: string;
  id: string;
  frProId?: string;
  role: UserRoles;
  medicalData?: MedicalData;
  preferences?: Preferences;
  profile?: Profile;
  settings?: Settings;

  constructor(authenticatedUser: AuthenticatedUser) {
    this.email = authenticatedUser.email;
    this.emailVerified = authenticatedUser.emailVerified;
    this.id = User.getId(authenticatedUser.sub);
    this.role = authenticatedUser[UserMetadata.Roles][0] as UserRoles;
    this.username = authenticatedUser.email;
    this.latestConsentChangeDate = config.LATEST_TERMS ? new Date(config.LATEST_TERMS) : new Date(0);
  }

  private static getId(sub: string): string {
    const parsedSub = sub.split("|");
    return parsedSub[1];
  }

  get firstName(): string {
    return this.profile?.firstName ?? "";
  }

  get lastName(): string {
    return this.profile?.lastName ?? this.profile?.fullName ?? this.username;
  }

  get fullName(): string {
    return this.profile?.fullName ?? this.username;
  }

  isUserHcp(): boolean {
    return this.role === UserRoles.hcp;
  }

  isUserPatient(): boolean {
    return this.role === UserRoles.patient;
  }

  isUserCaregiver(): boolean {
    return this.role === UserRoles.caregiver;
  }

  /**
   * Check the given consent against the latest consent publication date
   * @param consent {Consent}
   * @returns true if the latest consent date is greater than the given consent
   */
  checkConsent(consent: Consent): boolean {
    if (consent.acceptanceTimestamp) {
      // A `null` is fine here, because `new Date(null).valueOf() === 0`
      const acceptDate = new Date(consent.acceptanceTimestamp);
      if (!Number.isFinite(acceptDate.getTime())) {
        // if acceptDate is not a valid formatted date string, get user to re-accept terms
        return true;
      }
      return this.latestConsentChangeDate >= acceptDate;
    }
    return true;
  }

  /**
   * Check If the user should accept is consent at a first login.
   * @description the first login is determined by null consents object
   */
  shouldAcceptConsent(): boolean {
    return !(this.profile?.termsOfUse?.isAccepted && this.profile.privacyPolicy?.isAccepted);
  }

  /**
   * Check If the user should renew is consent.
   */
  shouldRenewConsent(): boolean {
    if (!this.profile?.termsOfUse || !this.profile.privacyPolicy) {
      return true;
    }
    return (this.checkConsent(this.profile.termsOfUse) || this.checkConsent(this.profile.privacyPolicy));
  }

  isFirstLogin(): boolean {
    return !this.profile;
  }

  hasToAcceptNewConsent(): boolean {
    return this.isUserPatient() && !this.isFirstLogin() && this.shouldAcceptConsent();
  }

  hasToRenewConsent(): boolean {
    return !this.isFirstLogin() && this.shouldRenewConsent();
  }

  getParsedFrProId(): string | null {
    if (this.frProId) {
      const parsedId = this.frProId.split(":");
      return parsedId[2];
    }
    return null;
  }
}
