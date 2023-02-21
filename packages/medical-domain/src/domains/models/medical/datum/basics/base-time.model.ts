import { isRecord } from '../../../../utils/typeguard.utils'

interface BaseTime {
  timezone: string
  normalTime: string
  epoch: number
  displayOffset: number
  guessedTimezone: boolean
}
function isBaseTime(value: unknown): value is BaseTime {
  if (!isRecord(value)) {
    return false
  }
  if (typeof value.timezone !== 'string') {
    return false
  }
  if (typeof value.normalTime !== 'string') {
    return false
  }
  if (typeof value.epoch !== 'number') {
    return false
  }
  if (typeof value.displayOffset !== 'number') {
    return false
  }
  if (typeof value.guessedTimezone !== 'boolean') {
    return false
  }
  return true
}

export default BaseTime
export { isBaseTime }
