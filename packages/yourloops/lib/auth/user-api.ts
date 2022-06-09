import { Preferences, Profile, Settings } from "../../models/shoreline";
import HttpService from "../../services/http";
import { HttpHeaderKeys } from "../../models/api";
import User from "./user";

export default class UserApi {
  static async getShorelineAccessToken(email: string): Promise<{ token: string, id: string }> {
    try {
      const { headers, data } = await HttpService.post<User, void>({ url: `auth/hack/user/${email}` });
      console.log(data);
      return { token: headers[HttpHeaderKeys.sessionToken], id: data.userid };
    } catch (err) {
      console.log("This profile doesn't exists");
      throw "unknown user";
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

  static async updateProfile(userId: string, profile: Profile): Promise<Profile> {
    const { data } = await HttpService.put<Profile, Profile>({
      url: `/metadata/${userId}/profile`,
      payload: profile,
    });
    return data;
  }

  static async updatePreferences(userId: string, preferences: Preferences): Promise<Preferences> {
    const { data } = await HttpService.put<Preferences, Preferences>({
      url: `/metadata/${userId}/preferences`,
      payload: preferences,
    });
    return data;
  }

  static async updateSettings(userId: string, settings: Settings): Promise<Settings> {
    const { data } = await HttpService.put<Settings, Settings>({
      url: `/metadata/${userId}/settings`,
      payload: settings,
    });
    return data;
  }
}
