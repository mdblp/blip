/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

/* eslint-disable max-len */

import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'

import { formatClassesAsSelector } from '../../helpers/cssmodules'

import CBGTooltip from '../../../src/components/daily/cbgtooltip/CBGTooltip'
import styles from '../../../src/components/daily/cbgtooltip/CBGTooltip.css'

const bgPrefs = {
  bgClasses: {
    'very-high': { boundary: 600 },
    'high': { boundary: 300 },
    'target': { boundary: 180 },
    'low': { boundary: 70 },
    'very-low': { boundary: 54 }
  },
  bgUnits: 'mg/dL'
}

const target = {
  type: 'cbg',
  units: 'mg/dL',
  value: 100
}

const veryHigh = {
  type: 'cbg',
  units: 'mg/dL',
  value: 601,
  annotations: [
    {
      code: 'bg/out-of-range',
      value: 'high',
      threshold: 600
    }
  ]
}

const veryLow = {
  type: 'cbg',
  units: 'mg/dL',
  value: 39,
  annotations: [
    {
      code: 'bg/out-of-range',
      value: 'low',
      threshold: 40
    }
  ]
}

const props = {
  position: { top: 200, left: 200 },
  timePrefs: { timezoneAware: false },
  bgPrefs
}

const glucoseValueSelector = `${formatClassesAsSelector(styles.bg)} ${formatClassesAsSelector(styles.value)}`

describe('CBGTooltip', () => {
  it('should render without issue when all properties provided', () => {
    const wrapper = mount(<CBGTooltip {...props} cbg={target} />)
    expect(wrapper.find(formatClassesAsSelector(styles.bg))).to.have.length(1)
  })

  it('should render "High" and an annotation for a "very-high" cbg', () => {
    const wrapper = mount(<CBGTooltip {...props} cbg={veryHigh} />)
    expect(wrapper.find(formatClassesAsSelector(styles.annotation))).to.have.length(1)
    expect(wrapper.find(glucoseValueSelector).text()).to.equal('High')
  })

  it('should render "Low" and an annotation for a "very-low" cbg', () => {
    const wrapper = mount(<CBGTooltip {...props} cbg={veryLow} />)
    expect(wrapper.find(formatClassesAsSelector(styles.annotation))).to.have.length(1)
    expect(wrapper.find(glucoseValueSelector).text()).to.equal('Low')
  })
})
