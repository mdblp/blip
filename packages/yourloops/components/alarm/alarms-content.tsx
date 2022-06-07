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

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import BasicDropdown from "../dropdown/basic-dropdown";
import { Monitoring } from "../../models/monitoring";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ProgressIconButtonWrapper from "../buttons/progress-icon-button-wrapper";
import { convertBG, UNITS_TYPE } from "../../lib/units/utils";

const useStyles = makeStyles((theme: Theme) => ({
  cancelButton: {
    marginRight: theme.spacing(2),
  },
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
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 90,
  },
  valueSelection: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(3),
  },
}));

export interface TeamAlarmsContentProps {
  monitoring?: Monitoring;
  saveInProgress: boolean;
  showCancelButton?: boolean;
  onClose?: () => void;
  onSave: (monitoring: Monitoring) => void;
}

interface ValueErrorPair {
  value?: number,
  error: boolean,
}

export const MIN_HIGH_BG = 140;
export const MAX_HIGH_BG = 250;
export const MIN_VERY_LOW_BG = 40;
export const MAX_VERY_LOW_BG = 90;
export const MIN_LOW_BG = 50;
export const MAX_LOW_BG = 100;
export const PERCENTAGES = [...new Array(21)]
  .map((_each, index) => `${index * 5}%`).slice(1, 21);

