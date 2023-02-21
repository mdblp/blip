interface BgBounds {
  veryHighThreshold: number
  targetUpperBound: number
  targetLowerBound: number
  veryLowThreshold: number
}

interface CbgRangeStatistics {
  veryLow: number
  low: number
  target: number
  high: number
  veryHigh: number
  total: number
}

interface SensorUsageStatistics {
  sensorUsage: number
  total: number
}

interface AverageGlucoseStatistics {
  averageGlucose: number
  total: number
}

interface CoefficientOfVariationStatistics {
  insufficientData: boolean
  total: number
  coefficientOfVariation: number
}

interface GlucoseManagementIndicatoStatistics {
  insufficientData: boolean
  glucoseManagementIndicator: number
  total: number
}

interface StandardDevStatistics {
  insufficientData: boolean
  averageGlucose: number
  total: number
  standardDeviation: number
}

export type {
  BgBounds, CbgRangeStatistics, SensorUsageStatistics, AverageGlucoseStatistics,
  CoefficientOfVariationStatistics, GlucoseManagementIndicatoStatistics, StandardDevStatistics
}
