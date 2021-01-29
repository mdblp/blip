/**
 * Copyright (c) 2020, Diabeloop
 * Profile page
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import {
  AppBar,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  TextField,
  Toolbar,
} from "@material-ui/core";
import React, { Fragment, FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

import HeaderBar from "../../components/header-bar";
import HomeIcon from "@material-ui/icons/Home";
import { Password } from "../../components/utils/password";
import { REGEX_EMAIL } from "../../lib/utils";
import { User } from "models/shoreline";
import _ from "lodash";
import apiClient from "../../lib/auth/api";
import { i18n } from "i18next";
import locales from "../../../../locales/languages.json";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

enum Units {
  mole = "mmol/L",
  gram = "mg/dL",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: { padding: "1em 2em" },
    formControl: {
      minWidth: 120,
      textAlign: "right",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    homeIcon: {
      marginRight: "0.5em",
    },
    breadcrumbLink: {
      display: "flex",
    },
    toolBar: {
      display: "grid",
      gridTemplateRows: "auto",
      gridTemplateColumns: "auto auto auto",
      paddingLeft: "6em",
      paddingRight: "6em",
    },
    textField: {
      "& input:disabled": {
        backgroundColor: "#f7f7f8",
      },
    },
    title: {
      textAlign: "center",
      color: theme.palette.primary.main,
    },
  })
);

type Errors = {
  firstName: boolean;
  name: boolean;
  mail: boolean;
  password: boolean;
  passwordConfirmation: boolean;
};

const getCurrentLocaleName = (i18n: i18n): string => {
  const shortLocale = i18n.language.split("-")[0] as "en" | "de" | "es" | "fr" | "it" | "nl";

  return locales.resources[shortLocale]?.name;
};

const getLocaleShortname = (locale: string): string => {
  let shortName = "";
  _.forEach(locales.resources, ({ name }, key) => {
    if (name === locale) {
      shortName = key;
    }
  });

  return shortName;
};

export const ProfilePage: FunctionComponent = () => {
  const { t, i18n } = useTranslation("yourloops");
  const classes = useStyles();
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [locale, setLocale] = useState(getCurrentLocaleName(i18n));
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [unit, setUnit] = useState(Units.mole);
  const [role, setRole] = useState("");

  const availableLocales = useMemo(() => _.map(locales.resources, ({ name }) => name), []);

  useEffect(() => {
    const user = apiClient.whoami;
    console.log("user", user);
    if (user?.profile?.firstName) {
      setFirstName(user.profile.firstName);
    }
    if (user?.profile?.lastName) {
      setName(user.profile.lastName);
    }
    if (user?.roles) {
      setRole(user.roles[0]);
    }
    if (user?.emails && user.emails.length) {
      setMail(user.emails[0]);
    }
  }, []);

  const handleChange = (
    setState: React.Dispatch<React.SetStateAction<string>>
  ): ((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (event) => setState(event.target.value);

  const handleLocaleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>
  ): void => {
    setLocale(event.target.value as string);
  };

  const handleUnitChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>
  ): void => {
    if (event.target.value === Units.mole) {
      setUnit(Units.mole);
    } else if (event.target.value === Units.gram) {
      setUnit(Units.gram);
    }
  };

  const errors: Errors = useMemo(
    () => ({
      firstName: _.isEmpty(firstName),
      name: _.isEmpty(name),
      mail: !REGEX_EMAIL.test(mail),
      password: password.length > 0 && password.length < 10,
      passwordConfirmation: passwordConfirmation !== password,
    }),
    [firstName, name, mail, password, passwordConfirmation]
  );

  const hasChanged: boolean = useMemo(() => {
    if (i18n && getCurrentLocaleName(i18n) !== locale) {
      return true;
    }
    const user = apiClient.whoami;
    if (user) {
      const newUser: User = {
        ...user,
        emails: [mail],
        profile: {
          ...user.profile,
          fullName: firstName + " " + name,
          firstName,
          lastName: name,
        },
      };
      return !_.isEqual(user, newUser);
    }

    return false;
  }, [firstName, name, mail, password, passwordConfirmation, locale]);

  const onSave = useCallback(() => {
    if (i18n && getCurrentLocaleName(i18n) !== locale) {
      const newLocale = getLocaleShortname(locale);
      i18n.changeLanguage(newLocale);
    }

    const user = apiClient.whoami;
    if (user) {
      const newUser: User = {
        ...user,
        emails: [mail],
        profile: {
          ...user.profile,
          fullName: firstName + " " + name,
          firstName,
          lastName: name,
        },
      };
      if (!_.isEqual(user, newUser)) {
        apiClient.updateUserProfile(newUser);
      }
    }
  }, [firstName, name, mail, locale, i18n, t]);

  const onCancel = (): void => history.goBack();

  return (
    <Fragment>
      <HeaderBar />
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolBar}>
          <Breadcrumbs aria-label={t("breadcrumb")}>
            <Link className={classes.breadcrumbLink} color="textPrimary" href="/hcp">
              <HomeIcon className={classes.homeIcon} />
              {t("My Patients")}
            </Link>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <div style={{ display: "flex", flexDirection: "column", margin: "16px" }}>
          <div className={classes.title}>Update your personal info and preferences</div>
          <TextField
            id="firstName"
            value={firstName}
            onChange={handleChange(setFirstName)}
            error={errors.firstName}
            helperText={errors.firstName && "Field required"}
            inputProps={{ style: { textAlign: "right", padding: "1em 2em" } }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{t("First Name")}</InputAdornment>,
            }}
          />
          <TextField
            id="lastName"
            value={name}
            onChange={handleChange(setName)}
            error={errors.name}
            helperText={errors.name && "Field required"}
            inputProps={{ style: { textAlign: "right", padding: "1em 2em" } }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{t("Last Name")}</InputAdornment>,
            }}
          />

          {role === "clinic" ? (
            <Fragment>
              <TextField
                id="mail"
                value={mail}
                disabled
                onChange={handleChange(setMail)}
                error={errors.mail}
                helperText={errors.mail && "Mail incorrect"}
                className={classes.textField}
                inputProps={{
                  style: { textAlign: "right", padding: "1em 2em" },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{t("Email")}</InputAdornment>,
                }}
              />
              <Password
                id="password"
                label="Password"
                value={password}
                error={errors.password}
                helperText={"Password too weak"}
                setState={setPassword}
              />
              <Password
                id="passwordConfirmation"
                label="Confirm password"
                value={passwordConfirmation}
                error={errors.passwordConfirmation}
                helperText={"Passwords are not matching"}
                setState={setPasswordConfirmation}
              />
            </Fragment>
          ) : (
            <Fragment>
              <TextField //TODO:
                id="birthDate"
                value={firstName}
                onChange={handleChange(setFirstName)}
                error={errors.firstName}
                helperText={errors.firstName && "Field required"}
                inputProps={{
                  style: { textAlign: "right", padding: "1em 2em" },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{t("date-of-birth")}</InputAdornment>,
                }}
              />
              <TextField //TODO:
                id="hb1c"
                disabled
                value={"8.5%"}
                inputProps={{
                  style: { textAlign: "right", padding: "1em 2em" },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{t("initial-hb1c")}</InputAdornment>,
                }}
              />
            </Fragment>
          )}
          <FormControl className={classes.formControl}>
            <Select
              disabled={role !== "clinic"}
              labelId="unit-selector"
              id="unit-selector"
              value={unit}
              onChange={handleUnitChange}
              classes={{ root: classes.select }}
              startAdornment={<InputAdornment position="start">{t("Units")}</InputAdornment>}>
              <MenuItem value={Units.mole}>{Units.mole}</MenuItem>
              <MenuItem value={Units.gram}>{Units.gram}</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Select
              labelId="locale-selector"
              id="locale-selector"
              value={locale}
              onChange={handleLocaleChange}
              classes={{ root: classes.select }}
              startAdornment={<InputAdornment position="start">{t("Language")}</InputAdornment>}>
              {availableLocales.map((locale) => (
                <MenuItem key={locale} value={locale}>
                  {locale}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="secondary" onClick={onCancel} style={{ margin: "2em 1em" }}>
              {t("CANCEL")}
            </Button>
            <Button variant="contained" disabled={!hasChanged} color="primary" onClick={onSave} style={{ margin: "2em 1em" }}>
              {t("SAVE")}
            </Button>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
