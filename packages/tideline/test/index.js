/*
 * Copyright (c) 2014-2022, Diabeloop
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

import enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import moment from 'moment-timezone'

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true
})

window.d3 = require('d3')
window.d3.chart = require('d3.chart')

moment.locale('en')

// DOM not required
// ====================================

/* js/data/ */
import './format.test'
import './datetime.test'
import './constants.test'
import './tidelinedata.test'
import './basalutil.test'
import './categorize.test'

/* js/plot/ */
import './annotations.test'
import './commonbolus.test'
import './device.test'

// DOM required
// ====================================

/* plugins/ */
import './chartbasicsfactory.test'
import './basics_classifiers.test'
import './basics_datamunger.test'
import './nurseshark.test'

import './blip/components/day/hover/InfusionHoverDisplay.test.js'
import './blip/components/logic/actions.test.js'
import './blip/components/sitechange/Selector.test.js'
import './blip/components/BasicsUtils.test.js'
import './blip/components/CalendarContainer.test.js'
