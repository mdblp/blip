/**
 * Copyright (c) 2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import BasicDropdown from "../dropdown/basic-dropdown";

const useStyles = makeStyles((theme: Theme) => ({
  categoryInfo: {
    marginLeft: theme.spacing(3),
  },
  categoryTitle: {
    fontWeight: 600,
    textTransform: "uppercase",
  },
  defaultLabel: {
    marginTop: theme.spacing(2),
    fontSize: "10px",
    fontStyle: "italic",
    marginLeft: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  dropdown: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  subCategoryContainer: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  subCategoryTitle: {
    fontWeight: 600,
    fontSize: "13px",
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  valueSelection: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(3),
  },
}));

function TeamAlarmsContent(): JSX.Element {
  const classes = useStyles();
  const { t } = useTranslation("yourloops");

  return (
    <React.Fragment>
      <Typography className={classes.categoryTitle}>
        1. {t("time-away-from-target")}
      </Typography>
      <Typography variant="caption" className={classes.categoryInfo}>
        {t("current-trigger-setting-tir")}
      </Typography>
      <Box display="flex" marginTop={2}>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>
            A. {t("glycemic-target")}
          </Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("minimum")} :</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="70mg/dL"
                values={["60mg/dL", "70mg/dL", "80mg/dL", "100mg/dL"]}
                onSelect={() => console.log("Selected")}
              />
            </div>
            <Typography>{t("maximum")} :</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="180mg/dL"
                values={["160mg/dL", "170mg/dL", "180mg/dL", "200mg/dL"]}
                onSelect={() => console.log("Selected")}
              />
            </div>
          </div>
          <Typography className={classes.defaultLabel}>{t("default-min-max")}</Typography>
        </div>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>B. {t("event-trigger-threshold")}</Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("time-spent-off-target")}</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="50%"
                values={["10%", "30%", "50%", "60%"]}
                onSelect={() => console.log("Selected")}
              />
            </div>
          </div>
          <Typography className={classes.defaultLabel}>{t("default", { value: "50%" })}</Typography>
        </div>
      </Box>

      <Divider variant="middle" className={classes.divider} />

      <Typography className={classes.categoryTitle}>
        2. {t("severe-hypoglycemia")}
      </Typography>
      <Typography variant="caption" className={classes.categoryInfo}>
        {t("current-trigger-setting-hypoglycemia")}
      </Typography>
      <Box display="flex" marginTop={2}>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>A. {t("severe-hypoglycemia-threshold")}:</Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("severe-hypoglycemia-below")}:</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="70mg/dL"
                values={["60mg/dL", "70mg/dL", "80mg/dL", "100mg/dL"]}
                onSelect={() => console.log("Selected")}
              />
            </div>
          </div>
          <Typography className={classes.defaultLabel}>{t("default", { value: "50mg/dL" })}</Typography>
        </div>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>
            B. {t("event-trigger-threshold")}
          </Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("time-spent-severe-hypoglycemia")}</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="50%"
                values={["10%", "30%", "50%", "60%"]}
                onSelect={() => console.log("Selected")}
              />
            </div>
          </div>
          <Typography className={classes.defaultLabel}>{t("default", { value: "5%" })}</Typography>
        </div>
      </Box>

      <Divider variant="middle" className={classes.divider} />

      <Typography className={classes.categoryTitle}>
        3. {t("data-not-transmitted")}
      </Typography>
      <Typography variant="caption" className={classes.categoryInfo}>
        {t("current-trigger-setting-data")}
      </Typography>
      <Box display="flex" marginTop={2}>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>A. {t("event-trigger-threshold")}</Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("time-spent-without-uploaded-data")}</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"team-basic-dropdown"}
                defaultValue="50%"
                values={["40%", "50%", "60%", "70%"]}
                onSelect={() => console.log("Selected")}
              />
            </div>
          </div>
          <Typography className={classes.defaultLabel}>{t("default", { value: "50%" })}</Typography>
        </div>
      </Box>
    </React.Fragment>
  );
}

export default TeamAlarmsContent;
