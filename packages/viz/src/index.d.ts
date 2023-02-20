/* eslint-disable no-unused-vars */
import DataUtil from './types/utils/data'


declare module 'tidepool-viz' {
  export const delayShowCbgTracesOnFocus: (userId: string, sliceData: { id: string }, slicePosition: Object, focusedKeys: string[]) => void
  export const unfocusTrendsCbgSlice: (userId: string) => void
  export class VizDataUtil extends DataUtil {}
}
