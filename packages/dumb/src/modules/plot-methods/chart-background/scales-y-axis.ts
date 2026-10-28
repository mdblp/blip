/*
 * Copyright (c) 2014-2026, Diabeloop
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

import * as d3 from 'd3'
import MedicalDataService, { type Bolus, type Cbg, convertBG, MGDL_UNITS, type Smbg, type Wizard } from 'medical-domain'
import { getMaxIobValue } from '../charts/active-insulin/iob'
import { getBolusFromInsulinEvent } from '../../../utils/bolus/bolus.util'

/** The minimal pool shape these Y-axis factories need: just the pool's rendered height in pixels */
interface PoolHeight {
  height: () => number
}

/** A scale paired with the (hidden) axis built from it, as returned to the caller's pool.render() */
interface YAxisScale<Scale extends d3.ScaleContinuousNumeric<number, number>> {
  axis: d3.Axis<d3.NumberValue>
  scale: Scale
}

// SMBG circles are drawn at this diameter; half of it is used as top/bottom padding on the BG
// scale's range so they're never clipped by the pool's edges
const SMBG_DIAMETER = 16

// The BG scale never needs to display more than this, in mg/dL (and its mmol/L equivalent)
const MAX_CBG_MGDL = 401
const MAX_CBG_MMOLL = convertBG(MAX_CBG_MGDL, MGDL_UNITS)

// The max bolus value maps to this fraction of the pool height from the top, leaving headroom
// above the tallest bolus circle/rectangle
const BOLUS_SCALE_TOP_RATIO = 0.35

// We display 10% more than the max rate/IOB value to avoid cutting off the top of the curve
const BASAL_SCALE_HEADROOM_RATIO = 1.1
const IOB_SCALE_HEADROOM_RATIO = 1.1

/**
 * The BG, bolus, basal and IOB pools all hide their Y axis entirely via CSS
 * (#pool-<poolId>-yAxis); thresholds are shown via guideline lines/chips instead
 * (see getBgGuidelines/getBolusGuidelines/getBasalGuidelines/getIobGuidelines in this module).
 */
const createHiddenAxis = (scale: d3.ScaleContinuousNumeric<number, number>): d3.Axis<d3.NumberValue> => {
  return d3.axisLeft(scale)
}

const createScaleBG = (
  tidelineData: MedicalDataService,
  pool: PoolHeight,
  [minBgValue, maxBgValue]: [number | undefined, number | undefined],
  padding: number
): d3.ScaleLinear<number, number> => {
  const bgUnits = tidelineData.opts.bgUnits
  const targetBoundary = tidelineData.opts.bgClasses.target
  const maxCbgValue = bgUnits === MGDL_UNITS ? MAX_CBG_MGDL : MAX_CBG_MMOLL

  // The top of the scale must be at least at the target upper bound, for proper rendering of
  // datasets with no BG values above this mark
  const upperBound = Math.max(maxBgValue ?? Number.NEGATIVE_INFINITY, targetBoundary)

  const range: [number, number] = [pool.height() - padding, padding]
  const domain: [number, number] = [0, Math.min(upperBound, maxCbgValue)]
  const scale = d3.scaleLinear(domain, range)

  const isSingleValueDataset = minBgValue === upperBound
  if (upperBound > maxCbgValue || isSingleValueDataset) {
    scale.clamp(true)
  }

  if (!Number.isFinite(scale(70))) {
    console.warn('createScaleBG: scale is not well initialized', { minBgValue, maxBgValue, maxCbgValue, bgUnits, range, domain })
  }

  return scale
}

/**
 * Create the Y-Axis SVG and scale for BG graph
 *
 * Also returns the raw BG value extent it computed, so callers building the BG guidelines
 * (see getBgGuidelines) can reuse it instead of re-scanning the same cbg/smbg arrays.
 */
export const createYAxisBG = (
  tidelineData: MedicalDataService,
  pool: PoolHeight
): YAxisScale<d3.ScaleLinear<number, number>> & { extent: [number | undefined, number | undefined] } => {
  const allBgValues: Array<Cbg | Smbg> = [...tidelineData.medicalData.cbg, ...tidelineData.medicalData.smbg]
  const extent = d3.extent(allBgValues, (d) => d.value)
  const scale = createScaleBG(tidelineData, pool, extent, SMBG_DIAMETER / 2)
  const axis = createHiddenAxis(scale)

  return { axis, scale, extent }
}

