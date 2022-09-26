import ChatApi from '../../../lib/chat/api'

export const mockChatAPI = () => {
  jest.spyOn(ChatApi, 'getChatMessages').mockResolvedValue([])
}
