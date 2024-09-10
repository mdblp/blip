/*
 * Copyright (c) 2023-2024, Diabeloop
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
import { createWizardData } from '../../../data-generator'
import WizardService from '../../../../src/domains/repositories/medical/datum/wizard.service'
import { Bolus, defaultMedicalDataOptions } from '../../../../src'

describe('deduplicate', () => {
  it('should return a deduplicated array based on normal time', () => {
    const normalTime1 = '2023-07-24T08:00:00.000Z'
    const normalTime2 = '2023-07-24T12:00:00.000Z'
    const expectedWizard1 = {
      ...createWizardData(),
      ...{
        normalTime: normalTime1,
        inputTime: '2023-07-24T08:00:04.000Z',
        bolusId: 'bolus3',
        bolusIds: new Set<string>(['bolus3'])
      }
    }
    const expectedWizard2 = {
      ...createWizardData(),
      ...{
        normalTime: normalTime2,
        inputTime: '2023-07-12:00:00.000Z',
        bolusId: 'bolus4',
        bolusIds: new Set<string>(['bolus4'])
      }
    }
    const wizardData = [
      {
        ...createWizardData(),
        ...{
          normalTime: normalTime1,
          inputTime: '2023-07-24T08:00:00.000Z',
          bolusId: 'bolus1',
          bolusIds: new Set<string>(['bolus1'])
        }
      },
      {
        ...createWizardData(),
        ...{
          normalTime: normalTime1,
          inputTime: '2023-07-24T08:00:02.000Z',
          bolusId: 'bolus2',
          bolusIds: new Set<string>(['bolus2'])
        }
      },
      expectedWizard1,
      expectedWizard2
    ]

    const bolusData = [{ id: 'bolus1' }, { id: 'bolus2' }, { id: 'bolus3' }] as Bolus[]
    const dedupWizards = WizardService.deduplicate(wizardData, bolusData, defaultMedicalDataOptions)
    const expectedWizards = [
      { ...expectedWizard1, ...{ bolusIds: new Set<string>(['bolus1', 'bolus2', 'bolus3']) } },
      expectedWizard2
    ]
    expect(dedupWizards).toEqual(expectedWizards)
  })

  it('should not keep wizards with invalid boluses', () => {
    const normalTime = '2023-07-24T08:00:00.000Z'
    const wizardData = [
      {
        ...createWizardData(),
        ...{
          normalTime: normalTime,
          inputTime: '2023-07-24T08:00:00.000Z',
          bolusId: 'bolus1',
          bolusIds: new Set<string>(['bolus1'])
        }
      },
      {
        ...createWizardData(),
        ...{
          normalTime: normalTime,
          inputTime: '2023-07-24T08:00:02.000Z',
          bolusId: 'bolus2',
          bolusIds: new Set<string>(['bolus2'])
        }
      }
    ]
    const bolusData = [{ id: 'bolus2' }] as Bolus[]

    const result = WizardService.deduplicate(wizardData, bolusData, defaultMedicalDataOptions)

    expect(result[0].bolusId).toEqual('bolus2')
    expect(result[0].bolusIds).toEqual(new Set<string>(['bolus1', 'bolus2']))
  })
})
