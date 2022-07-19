import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import { VictoryLabel } from 'victory'

const BgBarLabel = props => {
  const {
    barWidth,
    domain,
    scale = {
      x: _.noop,
      y: _.noop
    },
    style
  } = props

  const labelStyle = _.assign({}, style, {
    pointerEvents: 'none'
  })

  return (
    <g className="bgBarLabel">
      <VictoryLabel
        {...props}
        renderInPortal={false}
        style={labelStyle}
        textAnchor="end"
        verticalAnchor="middle"
        dy={-(barWidth / 2 - 1)}
        x={scale.y(domain.x[1])}
      />
    </g>
  )
}

BgBarLabel.propTypes = {
  barWidth: PropTypes.number.isRequired,
  bgPrefs: PropTypes.object,
  domain: PropTypes.object.isRequired,
  scale: PropTypes.object,
  text: PropTypes.func,
  y: PropTypes.number,
  style: PropTypes.object,
  tooltipText: PropTypes.func
}

BgBarLabel.displayName = 'BgBarLabel'

export default BgBarLabel
