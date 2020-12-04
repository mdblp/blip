/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
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

const _ = require('lodash');

const commonbolus = require('./commonbolus');

const BolusTypes = {
  meal: 1,
  micro: 2,
  manual: 3,
};

/**
 * @param {object} b The bolus or wizard
 * @returns {number} The type of bolus
 */
function bolusToLegend(b) {
  if (b.type === 'wizard') {
    return BolusTypes.meal;
  }
  const bolus = commonbolus.getBolus(b);
  if (bolus.presciptor === 'manual') {
    return BolusTypes.manual;
  }
  return BolusTypes.micro;
}

/**
 * @param {object} b The bolus or wizard
 * @param {string} baseClass default/prepend class
 * @return {string} The SVG class
 */
function bolusClass(b, baseClass) {
  switch (bolusToLegend(b)) {
    case BolusTypes.manual:
      return `${baseClass} d3-bolus-manual`;
    case BolusTypes.meal:
      return `${baseClass} d3-bolus-meal`;
    case BolusTypes.micro:
      return `${baseClass} d3-bolus-micro`;
    }
    return baseClass;
}

module.exports = function(pool, opts = {}) {
  const defaults = {
    width: 12,
    r: 14,
    suspendMarkerWidth: 5,
    markerHeight: 2,
    triangleHeight: 4,
    triangleOffset: 4,
    bolusStroke: 2,
    triangleSize: 6,
    carbPadding: 4,
    timezoneAware: false,
    tooltipHeightAddition: 3,
    tooltipPadding: 20
  };

  _.defaults(opts, defaults);

  const halfWidth = opts.width / 2;
  var top = opts.yScale.range()[0];
  var mainGroup = pool.parent();

  const pluckBolus = commonbolus.getBolus;

  var xPosition = function(d) {
    var x = opts.xScale(Date.parse(d.normalTime)) - halfWidth;
    return x;
  };
  var computePathHeight = function(d) {
    var base = opts.yScale(d.extended) + opts.bolusStroke / 2;
    if (d.extended === 0) {
      return base - opts.bolusStroke;
    }
    return base;
  };

  var triangleLeft = function(x) { return x + halfWidth - opts.triangleOffset; };
  var triangleRight = function(x) { return x + halfWidth + opts.triangleOffset; };
  var triangleMiddle = function(x) { return x + halfWidth; };

  var extendedTriangle = function(x, y) {
    var top = (x + opts.triangleSize) + ' ' + (y + opts.triangleSize/2);
    var bottom = (x + opts.triangleSize) + ' ' + (y - opts.triangleSize/2);
    var point = x + ' ' + y;
    return 'M' + top + 'L' + bottom + 'L' + point + 'Z';
  };

  var underrideTriangle = function(x, y) {
    return triangleLeft(x) + ',' + (y + opts.markerHeight/2) + ' ' +
      triangleMiddle(x) + ',' + (y + opts.markerHeight/2 + opts.triangleHeight) + ' ' +
      triangleRight(x) + ',' + (y + opts.markerHeight/2);
  };

  var overrideTriangle = function(x, y) {
    return triangleLeft(x) + ',' + (y + opts.markerHeight/2) + ' ' +
      triangleMiddle(x) + ',' + (y + opts.markerHeight/2 - opts.triangleHeight) + ' ' +
      triangleRight(x) + ',' + (y + opts.markerHeight/2);
  };

  return {
    carb: function(carbs) {
      var xPos = function(d) {
        return xPosition(d) + halfWidth;
      };

      var yPos = function(d) {
        var r = opts.yScaleCarbs ? opts.yScaleCarbs(d.carbInput) : opts.r;

        var bolusValue = d.bolus ? commonbolus.getMaxValue(d) : 0;

        return opts.yScale(bolusValue) - r - (bolusValue ? opts.carbPadding : 0);
      };

      carbs.append('circle')
        .attr({
          cx: xPos,
          cy: yPos,
          r: function(d) {
            return opts.yScaleCarbs ? opts.yScaleCarbs(d.carbInput) : opts.r;
          },
          'stroke-width': 0,
          'class': 'd3-circle-carbs d3-carbs',
          id: function(d) {
            return 'carbs_' + d.id;
          }
        });

      carbs.append('text')
        .text(function(d) {
          return d.carbInput;
        })
        .attr({
          x: xPos,
          y: yPos,
          'class': 'd3-carbs-text'
        });
    },
    bolus: function(boluses) {
      // delivered amount of bolus
      boluses.append('rect')
        .attr({
          x: function(d) {
            d = pluckBolus(d);
            return xPosition(d);
          },
          y: function(d) {
            return opts.yScale(commonbolus.getDelivered(d));
          },
          width: (d) => {
            if (bolusToLegend(d) === BolusTypes.micro) {
              return opts.width / 2;
            }
            return opts.width;
          },
          height: function(d) {
            return top - opts.yScale(commonbolus.getDelivered(d));
          },
          'class': (b) => bolusClass(b, 'd3-bolus d3-rect-bolus'),
          id: function(d) {
            d = pluckBolus(d);
            return 'bolus_' + d.id;
          }
        });
    },
    suspended: function(suspended) {
      // draw color in the suspended portion
      suspended.append('rect')
        .attr({
          x: function(d) {
            d = pluckBolus(d);
            return xPosition(d);
          },
          y: function(d) {
            return opts.yScale(commonbolus.getMaxValue(d));
          },
          width: (d) => {
            if (bolusToLegend(d) === BolusTypes.micro) {
              return opts.width / 2;
            }
            return opts.width;
          },
          height: (b) => {
            const d = commonbolus.getDelivered(b);
            const m = commonbolus.getMaxValue(b);
            return opts.yScale(d) - opts.yScale(m);
          },
          'class': 'd3-rect-suspended-bolus d3-bolus',
          'id': (b) => `${b.type}_suspended_${b.id}`,
        });

      // draw the line
      // suspended.append('rect')
      //   .attr({
      //     x: function(d) {
      //       d = pluckBolus(d);
      //       return xPosition(d);
      //     },
      //     y: function(d) {
      //       if (commonbolus.getDelivered(d) === 0) {
      //         return opts.yScale(0) - opts.markerHeight;
      //       }
      //       return opts.yScale(commonbolus.getDelivered(d));
      //     },
      //     width: (d) => {
      //       if (bolusToLegend(d) === BolusTypes.micro) {
      //         return opts.width / 2;
      //       }
      //       return opts.width;
      //     },
      //     height: opts.markerHeight,
      //     'class': 'd3-rect-suspended d3-bolus'
      //   });
    },
    underride: function(underride) {
      underride = underride.filter(function(d) {
        return commonbolus.getDelivered(d) > 0;
      });
      underride.append('rect')
        .attr({
          x: function(d) {
            d = pluckBolus(d);
            return xPosition(d);
          },
          y: function(d) {
            return opts.yScale(commonbolus.getRecommended(d));
          },
          width: (d) => {
            if (bolusToLegend(d) === BolusTypes.micro) {
              return opts.width / 2;
            }
            return opts.width;
          },
          height: function(d) {
            return opts.yScale(commonbolus.getDelivered(d)) - opts.yScale(commonbolus.getRecommended(d));
          },
          'class': 'd3-rect-recommended d3-bolus',
          id: function(d) {
            d = pluckBolus(d);
            return 'bolus_' + d.id;
          }
        });

      // draw the line iff the programmed and delivered are the same
      // to avoid too much confusing clutter
      // tooltip still exposes fact that suggested and programmed differed
      var uninterrupted = underride.filter(function(d) {
        return commonbolus.getProgrammed(d) === commonbolus.getDelivered(d);
      });
      uninterrupted.append('rect')
        .attr({
          x: function(d) {
            d = pluckBolus(d);
            return xPosition(d);
          },
          y: function(d) {
            return opts.yScale(commonbolus.getDelivered(d));
          },
          width: (d) => {
            if (bolusToLegend(d) === BolusTypes.micro) {
              return opts.width / 2;
            }
            return opts.width;
          },
          height: opts.markerHeight,
          'class': 'd3-rect-override d3-bolus'
        });

      uninterrupted.append('polygon')
        .attr({
          x: function(d) {
            d = pluckBolus(d);
            return xPosition(d);
          },
          y: function(d) {
            return opts.yScale(commonbolus.getDelivered(d));
          },
          points: function(d) {
            var bolus = pluckBolus(d);
            return underrideTriangle(xPosition(bolus), opts.yScale(commonbolus.getDelivered(d)));
          },
          'class': 'd3-polygon-override d3-bolus'
        });
    },
    override: function(override) {
      // draw the line iff the programmed and delivered are the same
      // to avoid too much confusing clutter
      // tooltip still exposes fact that suggested and programmed differed
      var uninterrupted = override.filter(function(d) {
        return commonbolus.getProgrammed(d) === commonbolus.getDelivered(d);
      });
      uninterrupted.append('rect')
        .attr({
          x: function(d) {
            d = pluckBolus(d);
            return xPosition(d);
          },
          y: function(d) {
            return opts.yScale(commonbolus.getRecommended(d)) - opts.markerHeight;
          },
          width: (d) => {
            if (bolusToLegend(d) === BolusTypes.micro) {
              return opts.width / 2;
            }
            return opts.width;
          },
          height: opts.markerHeight,
          'class': 'd3-rect-override d3-bolus'
        });

      uninterrupted.append('polygon')
        .attr({
          x: function(d) {
            d = pluckBolus(d);
            return xPosition(d);
          },
          y: function(d) {
            return opts.yScale(commonbolus.getRecommended(d)) - opts.markerHeight;
          },
          points: function(d) {
            var bolus = pluckBolus(d);
            return overrideTriangle(xPosition(bolus), opts.yScale(commonbolus.getRecommended(d)) - opts.markerHeight);
          },
          'class': 'd3-polygon-override d3-bolus'
        });
    },
    extended: function(extended) {
      // extended "arm" of square- and dual-wave boluses
      extended.append('path')
        .attr({
          d: function(d) {
            d = pluckBolus(d);
            var rightEdge = xPosition(d) + opts.width;
            var doseHeight = computePathHeight(d);
            var doseEnd = opts.xScale(Date.parse(d.normalTime) + commonbolus.getMaxDuration(d));
            return 'M' + rightEdge + ' ' + doseHeight + 'L' + doseEnd + ' ' + doseHeight;
          },
          'stroke-width': opts.bolusStroke,
          'class': 'd3-path-extended d3-bolus',
          id: function(d) {
            d = pluckBolus(d);
            return 'bolus_' + d.id;
          }
        });

      // triangle
      extended.append('path')
        .attr({
          d: function(d) {
            d = pluckBolus(d);
            var doseHeight = computePathHeight(d);
            var doseEnd = opts.xScale(Date.parse(d.normalTime) + commonbolus.getMaxDuration(d)) - opts.triangleSize;
            return extendedTriangle(doseEnd, doseHeight);
          },
          'stroke-width': opts.bolusStroke,
          'class': function(d) {
            d = pluckBolus(d);

            if (d.expectedExtended) {
              return 'd3-path-extended-triangle-suspended d3-bolus';
            }

            return 'd3-path-extended-triangle d3-bolus';
          },
          id: function(d) {
            d = pluckBolus(d);
            return 'bolus_' + d.id;
          }
        });
    },
    extendedSuspended: function(suspended) {
      // red marker indicating where suspend happened
      suspended.append('path')
        .attr({
          d: function(d) {
            d = pluckBolus(d);
            var doseHeight = computePathHeight(d);
            var rightEdge = opts.xScale(Date.parse(d.normalTime) + d.duration);
            var pathEnd = rightEdge + opts.suspendMarkerWidth;

            return 'M' + rightEdge + ' ' + doseHeight + 'L' + pathEnd + ' ' + doseHeight;
          },
          'stroke-width': opts.bolusStroke,
          'class': 'd3-path-suspended d3-bolus'
        });

      // now, light-blue path representing undelivered extended bolus
      suspended.append('path')
        .attr({
          d: function(d) {
            d = pluckBolus(d);
            var doseHeight = computePathHeight(d);
            var pathEnd = opts.xScale(Date.parse(d.normalTime) + d.duration) + opts.suspendMarkerWidth;
            var doseEnd = opts.xScale(Date.parse(d.normalTime) + d.expectedDuration);

            return 'M' + pathEnd + ' ' + doseHeight + 'L' + doseEnd + ' ' + doseHeight;
          },
          'stroke-width': opts.bolusStroke,
          'class': 'd3-path-extended-suspended d3-bolus',
          id: function(d) {
            d = pluckBolus(d);
            return 'bolus_' + d.id;
          }
        });
    },
    tooltip: {
      add: function(d, rect) {
        if (_.get(opts, 'onBolusHover', false)) {
          opts.onBolusHover({
            data: d,
            rect: rect
          });
        }
      },
      remove: function(d) {
        if (_.get(opts, 'onBolusOut', false)){
          opts.onBolusOut({
            data: d
          });
        }
      }
    },
    annotations: function(data /*, selection */) {
      _.forEach(data, function(d) {
        var annotationOpts = {
          x: opts.xScale(Date.parse(d.normalTime)),
          y: opts.yScale(commonbolus.getMaxValue(d)),
          xMultiplier: -2,
          yMultiplier: 1,
          d: d,
          orientation: {
            up: true
          }
        };
        if (mainGroup.select('#annotation_for_' + d.id)[0][0] == null) {
          mainGroup.select('#tidelineAnnotations_bolus').call(pool.annotations(), annotationOpts);
        }
      });
    }
  };
};
