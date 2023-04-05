/*
 * Copyright (c) 2023, Diabeloop
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

export interface BgBounds {
  veryHighThreshold: number
  targetUpperBound: number
  targetLowerBound: number
  veryLowThreshold: number
}

export interface CbgRangeStatistics {
  veryLow: number
  low: number
  target: number
  high: number
  veryHigh: number
  total: number
}

export interface SensorUsageStatistics {
  sensorUsage: number
  totalUsage: number
}

export interface AverageGlucoseStatistics {
  averageGlucose: number
  total: number
}

export interface CoefficientOfVariationStatistics {
  insufficientData: boolean
  total: number
  coefficientOfVariation: number
}

export interface GlucoseManagementIndicatoStatistics {
  insufficientData: boolean
  glucoseManagementIndicator: number
}

export interface StandardDevStatistics {
  insufficientData: boolean
  averageGlucose: number
  total: number
  standardDeviation: number
}
