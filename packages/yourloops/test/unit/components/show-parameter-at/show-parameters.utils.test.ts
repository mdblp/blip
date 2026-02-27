/*
 * Copyright (c) 2026, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ChangeType, DblParameter, type ParameterConfig, type ParametersChange, Unit } from 'medical-domain'
import { getParametersAtDate } from '../../../../components/show-parameters/show-parameters.utils'

describe('show parameters at utils', () => {
  const baseDate = new Date('2026-01-01T00:00:00.000Z')
  const beforeTarget = new Date('2025-12-15T00:00:00.000Z')
  const targetDate = new Date('2026-01-15T00:00:00.000Z')
  const afterTarget = new Date('2026-01-25T00:00:00.000Z')

  describe('getParametersAtDate', () => {
    it('should return current parameters unchanged when history is empty', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '70'
        },
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.TotalDailyInsulin,
          unit: Unit.InsulinUnit,
          value: '50'
        }
      ]

      const result = getParametersAtDate(currentParameters, [], targetDate)

      expect(result).toEqual(currentParameters)
    })

    it('should return current parameters unchanged when history is null', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '70'
        },
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.TotalDailyInsulin,
          unit: Unit.InsulinUnit,
          value: '50'
        }
      ]

      const result = getParametersAtDate(currentParameters, null, targetDate)

      expect(result).toEqual(currentParameters)
    })

    it('should return current parameters unchanged when target is null', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '70'
        },
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.TotalDailyInsulin,
          unit: Unit.InsulinUnit,
          value: '50'
        }
      ]

      const result = getParametersAtDate(currentParameters, [], null)

      expect(result).toEqual(currentParameters)
    })

    it('should return empty array when current parameters is empty', () => {
      const history: ParametersChange[] = [
        {
          changeDate: afterTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Added,
              effectiveDate: afterTarget.toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '70'
            }
          ]
        }
      ]

      const result = getParametersAtDate([], history, targetDate)

      expect(result).toEqual([])
    })
    
    it('should return current parameters when target date [2026-01-15] is after all changes [2025-12-15]', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: baseDate.toISOString(), // 2026-01-01
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '75'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: beforeTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: beforeTarget.toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '75',
              previousValue: '70'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result).toEqual(currentParameters)
    })

    // ChangeType.Added reversal scenario
    it('should remove parameter that was added after target date [2026-01-15]', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '70'
        },
        {
          effectiveDate: afterTarget.toISOString(),
          level: 0,
          name: DblParameter.Height,
          unit: Unit.Centimeter,
          value: '175'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: afterTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Added,
              effectiveDate: afterTarget.toISOString(),
              level: 0,
              name: DblParameter.Height,
              unit: Unit.Centimeter,
              value: '175'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe(DblParameter.Weight)
      expect(result[0].value).toBe('70')
    })

    it('should keep parameter that was added before target date [2026-01-15]', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: beforeTarget.toISOString(),
          level: 0,
          name: DblParameter.Height,
          unit: Unit.Centimeter,
          value: '175'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: beforeTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Added,
              effectiveDate: beforeTarget.toISOString(),
              level: 0,
              name: DblParameter.Height,
              unit: Unit.Centimeter,
              value: '175'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe(DblParameter.Height)
      expect(result[0].value).toBe('175')
    })

    // change type delete reversal scenario
    it('should restore deleted parameter with previousValue when deleted after target date [2026-01-15]', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: baseDate.toISOString(),
          level: 0,
          name: DblParameter.TotalDailyInsulin,
          unit: Unit.InsulinUnit,
          value: '50'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: afterTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Deleted,
              effectiveDate: afterTarget.toISOString(), //2026-01-25
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '',
              previousValue: '70'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(2)
      const restoredParam = result.find(p => p.name === DblParameter.Weight)
      expect(restoredParam).toBeDefined()
      expect(restoredParam?.value).toBe('70')
      expect(restoredParam?.unit).toBe(Unit.Kilogram)
    })

    // ChangeType.Updated reversal
    it('should revert parameter to previousValue when updated after target date', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: afterTarget.toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '75'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: afterTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: afterTarget.toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '75',
              previousValue: '70'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe(DblParameter.Weight)
      expect(result[0].value).toBe('70')
    })

    it('should revert parameter to previousValue and previousUnit when both changed after target date', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: afterTarget.toISOString(),
          level: 0,
          name: DblParameter.HyperglycemiaThreshold,
          unit: Unit.MmolPerLiter,
          value: '10.0'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: afterTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: afterTarget.toISOString(),
              level: 0,
              name: DblParameter.HyperglycemiaThreshold,
              unit: Unit.MmolPerLiter,
              value: '10.0',
              previousValue: '180',
              previousUnit: Unit.MilligramPerDeciliter
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe(DblParameter.HyperglycemiaThreshold)
      expect(result[0].value).toBe('180')
      expect(result[0].unit).toBe(Unit.MilligramPerDeciliter)
    })

    it('should keep current parameter when updated before target date', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: beforeTarget.toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '72'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: beforeTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: beforeTarget.toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '72',
              previousValue: '70'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(1)
      expect(result[0].value).toBe('72')
    })

    // more tricky scenarios
    it('should handle multiple changes for same parameter correctly', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: new Date('2026-01-30T00:00:00.000Z').toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '80'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: new Date('2026-01-20T00:00:00.000Z').toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: new Date('2026-01-20T00:00:00.000Z').toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '75',
              previousValue: '70'
            }
          ]
        },
        {
          changeDate: new Date('2026-01-30T00:00:00.000Z').toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: new Date('2026-01-30T00:00:00.000Z').toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '80',
              previousValue: '75'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(1)
      expect(result[0].value).toBe('70')
    })

    it('should handle mixed change types in single ParametersChange', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: afterTarget.toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '75'
        },
        {
          effectiveDate: afterTarget.toISOString(),
          level: 0,
          name: DblParameter.TotalDailyInsulin,
          unit: Unit.InsulinUnit,
          value: '55'
        },
        {
          effectiveDate: afterTarget.toISOString(),
          level: 0,
          name: DblParameter.Height,
          unit: Unit.Centimeter,
          value: '180'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: afterTarget.toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: afterTarget.toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '75',
              previousValue: '70'
            },
            {
              changeType: ChangeType.Added,
              effectiveDate: afterTarget.toISOString(),
              level: 0,
              name: DblParameter.Height,
              unit: Unit.Centimeter,
              value: '180'
            },
            {
              changeType: ChangeType.Deleted,
              effectiveDate: afterTarget.toISOString(),
              level: 0,
              name: DblParameter.TargetGlucoseLevel,
              unit: Unit.MilligramPerDeciliter,
              value: '',
              previousValue: '100'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(3)

      const weightParam = result.find(p => p.name === DblParameter.Weight)
      expect(weightParam?.value).toBe('70')

      const heightParam = result.find(p => p.name === DblParameter.Height)
      expect(heightParam).toBeUndefined()

      const targetParam = result.find(p => p.name === DblParameter.TargetGlucoseLevel)
      expect(targetParam?.value).toBe('100')
    })

    it('should handle history in any order by sorting internally', () => {
      const currentParameters: ParameterConfig[] = [
        {
          effectiveDate: new Date('2026-01-30T00:00:00.000Z').toISOString(),
          level: 0,
          name: DblParameter.Weight,
          unit: Unit.Kilogram,
          value: '80'
        }
      ]
      const history: ParametersChange[] = [
        {
          changeDate: new Date('2026-01-30T00:00:00.000Z').toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: new Date('2026-01-30T00:00:00.000Z').toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '80',
              previousValue: '75'
            }
          ]
        },
        {
          changeDate: new Date('2026-01-20T00:00:00.000Z').toISOString(),
          parameters: [
            {
              changeType: ChangeType.Updated,
              effectiveDate: new Date('2026-01-20T00:00:00.000Z').toISOString(),
              level: 0,
              name: DblParameter.Weight,
              unit: Unit.Kilogram,
              value: '75',
              previousValue: '70'
            }
          ]
        }
      ]

      const result = getParametersAtDate(currentParameters, history, targetDate)

      expect(result.length).toBe(1)
      expect(result[0].value).toBe('70')
    })
  })
})
