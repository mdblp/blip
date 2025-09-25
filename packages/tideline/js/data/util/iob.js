const TOTAL_DAILY_INSULIN_PARAM = 'TOTAL_INSULIN_FOR_24H'
const DEFAULT_MAX_IOB_VALUE_U = 45


export const getMaxIobValue = (medicalData) => {
  if (!medicalData.pumpSettings || medicalData.pumpSettings.length === 0) {
    return DEFAULT_MAX_IOB_VALUE_U
  }

  const totalDailyInsulinParameter = medicalData.pumpSettings[0]?.payload?.parameters?.find((parameter) => parameter.name === TOTAL_DAILY_INSULIN_PARAM)
  const totalDailyInsulinValue = totalDailyInsulinParameter && Number.parseFloat(totalDailyInsulinParameter.value)

  return Number.isFinite(totalDailyInsulinValue) ? totalDailyInsulinValue / 2 : DEFAULT_MAX_IOB_VALUE_U
}
