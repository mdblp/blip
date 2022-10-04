import React, { FunctionComponent } from 'react'
import { Bar, Rect } from 'victory'

import colors from '../../styles/colors.css'

interface HoverBarProps {
  alignment: string
  barSpacing: number
  barWidth: number
  cornerRadius: { topLeft: number, bottomLeft: number, topRight: number, bottomRight: number, top: number }
  chartLabelWidth: number
  data: []
  datum: { x: number, y: number, id: string }
  domain: number
  events: {}
  horizontal: boolean
  index: number
  scale: { x: Function, y: Function }
  style: {}
  width: number
  x: number
  y: number
  y0: number
}

export const HoverBar: FunctionComponent<HoverBarProps> = (props: HoverBarProps) => {
  const {
    alignment,
    barSpacing,
    barWidth,
    cornerRadius,
    chartLabelWidth,
    data,
    datum,
    domain,
    events,
    horizontal,
    index,
    scale,
    style,
    width,
    x,
    y,
    y0
  } = props

  const barGridWidth = barWidth / 6
  const barGridRadius = cornerRadius.top ?? 2
  const widthCorrection = (width - chartLabelWidth) / width

  return (
    <g className="HoverBar">
      <g className="HoverBarTarget">
        <Rect
          events={events}
          x={0}
          y={scale.x(index + 1) - (barWidth / 2) - (barSpacing / 2)}
          rx={barGridRadius}
          ry={barGridRadius}
          width={scale.y(domain)}
          height={barWidth + barSpacing}
          style={{
            stroke: 'transparent',
            fill: 'transparent'
          }}
        />
      </g>
      <g className="barBg">
        <Rect
          events={events}
          x={0}
          y={scale.x(index + 1) - (barGridWidth / 2)}
          rx={barGridRadius}
          ry={barGridRadius}
          width={scale.y(domain) - chartLabelWidth}
          height={barGridWidth}
          style={{
            stroke: 'transparent',
            fill: colors.axis
          }}
        />
      </g>
      <Bar
        alignment={alignment}
        barWidth={barWidth}
        cornerRadius={cornerRadius}
        data={data}
        datum={datum}
        events={events}
        horizontal={horizontal}
        scale={scale}
        style={style}
        width={scale.y(domain) - chartLabelWidth}
        x={x}
        y={y * widthCorrection}
        y0={y0}
      />
    </g>
  )
}
