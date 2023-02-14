/* eslint-disable no-unused-vars */
import DataUtil from './types/utils/data'
import { CbgDateTrace } from 'dumb/src/models/cbg-date-trace.model'
import { BgPositionData } from 'dumb/src/models/bg-position-data.model'


declare module 'tidepool-viz' {
  export const delayShowCbgTracesOnFocus: (userId: string, sliceData: { id: string }, slicePosition: Object, focusedKeys: string[]) => void
  export const unfocusTrendsCbgSlice: (userId: string) => void
  export const unfocusTrendsCbgDateTrace: (userId: string) => void
  export const focusTrendsCbgDateTrace: (userId: string, data: CbgDateTrace, cbgPosition: BgPositionData) => void
  export class VizDataUtil extends DataUtil {}
}
