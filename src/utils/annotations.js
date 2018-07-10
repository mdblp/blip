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

/*
 * Guidelines for these utilities:
 *
 * 1. Only "workhorse" functions used in 2+ places should be here.
 * 1a. A function used in only one component should just be part of that component,
 * potentially as a named export if tests are deemed important to have.
 *
 * 2. Function naming scheme: the main verb here is `get`. Start all function names with that.
 *
 * 3. Function organizational scheme in this file and tests file: alphabetical plz
 *
 * 4. Try to be consistent in how params are used:
 * (e.g., always pass in `bgPrefs`) rather than some (subset) of bgUnits and/or bgBounds
 * and try to copy & paste JSDoc @param descriptions for common params.
 *
 */

/* eslint-disable max-len */
import _ from 'lodash';

const medtronic600BGMessages = {
  'medtronic600/smbg/user-accepted-remote-bg': 'Yes',
  'medtronic600/smbg/user-rejected-remote-bg': 'No',
  'medtronic600/smbg/remote-bg-acceptance-screen-timeout': 'Timed Out',
};

const medtronic600CalibrationMessages = {
  'medtronic600/smbg/bg-sent-for-calib': 'Yes',
  'medtronic600/smbg/user-rejected-sensor-calib': 'No',
};

const simpleAnnotationMessages = {
  'animas/bolus/extended-equal-split':
    "* Animas pumps don't capture the details of how combo boluses are split between the normal and extended amounts.",
};

/**
 * getAnnotations
 *
 * @export
 * @param {Object} datum - data object potentially containing annotations
 * @returns {Array} array of annotation objects or empty array
 */
export function getAnnotations(datum) {
  return _.get(datum, 'annotations', []);
}

/**
 * getAnnotationCodes
 *
 * @export
 * @param {Object} datum - data object potentially containing annotations
 * @returns {Array} array of annotation codes or empty array
 */
export function getAnnotationCodes(datum) {
  return _.map(getAnnotations(datum), 'code');
}

/**
 * getMedtronic600AnnotationMessages
 *
 * @export
 * @param {Object} datum - data object potentially containing annotations
 * @returns {Array} array of objects with string values and labels or empty array
 */
export function getMedtronic600AnnotationMessages(datum) {
  const annotations = getAnnotations(datum);
  const annotationCodes = getAnnotationCodes(datum);
  const messages = [];
  const medtronic600BGMessage = _.intersection(_.keys(medtronic600BGMessages), annotationCodes);
  if (medtronic600BGMessage.length > 0) {
    messages.push(
      _.assign(_.find(annotations, { code: medtronic600BGMessage[0] }), {
        message: {
          label: 'Confirm BG',
          value: medtronic600BGMessages[medtronic600BGMessage[0]],
        },
      })
    );
  }
  const medtronic600CalibrationMessage = _.intersection(
    _.keys(medtronic600CalibrationMessages),
    annotationCodes
  );
  if (medtronic600CalibrationMessage.length > 0) {
    messages.push(
      _.assign(_.find(annotations, { code: medtronic600CalibrationMessage[0] }), {
        message: {
          label: 'Calibration',
          value: medtronic600CalibrationMessages[medtronic600CalibrationMessage[0]],
        },
      })
    );
  }
  return messages;
}

/**
 * getOutOfRangeAnnotationMessage
 *
 * @export
 * @param {Object} datum - data object potentially containing annotations
 * @returns {Array} array with object with string value or empty array
 */
export function getOutOfRangeAnnotationMessage(datum) {
  const annotations = getAnnotations(datum);
  const messages = [];
  _.each(annotations, annotation => {
    if (_.get(annotation, 'code', '') === 'bg/out-of-range') {
      const value = annotation.value;
      messages.push(
        _.assign(annotation, {
          message: {
            value: `* This BG value was ${value}er than your device could record. Your actual BG value is ${value}er than it appears here.`,
          },
        })
      );
    }
  });
  return messages;
}

/**
 * getAnnotationMessages
 *
 * @export
 * @param {Object} datum - data object potentially containing annotations
 * @returns {Array} array of objects with string values and potentially labels or empty array
 */
export function getAnnotationMessages(datum) {
  const annotations = getAnnotations(datum);
  let messages = [];
  messages = messages.concat(
    getMedtronic600AnnotationMessages(datum),
    getOutOfRangeAnnotationMessage(datum)
  );

  _.each(annotations, annotation => {
    const code = _.get(annotation, 'code');
    if (_.has(simpleAnnotationMessages, code)) {
      messages.push(
        _.assign(annotation, {
          message: {
            value: simpleAnnotationMessages[code],
          },
        })
      );
    }
  });
  return messages;
}
