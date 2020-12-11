const dt = require('../../data/util/datetime');

var utils = {

  xPos: function(d, opts){ 
    return opts.xScale(Date.parse(d.normalTime)) + 1;
  },

  calculateWidth: function(d, opts) {
    const s = Date.parse(d.normalTime);
    const units = d.duration.units;
    let msfactor = 1000;
    switch (units) {
    case 'minutes':
      msfactor *= 60;
      break;
    case 'hours':
      msfactor *= 60 * 60;
      break;
    }
    const e = Date.parse(dt.addDuration(s, d.duration.value * msfactor));
    return opts.xScale(e) - opts.xScale(s) - 1;
  }

}

module.exports = utils;