import _ from 'lodash'
import hypoglycemiaEventIcon from 'hypoglycemia-event.svg'
import utils from './util/utils'

const D3_HYPOGLYCEMIA_ID = 'hypoglycemia'

function plotHypoglycemiaEvent(pool, opts) {
  const d3 = window.d3
  const height = pool.height() / 5
  const width = 40

  const plotTooltip = (selection, selector) => {
    selection.selectAll(selector).on('mouseover', function () {
      opts.onHypoglycemiaEventHover({
        data: d3.select(this).datum(),
        rect: utils.getTooltipContainer(this)
      })
    })

    selection.selectAll(selector).on('mouseout', opts.onHypoglycemiaEventOut)
  }

  return (selection) => {
    opts.xScale = pool.xScale().copy()

    selection.each(function() {
      // TODO Update data retrieval
      const hypoglycemiaEvents = pool.filterDataForRender(opts.tidelineData.medicalData.warmUps)
      const hypoglycemiaEventGroupSelector = `d3-${D3_HYPOGLYCEMIA_ID}-group`

      console.log(`Found ${hypoglycemiaEvents.length} events for hypo`)
      if (hypoglycemiaEvents.length < 1) {
        d3.select(this).selectAll(`g.${hypoglycemiaEventGroupSelector}`).remove()
        return
      }

      const allHypoglycemiaEvents = d3
          .select(this)
          .selectAll(`circle.d3-${D3_HYPOGLYCEMIA_ID}`)
          .data(hypoglycemiaEvents, (data) => data.id)

      const hypoglycemiaEventGroup = allHypoglycemiaEvents
          .enter()
          .append('g')
          .attr({
            class: hypoglycemiaEventGroupSelector,
            id: (d) => `${D3_HYPOGLYCEMIA_ID}_group_${d.id}`
          })

      hypoglycemiaEventGroup.append('image').attr({
        'x': (d) => opts.xScale(d.epoch),
        'y': _.constant(0),
        width,
        height,
        // TODO Update image
        // 'xlink:href': hypoglycemiaEventIcon
        'xlink:href': hypoglycemiaEventIcon
      })

      allHypoglycemiaEvents.exit().remove()

      plotTooltip(selection, hypoglycemiaEventGroupSelector)
    })
  }
}

export default plotHypoglycemiaEvent
