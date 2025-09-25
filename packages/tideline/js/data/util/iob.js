const TOTAL_DAILY_INSULIN_PARAM = 'TOTAL_INSULIN_FOR_24H'
const DEFAULT_MAX_IOB_VALUE = 45


export const getMaxIobValue = (medicalData) => {
  const totalDailyInsulinParameter = medicalData.pumpSettings[0]?.payload?.parameters?.find((parameter) => parameter.name === TOTAL_DAILY_INSULIN_PARAM)
  const totalDailyInsulinValue = totalDailyInsulinParameter && Number.parseFloat(totalDailyInsulinParameter.value)

  return Number.isFinite(totalDailyInsulinValue) ? totalDailyInsulinValue / 2 : DEFAULT_MAX_IOB_VALUE
}
