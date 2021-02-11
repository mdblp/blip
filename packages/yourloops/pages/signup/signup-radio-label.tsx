import * as React from "react";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";

interface RadioLabelProps {
  header: string;
  body: string;
}

export default function RadioLabel(props: RadioLabelProps): JSX.Element {
  const { t } = useTranslation("yourloops");

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t(props.header)}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {t(props.body)}
      </Typography>
    </React.Fragment>
  );
}
