import UserApi from '../../../lib/auth/user-api'

export const mockUserApi = () => {
  const updateProfileMock = jest.spyOn(UserApi, 'updateProfile').mockResolvedValue(undefined)
  const updatePreferencesMock = jest.spyOn(UserApi, 'updatePreferences').mockResolvedValue(undefined)
  const updateSettingsMock = jest.spyOn(UserApi, 'updateSettings').mockResolvedValue(undefined)
  const updateAuth0UserMetadataMock = jest.spyOn(UserApi, 'completeUserSignup').mockResolvedValue(undefined)

  return {
    updateAuth0UserMetadataMock,
    updateProfileMock,
    updatePreferencesMock,
    updateSettingsMock
  }
}
