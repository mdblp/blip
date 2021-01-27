import React, { useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useTranslation } from "react-i18next";

function LanguageSelect(): JSX.Element {
  const { i18n } = useTranslation();
  const [val, setVal] = useState(i18n.language);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const lang = event.target.value as string;
    i18n.changeLanguage(lang);
    setVal(lang);
  };

  const iconComponent = () => {
    return <ArrowDropDownIcon />;
  };

  const langs = [];
  for (const lang in i18n.options.resources) {
    if (Object.prototype.hasOwnProperty.call(i18n.options.resources, lang)) {
      const language = i18n.options.resources[lang].name;
      langs.push(
        <MenuItem key={lang} value={lang}>
          {language}
        </MenuItem>
      );
    }
  }

  return (
    <FormControl>
      <Select
        disableUnderline
        IconComponent={iconComponent}
        value={val}
        onChange={handleChange}
      >
        {langs}
      </Select>
    </FormControl>
  );
}

export default LanguageSelect;
