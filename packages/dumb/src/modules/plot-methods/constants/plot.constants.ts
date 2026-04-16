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

/**
 * Common dimensions used across plot methods
 */
export const PLOT_DIMENSIONS = {
  /** Standard radius for circles (e.g., carbs, events) */
  COMMON_RADIUS: 14,

  /** Standard padding around elements */
  COMMON_PADDING: 4,

  /** Default margin for images to prevent clipping */
  DEFAULT_IMAGE_MARGIN: 8,

  /** Default size for icons and images */
  DEFAULT_SIZE: 30,

  /** Width for bolus rectangles */
  BOLUS_WIDTH: 12,

  /** Radius for CBG (continuous glucose) points */
  CBG_RADIUS: 2.5,

  /** Default radius increase on hover */
  HOVER_RADIUS_INCREASE: 1
} as const

/**
 * Element type identifiers used for ID generation
 */
export const ELEMENT_IDS = {
  NIGHT_MODE: 'nightMode',
  ZEN_MODE: 'zenMode',
  PHYSICAL_ACTIVITY: 'pa',
  ALARM_EVENT: 'alarmEvent',
  WARM_UP: 'warmUp',
  DEVICE_PARAMETER: 'deviceParameter',
  RESERVOIR_CHANGE: 'reservoirChange',
  CARTRIDGE_CHANGE: 'cartridgeChange',
  TIMEZONE_CHANGE: 'timechange',
  EATING_SHORTLY: 'eating_shortly',
  RESCUE_CARBS: 'carb',
  CONFIDENTIAL_MODE: 'confidentialMode',
  EVENT_SUPERPOSITION: 'eventSuperposition',
  BOLUS: 'bolus',
  WIZARD: 'wizard',
  MEAL: 'meal',
  CBG: 'cbg',
  SMBG: 'smbg',
  BASAL: 'basal'
} as const

/**
 * Common CSS class names used across plot methods
 */
export const CSS_CLASSES = {
  // Event classes
  EVENT_GROUP: 'd3-event-group',

  // Bolus classes
  BOLUS_GROUP: 'd3-bolus-group',
  BOLUS_RECT: 'd3-rect-bolus',
  BOLUS_MANUAL: 'd3-bolus-manual',
  BOLUS_MEAL: 'd3-bolus-meal',
  BOLUS_CORRECTION: 'd3-bolus-correction',
  BOLUS_PEN: 'd3-bolus-pen',
  BOLUS_EATING_SHORTLY: 'd3-bolus-eating-shortly',

  // Carb classes
  CARB_GROUP: 'd3-carb-group',
  CARB_CIRCLE: 'd3-circle-carbs',
  CARB_TEXT: 'd3-carbs-text',

  // Glucose classes
  CBG: 'd3-cbg',
  CBG_CIRCLE: 'd3-circle-cbg',
  BG_VERY_LOW: 'd3-bg-very-low',
  BG_LOW: 'd3-bg-low',
  BG_TARGET: 'd3-bg-target',
  BG_HIGH: 'd3-bg-high',
  BG_VERY_HIGH: 'd3-bg-very-high',
  BG_LOW_FOCUS: 'd3-bg-low-focus',
  BG_TARGET_FOCUS: 'd3-bg-target-focus',
  BG_HIGH_FOCUS: 'd3-bg-high-focus',

  // Zone classes
  ZONE_RECT: 'd3-rect-zone',
  NIGHT_RECT: 'd3-rect-night',
  ZEN_RECT: 'd3-rect-zen',
  PA_RECT: 'd3-rect-pa',

  // Common element classes
  CIRCLE: 'd3-circle',
  IMAGE: 'd3-image',
  TEXT: 'd3-text',
  RECT: 'd3-rect'
} as const

/**
 * Z-index values for layering elements
 */
export const Z_INDEX = {
  BACKGROUND: 0,
  ZONES: 1,
  BASALS: 2,
  BOLUSES: 3,
  GLUCOSE: 4,
  EVENTS: 5,
  TOOLTIPS: 10
} as const

