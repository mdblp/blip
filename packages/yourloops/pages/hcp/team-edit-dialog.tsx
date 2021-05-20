/**
 * Copyright (c) 2021, Diabeloop
 * Modal (pop-up) displayed to create or edit a team
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

import _ from "lodash";
import * as React from "react";
import { useTranslation, Trans } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Modal from "@material-ui/core/Modal";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

import locales from "../../../../locales/languages.json";
import DiabeloopUrl from "../../lib/diabeloop-url";
import { Team } from "../../lib/team";
import { REGEX_EMAIL } from "../../lib/utils";
import { useAuth } from "../../lib/auth";
import { TeamEditModalContentProps } from "./types";

interface LocalesCountries {
  [code: string]: {
    name: string;
  };
}

interface TeamEditModalProps {
  teamToEdit: TeamEditModalContentProps | null;
}

const modalStyles = makeStyles((theme: Theme) => {
  return {
    modal: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    divMain: {
      display: "block",
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      width: theme.breakpoints.width("sm"),
    },
    title: {
      paddingLeft: theme.spacing(2),
    },
    form: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
      overflowY: "scroll",
    },
    formNew: {
      maxHeight: "24em",
    },
    formEdit: {
      maxHeight: "28em",
    },
    formChild: {
      marginBottom: theme.spacing(2),
    },
    divModalButtons: {
      display: "flex",
      flexDirection: "row",
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(4), // eslint-disable-line no-magic-numbers
    },
    divModalButtonCancel: {
      marginLeft: "auto",
      marginRight: theme.spacing(1),
    },
    pModalInfos: {
      paddingLeft: theme.spacing(2),
    },
    divModalWarnings: {
      display: "block",
      paddingLeft: theme.spacing(2),
    },
  };
});

const teamFieldsLimits = {
  name: { min: 1, max: 64 },
  phone: { min: 3, max: 32 },
  addLine1: { min: 1, max: 128 },
  addLine2: { min: -1, max: 128 },
  zipCode: { min: 1, max: 16 },
  city: { min: 1, max: 128 },
  country: { min: 1, max: 4 },
  email: { min: 0, max: 64 },
};

/**
 * Show a dialog to edit a team.
 * If the team in props.team is empty, the modal is used to create a team.
 * @param props null to hide the modal
 */
