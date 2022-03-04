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

import AccountCircle from "@material-ui/icons/AccountCircle";

import { ClassNameMap } from "@material-ui/styles/withStyles";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import appConfig from "../../lib/config";
import { useAuth, User } from "../../lib/auth";
import { Errors } from "./models";
import { UserRoles } from "../../models/shoreline";
import { HcpProfession, HcpProfessionList } from "../../models/hcp-profession";
import BasicDropdown from "../../components/dropdown/basic-dropdown";
import CertifiedProfessionalIcon from "../../components/icons/certified-professional-icon";
import ProSanteConnectButton from "../../components/buttons/pro-sante-connect-button";
import PatientProfileForm from "./patient-form";

export interface PersonalInfoProps {
  birthDate?: string;
  classes: ClassNameMap;
  errors: Errors;
  firstName: string;
  hcpProfession: HcpProfession;
  lastName: string;
  role: UserRoles;
  user: User;
  setBirthDate: (birthDate: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setHcpProfession: (hcpProfession: HcpProfession) => void;
}

export function PersonalInfo({
  birthDate,
  classes,
  errors,
  firstName,
  hcpProfession,
  lastName,
  role,
  user,
  setBirthDate,
  setFirstName,
  setLastName,
  setHcpProfession,
}: PersonalInfoProps): JSX.Element {
  const { t } = useTranslation("yourloops");
  const { redirectToProfessionalAccountLogin } = useAuth();

  return (
    <React.Fragment>
      <Box className={classes.categoryLabel}>
        <AccountCircle color="primary" style={{ margin: "0" }} />
        <strong className={classes.uppercase}>{t("personal-information")}</strong>
        {user.frProId && <CertifiedProfessionalIcon id={`certified-professional-icon-${user.userid}`} />}
      </Box>

      <Box className={classes.inputContainer}>
        <TextField
          id="profile-textfield-firstname"
          label={t("firstname")}
          value={firstName}
          onChange={event => setFirstName(event.target.value)}
          error={errors.firstName}
          helperText={errors.firstName && t("required-field")}
          className={`${classes.formInput} ${classes.halfWide}`}
        />
        <TextField
          id="profile-textfield-lastname"
          label={t("lastname")}
          value={lastName}
          onChange={event => setLastName(event.target.value)}
          error={errors.lastName}
          helperText={errors.lastName && t("required-field")}
          className={`${classes.formInput} ${classes.halfWide}`}
        />
      </Box>

      {role === UserRoles.hcp &&
        <Box className={classes.inputContainer}>
          <Box className={`${classes.formInput} ${classes.halfWide}`}>
            <BasicDropdown
              onSelect={setHcpProfession}
              defaultValue={hcpProfession}
              disabledValues={[HcpProfession.empty]}
              values={HcpProfessionList.filter(item => item !== HcpProfession.empty)}
              id="profession"
              inputTranslationKey="hcp-profession"
              errorTranslationKey="profession-dialog-title"
            />
          </Box>

          {appConfig.ECPS_ENABLED && user.settings?.country === "FR" &&
            <React.Fragment>
              {user.frProId ?
                <TextField
                  id="professional-account-number-text-field"
                  value={user.getParsedFrProId()}
                  label={t("professional-account-number")}
                  disabled
                  className={classes.formInput}
                />
                :
                <FormControl className={`${classes.formInput} ${classes.halfWide}`}>
                  <ProSanteConnectButton onClick={redirectToProfessionalAccountLogin} />
                </FormControl>
              }
            </React.Fragment>
          }
        </Box>
      }

      {role === UserRoles.patient &&
        <PatientProfileForm
          user={user}
          classes={classes}
          errors={errors}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
        />
      }
    </React.Fragment>
  );
}

export default PersonalInfo;
