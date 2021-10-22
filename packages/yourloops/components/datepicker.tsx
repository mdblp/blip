/**
 * Copyright (c) 2021, Diabeloop
 * Simple DatePicker
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

import React, { FunctionComponent, useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import DayjsUtils from "@date-io/dayjs";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/it";
import "dayjs/locale/nl";

import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import { getCurrentLang } from "../lib/language";

interface DatePickerProps {
  date: MaterialUiPickersDate;
  title: FunctionComponent;
}

/**
 * Need to override default Dayjs locale ("en") by current locale to have right translations
 * see documentation here : https://material-ui-pickers.dev/guides/formats
 */
class LocalizedUtils extends DayjsUtils {
  constructor() {
    super();
    dayjs.locale(getCurrentLang());
  }

  getDatePickerHeaderText(date: MaterialUiPickersDate) {
    return dayjs(date).format(i18next.t("MMM D, YYYY"));
  }
}

function DatePicker({ date, title }: DatePickerProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const [selectedDate, handleDateChange] = useState(date as MaterialUiPickersDate);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // TODO emits the new date
    console.log(selectedDate);
  }, [selectedDate]);

  const textFieldOverride = () => (
    <div
      className={`chart-title-clickable ${isOpen ? "active" : ""}`}
      onClick={() => setIsOpen(true)}
      onKeyDown={() => setIsOpen(true)}
      role="presentation"
    >
      {title}
    </div>
  );

  return (
    <MuiPickersUtilsProvider utils={LocalizedUtils}>
      <MuiDatePicker
        value={selectedDate}
        onChange={handleDateChange}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        format={i18next.t("ddd, MMM D, YYYY")}
        cancelLabel={t("button-cancel")}
        orientation={window.innerWidth > 600 ? "landscape" : "portrait"}
        disableFuture
        TextFieldComponent={textFieldOverride}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePicker;
