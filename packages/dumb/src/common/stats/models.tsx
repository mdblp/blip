export enum CBGStatType {
  TimeInRange = 'timeInRange',
  ReadingsInRange = 'readingsInRange',
}

export interface CBGTimeData {
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
