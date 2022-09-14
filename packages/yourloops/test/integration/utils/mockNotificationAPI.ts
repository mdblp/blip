import NotificationApi from '../../../lib/notifications/notification-api'

export const mockNotificationAPI = () => {
  jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValue([])
  jest.spyOn(NotificationApi, 'getSentInvitations').mockResolvedValue([])
}
