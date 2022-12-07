import Basal from './datum/basal.model'
import Bolus from './datum/bolus.model'
import Cbg from './datum/cbg.model'
import ConfidentialMode from './datum/confidential-mode.model'
import DeviceParameterChange from './datum/device-parameter-change.model'
import Fill from './datum/fill.model'
import Meal from './datum/meal.model'
import Message from './datum/message.model'
import PhysicalActivity from './datum/physical-activity.model'
import PumpSettings from './datum/pump-settings.model'
import ReservoirChange from './datum/reservoir-change.model'
import Smbg from './datum/smbg.model'
import TimeZoneChange from './datum/time-zone-change.model'
import Upload from './datum/upload.model'
import WarmUp from './datum/warm-up.model'
import Wizard from './datum/wizard.model'
import ZenMode from './datum/zen-mode.model'
import MedicalDataOptions from './medical-data-options.model'

type Datum = Basal | Bolus | Cbg | ConfidentialMode | DeviceParameterChange | Fill | Meal |
Message | PhysicalActivity | PumpSettings | ReservoirChange | Smbg | Upload | Wizard |
ZenMode | TimeZoneChange | WarmUp

interface DatumProcessor<T> {
  normalize: (rawData: Record<string, unknown>, opts: MedicalDataOptions) => T
  deduplicate: (data: T[], opts: MedicalDataOptions) => T[]
}
export default Datum
export { DatumProcessor }
