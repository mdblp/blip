import type Basal from './datum/basal.model'
import type Bolus from './datum/bolus.model'
import type Cbg from './datum/cbg.model'
import type ConfidentialMode from './datum/confidential-mode.model'
import type DeviceParameterChange from './datum/device-parameter-change.model'
import type Fill from './datum/fill.model'
import type Meal from './datum/meal.model'
import type Message from './datum/message.model'
import type PhysicalActivity from './datum/physical-activity.model'
import type PumpSettings from './datum/pump-settings.model'
import type ReservoirChange from './datum/reservoir-change.model'
import type Smbg from './datum/smbg.model'
import type TimeZoneChange from './datum/time-zone-change.model'
import type Upload from './datum/upload.model'
import type WarmUp from './datum/warm-up.model'
import type Wizard from './datum/wizard.model'
import type ZenMode from './datum/zen-mode.model'
import type MedicalDataOptions from './medical-data-options.model'
import { type WeekDaysFilter } from '../time/date-filter.model'

type Datum = Basal | Bolus | Cbg | ConfidentialMode | DeviceParameterChange | Fill | Meal |
Message | PhysicalActivity | PumpSettings | ReservoirChange | Smbg | Upload | Wizard |
ZenMode | TimeZoneChange | WarmUp

interface DatumProcessor<T> {
  normalize: (rawData: Record<string, unknown>, opts: MedicalDataOptions) => T
  deduplicate: (data: T[], opts: MedicalDataOptions) => T[]
  filterOnDate: (data: T[], start: number, end: number, weekDaysFilter: WeekDaysFilter) => T[]
}
export default Datum
export type { DatumProcessor }
