tideline
========

D3.js-based library rendering the daily timeline chart of YourLoops. Originally forked from [Tidepool's tideline](https://github.com/tidepool-org/tideline), it has been reduced to the code still used by the daily view.

The chart is progressively being migrated to React components in the `dumb` package.

## Usage

tideline is consumed inside this monorepo as an npm workspace:

```javascript
import { chartDailyFactory } from 'tideline'

// load styles
import 'tideline/css/tideline.less'
```

- `chartDailyFactory` is used by `packages/blip/app/components/chart/daily.js`.
- `tideline.less` is imported by `packages/yourloops/components/patient-data/patient-data.tsx`.

## Dependencies

At runtime, tideline imports [D3.js](https://d3js.org/), [Lodash](https://lodash.com/), [Moment Timezone](https://momentjs.com/timezone/), [i18next](https://www.i18next.com/), [Bows](https://github.com/latentflip/bows), `events`, and the `dumb` and `medical-domain` workspaces.

## Testing

tideline has no unit tests: its `test` script is a no-op. The daily chart is covered by the `yourloops` integration tests.

## Repository Organization

- `css/` contains the Less styles. `tideline.less` provides the styles and imports `tideline-colors.less` (color variables) and `tideline-breakpoints.less` (media query breakpoints).
- `js/` contains the library:
  - `index.js` is the package entry point and exports `chartDailyFactory`.
  - `oneday.js` creates the horizontal scrolling timeline showing twenty-four hours of data at a time.
  - `pool.js` defines a *pool*: a horizontal section of the chart plotting one or more data types against the shared x-axis.
  - `plot/util/legend.js` draws the legends of the pools that require one.
- `plugins/blip/chartdailyfactory.js` assembles the one-day chart and its pools for the daily view.

## Code Conventions

SVG element IDs use `camelCase`, with different parts of the ID separated by an underscore `_`. Class names are lowercase, prefixed with `d3`, and use a hyphen `-` as a separator.

Because SVG has no concept of z-index, elements are layered in the order they appear in the document. tideline groups elements with `<g>` tags to control this layering, so the order of the groups is significant.
