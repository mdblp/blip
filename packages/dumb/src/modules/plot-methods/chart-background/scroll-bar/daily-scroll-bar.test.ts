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
import { type DailyScrollBarOptions, type DailyScrollBarSelection, plotDailyScrollBar } from './daily-scroll-bar'

describe('plotDailyScrollBar', () => {
  // The thumb center moves from 59 (axis gutter + thumb radius) to 1059: 100 px per day
  const start = new Date('2023-01-01T00:00:00.000Z')
  const end = new Date('2023-01-11T00:00:00.000Z')
  const atDay = (day: number): Date => new Date(start.valueOf() + day * 24 * 60 * 60 * 1000)

  const buildOptions = (options: Partial<DailyScrollBarOptions> = {}): DailyScrollBarOptions => ({
    start,
    end,
    width: 1083,
    axisGutter: 35,
    canDrag: () => true,
    onDragStart: jest.fn(),
    onDrag: jest.fn(),
    onDragEnd: jest.fn(),
    ...options
  })

  const render = (date: Date, options: DailyScrollBarOptions = buildOptions()): {
    plot: (selection: DailyScrollBarSelection) => void
    selection: DailyScrollBarSelection
  } => {
    const svg = d3.select(document.body).append('svg')
    const selection = svg.append('g').datum(date) as unknown as DailyScrollBarSelection
    const plot = plotDailyScrollBar(options)
    plot(selection)
    return { plot, selection }
  }

  const getThumb = (): HTMLElement => document.getElementById('scrollBar_thumb')!

  const dragThumb = (fromX: number, toX: number): void => {
    const thumb = getThumb()
    thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, view: window, clientX: fromX }))
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, view: window, clientX: toX }))
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, view: window, clientX: toX }))
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should draw the gutter and the thumb at the date of the view', () => {
    render(atDay(2))

    const gutter = document.getElementById('scrollBar_gutter')!
    expect(gutter.tagName).toBe('line')
    expect(gutter.getAttribute('data-testid')).toBe('scrollBar_gutter')
    expect(gutter.getAttribute('x1')).toBe('45')
    expect(gutter.getAttribute('x2')).toBe('1073')
    expect(gutter.getAttribute('stroke-width')).toBe('20')

    const thumb = getThumb()
    expect(thumb.tagName).toBe('rect')
    expect(thumb.getAttribute('class')).toBe('scrollThumb')
    expect(thumb.getAttribute('data-testid')).toBe('scrollBar_thumb')
    expect(thumb.getAttribute('x')).toBe('235')
    expect(thumb.getAttribute('y')).toBe('-8')
    expect(thumb.getAttribute('rx')).toBe('8')
    expect(thumb.getAttribute('width')).toBe('48')
    expect(thumb.getAttribute('height')).toBe('16')
  })

  it('should move the same thumb when rendered with a new date', () => {
    const { plot, selection } = render(atDay(2))
    const thumb = getThumb()

    selection.datum(atDay(7))
    plot(selection)

    expect(getThumb()).toBe(thumb)
    expect(thumb.getAttribute('x')).toBe('735')
    expect(document.querySelectorAll('line')).toHaveLength(1)
    expect(document.querySelectorAll('rect')).toHaveLength(1)
  })

  it('should keep the thumb within the bar for a date out of its range', () => {
    const { plot, selection } = render(atDay(-3))
    expect(getThumb().getAttribute('x')).toBe('35')

    selection.datum(atDay(15))
    plot(selection)
    expect(getThumb().getAttribute('x')).toBe('1035')
  })

  it('should call the drag callbacks with the date matching the thumb position', () => {
    const options = buildOptions()
    render(atDay(2), options)

    dragThumb(500, 650)

    expect(options.onDragStart).toHaveBeenCalledTimes(1)
    expect(options.onDrag).toHaveBeenCalledTimes(1)
    expect(options.onDrag).toHaveBeenCalledWith(new Date('2023-01-04T12:00:00.000Z'))
    expect(options.onDragEnd).toHaveBeenCalledTimes(1)
  })

  it('should stop the drag at both ends of the bar', () => {
    const options = buildOptions()
    render(atDay(2), options)

    dragThumb(500, -1000)
    expect(options.onDrag).toHaveBeenLastCalledWith(start)

    dragThumb(500, 5000)
    expect(options.onDrag).toHaveBeenLastCalledWith(end)
  })

  it('should not move the view while the thumb can not be dragged', () => {
    const options = buildOptions({ canDrag: () => false })
    render(atDay(2), options)

    dragThumb(500, 650)

    expect(options.onDragStart).toHaveBeenCalledTimes(1)
    expect(options.onDrag).not.toHaveBeenCalled()
    expect(options.onDragEnd).toHaveBeenCalledTimes(1)
  })

  it('should not propagate the mouse down on the thumb to the chart', () => {
    render(atDay(2))
    const chartMouseDown = jest.fn()
    document.querySelector('svg')!.addEventListener('mousedown', chartMouseDown)

    dragThumb(500, 650)

    expect(chartMouseDown).not.toHaveBeenCalled()
  })
})