function TeamEditDialog(props: TeamEditModalProps): JSX.Element {
  const { teamToEdit } = props;
  const { team, onSaveTeam } = teamToEdit ?? ({ team: null, onSaveTeam: _.noop } as TeamEditModalContentProps);

  const classes = modalStyles();
  const auth = useAuth();
  const { t, i18n } = useTranslation("yourloops");

  const [modalOpened, setModalOpened] = React.useState(false);
  const [teamName, setTeamName] = React.useState("");
  const [teamPhone, setTeamPhone] = React.useState("");
  const [teamEmail, setTeamEmail] = React.useState("");
  const [addrLine1, setAddrLine1] = React.useState("");
  const [addrLine2, setAddrLine2] = React.useState("");
  const [addrZipCode, setAddrZipCode] = React.useState("");
  const [addrCity, setAddrCity] = React.useState("");
  const [addrCountry, setAddrCountry] = React.useState(auth.user?.settings?.country ?? "FR");

  const countries: LocalesCountries = locales.countries;
  const optionsCountries: JSX.Element[] = [];
  for (const entry in countries) {
    if (Object.prototype.hasOwnProperty.call(countries, entry)) {
      const { name } = countries[entry];
      optionsCountries.push(
        <option value={entry} key={name} aria-label={name}>
          {name}
        </option>
      );
    }
  }
  optionsCountries.sort((a: JSX.Element, b: JSX.Element) => {
    const aName = a.key as string;
    const bName = b.key as string;
    return aName.localeCompare(bName);
  });

  const isFormIsIncomplete = (): boolean => {
    const inLimit = (value: string, limits: { min: number; max: number }): boolean => {
      const len = value.length;
      return len > limits.min && len < limits.max;
    };
    let valid = inLimit(teamName.trim(), teamFieldsLimits.name);
    valid = valid && inLimit(teamPhone.trim(), teamFieldsLimits.phone);
    valid = valid && inLimit(addrLine1.trim(), teamFieldsLimits.addLine1);
    valid = valid && inLimit(addrLine2.trim(), teamFieldsLimits.addLine2);
    valid = valid && inLimit(addrZipCode.trim(), teamFieldsLimits.zipCode);
    valid = valid && inLimit(addrCity.trim(), teamFieldsLimits.city);
    valid = valid && inLimit(addrCountry.trim(), teamFieldsLimits.country);

    const email = teamEmail.trim();
    if (valid && inLimit(email, teamFieldsLimits.email)) {
      valid = REGEX_EMAIL.test(email);
    }

    return !valid;
  };

  const formIsIncomplete = React.useMemo(isFormIsIncomplete, [
    teamName,
    teamEmail,
    teamPhone,
    addrCity,
    addrCountry,
    addrLine1,
    addrLine2,
    addrZipCode,
  ]);

  const handleCloseModal = (): void => {
    onSaveTeam(null);
  };

  const handleValidateModal = (): void => {
    const updatedTeam = team === null ? {} as Partial<Team> : { ...team, members: [] };
    updatedTeam.name = teamName.trim();
    updatedTeam.phone = teamPhone.trim();

    const email = teamEmail.trim();
    if (email.length > 0) {
      updatedTeam.email = email;
    } else {
      delete updatedTeam.email;
    }

    updatedTeam.address = {
      line1: addrLine1.trim(),
      line2: addrLine2.trim(),
      zip: addrZipCode.trim(),
      city: addrCity.trim(),
      country: addrCountry.trim(),
    };
    if ((updatedTeam.address.line2?.length ?? 0) < 1) {
      delete updatedTeam.address.line2;
    }
    onSaveTeam(updatedTeam);
  };

  React.useEffect((): void => {
    setModalOpened(teamToEdit !== null);
    if (team) {
      setAddrCity(team.address?.city ?? "");
      setAddrCountry(team.address?.country ?? auth.user?.settings?.country ?? "FR");
      setAddrLine1(team.address?.line1 ?? "");
      setAddrLine2(team.address?.line2 ?? "");
      setAddrZipCode(team.address?.zip ?? "");
      setTeamEmail(team.email ?? "");
      setTeamName(team.name ?? "");
      setTeamPhone(team.phone ?? "");
    } else {
      setAddrCity("");
      setAddrCountry(auth.user?.settings?.country ?? "FR");
      setAddrLine1("");
      setAddrLine2("");
      setAddrZipCode("");
      setTeamEmail("");
      setTeamName("");
      setTeamPhone("");
    }
  }, [teamToEdit, team, auth]);

  let ariaModal = "";
  let modalTitle = "";
  let modalButtonValidate = "";
  let infoLine = null;
  let warningLines = null;
  if (team === null) {
    // Create a new team
    ariaModal = t("button-create-a-team");
    modalTitle = t("team-modal-add-title");
    modalButtonValidate = t("button-create-team");
    infoLine = <p id="team-edit-dialog-info-line" className={classes.pModalInfos}>{t("team-modal-create-info")}</p>;
    const termsOfUse = t("terms-and-conditions");
    const linkTerms = (
      <Link aria-label={termsOfUse} href={DiabeloopUrl.getTermsUrL(i18n.language)} target="_blank" rel="noreferrer">
        {termsOfUse}
      </Link>
    );
    warningLines = (
      <div className={classes.divModalWarnings}>
        <p id="team-edit-dialog-warning-line1">{t("team-modal-create-warning-line1")}</p>
        <p id="team-edit-dialog-warning-line2">
          <Trans i18nKey="team-modal-create-warning-line2" t={t} components={{ linkTerms }} values={{ terms: termsOfUse }} parent={React.Fragment}>
            By accepting our {termsOfUse} you confirm you are a registered healthcare professional in your country
            and have the right to create a care team.
          </Trans>
        </p>
      </div>
    );
  } else {
    ariaModal = t("aria-modal-team-edit");
    modalTitle = t("modal-team-edit-title");
    modalButtonValidate = t("save");
  }

  return (
    <Modal
      id="team-edit-dialog"
      aria-labelledby={ariaModal}
      className={classes.modal}
      open={modalOpened}
      onClose={handleCloseModal}>
      <Fade in={modalOpened}>
        <div className={classes.divMain}>
          <h2 id="team-edit-dialog-title" className={classes.title}>{modalTitle}</h2>

          {infoLine}

          <form noValidate autoComplete="off" className={`${classes.form} ${team === null ? classes.formNew : classes.formEdit}`}>
            <TextField
              id="team-edit-dialog-field-name"
              className={classes.formChild}
              variant="outlined"
              onChange={(e) => setTeamName(e.target.value)}
              name="name"
              value={teamName}
              label={t("team-edit-dialog-placeholder-name")}
              required={true}
              aria-required="true"
            />

            <TextField
              id="team-edit-dialog-field-line1"
              className={classes.formChild}
              variant="outlined"
              onChange={(e) => setAddrLine1(e.target.value)}
              name="addr-line1"
              value={addrLine1}
              label={t("team-edit-dialog-placeholder-addr-line1")}
              required={true}
              aria-required="true"
            />
            <TextField
              id="team-edit-dialog-field-line2"
              className={classes.formChild}
              variant="outlined"
              onChange={(e) => setAddrLine2(e.target.value)}
              name="addr-line2"
              value={addrLine2}
              label={t("team-edit-dialog-placeholder-addr-line2")}
              required={false}
              aria-required="false"
            />
            <TextField
              id="team-edit-dialog-field-zip"
              className={classes.formChild}
              variant="outlined"
              onChange={(e) => setAddrZipCode(e.target.value)}
              name="addr-zip"
              value={addrZipCode}
              label={t("team-edit-dialog-placeholder-addr-zip")}
              required={true}
              aria-required="true"
            />
            <TextField
              id="team-edit-dialog-field-city"
              className={classes.formChild}
              variant="outlined"
              onChange={(e) => setAddrCity(e.target.value)}
              name="addr-city"
              value={addrCity}
              label={t("team-edit-dialog-placeholder-addr-city")}
              required={true}
              aria-required="true"
            />
            <FormControl className={classes.formChild} required={true} variant="outlined">
              <InputLabel htmlFor="team-edit-dialog-select-country">{t("team-edit-dialog-placeholder-addr-country")}</InputLabel>
              <Select
                native
                label={t("team-edit-dialog-placeholder-addr-country")}
                value={addrCountry}
                onChange={(e) => setAddrCountry(e.target.value as string)}
                inputProps={{ name: "country", id: "team-edit-dialog-select-country" }}>
                {optionsCountries}
              </Select>
            </FormControl>

            <TextField
              id="team-edit-dialog-field-phone"
              className={classes.formChild}
              variant="outlined"
              onChange={(e) => setTeamPhone(e.target.value)}
              name="phone"
              value={teamPhone}
              label={t("team-edit-dialog-placeholder-phone")}
              required={true}
              aria-required="true"
            />
            <TextField
              id="team-edit-dialog-field-email"
              className={classes.formChild}
              variant="outlined"
              onChange={(e) => setTeamEmail(e.target.value)}
              name="email"
              value={teamEmail}
              label={t("email")}
              required={false}
              aria-required="false"
            />
          </form>

          {warningLines}

          <div className={classes.divModalButtons}>
            <Button
              id="team-edit-dialog-button-close"
              className={classes.divModalButtonCancel}
              variant="contained"
              onClick={handleCloseModal}>
              {t("common-cancel")}
            </Button>
            <Button
              id="team-edit-dialog-button-validate"
              disabled={formIsIncomplete}
              onClick={handleValidateModal}
              color="primary"
              variant="contained">
              {modalButtonValidate}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default TeamEditDialog;
