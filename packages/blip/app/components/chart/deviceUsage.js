import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import _ from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import PhonelinkSetupOutlinedIcon from "@material-ui/icons/PhonelinkSetupOutlined";

import { BasicsChart } from "tideline";
import Stats from "./stats";
import { getParametersChanges, getLongDayHourFormat, formatParameterValue } from "tidepool-viz";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 430,
  },
  cardHeader: {
    textTransform: "uppercase",
    backgroundColor: "var(--card-header-background-color)",
  },
  cardContent: {
    overflowY: "auto",
    maxHeight: 800,
  },
  sectionTitles: {
    fontSize: "var(--section-title-font-size)",
    fontWeight: "var(--section-title-font-weight)",
    lineHeight: "var(--section-title-line-height)",
    margin: "var(--section-title-margin)",
    color: "var(--section-title-color)"
  },
  sectionContent: {
    fontSize: "13px",
    fontWeight: 300,
    lineHeight: "15px",
    color: "#444444"
  },
  deviceLabels: {
    paddingLeft: theme.spacing(2),
  },
  tableRows: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.grey[100],
    },
  },
  tableCell: {
    padding: theme.spacing(0.2, 0.5),
  },
  divider: {
    margin: theme.spacing(1, 0),
    width: "99%",
  },
  parameterChanges: {
    width: "100%",
  },
  parameterChangesTable: {
    maxHeight: 200,
  },
}));

const getLabel = (row, t) => {
  const fCurrentValue = `${formatParameterValue(row.value, row.unit)} ${row.unit}`;
  const currentLabel = t(`params|${row.name}`);
  switch (row.changeType) {
  case "added":
    return `${currentLabel} (${fCurrentValue})`;
  case "deleted":
    return `${currentLabel} (${fCurrentValue} -> ${t("deleted")})`;
  case "updated":
    const fPreviousValue = `${formatParameterValue(row.previousValue, row.previousUnit)} ${row.unit}`;
    return `${currentLabel} (${fPreviousValue} -> ${fCurrentValue})`;
  default:
    return `${currentLabel} X (${fCurrentValue})`;
  }
};

const DeviceUsage = (props) => {
  //eslint-disable-next-line
  const { bgPrefs, timePrefs, patient, tidelineData, permsOfLoggedInUser, trackMetric,
    //eslint-disable-next-line
    dataUtil, chartPrefs, endpoints, loading
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  //eslint-disable-next-line
  const mostRecentSettings = _.last(tidelineData.grouped.pumpSettings);
  const device = _.get(mostRecentSettings, "payload.device", null);
  const pump = _.get(mostRecentSettings, "payload.pump", null);
  const cgm = _.get(mostRecentSettings, "payload.cgm", null);
  const history = _.sortBy(_.cloneDeep(_.get(mostRecentSettings, "payload.history", null)), ["changeDate"]);

  const dateFormat = getLongDayHourFormat();
  const paramChanges = getParametersChanges(history, timePrefs, dateFormat, false);
  const deviceData = {
    device: {
      label: `${t("DBL")}:`,
      value: device.manufacturer
    },
    pump: {
      label: `${t("Pump")}:`,
      value: pump.manufacturer
    },
    cgm: {
      label: `${t("CGM")}:`,
      value: `${cgm.manufacturer} ${cgm.name}`
    }
  };

  return (
    <Card id="device-usage" className={classes.card}>
      <CardHeader
        id="device-usage-header"
        avatar={<PhonelinkSetupOutlinedIcon/>}
        className={classes.cardHeader}
        title={t("Device Usage")}
      />
      <CardContent id="device-usage-content" className={classes.cardContent}>
        <Box id="device-usage-device">
          <Typography className={classes.sectionTitles}>{t("Devices")}</Typography>
          <Grid className={classes.sectionContent} container spacing={1}>
            {Object.keys(deviceData).map(
              (key) =>
                <React.Fragment key={key}>
                  <Grid item xs={6}>
                    <div className={`${classes.deviceLabels} device-label`}>
                      {deviceData[key].label}
                    </div>
                  </Grid>
                  <Grid item xs={6} className="device-value">
                    {deviceData[key].value}
                  </Grid>
                </React.Fragment>
            )}
          </Grid>
        </Box>
        <Divider variant="fullWidth" className={classes.divider}/>
        <Box id="device-usage-updates" className={classes.parameterChanges}>
          <Typography className={classes.sectionTitles}>{t("Last updates")}</Typography>
          <TableContainer className={classes.parameterChangesTable}>
            <Table>
              <TableBody className={classes.sectionContent}>
                {paramChanges.map((row) =>
                  (
                    <TableRow
                      key={row.key}
                      data-param={row.name}
                      data-changetype={row.changeType}
                      data-isodate={row.effectiveDate}
                      className={`${classes.tableRows} parameter-update`}
                    >
                      {["date", "value"].map((column) => {
                        return (
                          <TableCell className={`${classes.sectionContent} ${classes.tableCell} parameter-${column}`} key={`${column}-${row.key}`}>
                            {column === "date" ? row.parameterDate : getLabel(row, t)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider variant="fullWidth" className={classes.divider}/>
        <Stats
          bgPrefs={bgPrefs}
          //eslint-disable-next-line
          bgSource={dataUtil.bgSource}
          chartPrefs={chartPrefs}
          chartType="deviceUsage"
          dataUtil={dataUtil}
          endpoints={endpoints}
          loading={loading}
        />
        <BasicsChart
          //eslint-disable-next-line
          bgClasses={bgPrefs.bgClasses}
          //eslint-disable-next-line
          bgUnits={bgPrefs.bgUnits}
          onSelectDay={()=>null}
          patient={patient}
          tidelineData={tidelineData}
          permsOfLoggedInUser={permsOfLoggedInUser}
          timePrefs={timePrefs}
          trackMetric={trackMetric} />
      </CardContent>
    </Card>
  );
};

DeviceUsage.propType = {
  bgPrefs: PropTypes.object.isRequired,
  timePrefs: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  tidelineData: PropTypes.object.isRequired,
  permsOfLoggedInUser: PropTypes.object.isRequired,
  trackMetric: PropTypes.func.isRequired,
};

export default DeviceUsage;
