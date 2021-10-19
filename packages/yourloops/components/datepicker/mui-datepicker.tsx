import React, { FunctionComponent, useEffect, useState } from 'react';
import i18next from 'i18next';
import { useTranslation } from "react-i18next";
import DayjsUtils from '@date-io/dayjs';
import dayjs from "dayjs";
import 'dayjs/locale/de';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import 'dayjs/locale/nl';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import { getCurrentLang } from "../../lib/language";

interface Props {
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
    return dayjs(date).format(i18next.t('MMM D, YYYY'));
  }
}

const MUIDatePicker = ({ date, title }: Props): JSX.Element => {
  const { t } = useTranslation("yourloops");
  const [selectedDate, handleDateChange] = useState(date as MaterialUiPickersDate);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // TODO emits the new date
    console.log(selectedDate);
  }, [selectedDate]);

  const textFieldOverride: FunctionComponent = () => (
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
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        format={i18next.t('ddd, MMM D, YYYY')}
        cancelLabel={t("button-cancel")}
        orientation={window.innerWidth > 600 ? "landscape" : "portrait"}
        disableFuture
        TextFieldComponent={textFieldOverride}
      />
    </MuiPickersUtilsProvider>
  );
};

export default MUIDatePicker;
