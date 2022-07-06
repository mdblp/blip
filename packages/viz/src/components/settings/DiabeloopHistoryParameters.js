import React from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import _ from "lodash";
import bows from "bows";
import moment from "moment-timezone";

import { formatParameterValue } from "../../utils/format";
import Table from "./common/Table";

import { getLongDayHourFormat } from "../../utils/datetime";

import styles from "./Diabeloop.css";

const t = i18next.t.bind(i18next);

export default class HistoryTable extends Table {
  constructor(props) {
    super(props);

    this.log = bows("HistoryTable");
  }

  static get title() {
    return {
      label: {
        main: `${t("Parameters History")}`,
      },
      className: styles.bdlgSettingsHeader,
    };
  }

  static get columns() {
    return [
      {
        key: "level",
        label: t("Level"),
      },
      {
        key: "parameterChange",
        label: t("Parameter"),

      },
      {
        key: "valueChange",
        label: t("Value"),

      },
      {
        key: "parameterDate",
        label: t("Date"),
      },
    ];
  }

  renderSpannedRow(normalizedColumns, rowKey, rowData) {
    const { switchToDailyIconClass, onSwitchToDaily } = this.props;
    let content = rowData.spannedContent;
    if (!content) {
      content = "&nbsp;";
    }
    const handleSwitchToDaily = () => {
      onSwitchToDaily(rowData.mLatestDate, "Diabeloop parameters history");
    };
    const dateString = rowData.mLatestDate.toISOString();
    return (
      <tr id={`parameters-history-${dateString}`} key={rowKey} className={styles.spannedRow}>
        <td colSpan={normalizedColumns.length}>
          {content}
          <i
            id={`parameters-history-${dateString}-link-daily`}
            role="button"
            tabIndex={0}
            data-date={dateString}
            className={`${switchToDailyIconClass} ${styles.clickableIcon} parameters-history-link-daily`}
            onClick={handleSwitchToDaily}
            onKeyPress={handleSwitchToDaily}
          />
        </td>
      </tr>);
  }

  renderRows(normalizedColumns) {
    const rows = this.getAllRows(this.props.rows);
    const rowData = _.map(rows, (row, key) => {
      if (row.isSpanned) {
        return this.renderSpannedRow(normalizedColumns, key, row);
      }
      return this.renderRow(normalizedColumns, key, row);
    });
    return (<tbody key={`tbody_${rowData.length}`}>{rowData}</tbody>);
  }

  getParameterChange(parameter) {
    const { unknownParameterIcon, addedParameterIcon,
      deletedParameterIcon, updatedParameterIcon } = this.props;
    let icon = unknownParameterIcon;
    switch (parameter.changeType) {
    case "added":
      icon = addedParameterIcon;
      break;
    case "deleted":
      icon = deletedParameterIcon;
      break;
    case "updated":
      icon = updatedParameterIcon;
      break;
    default:
      break;
    }
    return (
      <span>
        {icon}
        <span
          id={`parameters-history-${parameter.name}-${parameter.changeType}-${parameter.effectiveDate}`}
          className={`parameters-history-table-name ${styles.parameterHistory}`}
          data-param={parameter.name}
          data-changetype={parameter.changeType}
          data-isodate={parameter.effectiveDate}>
          {t(`params|${parameter.name}`)}
        </span>
      </span>
    );
  }

  getValueChange(param) {
    const fCurrentValue = formatParameterValue(param.value, param.unit);
    const value = <span key="value">{`${fCurrentValue} ${param.unit}`}</span>;
    let spanClass = `parameters-history-table-value ${styles.historyValue}`;

    const elements = [];
    switch (param.changeType) {
    case "added":
      spanClass = `${spanClass} ${styles.valueAdded}`;
      break;
    case "deleted":
      spanClass = `${spanClass} ${styles.valueDeleted}`;
      break;
    case "updated": {
      const { changeValueArrowIcon } = this.props;
      const fPreviousValue = formatParameterValue(param.previousValue, param.previousUnit);
      spanClass = `${spanClass} ${styles.valueUpdated}`;
      const previousValue = <span key="previousValue">{`${fPreviousValue} ${param.previousUnit}`}</span>;
      elements.push(previousValue);
      elements.push(changeValueArrowIcon);
      break;
    }
    default:
      break;
    }

    elements.push(value);

    return (
      <span className={spanClass} data-changetype={param.changeType}>
        {elements}
      </span>
    );
  }

  getAllRows(history) {
    const rows = [];
    const { timePrefs } = this.props;
    const dateFormat = getLongDayHourFormat();

    if (_.isArray(history)) {
      const currentParameters = new Map();

      const nHistory = history.length;
      for (let i = 0; i < nHistory; i++) {
        const parameters = history[i].parameters;

        if (_.isArray(parameters)) {
          const nParameters = parameters.length;
          let latestDate = new Date(0);

          // Compare b->a since there is a reverse order at the end
          parameters.sort((a, b) =>
            b.level.toString().localeCompare(a.level.toString())
            || b.name.localeCompare(a.name)
            || a.effectiveDate.localeCompare(b.effectiveDate)
          );

          for (let j = 0; j < nParameters; j++) {
            const parameter = parameters[j];
            const row = { ...parameter };
            row.rawData = parameter.name;
            const changeDate = new Date(parameter.effectiveDate);

            if (latestDate.getTime() < changeDate.getTime()) {
              latestDate = changeDate;
            }
            if (timePrefs.timezoneAware) {
              row.parameterDate = moment.tz(changeDate, timePrefs.timezoneName).format(dateFormat);
            } else {
              row.parameterDate = moment.utc(changeDate).format(dateFormat);
            }

            switch (row.changeType) {
            case "added":
              if (currentParameters.has(parameter.name)) {
                // eslint-disable-next-line max-len
                this.log.warn(`History: Parameter ${parameter.name} was added, but present in current parameters`);
              }
              currentParameters.set(parameter.name, {
                value: parameter.value,
                unit: parameter.unit,
              });
              break;
            case "deleted":
              if (currentParameters.has(parameter.name)) {
                currentParameters.delete(parameter.name);
              } else {
                // eslint-disable-next-line max-len
                this.log.warn(`History: Parameter ${parameter.name} was removed, but not present in current parameters`);
              }
              break;
            case "updated":
              if (currentParameters.has(parameter.name)) {
                const currParam = currentParameters.get(parameter.name);
                row.previousUnit = currParam.unit;
                row.previousValue = currParam.value;
              } else {
                // eslint-disable-next-line max-len
                this.log.warn(`History: Parameter ${parameter.name} was updated, but not present in current parameters`);
                row.changeType = "added";
              }

              currentParameters.set(parameter.name, {
                value: parameter.value,
                unit: parameter.unit,
              });
              break;
            default:
              this.log.warn(`Unknown change type ${row.changeType}:`, row);
              break;
            }

            row.parameterChange = this.getParameterChange(row);
            row.valueChange = this.getValueChange(row);

            rows.push(row);
          }

          let mLatestDate;
          if (timePrefs.timezoneAware) {
            mLatestDate = moment.tz(latestDate, timePrefs.timezoneName);
          } else {
            mLatestDate = moment.utc(latestDate);
          }

          rows.push({
            isSpanned: true,
            spannedContent: mLatestDate.format(dateFormat),
            mLatestDate,
          });
        }
      }
    }

    return rows.reverse();
  }
}

HistoryTable.propTypes = {
  ...Table.propTypes,
  timePrefs: PropTypes.shape({
    timezoneAware: PropTypes.bool.isRequired,
    timezoneName: PropTypes.string,
  }).isRequired,
};
