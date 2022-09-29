import UserApi from '../../../lib/auth/user-api'

export const mockUserApi = () => {
  jest.spyOn(UserApi, 'getShorelineAccessToken').mockResolvedValue(undefined)
  const getProfileMock = jest.spyOn(UserApi, 'getProfile').mockResolvedValue(undefined)
  const getPreferencesMock = jest.spyOn(UserApi, 'getPreferences').mockResolvedValue(undefined)
  const getSettingsMock = jest.spyOn(UserApi, 'getSettings').mockResolvedValue(undefined)
  const updateProfileMock = jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(undefined)
  const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(undefined)
  const updateSettingsMock = jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(undefined)

  return {
    updateProfileMock,
    updatePreferencesMock,
    updateSettingsMock,
    getProfileMock,
    getPreferencesMock,
    getSettingsMock
  }
}
