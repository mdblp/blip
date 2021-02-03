import * as React from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";

import LanguageSelect from "../../components/language-select";
import diabeloopUrls from "../../lib/diabeloop-url";
import config from "../../lib/config";

const loginStyle = makeStyles((theme: Theme) => {
  return {
    rightLink: {
      padding: theme.spacing(0.5),
      textAlign: "start",
      fontSize: "small",
    },
    centeredLink: {
      padding: theme.spacing(0.5),
      textAlign: "center",
      color: "#109182",
    },
    leftLink: {
      padding: theme.spacing(0.5),
      textAlign: "end",
      fontSize: "small",
    },
    selection: {
      padding: theme.spacing(2),
      textAlign: "center",
      fontSize: "small",
    },
  };
});

function LoginFooterLink(): JSX.Element{
  const { t, i18n } = useTranslation();
  const classes = loginStyle();
  return (
    <Grid container>
      <Grid item xs={12} className={classes.selection}>
        <LanguageSelect />
      </Grid>
      <Grid item xs={4} className={classes.rightLink}>
        <Link href={diabeloopUrls.getPrivacyPolicyUrL(i18n.language)}>
          {t(diabeloopUrls.PrivacyPolicy)}
        </Link>
      </Grid>
      <Grid item xs={4} className={classes.centeredLink}>
        <Typography
          style={{
            fontSize: "small",
          }}
        >
          {`${t("Yourloops")} ${config.VERSION}`}
        </Typography>
      </Grid>
      <Grid item xs={4} className={classes.leftLink}>
        <Link href={diabeloopUrls.SupportUrl}>
          {t(diabeloopUrls.Support)}
        </Link>
      </Grid>
      <Grid item xs={6} className={classes.rightLink}>
        <Link href={diabeloopUrls.getTermsUrL(i18n.language)}>
          {t(diabeloopUrls.Terms)}
        </Link>
      </Grid>
      <Grid item xs={6} className={classes.leftLink}>
        <Link href={diabeloopUrls.getIntendedUseUrL(i18n.language)}>
          {t(diabeloopUrls.IntendedUse)}
        </Link>
      </Grid>
    </Grid>
  );
}

export default LoginFooterLink;
