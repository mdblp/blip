import React from "react";
import Stats from "./stats";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 345,
  },
  cardContent: {
    overflowY: "auto",
    maxHeight: 500,
  },
}));

export default function PatientStatistics(props) {
  const { bgPrefs, loading, chartPrefs, dataUtil, endpoints } = props;
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
          <Stats
            bgPrefs={bgPrefs}
            bgSource={dataUtil.bgSource}
            chartPrefs={chartPrefs}
            chartType="daily"
            dataUtil={dataUtil}
            endpoints={endpoints}
            loading={loading}
          />
        </CardContent>
      </Card>
  )
}
