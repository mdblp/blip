import Message from '../../../models/medical/datum/Message'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Message => {
  rawData.time = rawData.timestamp
  const base = BaseDatumService.normalize(rawData, opts)
  const rawUser = (rawData?.user ?? {}) as Record<string, unknown>
  const message: Message = {
    ...base,
    type: 'message',
    userid: rawData.userid as string,
    groupid: rawData.groupid as string,
    messageText: rawData.messagetext as string,
    parentMessage: rawData.parentmessage ? rawData.parentmessage as string : null,
    user: {
      fullName: (rawUser?.fullName ?? '') as string
    }
  }
  return message
}

const deduplicate = (data: Message[], opts: MedicalDataOptions): Message[] => {
  return DatumService.deduplicate(data, opts) as Message[]
}

const MessageService: DatumProcessor<Message> = {
  normalize,
  deduplicate
}

export default MessageService
