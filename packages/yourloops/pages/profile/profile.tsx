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

import React, { Fragment, FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
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
  Snackbar,
  TextField,
  Toolbar,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

import HeaderBar from "../../components/header-bar";
import { Password } from "../../components/utils/password";
import { REGEX_BIRTHDATE, REGEX_EMAIL } from "../../lib/utils";
import apiClient from "../../lib/auth/api";
import { getCurrentLocaleName, getLocaleShortname, availableLocales } from "../../lib/language";
import { Profile, Roles, Settings, Units, User } from "../../models/shoreline";
import { useAuth } from "../../lib/auth/hook/use-auth";
import { Alert } from "@material-ui/lab";

interface Errors {
  firstName: boolean;
  name: boolean;
  mail: boolean;
  password: boolean;
  passwordConfirmation: boolean;
  birthDate: boolean;
}
interface ApiReturnAlert {
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: { padding: "1em 2em" },
    button: { margin: "2em 1em" },
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
    inputTitle: { color: "black" },
    inputProps: { textAlign: "right", padding: "1em 2em" },
    container: {
      border: "solid",
      borderRadius: "15px",
      marginTop: "32px",
      // eslint-disable-next-line no-magic-numbers
      borderColor: theme.palette.grey[300],
      borderWidth: "1px",
    },
  })
);

