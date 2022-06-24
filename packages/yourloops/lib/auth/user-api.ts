import { IUser, Preferences, Profile, Settings } from "../../models/user";
import HttpService, { ErrorMessageStatus } from "../../services/http";
import { HttpHeaderKeys } from "../../models/api";
import bows from "bows";

const log = bows("User API");

export default class UserApi {
  static async getShorelineAccessToken(): Promise<{ token: string, id: string }> {
    try {
      const { headers, data } = await HttpService.get<IUser>({ url: "auth/login" });
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
      const error = err as Error;
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No profile for ${userId}`);
        return undefined;
      }
      throw err;
    }
  }

  static async getPreferences(userId: string): Promise<Preferences | undefined> {
    try {
      const { data } = await HttpService.get<Preferences>({ url: `/metadata/${userId}/preferences` });
      return data;
    } catch (err) {
      const error = err as Error;
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No preferences for ${userId}`);
        return undefined;
      }
      throw err;
    }
  }

  static async getSettings(userId: string): Promise<Settings | undefined> {
    try {
      const { data } = await HttpService.get<Settings>({ url: `/metadata/${userId}/settings` });
      return data;
    } catch (err) {
      const error = err as Error;
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No settings for ${userId}`);
        return undefined;
      }
      throw err;
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
