import React, { FunctionComponent } from 'react'
import { TextSize, VictoryLabel, VictoryTooltip } from 'victory'
import colors from '../../styles/colors.css'

interface HoverBarLabelProps {
  active: boolean
  barWidth: number
  data: []
  datum: { x: number, y: number, id: string }
  domain: number
  events: {}
  horizontal: boolean
  labelPlacement: string
  isDisabled: boolean
  scale: { x: Function, y: Function}
  style: { fontSize: number, paddingLeft: number }
  text: Function
  tooltipText: Function
  y: number
}

export const HoverBarLabel: FunctionComponent<HoverBarLabelProps> = (props: HoverBarLabelProps) => {
  const {
    active,
    barWidth,
    data,
    datum,
    domain,
    events,
    horizontal,
    labelPlacement,
    isDisabled,
    scale,
    style,
    text,
    tooltipText,
    y
  } = props

  const tooltipFontSize = barWidth / 2 < 12 ? barWidth / 2 : 12

  const tooltipHeight = tooltipFontSize * 1.2
  const tooltipRadius = tooltipHeight / 2
  const tooltipStyle = {
    ...style,
    fontSize: tooltipFontSize,
    display: isDisabled ? 'none' : 'inherit'
  }

  const tooltipTextSize = TextSize.approximateTextSize(tooltipText(datum), tooltipStyle)

  const labelStyle = {
    ...style,
    pointerEvents: 'none'
  }

  const labelUnitsStyle = {
    ...labelStyle,
    fontSize: labelStyle.fontSize / 2,
    baselineShift: -((labelStyle.fontSize / 2) * 0.25),
    fill: colors.statDefault
  }

  const labelText = text(datum)
  const labelUnitsTextSize = TextSize.approximateTextSize(labelText[1] || '', labelUnitsStyle)

  const tooltipDatum = {
    ...datum,
    y: datum.y > 0 ? datum.y : 0
  }
  return (
    <g className="HoverBarLabel" data-testid={`hover-bar-${datum.id}`}>
      <VictoryLabel
        active={active}
        data={data}
        datum={tooltipDatum}
        dx={-(labelUnitsTextSize.width * 1.9)}
        events={events}
        labelPlacement={labelPlacement}
        renderInPortal={false}
        style={labelStyle}
        text={labelText[0]}
        textAnchor="end"
        verticalAnchor="middle"
        x={scale.y(domain)}
        y={y}
      />
      <VictoryLabel
        active={active}
        data={data}
        datum={tooltipDatum}
        dx={0}
        events={events}
        labelPlacement={labelPlacement}
        renderInPortal={false}
        style={labelUnitsStyle}
        text={labelText[1]}
        textAnchor="end"
        verticalAnchor="middle"
        x={scale.y(domain)}
        y={y}
      />
      {tooltipTextSize.width > 0 && (
        <VictoryTooltip
          active={active}
          barWidth={barWidth}
          cornerRadius={tooltipRadius}
          data={data}
          datum={tooltipDatum}
          domain={domain}
          events={events}
          flyoutStyle={{
            display: isDisabled ? 'none' : 'inherit',
            stroke: colors.axis,
            strokeWidth: 2,
            fill: colors.white
          }}
          height={tooltipHeight}
          horizontal={horizontal}
          pointerLength={0}
          pointerWidth={0}
          renderInPortal={false}
          style={tooltipStyle}
          text={tooltipText}
          width={+tooltipTextSize.width + (tooltipRadius * 2)}
          x={scale.y(domain) - style.paddingLeft - tooltipTextSize.width - (tooltipRadius * 2)}
          y={y}
        />
      )}
    </g>
  )
}
