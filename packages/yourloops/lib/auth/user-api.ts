import {
  UserMetadata,
  Preferences,
  Profile,
  Settings,
  CompleteSignupPayload,
  ChangeUserRolePayload
} from '../../models/user'
import HttpService, { ErrorMessageStatus } from '../../services/http'
import bows from 'bows'

const log = bows('User API')

export default class UserApi {
  static async changeUserRoleToHcp(userId: string, payload: ChangeUserRolePayload): Promise<void> {
    await HttpService.post({
      url: `/bff/v1/accounts/${userId}`,
      payload
    })
  }

  static async completeUserSignup(userId: string, payload: CompleteSignupPayload): Promise<CompleteSignupPayload> {
    const { data } = await HttpService.post<CompleteSignupPayload, CompleteSignupPayload>({
      url: `/bff/v1/accounts/${userId}`,
      payload
    })
    return data
  }

  static async getUserMetadata(userId: string): Promise<UserMetadata | undefined> {
    try {
      const { data } = await HttpService.get<UserMetadata>({ url: `/metadata/${userId}` })
      return data
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No profile for ${userId}`)
        return undefined
      }
      throw err
    }
  }

  static async updateProfile(userId: string, profile: Profile): Promise<Profile> {
    const { data } = await HttpService.put<Profile, Profile>({
      url: `/metadata/${userId}/profile`,
      payload: profile
    })
    return data
  }

  static async updatePreferences(userId: string, preferences: Preferences): Promise<Preferences> {
    const { data } = await HttpService.put<Preferences, Preferences>({
      url: `/metadata/${userId}/preferences`,
      payload: preferences
    })
    return data
  }

  static async updateSettings(userId: string, settings: Settings): Promise<Settings> {
    const { data } = await HttpService.put<Settings, Settings>({
      url: `/metadata/${userId}/settings`,
      payload: settings
    })
    return data
  }
}
