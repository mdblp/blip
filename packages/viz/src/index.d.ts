import DataUtil from './types/utils/data'

declare const delayShowCbgTracesOnFocus: (userId: string, sliceData: { id: string }, slicePosition: Object, focusedKeys: string[]) => void
declare const unfocusTrendsCbgSlice: (userId: string) => void

export { DataUtil, delayShowCbgTracesOnFocus, unfocusTrendsCbgSlice }
