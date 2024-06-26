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

export enum AlarmCode {
  DanaEmptyPumpBattery = '51001',
  DanaEmptyReservoir = '51002',
  DanaIncompatibleActionsOnPump = '51003',
  DanaOcclusion = '51004',
  Hyperglycemia = '10113',
  Hypoglycemia = '12000',
  InsightEmptyInsulinCartridge = '71002',
  InsightEmptyPumpBattery = '71001',
  InsightHypoglycemia = '10117',
  InsightIncompatibleActionsOnPump = '71003',
  InsightInsulinCartridgeExpired = '71020',
  InsightOcclusion = '71004',
  KaleidoEmptyInsulinCartridge = '41002',
  KaleidoEmptyPumpBattery = '41001',
  KaleidoInsulinCartridgeExpired = '41003',
  KaleidoOcclusion = '41004',
  LongHyperglycemia = '15000',
  LongHypoglycemia = '24000',
  MedisafeEmptyPumpBattery = '91001',
  MedisafeEmptyPumpReservoir = '91002',
  MedisafeOcclusion = '91004',
  NoReadingsHypoglycemiaRisk = '20100',
  SensorSessionExpired = '11000',
  SuddenRiseInGlycemia = '20102',
  UrgentLowSoon = '10112'
}
