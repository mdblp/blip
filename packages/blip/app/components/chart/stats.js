import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import bows from "bows";
import Divider from "@material-ui/core/Divider";
import { utils as vizUtils, components as vizComponents } from "tidepool-viz";

import { BG_DATA_TYPES } from "../../core/constants";

const { Stat } = vizComponents;

class Stats extends React.Component {
  static propTypes = {
    bgPrefs: PropTypes.object.isRequired,
    bgSource: PropTypes.oneOf(BG_DATA_TYPES),
    chartPrefs: PropTypes.object,
    chartType: PropTypes.oneOf(["basics", "daily", "bgLog", "trends", "deviceUsage"]).isRequired,
    dataUtil: PropTypes.object.isRequired,
    endpoints: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.log = bows("Stats");

    this.bgPrefs = {
      bgUnits: this.props.bgPrefs.bgUnits,
      bgBounds: vizUtils.bg.reshapeBgClassesToBgBounds(this.props.bgPrefs),
    };

    this.updateDataUtilEndpoints(this.props);

    this.state = {
      stats: this.getStatsByChartType(this.props),
    };
  }

  componentDidUpdate(prevProps) {
    const update = this.updatesRequired(prevProps);
    if (update) {
      if (update.dataChanged) {
        this.updateDataUtilEndpoints();
        this.updateStatData();
        this.setState({
          stats: this.getStatsByChartType(),
        });
      } else if (update.stats) {
        this.setState({
          stats: this.getStatsByChartType(),
        });
      } else if (update.endpoints) {
        this.updateDataUtilEndpoints();
        this.updateStatData();
      } else if (update.activeDays) {
        this.updateStatData();
      }
    }
  }

  updatesRequired(prevProps) {
    const {
      bgSource,
      chartType,
      endpoints,
      loading,
    } = prevProps;

    const prevActiveDays = _.get(prevProps, `chartPrefs.${chartType}`, null);
    const currActiveDays = _.get(this.props, `chartPrefs.${chartType}`, null);

    const activeDaysChanged = !_.isEqual(prevActiveDays, currActiveDays);
    const bgSourceChanged = _.isString(bgSource) && !_.isEqual(bgSource, this.props.bgSource);
    const endpointsChanged = _.isArray(endpoints) && !_.isEqual(endpoints, this.props.endpoints);
    const dataChanged = loading === true && this.props.loading === false;

    return activeDaysChanged || bgSourceChanged || endpointsChanged || dataChanged
      ? {
        activeDays: activeDaysChanged,
        endpoints: endpointsChanged,
        stats: bgSourceChanged,
        dataChanged,
      }
      : false;
  }

  renderStats(stats, animate) {
    return _.map(stats, stat => (
      <div id={`Stat--${stat.id}`} key={stat.id}>
        <Stat animate={animate} bgPrefs={this.bgPrefs} {...stat} />
        <Divider variant="fullWidth"/>
      </div>
    ));
  }

  render() {
    const { chartPrefs: { animateStats } } = this.props;

    return (
      <div className="Stats">
        {this.renderStats(this.state.stats, animateStats)}
      </div>
    );
  }

  getStatsByChartType() {
    const {
      chartType,
      dataUtil,
      bgSource,
    } = this.props;

    const { commonStats } = vizUtils.stat;
    const { bgBounds, bgUnits, days, latestPump } = dataUtil;
    const { manufacturer, deviceModel } = latestPump;
    const isAutomatedBasalDevice = vizUtils.device.isAutomatedBasalDevice(manufacturer, deviceModel);

    const stats = [];

    const addStat = statType => {
      const chartStatOpts = _.get(this.props, `chartPrefs.${chartType}.${statType}`);

      const stat = vizUtils.stat.getStatDefinition(dataUtil[vizUtils.stat.statFetchMethods[statType]](), statType, {
        bgSource,
        days,
        bgPrefs: {
          bgBounds,
          bgUnits,
        },
        manufacturer,
        ...chartStatOpts,
      });

      stats.push(stat);
    };

    const cbgSelected = bgSource === "cbg";
    const smbgSelected = bgSource === "smbg";

    switch (chartType) {
    case "basics":
      cbgSelected && addStat(commonStats.timeInRange);
      smbgSelected && addStat(commonStats.readingsInRange);
      addStat(commonStats.averageGlucose);
      cbgSelected && addStat(commonStats.sensorUsage);
      addStat(commonStats.totalInsulin);
      isAutomatedBasalDevice && addStat(commonStats.timeInAuto);
      addStat(commonStats.carbs);
      addStat(commonStats.averageDailyDose);
      cbgSelected && addStat(commonStats.glucoseManagementIndicator);
      break;

    case "daily":
      cbgSelected && addStat(commonStats.timeInRange);
      smbgSelected && addStat(commonStats.readingsInRange);
      addStat(commonStats.averageGlucose);
      addStat(commonStats.totalInsulin);
      isAutomatedBasalDevice && addStat(commonStats.timeInAuto);
      addStat(commonStats.carbs);
      cbgSelected && addStat(commonStats.standardDev);
      cbgSelected && addStat(commonStats.coefficientOfVariation);
      break;

    case "trends":
      cbgSelected && addStat(commonStats.timeInRange);
      smbgSelected && addStat(commonStats.readingsInRange);
      addStat(commonStats.averageGlucose);
      cbgSelected && addStat(commonStats.sensorUsage);
      cbgSelected && addStat(commonStats.glucoseManagementIndicator);
      addStat(commonStats.standardDev);
      addStat(commonStats.coefficientOfVariation);
      break;

      case "deviceUsage":
        cbgSelected && addStat(commonStats.sensorUsage);
        break;
    }

    return stats;
  }

  updateDataUtilEndpoints() {
    const {
      dataUtil,
      endpoints,
    } = this.props;

    dataUtil.endpoints = endpoints;
  }

  updateStatData() {
    const { bgSource, dataUtil } = this.props;
    const stats = this.state.stats;

    const { bgBounds, bgUnits, days, latestPump } = dataUtil;
    const { manufacturer } = latestPump;

    _.forEach(stats, (stat, i) => {
      const data = dataUtil[vizUtils.stat.statFetchMethods[stat.id]]();
      const opts = {
        bgSource: bgSource,
        bgPrefs: {
          bgBounds,
          bgUnits,
        },
        days,
        manufacturer,
      };

      stats[i].data = vizUtils.stat.getStatData(data, stat.id, opts);
      stats[i].annotations = vizUtils.stat.getStatAnnotations(data, stat.id, opts);
      stats[i].title = vizUtils.stat.getStatTitle(stat.id, opts);
    });

    this.setState({ stats });
  }
}

export default Stats;
