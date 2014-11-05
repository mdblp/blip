var _ = require('lodash');
var crossfilter = require('crossfilter');
var d3 = window.d3;
var EventEmitter = require('events').EventEmitter;

d3.chart('Brush', {
  initialize: function() {
    var chart = this;

    this.width = this.base.attr('width');
    this.height = this.base.attr('height');

    this.base.append('g').attr('id', 'brushMainGroup');
  },
  emitter: function(emitter) {
    if (!arguments.length) { return this._emitter; }
    this._emitter = emitter;
    return this;
  },
  initialExtent: function(initialExtent) {
    if (!arguments.length) { return this._initialExtent; }
    this._initialExtent = initialExtent;
    return this;
  },
  margins: function(margins) {
    if (!arguments.length) { return this._margins; }
    this._margins = margins;
    return this;
  },
  setExtent: function(newExtent) {
    this.brushHandleGroup.call(this.brush.extent(newExtent));
    this.fixBrushHandlers(this.brushHandleGroup);
    return this;
  },
  xScale: function(xScale) {
    if (!arguments.length) { return this._xScale; }
    var w = this.width;
    var mainMargins = this.margins().main;
    this._xScale = xScale.range([
      mainMargins.left,
      w - mainMargins.right
    ]);
    this.makeBrush();
    var domainAxis = d3.svg.axis()
      .scale(xScale)
      .orient('top')
      .ticks(d3.time.month.utc, 1)
      .tickFormat(d3.time.format.utc('%b'));
    this.base.append('g')
      .attr({
        id: 'domainAxis',
        transform: 'translate(0,' + mainMargins.top + ')'
      })
      .call(domainAxis);
    return this;
  },
  makeBrush: function() {
    var chart = this, emitter = this.emitter();
    function brushed() {
      var MS_IN_24 = 86400000;
      var origExtent = chart.brush.extent(), newExtent;
      // preserve width of handle on drag
      if (d3.event.mode === 'move') {
        var s = d3.time.day.utc.round(origExtent[0]),
          e = d3.time.day.utc.offset(s, Math.round((origExtent[1] - origExtent[0])/MS_IN_24));
        newExtent = [s, e];
      }
      // on resize, round to midnights
      else {
        newExtent = origExtent.map(d3.time.day.utc.round);

        // if empty when rounded, use floor & ceil instead
        // i.e., enforce min of 1 day
        if (newExtent[0] >= newExtent[1]) {
          newExtent[0] = d3.time.day.utc.floor(origExtent[0]);
          newExtent[1] = d3.time.day.utc.floor(origExtent[1]);
        }
      }
      emitter.emit('brushed', [newExtent[0].toISOString(), newExtent[1].toISOString()]);
      d3.select(this).call(chart.brush.extent(newExtent));
      chart.fixBrushHandlers(d3.select(this));
    }

    var xScale = this.xScale();
    var initial = chart.initialExtent();

    var extentDates = [Date.parse(initial[0]), Date.parse(initial[1])];
      
    this.brush = d3.svg.brush()
      .x(xScale)
      .extent(extentDates)
      .on('brush', brushed);

    this.brushHandleGroup = this.base.append('g')
      .attr('id', 'brushHandleGroup')
      .call(this.brush);

    this.fixBrushHandlers(this.brushHandleGroup);

    var mainMargins = this.margins().main;

    this.brushHandleGroup.select('rect.background')
      .attr({
        height: this.height - mainMargins.top - mainMargins.bottom,
        transform: 'translate(0,' + mainMargins.top + ')',
        rx: 10,
        ry: 10
      })
      .style('visibility', 'visible');

    this.brushHandleGroup.select('rect.extent')
      .attr({
        height: this.height - mainMargins.top - mainMargins.bottom,
        transform: 'translate(0,' + mainMargins.top + ')',
        rx: 10,
        ry: 10
      });
  },
  fixBrushHandlers: function(brushNode) {
    var oldMousedown = brushNode.on('mousedown.brush');
    brushNode.on('mousedown.brush', function() {
      brushNode.on('mouseup.brush', function() {
        clearHandlers();
      });

      brushNode.on('mousemove.brush', function() {
        clearHandlers();
        oldMousedown.call(this);
      });

      function clearHandlers() {
        brushNode.on('mousemove.brush', null);
        brushNode.on('mouseup.brush', null);
      }
    });
  },
  remove: function() {
    this.base.remove();
    return this;
  }
});

var chart;

module.exports = {
  create: function(el, dateDomain, opts) {
    opts = opts || {};
    var defaults = {
      baseMargin: opts.baseMargin || 10,
      brushHeight: el.offsetHeight,
      initialExtent: [d3.time.day.utc.offset(new Date(dateDomain[1]), -14), new Date(dateDomain[1])]
    };
    defaults.margins = {
      main: {
        top: defaults.baseMargin + 11,
        right: defaults.baseMargin,
        bottom: defaults.baseMargin - 5,
        left: defaults.baseMargin
      }
    };
    _.defaults(opts, defaults);

    var xScale = d3.time.scale.utc()
      .domain([
        d3.time.day.utc.floor(new Date(dateDomain[0])),
        d3.time.day.utc.ceil(new Date(dateDomain[1]))
      ]);

    chart = d3.select(el)
      .append('svg')
      .attr({
        width: el.offsetWidth,
        height: opts.brushHeight
      })
      .chart('Brush')
      .emitter(this.emitter)
      .initialExtent(opts.initialExtent)
      .margins(opts.margins)
      .xScale(xScale);

    return this;
  },
  getCurrentDay: function() {
    return new Date(chart.brush.extent()[1].valueOf() - 864e5/2);
  },
  emitter: new EventEmitter(),
  render: function(data, opts) {
    opts = opts || {};
    var defaults = {};
    _.defaults(opts, defaults);

    chart.draw();

    return this;
  },
  setExtent: function(newExtent) {
    chart.setExtent(newExtent);
  },
  destroy: function() {
    chart.remove();

    return this;
  }
};