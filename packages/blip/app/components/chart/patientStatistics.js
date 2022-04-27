import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import { useTranslation } from "react-i18next";
import Stats from "./stats";

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 345,
  },
  cardContent: {
    overflowY: "auto",
  },
}));

const PatientStatistics = (props) => {
  //eslint-disable-next-line
  const { bgPrefs, loading, chartPrefs, dataUtil, endpoints } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<InsertChartOutlinedIcon/>}
        title={t("patient-statistics")}
      />
      <CardContent className={classes.cardContent}>
        <Stats
          bgPrefs={bgPrefs}
          //eslint-disable-next-line
          bgSource={dataUtil.bgSource}
          chartPrefs={chartPrefs}
          chartType="patientStatistics"
          dataUtil={dataUtil}
          endpoints={endpoints}
          loading={loading}
          hideToolTips={true}
        />
      </CardContent>
    </Card>
  );
};

PatientStatistics.propType = {
  bgPrefs: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  chartPrefs: PropTypes.object.isRequired,
  dataUtil: PropTypes.object.isRequired,
  endpoints: PropTypes.arrayOf(PropTypes.string),
};

export default PatientStatistics;
