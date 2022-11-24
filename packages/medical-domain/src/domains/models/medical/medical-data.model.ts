import Basal from './datum/basal.model'
import Bolus from './datum/bolus.model'
import Cbg from './datum/cbg.model'
import ConfidentialMode from './datum/confidential-mode.model'
import DeviceParameterChange from './datum/device-parameter-change.model'
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
