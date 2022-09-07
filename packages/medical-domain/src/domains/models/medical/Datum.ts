import Basal from './datum/Basal'
import Bolus from './datum/Bolus'
import Cbg from './datum/Cbg'
import ConfidentialMode from './datum/ConfidentialMode'
import DeviceParameterChange from './datum/DeviceParameterChange'
import Fill from './datum/Fill'
import Meal from './datum/Meal'
import Message from './datum/Message'
import PhysicalActivity from './datum/PhysicalActivity'
import PumpSettings from './datum/PumpSettings'
import ReservoirChange from './datum/ReservoirChange'
import Smbg from './datum/Smbg'
import TimeZoneChange from './datum/TimeZoneChange'
import Upload from './datum/Upload'
import WarmUp from './datum/WarmUp'
import Wizard from './datum/Wizard'
import ZenMode from './datum/ZenMode'
import MedicalDataOptions from './MedicalDataOptions'

type Datum = Basal | Bolus | Cbg | ConfidentialMode | DeviceParameterChange | Fill | Meal |
Message | PhysicalActivity | PumpSettings | ReservoirChange | Smbg | Upload | Wizard |
ZenMode | TimeZoneChange | WarmUp

interface DatumProcessor<T> {
  normalize: (rawData: Record<string, unknown>, opts: MedicalDataOptions) => T
  deduplicate: (data: T[], opts: MedicalDataOptions) => T[]
}
export default Datum
export { DatumProcessor }
