import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useTranslation } from "react-i18next";
import { BasicsChart } from "tideline";

const useStyles = makeStyles(() => ({
  card: {
    width: 430,
  },
  cardContent: {
    overflowY: "auto",
    maxHeight: 800,
  },
}));

const DeviceUsage = (props) => {
  //eslint-disable-next-line
  const { bgPrefs, timePrefs, patient, tidelineData, permsOfLoggedInUser, trackMetric } = props;
  const { t } = useTranslation("yourloops");
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<VisibilityIcon/>}
        title={t("Overview")}
        action={
          <Typography variant="overline" display="block">{t("Show More")}</Typography>
        }
      />
      <CardContent className={classes.cardContent}>
        <BasicsChart
            bgClasses={bgPrefs.bgClasses}
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
