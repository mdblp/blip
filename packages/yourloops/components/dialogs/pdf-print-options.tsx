/**
 * Copyright (c) 2022, Diabeloop
 * Display the rendering PDF options
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
import dayjs, { Dayjs } from "dayjs";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";

import { CalendarOrientation } from "../date-pickers/models";
import RangeDatePicker from "../date-pickers/range-date-picker";

type Presets = "1week" | "2weeks" | "3weeks" | "3months";
interface PrintPDFOptions {
  /** Print start date (ISO day ex: 2022-02-10) */
  start: string;
  /** Print end date (ISO day ex: 2022-02-10) */
  end: string;
  preset?: Presets | null;
}
interface DialogPDFOptionsProps {
  open: boolean;
  /** Oldest available date date (ISO day ex: 2022-02-10) */
  minDate: string;
  /** Newest available date date (ISO day ex: 2022-02-10) */
  maxDate: string;
  onResult: (options?: PrintPDFOptions) => void;
}
const DEFAULT_PRESET: Presets = "3weeks";
const maxSelectableDays = 90;

function getDatesFromPreset(preset: Presets, maxDate: Dayjs) {
  const end = maxDate.format("YYYY-MM-DD");
  switch (preset) {
  case "1week":
    return {
      start: maxDate.subtract(6, "days").format("YYYY-MM-DD"),
      end,
      preset,
    };
  case "2weeks":
    return {
      start: maxDate.subtract(13, "days").format("YYYY-MM-DD"),
      end,
      preset,
    };
  case "3weeks":
    return {
      start: maxDate.subtract(20, "days").format("YYYY-MM-DD"),
      end,
      preset,
    };
  case "3months":
    return {
      start: maxDate.subtract(89, "days").format("YYYY-MM-DD"),
      end,
      preset,
    };
  }
  // Make eslint happy
  throw new Error("Invalid preset, bug here");
}

function DialogPDFOptions(props: DialogPDFOptionsProps) {
  const { open, onResult } = props;
  const { t } = useTranslation("yourloops");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const orientation: CalendarOrientation = matches ? "landscape" : "portrait";

  const { minDate, maxDate } = React.useMemo(() => {
    const minDate = dayjs(props.minDate, { utc: true });
    const maxDate = dayjs(props.maxDate, { utc: true });
    return { minDate, maxDate };
  }, [props.minDate, props.maxDate]);

  const [presetSelected, setPresetSelected] = React.useState<Presets | null>(DEFAULT_PRESET);
  const [pdfOptions, setPDFOptions] = React.useState<PrintPDFOptions>(getDatesFromPreset(DEFAULT_PRESET, maxDate));
  const [customStartDate, setCustomStartDate] = React.useState<Dayjs|null>(null);

  const { start, end, displayStart, displayEnd } = React.useMemo(() => {
    const start = customStartDate ?? dayjs(pdfOptions.start, { utc: true });
    const end = customStartDate ?? dayjs(pdfOptions.end, { utc: true });
    const displayStart = start.format("ll");
    const displayEnd = end.format("ll");
    return { start, end, displayStart, displayEnd };
  }, [pdfOptions, customStartDate]);

  React.useEffect(() => {
    if (open) {
      setPDFOptions(getDatesFromPreset(DEFAULT_PRESET, maxDate));
    }
  }, [open, maxDate]);

  const handleClickPreset = (preset: Presets | null) => {
    setPresetSelected(preset);
    if (preset) {
      setPDFOptions(getDatesFromPreset(preset, maxDate));
    }
  };

  const handleChangeCustomDate = (d: Dayjs) => {
    if (customStartDate === null) {
      setCustomStartDate(d);
      setPresetSelected(null);
    } else {
      const start = customStartDate.isBefore(d) ? customStartDate.format("YYYY-MM-DD") : d.format("YYYY-MM-DD");
      const end = customStartDate.isBefore(d) ? d.format("YYYY-MM-DD") : customStartDate.format("YYYY-MM-DD");
      setPDFOptions({ start, end });
      setCustomStartDate(null);
    }
  };

  const displayedDates = `${displayStart} → ${displayEnd}`;
  return (
    <Dialog id="dialog-pdf-options" fullScreen={!matches} open={open} onClose={() => onResult()} data-start={pdfOptions.start} data-end={pdfOptions.end} maxWidth={false}>
      <DialogContent style={{ width: "fit-content" }}>
        <Typography variant="h4">{t("dialog-pdf-options-title")}</Typography>

        <Typography variant="body2" style={{ marginTop: theme.spacing(2) }}>{t("dialog-pdf-options-presets")}</Typography>
        <Box display="flex" flexDirection="row" justifyContent="space-around" flexWrap="wrap">
          <Button
            id="pdf-options-button-one-week"
            variant={presetSelected === "1week" ? "contained" : "outlined"}
            color={presetSelected === "1week" ? "primary" : "default"}
            onClick={() => handleClickPreset("1week")}
            data-selected={presetSelected === "1week"}
          >
            {t("preset-dates-range-1week")}
          </Button>
          <Button
            id="pdf-options-button-two-weeks"
            variant={presetSelected === "2weeks" ? "contained" : "outlined"}
            color={presetSelected === "2weeks" ? "primary" : "default"}
            onClick={() => handleClickPreset("2weeks")}
            data-selected={presetSelected === "2weeks"}
          >
            {t("preset-dates-range-2weeks")}
          </Button>
          <Button
            id="pdf-options-button-three-weeks"
            variant={presetSelected === "3weeks" ? "contained" : "outlined"}
            color={presetSelected === "3weeks" ? "primary" : "default"}
            onClick={() => handleClickPreset("3weeks")}
            data-selected={presetSelected === "3weeks"}
          >
            {t("preset-dates-range-3weeks")}
          </Button>
          <Button
            id="pdf-options-button-three-months"
            variant={presetSelected === "3months" ? "contained" : "outlined"}
            color={presetSelected === "3months" ? "primary" : "default"}
            onClick={() => handleClickPreset("3months")}
            data-selected={presetSelected === "3months"}
          >
            {t("preset-dates-range-3months")}
          </Button>
        </Box>

        <Typography variant="body2" style={{ marginTop: theme.spacing(2) }}>{t("dialog-pdf-options-custom-range")}</Typography>
        <Button
          id="pdf-options-button-custom-range"
          variant={presetSelected === null ? "contained" : "outlined"}
          color={presetSelected === null ? "primary" : "default"}
          data-selected={presetSelected === null}
          data-displayed={displayedDates}
        >
          {displayedDates}
        </Button>
        <Box display="flex" flexDirection={matches ? "row" : "column"} mt={2} width="fit-content">
          <RangeDatePicker
            minDate={minDate}
            maxDate={maxDate}
            orientation={orientation}
            onChange={handleChangeCustomDate}
            selection={{ mode: "range", selected: { start, end }, maxSelectableDays }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button id="pdf-options-button-cancel" onClick={() => onResult()}>
          {t("button-cancel")}
        </Button>
        <Button id="pdf-options-button-print" onClick={() => onResult(pdfOptions)} color="primary" variant="contained">
          {t("button-print")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogPDFOptions;
