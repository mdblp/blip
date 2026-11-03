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

import * as d3 from 'd3'
import { type Bolus, BolusSubtype, DatumType, Prescriptor, type Wizard } from 'medical-domain'
import { plotMeal } from './meal'
import { type Pool } from '../../../../models/pool.model'
import { type PlotSelection } from '../../../../models/plot-selection.model'

describe('plotMeal', () => {
  const xScale = d3.scaleTime().domain([new Date(2023, 0, 1), new Date(2023, 0, 2)]).range([0, 1000])

  const buildPool = (yScale: d3.ScaleContinuousNumeric<number, number>): Pool<Wizard> => ({
    id: jest.fn().mockReturnValue('poolId'),
    xScale: jest.fn().mockReturnValue({ copy: () => xScale.copy() }),
    yScale: jest.fn().mockReturnValue(yScale),
    height: jest.fn().mockReturnValue(300),
    filterDataForRender: jest.fn((data: Wizard[]) => data),
    highlight: jest.fn().mockReturnValue({ on: jest.fn(), off: jest.fn() })
  })

  const buildWizard = (): Wizard => {
    const deliveredBolus = {
      id: 'bolus1',
      type: DatumType.Bolus,
      subType: BolusSubtype.Normal,
      prescriptor: Prescriptor.Auto,
      normal: 5,
      expectedNormal: 5
    } as Bolus

    return {
      id: 'wizard1',
      type: DatumType.Wizard,
      epoch: new Date('2023-01-01T08:00:00Z').valueOf(),
      carbInput: 30,
      bolus: deliveredBolus,
      recommended: { carb: 5, correction: 0, net: 5 }
    } as Wizard
  }

  it('repositions the meal bolus rectangle when the pool y scale is recomputed between renders', () => {
    const firstScale = d3.scaleLinear().domain([0, 10]).range([300, 0])
    const secondScale = d3.scaleLinear().domain([0, 20]).range([300, 0])

    const pool = buildPool(firstScale)
    const wizard = buildWizard()
    const svg = d3.select(document.body).append('svg')
    const g = svg.append('g').datum([wizard]) as unknown as PlotSelection<Wizard>

    // The render function is created once per pool lifetime and reused across
    // every subsequent pool.render() call - it must not cache a stale yScale.
    const plotFn = plotMeal(pool, { onElementHover: jest.fn(), onElementOut: jest.fn() })

    plotFn(g)

    // d3 selections are live references to the DOM node, so the attribute values
    // must be captured as plain strings now - re-reading the selection later would
    // reflect whatever the node looks like after the second render instead.
    const yAfterFirstRender = svg.select('rect.d3-rect-bolus').attr('y')
    const heightAfterFirstRender = svg.select('rect.d3-rect-bolus').attr('height')
    expect(yAfterFirstRender).toBe(String(firstScale(5)))
    expect(heightAfterFirstRender).toBe(String(firstScale.range()[0] - firstScale(5)))

    // Simulate the pool recomputing its Y axis on a subsequent data load.
    ;(pool.yScale as jest.Mock).mockReturnValue(secondScale)

    plotFn(g)

    const yAfterSecondRender = svg.select('rect.d3-rect-bolus').attr('y')
    const heightAfterSecondRender = svg.select('rect.d3-rect-bolus').attr('height')
    expect(yAfterSecondRender).toBe(String(secondScale(5)))
    expect(heightAfterSecondRender).toBe(String(secondScale.range()[0] - secondScale(5)))
    expect(yAfterSecondRender).not.toBe(yAfterFirstRender)
  })
})
