import _ from 'lodash'
import * as d3 from 'd3'
import eatingShortlyEventIcon from 'eating-shortly.svg'
import utils from './util/utils'

function plotEatingShortlyEvent(pool, opts) {
  var defaults = {
    r: 14,
    padding: 4
  }

  _.defaults(opts, defaults)

  var xPos = function (d) {
    return opts.xScale(d.epoch)
  }


  function eatingShortlyEvent(selection) {
    var yPos = opts.r + opts.padding
    opts.xScale = pool.xScale().copy()
    const height = 24
    const width = 24
    const imageCenterY = 6

    selection.each(function () {
      const filteredData = opts.tidelineData.medicalData.eatingShortlyEvents

      if (filteredData.length < 1) {
        // Remove previous data
        d3.select(this).selectAll('g.d3-eating-shortly-group').remove()
        return
      }

      const allEatingShortly = d3
        .select(this)
        .selectAll('circle.d3-eating-shortly')
        .data(filteredData, (d) => d.id)
      const eatingShortlyGroup = allEatingShortly.enter()
        .append('g')
        .classed('d3-eating-shortly-group', true)
        .attr('id', (d) => `eating_shortly_event_${d.id}`)
        .attr('data-testid', (d) => `eating_shortly_event_${d.id}`)

      eatingShortlyGroup
        .append('circle')
        .classed('d3-circle-eating-shortly', true)
        .attr('id', (d) => `eating_shortly_circle_${d.id}`)
        .attr('cx', xPos)
        .attr('cy', yPos)
        .attr('r', opts.r)
        .attr('stroke-width', 0)

      eatingShortlyGroup.append('image')
        .attr('x', (d) => xPos(d) - (width / 2))
        .attr('y', imageCenterY)
        .attr('width', width)
        .attr('height', height)
        .attr('href', eatingShortlyEventIcon)

      selection.selectAll('.d3-eating-shortly-group').on('mouseover', function () {
        opts.onEatingShortlyHover({
          data: d3.select(this).datum(),
          rect: utils.getTooltipContainer(this)
        })
      })

      selection.selectAll('.d3-eating-shortly-group').on('mouseout', function () {
        opts.onEatingShortlyOut()
      })
    })
  }

  return eatingShortlyEvent
}

export default plotEatingShortlyEvent