const getAllBolusEvents = (tidelineData: MedicalDataService): Array<Bolus | Wizard> => {
  return [...tidelineData.medicalData.bolus, ...tidelineData.medicalData.wizards]
}

/**
 * The bolus amount used to size the Y-axis: the larger of what was expected and what was
 * actually delivered, so an interrupted bolus still sizes the scale off its original amount.
 * Mirrors the legacy commonBolus.getProgrammed behaviour.
 */
const getProgrammedBolusAmount = (insulinEvent: Bolus | Wizard): number => {
  const bolus = getBolusFromInsulinEvent(insulinEvent)
  if (!bolus) {
    return 0
  }

  const expectedNormal = Number.isFinite(bolus.expectedNormal) ? bolus.expectedNormal as number : 0
  const normal = Number.isFinite(bolus.normal) ? bolus.normal : 0

  return Math.max(expectedNormal, normal)
}

const getMaxBolusValue = (insulinEvents: Array<Bolus | Wizard>): number => {
  // for boluses the recommended can exceed the value
  return insulinEvents.reduce((max, event) => Math.max(max, getProgrammedBolusAmount(event)), 0)
}

const createScaleBolus = (maxBolusValue: number, pool: PoolHeight): d3.ScalePower<number, number> => {
  const poolHeight = pool.height()
  const domain: [number, number] = [0, maxBolusValue]
  const range: [number, number] = [poolHeight, BOLUS_SCALE_TOP_RATIO * poolHeight]

  return d3.scaleSqrt(domain, range)
}

/**
 * Create the Y-Axis scale for bolus & carbs graph
 *
 * Also returns the max bolus value it computed, so callers building the bolus guidelines
 * (see getBolusGuidelines) can reuse it instead of re-scanning the same bolus/wizard arrays.
 */
export const createYAxisBolus = (
  tidelineData: MedicalDataService,
  pool: PoolHeight
): YAxisScale<d3.ScalePower<number, number>> & { maxBolusValue: number } => {
  const maxBolusValue = getMaxBolusValue(getAllBolusEvents(tidelineData))
  const scale = createScaleBolus(maxBolusValue, pool)
  const axis = createHiddenAxis(scale)

  return { axis, scale, maxBolusValue }
}

const createScaleBasal = (maxRate: number, pool: PoolHeight): d3.ScalePower<number, number> => {
  const domain: [number, number] = [0, maxRate * BASAL_SCALE_HEADROOM_RATIO]
  const range: [number, number] = [pool.height(), 0]

  return d3.scaleSqrt(domain, range)
}

/**
 * Create the Y-Axis SVG and scale for basal graph
 *
 * Also returns the raw basal rate extent it computed, so callers building the basal guidelines
 * (see getBasalGuidelines) can reuse it instead of re-scanning the same basal array.
 */
export const createYAxisBasal = (
  tidelineData: MedicalDataService,
  pool: PoolHeight
): YAxisScale<d3.ScalePower<number, number>> & { extent: [number | undefined, number | undefined] } => {
  const extent = d3.extent(tidelineData.medicalData.basal, (d) => d.rate)
  const scale = createScaleBasal(extent[1] ?? 0, pool)
  const axis = createHiddenAxis(scale)

  return { axis, scale, extent }
}

const createScaleIob = (maxIobValue: number, pool: PoolHeight): d3.ScaleLinear<number, number> => {
  const domain: [number, number] = [0, maxIobValue * IOB_SCALE_HEADROOM_RATIO]
  const range: [number, number] = [pool.height(), 0]

  return d3.scaleLinear(domain, range)
}

/**
 * Create the Y-Axis SVG and scale for the IOB graph
 *
 * Also returns the max IOB value it computed, so callers building the IOB guidelines
 * (see getIobGuidelines) can reuse it instead of recomputing it from the same pump settings.
 */
export const createYAxisIob = (
  tidelineData: MedicalDataService,
  pool: PoolHeight
): YAxisScale<d3.ScaleLinear<number, number>> & { maxIobValue: number } => {
  const maxIobValue = getMaxIobValue(tidelineData.medicalData)
  const scale = createScaleIob(maxIobValue, pool)
  const axis = createHiddenAxis(scale)

  return { axis, scale, maxIobValue }
}
