import { Preferences, Profile, Settings } from "../../models/shoreline";
import HttpService from "../../services/http";
import { HttpHeaderKeys } from "../../models/api";

export default class UserApi {

  static async getShorelineAccessToken(email: string): Promise<string> {
    try {
      const { headers } = await HttpService.post({ url: `auth/hack/user/${email}` });
      return headers[HttpHeaderKeys.sessionToken];
    } catch (err) {
      console.log(err);
      return "no-token";
    }
  }

  static async getProfile(userId: string): Promise<Profile | undefined> {
    try {
      const { data } = await HttpService.get<Profile>({ url: `/metadata/${userId}/profile` });
      return data;
    } catch (err) {
      console.log(`No settings for ${userId}`);
      return undefined;
    }
  }

  static async getPreferences(userId: string): Promise<Preferences | undefined> {
    try {
      const { data } = await HttpService.get<Preferences>({ url: `/metadata/${userId}/preferences` });
      return data;
    } catch (err) {
      console.log(`No settings for ${userId}`);
      return undefined;
    }
  }

  static async getSettings(userId: string): Promise<Settings | undefined> {
    try {
      const { data } = await HttpService.get<Settings>({ url: `/metadata/${userId}/settings` });
      return data;
    } catch (err) {
      console.log(`No settings for ${userId}`);
      return undefined;
    }
  }
}
