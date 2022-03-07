/**
 * Copyright (c) 2021, Diabeloop
 * Profile page
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
import _ from "lodash";
import bows from "bows";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import { Units } from "../../models/generic";
import { LanguageCodes } from "../../models/locales";
import { Preferences, Profile, Settings, UserRoles } from "../../models/shoreline";
import { getCurrentLang } from "../../lib/language";
import { REGEX_BIRTHDATE, setPageTitle } from "../../lib/utils";
import { useAuth, User } from "../../lib/auth";
import appConfig from "../../lib/config";
import metrics from "../../lib/metrics";
import { checkPasswordStrength, CheckPasswordStrengthResults } from "../../lib/auth/helpers";
import { useAlert } from "../../components/utils/snackbar";
import SecondaryHeaderBar from "./secondary-bar";
import SwitchRoleDialogs from "../../components/switch-role";
import { Errors } from "./models";
import CredentialsForm from "./credentials-form";
import { HcpProfession } from "../../models/hcp-profession";
import PersonalInfoForm from "./personal-info-form";
import PreferencesForm from "./preferences-form";

interface ProfilePageProps {
  defaultURL: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(2),
    },
    formInput: {
      marginTop: theme.spacing(2),
    },
    title: {
      color: theme.palette.primary.main,
      textAlign: "center",
      width: "100%",
    },
    container: {
      backgroundColor: "white",
      marginTop: "32px",
      padding: 0,
      [theme.breakpoints.up("sm")]: {
        border: "solid",
        borderRadius: "15px",
        borderColor: theme.palette.grey[300],
        borderWidth: "1px",
        padding: "0 64px",
      },
    },
    uppercase: {
      textTransform: "uppercase",
    },
    halfWide: {
      [theme.breakpoints.up("sm")]: {
        width: "calc(50% - 16px)",
      },
    },
    inputContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      [theme.breakpoints.only("xs")]: {
        flexDirection: "column",
      },
    },
    categoryLabel: {
      "display": "flex",
      "alignItems": "center",
      "marginTop": theme.spacing(5),
      "& > :nth-child(2)": {
        marginLeft: theme.spacing(1),
      },
    },
  })
);

const log = bows("ProfilePage");

const ProfilePage = (props: ProfilePageProps): JSX.Element => {
  const { t, i18n } = useTranslation("yourloops");
  const classes = useStyles();
  const history = useHistory();
  const alert = useAlert();
  const {
    user,
    setUser,
    updatePreferences,
    updateProfile,
    updateSettings,
    updatePassword,
  } = useAuth();

  if (!user) {
    throw new Error("User must be looged-in");
  }

  const role = user.role;
  const showFeedback = role === UserRoles.hcp;

  const [firstName, setFirstName] = React.useState<string>(user.firstName);
  const [lastName, setLastName] = React.useState<string>(user.lastName);
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>("");
  const [unit, setUnit] = React.useState<Units>(user.settings?.units?.bg ?? Units.gram);
  const [birthDate, setBirthDate] = React.useState<string>(user.profile?.patient?.birthday ?? "");
  const [switchRoleOpen, setSwitchRoleOpen] = React.useState<boolean>(false);
  const [lang, setLang] = React.useState<LanguageCodes>(user.preferences?.displayLanguageCode ?? getCurrentLang());
  const [hcpProfession, setHcpProfession] = React.useState<HcpProfession>(user.profile?.hcpProfession ?? HcpProfession.empty);
  const [feedbackAccepted, setFeedbackAccepted] = React.useState<boolean>(!!user?.profile?.contactConsent?.isAccepted);

  let passwordCheckResults: CheckPasswordStrengthResults;
  if (password.length > 0) {
    passwordCheckResults = checkPasswordStrength(password);
  } else {
    passwordCheckResults = { onError: false, helperText: "", score: -1 };
  }

  React.useEffect(() => setPageTitle(t("account-preferences")), [lang, t]);

  React.useEffect(() => {
    // ISO date format is required from the user: It's not a very user-friendly format in all countries, We should change it
    if (role === UserRoles.patient && !!birthDate) {
      let birthday = birthDate;
      if (birthday.length > 0 && birthday.indexOf("T") > 0) {
        birthday = birthday.split("T")[0];
      }
      REGEX_BIRTHDATE.test(birthday) ? setBirthDate(birthday) : setBirthDate("");
    }
    // No deps here, because we want the effect only when the component is mounting
    // If we set the deps, the patient won't be able to change its birthday.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getUpdatedPreferences = (): Preferences => {
    const updatedPreferences = _.cloneDeep(user.preferences ?? {}) as Preferences;
    updatedPreferences.displayLanguageCode = lang;
    return updatedPreferences;
  };

  const getUpdatedProfile = (): Profile => {
    const updatedProfile = _.cloneDeep(user.profile ?? {}) as Profile;
    updatedProfile.firstName = firstName;
    updatedProfile.lastName = lastName;
    updatedProfile.fullName = `${firstName} ${lastName}`;

    if (user.role === UserRoles.patient) {
      _.set(updatedProfile, "patient.birthday", birthDate);
    }
    if (user.role === UserRoles.hcp) {
      updatedProfile.hcpProfession = hcpProfession;
    }
    if (showFeedback && Boolean(user?.profile?.contactConsent?.isAccepted) !== feedbackAccepted) {
      updatedProfile.contactConsent = {
        isAccepted: feedbackAccepted,
        acceptanceTimestamp: new Date().toISOString(),
      };
    }

    return updatedProfile;
  };

  const getUpdatedSettings = (): Settings => {
    const updatedSettings = _.cloneDeep(user.settings ?? {}) as Settings;
    _.set(updatedSettings, "units.bg", unit);
    return updatedSettings;
  };

  const preferencesChanged = !_.isEqual(user.preferences, getUpdatedPreferences());
  const profileChanged = !_.isEqual(user.profile, getUpdatedProfile());
  const settingsChanged = !_.isEqual(user.settings, getUpdatedSettings());
  const passwordChanged = password !== "" || passwordConfirmation !== "";

  const handleSwitchRoleOpen = () => {
    setSwitchRoleOpen(true);
    metrics.send("switch_account", "display_switch_preferences");
  };

  const handleSwitchRoleCancel = () => setSwitchRoleOpen(false);

  const errors: Errors = React.useMemo(
    () => ({
      firstName: _.isEmpty(firstName),
      lastName: _.isEmpty(lastName),
      hcpProfession: role === UserRoles.hcp && hcpProfession === HcpProfession.empty,
      currentPassword: password.length > 0 && currentPassword.length < appConfig.PWD_MIN_LENGTH,
      password: passwordCheckResults.onError,
      passwordConfirmation: passwordConfirmation !== password,
      birthDate: role === UserRoles.patient && !REGEX_BIRTHDATE.test(birthDate),
    }),
    [firstName, lastName, hcpProfession, password, currentPassword.length, passwordCheckResults.onError, passwordConfirmation, role, birthDate]
  );

  const isAnyError = React.useMemo(() => _.some(errors), [errors]);
  const canSave = (preferencesChanged || profileChanged || settingsChanged || passwordChanged) && !isAnyError;

  const onSave = async (): Promise<void> => {
    let preferences: Preferences | null = null;
    let profile: Profile | null = null;
    let settings: Settings | null = null;
    let updateFailed = false;
    /** Set to true if we need to update the user only (no change needed for the password) */
    let updated = false;

    try {
      if (preferencesChanged) {
        preferences = await updatePreferences(getUpdatedPreferences(), false);
        updated = true;
      }
      if (profileChanged) {
        profile = await updateProfile(getUpdatedProfile(), false);
        updated = true;
      }
      if (settingsChanged) {
        settings = await updateSettings(getUpdatedSettings(), false);
        updated = true;
      }
      if (role !== UserRoles.patient && passwordChanged) {
        await updatePassword(currentPassword, password);
      }
    } catch (err) {
      log.error("Updating:", err);
      updateFailed = true;
    }

    if (updated) {
      const updatedUser = new User(user);
      if (preferences) {
        updatedUser.preferences = preferences;
      }
      if (profile) {
        updatedUser.profile = profile;
      }
      if (settings) {
        updatedUser.settings = settings;
      }

      setUser(updatedUser);
    }

    if (passwordChanged) {
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    }

    if (lang !== getCurrentLang()) {
      i18n.changeLanguage(lang);
    }

    if (updateFailed) {
      alert.error(t("profile-update-failed"));
    } else {
      alert.success(t("profile-updated"));
    }
  };

  const onCancel = (): void => history.push(props.defaultURL);

  return (
    <React.Fragment>
      <SecondaryHeaderBar defaultURL={props.defaultURL} />
      <Container className={classes.container} maxWidth="sm">
        <Box display="flex" flexDirection="column" margin={2}>
          <DialogTitle className={classes.title} id="profile-title">
            {t("account-preferences")}
          </DialogTitle>

          <PersonalInfoForm
            birthDate={birthDate}
            classes={classes}
            errors={errors}
            firstName={firstName}
            hcpProfession={hcpProfession}
            lastName={lastName}
            role={role}
            user={user}
            setBirthDate={setBirthDate}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setHcpProfession={setHcpProfession}
          />

          {role !== UserRoles.patient &&
            <CredentialsForm
              user={user}
              classes={classes}
              errors={errors}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              password={password}
              setPassword={setPassword}
              passwordConfirmation={passwordConfirmation}
              setPasswordConfirmation={setPasswordConfirmation}
              passwordCheckResults={passwordCheckResults}
            />
          }

          <PreferencesForm
            classes={classes}
            feedbackAccepted={feedbackAccepted}
            lang={lang}
            role={role}
            unit={unit}
            setFeedbackAccepted={setFeedbackAccepted}
            setLang={setLang}
            setUnit={setUnit}
          />

          <Box display="flex" justifyContent="flex-end" my={3}>
            <Button
              id="profile-button-cancel"
              onClick={onCancel}
            >
              {t("button-cancel")}
            </Button>
            <Button
              id="profile-button-save"
              variant="contained"
              disabled={!canSave}
              color="primary"
              onClick={onSave}
              className={classes.button}
            >
              {t("button-save")}
            </Button>
          </Box>

          {UserRoles.caregiver === role &&
            <Link id="profile-link-switch-role" component="button" onClick={handleSwitchRoleOpen}>
              {t("modal-switch-hcp-title")}
            </Link>
          }
        </Box>
      </Container>
      <SwitchRoleDialogs open={switchRoleOpen} onCancel={handleSwitchRoleCancel} />;
    </React.Fragment>
  );
};

export default ProfilePage;
