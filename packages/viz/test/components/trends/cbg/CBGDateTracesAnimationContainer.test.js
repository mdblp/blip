/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
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

import _ from 'lodash'
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import * as sinon from 'sinon'

import bgBounds from '../../../helpers/bgBounds'

import CBGDateTracesAnimationContainer from '../../../../src/components/trends/cbg/CBGDateTracesAnimationContainer'
import { CbgDateTracesAnimated } from 'dumb'

describe('CBGDateTracesAnimationContainer', () => {
  const props = {
    bgBounds,
    data: {
      '2016-12-25': [],
      '2017-01-01': []
    },
    dates: ['2016-12-25', '2017-01-01'],
    xScale: sinon.stub(),
    yScale: sinon.stub()
  }

  it('should render a group even if there are no dates or data', () => {
    const noDataProps = _.assign({}, props, { data: {}, dates: [] })
    const wrapper = shallow(<CBGDateTracesAnimationContainer {...noDataProps} />)
    expect(wrapper.find('#cbgDateTraces')).to.have.length(1)
    expect(wrapper.find(CbgDateTracesAnimated)).to.have.length(0)
  })

  it('should render a group and a CBGDateTraceAnimated for each date', () => {
    const wrapper = shallow(<CBGDateTracesAnimationContainer {...props} />)
    expect(wrapper.find('#cbgDateTraces')).to.have.length(1)
    expect(wrapper.find(CbgDateTracesAnimated)).to.have.length(2)
  })
})
