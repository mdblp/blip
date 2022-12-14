import BaseDatum from './basics/base-datum.model'

type Message = BaseDatum & {
  type: 'message'
  userid: string
  groupid: string
  messageText: string
  parentMessage: string | null
  user: {
    fullName: string
  }
}

export default Message
