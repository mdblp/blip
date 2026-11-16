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
import { MGDL_UNITS, MMOLL_UNITS } from 'medical-domain'
import { plotBasalLabel, plotBgLabel, plotBolusLabel, plotEventsLabel, plotIobLabel } from './labels'
import { type LabelsLayerPool } from '../../../../models/plot-methods/labels-layer-pool.model'

describe('labels', () => {
  const AXIS_GUTTER = 35
  const POOL_ID = 'poolTest'

  /** Build a mocked pool, laid out in the chart's labels layer */
  const setup = (): Omit<LabelsLayerPool, 'width'> => {
    const mainGroup = d3.select(document.body).append('svg').append('g')
    mainGroup.append('g').attr('id', 'tidelineLabels')

    return {
      id: jest.fn().mockReturnValue(POOL_ID),
      yPosition: jest.fn().mockReturnValue(100),
      parent: jest.fn().mockReturnValue(mainGroup)
    }
  }

  const getLabel = (): HTMLElement => document.getElementById(`${POOL_ID}_label`)!

  const getSpans = (): { text: string | null, className: string | null }[] => {
    return Array.from(getLabel().querySelectorAll('tspan')).map((span) => ({
      text: span.textContent,
      className: span.getAttribute('class')
    }))
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should draw the label in the axis gutter, following its baseline, with one tspan per span', () => {
    plotBolusLabel(setup(), AXIS_GUTTER, { baseline: 22 })

    const label = getLabel()
    expect(label.getAttribute('data-testid')).toBe('poolTest-chart-label')
    expect(label.getAttribute('class')).toBe('d3-pool-label')
    expect(label.getAttribute('transform')).toBe('translate(35,78)')

    const spanIds = Array.from(label.querySelectorAll('tspan')).map((span) => span.getAttribute('id'))
    expect(spanIds).toEqual(['poolTest_label_span_0', 'poolTest_label_span_1', 'poolTest_label_span_2', 'poolTest_label_span_3'])
  })

  it('should draw the events label', () => {
    plotEventsLabel(setup(), AXIS_GUTTER, { baseline: 4 })

    expect(getSpans()).toEqual([{ text: 'Events', className: 'label-main' }])
  })

  it('should draw the glucose label with the mg/dL unit', () => {
    plotBgLabel(setup(), AXIS_GUTTER, { baseline: 4, bgUnits: MGDL_UNITS })

    expect(getSpans()).toEqual([
      { text: 'Glucose', className: 'label-main' },
      { text: ' (mg/dL)', className: 'label-light' }
    ])
  })

  it('should draw the glucose label with the mmol/L unit', () => {
    plotBgLabel(setup(), AXIS_GUTTER, { baseline: 4, bgUnits: MMOLL_UNITS })

    expect(getLabel().textContent).toBe('Glucose (mmol/L)')
  })

  it('should draw the bolus & carbohydrates label', () => {
    plotBolusLabel(setup(), AXIS_GUTTER, { baseline: 4 })

    expect(getSpans()).toEqual([
      { text: 'Bolus', className: 'label-main' },
      { text: ' (U)', className: 'label-light' },
      { text: ' & Carbohydrates', className: 'label-main' },
      { text: ' (g)', className: 'label-light' }
    ])
  })

  it('should draw the basal rates label', () => {
    plotBasalLabel(setup(), AXIS_GUTTER, { baseline: 4 })

    expect(getSpans()).toEqual([
      { text: 'Basal Rates', className: 'label-main' },
      { text: ' (U/h)', className: 'label-light' }
    ])
  })

  it('should draw the active insulin label', () => {
    plotIobLabel(setup(), AXIS_GUTTER, { baseline: 4 })

    expect(getSpans()).toEqual([
      { text: 'Active insulin', className: 'label-main' },
      { text: ' (U)', className: 'label-light' }
    ])
  })
})
