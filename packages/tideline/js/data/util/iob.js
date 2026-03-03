import { DblParameter } from 'medical-domain'

const DEFAULT_MAX_IOB_VALUE_U = 45


export const getMaxIobValue = (medicalData) => {
  if (!medicalData.pumpSettings || medicalData.pumpSettings.length === 0) {
    return DEFAULT_MAX_IOB_VALUE_U
  }

  const totalDailyInsulinParameter = medicalData.pumpSettings[0]?.payload?.parameters?.find((parameter) => parameter.name === DblParameter.TotalDailyInsulin)
  const totalDailyInsulinValue = totalDailyInsulinParameter && Number.parseFloat(totalDailyInsulinParameter.value)

  // The max IOB value is set to half of the total daily insulin, or a default max if that value is not available
  return Number.isFinite(totalDailyInsulinValue) ? totalDailyInsulinValue / 2 : DEFAULT_MAX_IOB_VALUE_U
}
