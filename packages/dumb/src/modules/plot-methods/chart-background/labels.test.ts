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
import { plotPoolLabel, type PoolLabel } from './labels'

describe('plotPoolLabel', () => {
  const setup = (yPosition: number, labels: PoolLabel[]): void => {
    const mainGroup = d3.select(document.body).append('svg').append('g')
    mainGroup.append('g').attr('id', 'tidelineLabels')

    const pool = {
      id: jest.fn().mockReturnValue('poolBG'),
      yPosition: jest.fn().mockReturnValue(yPosition),
      parent: jest.fn().mockReturnValue(mainGroup)
    }

    plotPoolLabel(pool, 35, labels)
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should draw one text element per label, with one tspan per span', () => {
    setup(100, [{
      spans: [
        { text: 'Glucose', className: 'label-main' },
        { text: ' (mg/dL)', className: 'label-light' }
      ],
      baseline: 4
    }])

    const label = document.getElementById('poolBG_label_0')!
    expect(label).not.toBeNull()
    expect(label.getAttribute('data-testid')).toBe('poolBG-chart-label')
    expect(label.getAttribute('class')).toBe('d3-pool-label')
    expect(label.getAttribute('transform')).toBe('translate(35,96)')
    expect(label.textContent).toBe('Glucose (mg/dL)')

    const spans = label.querySelectorAll('tspan')
    expect(spans).toHaveLength(2)
    expect(spans[0].getAttribute('id')).toBe('poolBG_label_0_span_0')
    expect(spans[0].getAttribute('class')).toBe('label-main')
    expect(spans[0].textContent).toBe('Glucose')
    expect(spans[1].getAttribute('id')).toBe('poolBG_label_0_span_1')
    expect(spans[1].getAttribute('class')).toBe('label-light')
    expect(spans[1].textContent).toBe(' (mg/dL)')
  })

  it('should draw multiple label entries with distinct transforms following their own baseline', () => {
    setup(100, [
      { spans: [{ text: 'Carbohydrates', className: 'label-main' }], baseline: 22 },
      { spans: [{ text: 'Bolus', className: 'label-main' }], baseline: 4 }
    ])

    const first = document.getElementById('poolBG_label_0')!
    const second = document.getElementById('poolBG_label_1')!
    expect(first.getAttribute('transform')).toBe('translate(35,78)')
    expect(second.getAttribute('transform')).toBe('translate(35,96)')
  })

  it('should not draw anything when labels is empty', () => {
    setup(100, [])

    expect(document.querySelectorAll('.d3-pool-label')).toHaveLength(0)
  })

  it('should not draw anything when labels is undefined', () => {
    setup(100, undefined as unknown as PoolLabel[])

    expect(document.querySelectorAll('.d3-pool-label')).toHaveLength(0)
  })
})