const ProfileHeader = () => {
  const { t } = useTranslation("yourloops");
  const classes = useStyles();

  return (
    <Fragment>
      <HeaderBar />
      <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolBar}>
          <Breadcrumbs aria-label={t("breadcrumb")}>
            <Link className={classes.breadcrumbLink} color="textPrimary" href="/hcp">
              <HomeIcon className={classes.homeIcon} />
              {t("account-preferences")}
            </Link>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

export const ProfilePage: FunctionComponent = () => {
  const { t, i18n } = useTranslation("yourloops");
  const classes = useStyles();
  const history = useHistory();
  const { user, setUser } = useAuth();

  const [firstName, setFirstName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [locale, setLocale] = useState<string>(getCurrentLocaleName(i18n));
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [unit, setUnit] = useState<Units>(Units.mole);
  const [role, setRole] = useState<Roles | null>(null);
  const [birthDate, setBirthDate] = useState<string>("");
  const [hbA1c, setHbA1c] = useState<string>("8.5%"); // TODO
  const [hasProfileChanged, setHasProfileChanged] = useState<boolean>(false);
  const [haveSettingsChanged, setHaveSettingsChanged] = useState<boolean>(false);
  const [apiReturnAlert, setApiReturnAlert] = useState<ApiReturnAlert | null>(null);

  useEffect(() => {
    if (user?.profile?.firstName) {
      setFirstName(user.profile.firstName);
    }
    if (user?.profile?.lastName) {
      setName(user.profile.lastName);
    }
    if (user?.roles && user.roles.length) {
      setRole(user.roles[0]);
    }
    if (user?.emails && user.emails.length) {
      setMail(user.emails[0]);
    }
    if (user?.settings?.units?.bg) {
      setUnit(user?.settings?.units?.bg);
    }
    if (user?.profile?.patient?.birthday) {
      setBirthDate(user.profile.patient.birthday.split("T")[0]);
    }
  }, [user]);

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
    setUnit(event.target.value as Units);
  };

  const errors: Errors = useMemo(
    () => ({
      firstName: _.isEmpty(firstName),
      name: _.isEmpty(name),
      mail: !REGEX_EMAIL.test(mail),
      // eslint-disable-next-line no-magic-numbers
      password: password.length > 0 && password.length < 10, // TODO: define rules
      passwordConfirmation: passwordConfirmation !== password,
      birthDate: !REGEX_BIRTHDATE.test(birthDate),
    }),
    [firstName, name, mail, password, passwordConfirmation, birthDate]
  );

  useEffect(() => {
    const newSettings: Settings = {
      units: { bg: unit },
      country: locale,
    };
    setHaveSettingsChanged(!_.isEqual(user?.settings, newSettings));

    if (user) {
      const newProfile: Profile = {
        ...user.profile,
        fullName: firstName + " " + name,
        firstName,
        lastName: name,
      };
      setHasProfileChanged(!_.isEqual(user.profile, newProfile));
    } else {
      setHasProfileChanged(false);
    }
  }, [firstName, name, unit, locale]);

  const onSave = useCallback(() => {
    if (user) {
      if (haveSettingsChanged) {
        if (i18n && getCurrentLocaleName(i18n) !== locale) {
          const newLocale = getLocaleShortname(locale);
          i18n.changeLanguage(newLocale);
        }
        const newUser: User = { ...user, settings: { units: { bg: unit }, country: locale } };
        apiClient
          .updateUserSettings(newUser)
          .then(() => {
            setHaveSettingsChanged(false);
            setUser(newUser);
            setApiReturnAlert({ message: "Settings updated", severity: "success" });
          })
          .catch(() => setApiReturnAlert({ message: "Settings update failed", severity: "error" }));
      }

      if (hasProfileChanged) {
        const newUser: User = {
          ...user,
          profile: {
            ...user.profile,
            fullName: firstName + " " + name,
            firstName,
            lastName: name,
          },
        };
        apiClient
          .updateUserProfile(newUser)
          .then(() => {
            setHasProfileChanged(false);
            setUser(newUser);
            setApiReturnAlert({ message: "Profile updated", severity: "success" });
          })
          .catch(() => setApiReturnAlert({ message: "Profile update failed", severity: "error" }));
      }
    }
  }, [user, haveSettingsChanged, hasProfileChanged, firstName, name, locale, i18n, unit]);

  const onCancel = (): void => history.goBack();
  const onCloseAlert = (): void => setApiReturnAlert(null);

  return (
    <Fragment>
      <ProfileHeader />
      <Container className={classes.container} maxWidth="md">
        <div style={{ display: "flex", flexDirection: "column", margin: "16px" }}>
          <div className={classes.title}>{t("account-preferences-title")}</div>
          <TextField
            id="firstName"
            value={firstName}
            onChange={handleChange(setFirstName)}
            error={errors.firstName}
            helperText={errors.firstName && t("required-field")}
            inputProps={{ className: classes.inputProps }}
            InputProps={{
              startAdornment: (
                <InputAdornment className={classes.inputTitle} position="start">
                  <span>{t("First name")}</span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="lastName"
            value={name}
            onChange={handleChange(setName)}
            error={errors.name}
            helperText={errors.name && t("required-field")}
            inputProps={{ className: classes.inputProps }}
            InputProps={{
              startAdornment: (
                <InputAdornment className={classes.inputTitle} position="start">
                  <span>{t("Last name")}</span>
                </InputAdornment>
              ),
            }}
          />

          {role === Roles.clinic ? (
            <Fragment>
              <TextField
                id="mail"
                value={mail}
                disabled
                onChange={handleChange(setMail)}
                error={errors.mail}
                helperText={errors.mail && t("Invalid email address.")}
                className={classes.textField}
                inputProps={{ className: classes.inputProps }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span>{t("Email")}</span>
                    </InputAdornment>
                  ),
                }}
              />
              <Password
                id="password"
                label="password"
                value={password}
                error={errors.password}
                helperText={t("password-too-weak")}
                setState={setPassword}
              />
              <Password
                id="passwordConfirmation"
                label="confirm-password"
                value={passwordConfirmation}
                error={errors.passwordConfirmation}
                helperText={t("not-matching-password")}
                setState={setPasswordConfirmation}
              />
            </Fragment>
          ) : (
            <Fragment>
              <TextField
                id="birthDate"
                value={birthDate}
                onChange={handleChange(setBirthDate)}
                error={errors.birthDate}
                helperText={errors.birthDate && t("required-field")}
                inputProps={{ className: classes.inputProps }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment className={classes.inputTitle} position="start">
                      <span>{t("Date of birth")}</span>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="hbA1c"
                disabled
                value={hbA1c}
                onChange={handleChange(setHbA1c)}
                className={classes.textField}
                inputProps={{ className: classes.inputProps }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span>{t("initial-hbA1c")}</span>
                    </InputAdornment>
                  ),
                }}
              />
            </Fragment>
          )}
          <FormControl className={classes.formControl}>
            <Select
              disabled={role !== Roles.clinic}
              labelId="unit-selector"
              id="unit-selector"
              value={unit}
              onChange={handleUnitChange}
              classes={{ root: classes.select }}
              startAdornment={
                <InputAdornment className={role === Roles.clinic ? classes.inputTitle : ""} position="start">
                  <span>{t("units")}</span>
                </InputAdornment>
              }>
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
              startAdornment={
                <InputAdornment position="start">
                  <span>{t("Language")}</span>
                </InputAdornment>
              }>
              {availableLocales.map((locale) => (
                <MenuItem key={locale} value={locale}>
                  {locale}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="secondary" onClick={onCancel} className={classes.button}>
              {t("Cancel")}
            </Button>
            <Button
              variant="contained"
              disabled={!hasProfileChanged && !haveSettingsChanged}
              color="primary"
              onClick={onSave}
              className={classes.button}>
              {t("Save")}
            </Button>
          </div>
        </div>
      </Container>
      <Snackbar
        open={apiReturnAlert !== null}
        autoHideDuration={6000}
        onClose={onCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={onCloseAlert} severity={apiReturnAlert?.severity}>
          {apiReturnAlert?.message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};
