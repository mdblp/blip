/*
 * Copyright (c) 2024, Diabeloop
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

import { buildDevice, isDeviceVersionHigherOrEqual } from './device.utils'
import type MedicalDataService from 'medical-domain'
import { Device } from '../../models/device.model'

describe('DeviceUtil', () => {
  describe('buildDevice', () => {
    it('should return null when medicalData service is null', () => {
      //given
      const medicalDataService = null

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toBeNull()
    })

    it('should return null when medicalData is null', () => {
      //given
      const medicalDataService: MedicalDataService = {} as MedicalDataService

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toBeNull()
    })

    it('should return null when pumpSettings is null', () => {
      //given
      const medicalDataService: MedicalDataService = { medicalData: {} } as MedicalDataService

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toBeNull()
    })

    it('should return null when pumpSettings is empty', () => {
      //given
      const medicalDataService: MedicalDataService = { medicalData: { pumpSettings: [] } } as unknown as MedicalDataService

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toBeNull()
    })

    it('should return null when pumpSettings has no payload', () => {
      //given
      const medicalDataService: MedicalDataService = { medicalData: { pumpSettings: [{ payload: null }] } } as unknown as MedicalDataService

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toBeNull()
    })

    it('should return null when payload has no device', () => {
      //given
      const medicalDataService: MedicalDataService = { medicalData: { pumpSettings: [{ payload: { device: null } }] } } as unknown as MedicalDataService

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toBeNull()
    })

    it('should return correct device when DBLG1', () => {
      //given
      const medicalDataService: MedicalDataService = {
        medicalData: {
          pumpSettings: [{
            payload: {
              device: {
                name: "DBLG1",
                swVersion: "1.12.9.149-DBLG1-INS-DEXG6-COMMERCIAL"
              }
            }
          }]
        }
      } as unknown as MedicalDataService
      const expectedDevice: Device = {
        name: "DBLG1",
        majorVersion: 1,
        minorVersion: 12
      }

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toEqual(expectedDevice)
    })

    it('should return correct device when DBLG2', () => {
      //given
      const medicalDataService: MedicalDataService = {
        medicalData: {
          pumpSettings: [{
            payload: {
              device: {
                name: "DBLG2",
                swVersion: "20.17.9.149-DBLG1-INS-DEXG6-COMMERCIAL"
              }
            }
          }]
        }
      } as unknown as MedicalDataService
      const expectedDevice: Device = {
        name: "DBLG2",
        majorVersion: 20,
        minorVersion: 17
      }

      //when
      const device = buildDevice(medicalDataService)

      //then
      expect(device).toEqual(expectedDevice)
    })
  })
  describe('isDeviceVersionHigherOrEqual', () => {
    it('should return false when major is lower', () => {
      //given
      const device: Device = {
        name: "DBLG2",
        majorVersion: 1,
        minorVersion: 15
      }

      //when
      const res = isDeviceVersionHigherOrEqual(device, 2, 17)

      //then
      expect(res).toBeFalsy()
    })

    it('should return false when major is equal but minor lower', () => {
      //given
      const device: Device = {
        name: "DBLG2",
        majorVersion: 1,
        minorVersion: 15
      }

      //when
      const res = isDeviceVersionHigherOrEqual(device, 1, 16)

      //then
      expect(res).toBeFalsy()
    })

    it('should return true when major is equal and minor is equal', () => {
      //given
      const device: Device = {
        name: "DBLG2",
        majorVersion: 1,
        minorVersion: 15
      }

      //when
      const res = isDeviceVersionHigherOrEqual(device, 1, 15)

      //then
      expect(res).toBeTruthy()
    })

    it('should return true when major is equal and minor is higher', () => {
      //given
      const device: Device = {
        name: "DBLG2",
        majorVersion: 1,
        minorVersion: 15
      }

      //when
      const res = isDeviceVersionHigherOrEqual(device, 1, 14)

      //then
      expect(res).toBeTruthy()
    })

    it('should return true when major is higher', () => {
      //given
      const device: Device = {
        name: "DBLG2",
        majorVersion: 1,
        minorVersion: 15
      }

      //when
      const res = isDeviceVersionHigherOrEqual(device, 0, 16)

      //then
      expect(res).toBeTruthy()
    })
  })
})
