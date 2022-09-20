import Basal from './datum/Basal'
import Bolus from './datum/Bolus'
import Cbg from './datum/Cbg'
import ConfidentialMode from './datum/ConfidentialMode'
import DeviceParameterChange from './datum/DeviceParameterChange'
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

interface MedicalData {
  basal: Basal[]
  bolus: Bolus[]
  cbg: Cbg[]
  confidentialModes: ConfidentialMode[]
  deviceParametersChanges: DeviceParameterChange[]
  meals: Meal[]
  messages: Message[]
  physicalActivities: PhysicalActivity[]
  pumpSettings: PumpSettings[]
  reservoirChanges: ReservoirChange[]
  smbg: Smbg[]
  uploads: Upload[]
  warmUps: WarmUp[]
  wizards: Wizard[]
  zenModes: ZenMode[]
  timezoneChanges: TimeZoneChange[]
}

export default MedicalData
