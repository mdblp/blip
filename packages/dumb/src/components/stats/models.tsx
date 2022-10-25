export enum CBGStatType {
  AverageGlucose = 'averageGlucose',
  ReadingsInRange = 'readingsInRange',
  StandardDeviation = 'standardDev',
  TimeInRange = 'timeInRange',
}

export interface CBGPercentageData {
  id: StatLevel
  legendTitle: string
  title: string
  value: number
}

export enum StatLevel {
  VeryHigh = 'veryHigh',
  High = 'high',
  Target = 'target',
  Low = 'low',
  VeryLow = 'veryLow'
}