function AlarmsContent(props: TeamAlarmsContentProps): JSX.Element {
  const { monitoring, saveInProgress, showCancelButton, onSave, onClose } = props;
  const classes = useStyles();
  const { t } = useTranslation("yourloops");

  if (monitoring?.parameters && monitoring?.parameters?.bgUnit === UNITS_TYPE.MMOLL) {
    monitoring.parameters = {
      bgUnit: UNITS_TYPE.MGDL,
      lowBg: convertBG(monitoring.parameters.lowBg, UNITS_TYPE.MMOLL),
      highBg: convertBG(monitoring.parameters.highBg, UNITS_TYPE.MMOLL),
      outOfRangeThreshold: monitoring.parameters.outOfRangeThreshold,
      veryLowBg: convertBG(monitoring.parameters.veryLowBg, UNITS_TYPE.MMOLL),
      hypoThreshold: monitoring.parameters?.hypoThreshold,
      nonDataTxThreshold: monitoring.parameters?.nonDataTxThreshold,
      reportingPeriod: monitoring.parameters.reportingPeriod,
    };
  }

  const isError = (value: number, lowValue: number, highValue: number): boolean => {
    return !(value >= lowValue && value <= highValue);
  };

  const isInvalidPercentage = (value: number): boolean => {
    return !PERCENTAGES.includes(`${value}%`);
  };

  const [highBg, setHighBg] = useState<ValueErrorPair>({
    value: monitoring?.parameters?.highBg,
    error: !monitoring?.parameters?.highBg || isError(monitoring?.parameters?.highBg, MIN_HIGH_BG, MAX_HIGH_BG),
  });
  const [veryLowBg, setVeryLowBg] = useState<ValueErrorPair>({
    value: monitoring?.parameters?.veryLowBg,
    error: !monitoring?.parameters?.veryLowBg || isError(monitoring?.parameters?.veryLowBg, MIN_VERY_LOW_BG, MAX_VERY_LOW_BG),
  });
  const [lowBg, setLowBg] = useState<ValueErrorPair>({
    value: monitoring?.parameters?.lowBg,
    error: !monitoring?.parameters?.lowBg || isError(monitoring?.parameters?.lowBg, MIN_LOW_BG, MAX_LOW_BG),
  });
  const [nonDataTxThreshold, setNonDataTxThreshold] = useState<ValueErrorPair>(
    {
      value: monitoring?.parameters?.nonDataTxThreshold,
      error: monitoring?.parameters?.nonDataTxThreshold === undefined || isInvalidPercentage(monitoring.parameters.nonDataTxThreshold),
    });
  const [outOfRangeThreshold, setOutOfRangeThreshold] = useState<ValueErrorPair>(
    {
      value: monitoring?.parameters?.outOfRangeThreshold,
      error: monitoring?.parameters?.outOfRangeThreshold === undefined || isInvalidPercentage(monitoring.parameters.outOfRangeThreshold),
    });
  const [hypoThreshold, setHypoThreshold] = useState<ValueErrorPair>(
    {
      value: monitoring?.parameters?.hypoThreshold,
      error: monitoring?.parameters?.hypoThreshold === undefined || isInvalidPercentage(monitoring.parameters.hypoThreshold),
    });

  const saveButtonDisabled = useMemo(() => {
    return lowBg.error
        || highBg.error
        || veryLowBg.error
        || outOfRangeThreshold.error
        || hypoThreshold.error
        || nonDataTxThreshold.error
        || saveInProgress;
  },
  [highBg.error, hypoThreshold.error, lowBg.error, nonDataTxThreshold.error, outOfRangeThreshold.error, saveInProgress, veryLowBg.error]);

  const onChange = (
    value: number,
    lowValue: number,
    highValue: number,
    setValue: React.Dispatch<ValueErrorPair>,
  ) => {
    setValue({
      value: value,
      error: isError(value, lowValue, highValue),
    });
  };

  const save = () => {
    if (
      lowBg.value !== undefined
      && highBg.value !== undefined
      && veryLowBg.value !== undefined
      && outOfRangeThreshold.value !== undefined
      && nonDataTxThreshold.value !== undefined
      && hypoThreshold.value !== undefined
    ) {
      const reportingPeriod = (monitoring?.parameters?.reportingPeriod && monitoring?.parameters?.reportingPeriod > 0) ? monitoring?.parameters?.reportingPeriod : 55;
      const monitoringUpdated: Monitoring = {
        enabled: monitoring?.enabled ?? true,
        status: monitoring?.status,
        monitoringEnd: monitoring?.monitoringEnd,
        parameters: {
          bgUnit: monitoring?.parameters?.bgUnit ?? UNITS_TYPE.MGDL,
          lowBg: lowBg.value,
          highBg: highBg.value,
          outOfRangeThreshold: outOfRangeThreshold.value,
          veryLowBg: veryLowBg.value,
          hypoThreshold: hypoThreshold.value,
          nonDataTxThreshold: nonDataTxThreshold.value,
          reportingPeriod,
        },
      };
      onSave(monitoringUpdated);
    } else {
      throw Error("Cannot update team monitoring as some values are not defined");
    }
  };

  const onBasicDropdownSelect = (value: string, setValue: React.Dispatch<{ value?: number, error: boolean }>) => {
    const valueAsNumber = +value.slice(0, -1);
    setValue({
      value: valueAsNumber,
      error: false,
    });
  };

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
            <Box display="flex" alignItems="center" marginRight={2}>
              <Typography>{t("minimum")}</Typography>
              <TextField
                id="low-bg-text-field-id"
                defaultValue={lowBg.value}
                error={lowBg.error}
                type="number"
                className={classes.textField}
                variant="outlined"
                size="small"
                InputProps={{
                  inputProps: {
                    min: MIN_LOW_BG,
                    max: MAX_LOW_BG,
                  },
                }}
                onChange={(event) => onChange(+event.target.value, MIN_LOW_BG, MAX_LOW_BG, setLowBg)}
              />
              <Typography>{t("mg/dL")}</Typography>
            </Box>
            <Typography>{t("maximum")}</Typography>
            <TextField
              id="high-bg-text-field-id"
              defaultValue={highBg.value}
              error={highBg.error}
              type="number"
              className={classes.textField}
              variant="outlined"
              size="small"
              InputProps={{
                inputProps: {
                  min: MIN_HIGH_BG,
                  max: MAX_HIGH_BG,
                },
              }}
              onChange={(event) => onChange(+event.target.value, MIN_HIGH_BG, MAX_HIGH_BG, setHighBg)}
            />
            <Typography>{t("mg/dL")}</Typography>
          </div>
          <Typography className={classes.defaultLabel}>{t("default-min-max")}</Typography>
        </div>
        <div className={classes.subCategoryContainer}>
          <Typography className={classes.subCategoryTitle}>B. {t("event-trigger-threshold")}</Typography>
          <div className={classes.valueSelection}>
            <Typography>{t("time-spent-off-target")}</Typography>
            <div className={classes.dropdown}>
              <BasicDropdown
                id={"out-of-range"}
                defaultValue={`${outOfRangeThreshold.value}%` ?? ""}
                values={PERCENTAGES}
                error={outOfRangeThreshold.error}
                onSelect={(value) => onBasicDropdownSelect(value, setOutOfRangeThreshold)}
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
            <Typography>{t("severe-hypoglycemia-below")}</Typography>
            <TextField
              id="very-low-bg-text-field-id"
              defaultValue={veryLowBg.value}
              error={veryLowBg.error}
              type="number"
              className={classes.textField}
              variant="outlined"
              size="small"
              InputProps={{
                inputProps: {
                  min: MIN_VERY_LOW_BG,
                  max: MAX_VERY_LOW_BG,
                },
              }}
              onChange={(event) => onChange(+event.target.value, MIN_VERY_LOW_BG, MAX_VERY_LOW_BG, setVeryLowBg)}
            />
            <Typography>{t("mg/dL")}</Typography>
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
                id={"hypo-threshold"}
                defaultValue={`${hypoThreshold.value}%` ?? ""}
                values={PERCENTAGES}
                error={hypoThreshold.error}
                onSelect={(value) => onBasicDropdownSelect(value, setHypoThreshold)}
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
                id={"non-data"}
                defaultValue={`${nonDataTxThreshold.value}%` ?? ""}
                values={PERCENTAGES.slice(0, 10)}
                error={nonDataTxThreshold.error}
                onSelect={(value) => onBasicDropdownSelect(value, setNonDataTxThreshold)}
              />
            </div>
          </div>
          <Typography className={classes.defaultLabel}>{t("default", { value: "50%" })}</Typography>
        </div>
      </Box>
      <Box display="flex" justifyContent="end">
        {showCancelButton &&
          <Button
            id="cancel-button-id"
            className={classes.cancelButton}
            onClick={onClose}
          >
            {t("button-cancel")}
          </Button>
        }
        <ProgressIconButtonWrapper inProgress={saveInProgress}>
          <Button
            id="save-button-id"
            variant="contained"
            color="primary"
            disableElevation
            disabled={saveButtonDisabled}
            onClick={save}
          >
            {t("button-save")}
          </Button>
        </ProgressIconButtonWrapper>
      </Box>
    </React.Fragment>
  );
}

export default AlarmsContent;
