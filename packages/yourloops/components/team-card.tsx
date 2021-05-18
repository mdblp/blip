/**
 * Copyright (c) 2021, Diabeloop
 * Generic Team card
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
import { useTranslation } from "react-i18next";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";

import EmailIcon from "@material-ui/icons/Email";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PhoneIcon from "@material-ui/icons/Phone";

import VerifiedIcon from "./icons/VerifiedIcon";

import locales from "../../../locales/languages.json";
import { Team, getDisplayTeamCode } from "../lib/team";

export interface TeamCardProps {
  team: Readonly<Team>;
  children?: JSX.Element | JSX.Element[] | null;
}

export interface TeamInfoProps {
  id: string;
  label: string;
  value?: null | string | JSX.Element;
  icon: JSX.Element;
}

const teamCardStyles = makeStyles((theme: Theme) => {
  return {
    paper: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.primary.light,
    },
    paperRoot: {
      padding: "1em 3em",
    },
    firstRow: {
      display: "flex",
      flexDirection: "row",
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(2),
    },
    secondRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: theme.spacing(2),
    },
    teamName: {
      minWidth: "8em",
      marginTop: "auto",
      marginBottom: "auto",
    },
    teamInfoIcon: {
      fill: "#2e2e2e",
    },
    buttonActionFirstRow: {
      alignSelf: "center",
      marginRight: "1em",
      textTransform: "initial",
    },
    divActions: {
      marginLeft: "2em",
      display: "flex",
      flexGrow: 1,
      justifyContent: "flex-start",
    },
  };
});

const teamInfoStyles = makeStyles((theme: Theme) => {
  return {
    card: {
      display: "flex",
      flexDirection: "row",
      marginRight: theme.spacing(3), // eslint-disable-line no-magic-numbers
    },
    avatar: {
      backgroundColor: "#e4e4e5",
    },
    divLabelValue: {
      display: "flex",
      flexDirection: "column",
      marginLeft: theme.spacing(2),
      fontSize: theme.typography.fontSize,
    },
    spanValue: {
      fontWeight: 500,
    },
  };
});

export function TeamInfo(props: TeamInfoProps): JSX.Element | null {
  const { id, label, value, icon } = props;
  const classes = teamInfoStyles();
  const { t } = useTranslation("yourloops");

  if (_.isNil(value) || _.isEmpty(value)) {
    return null;
  }

  let infoLabel;
  if (label === "email") {
    // email key is common, so we can't use generic code here
    infoLabel = t("email");
  } else {
    infoLabel = t(`team-card-label-${label}`);
  }

  return (
    <div id={`team-card-info-${id}-${label}`} className={classes.card}>
      <Avatar className={classes.avatar}>{icon}</Avatar>
      <div className={classes.divLabelValue}>
        <span id={`team-card-info-${id}-${label}-label`}>{infoLabel}</span>
        <span id={`team-card-info-${id}-${label}-value`} className={classes.spanValue}>
          {value}
        </span>
      </div>
    </div>
  );
}

function TeamCard(props: TeamCardProps): JSX.Element {
  const { team, children } = props;
  const classes = teamCardStyles();
  const { id } = team;

  let address: JSX.Element | null = null;
  const teamAddress = team.address ?? null;
  if (teamAddress !== null) {
    const { line1, line2, zip, city, country } = teamAddress;
    const countryName = _.get(locales, `countries.${country}.name`, country) as string;
    address = (
      <React.Fragment>
        {line1}
        {_.isString(line2) ? (
          <React.Fragment>
            <br />
            {line2}
          </React.Fragment>
        ) : null}
        <br />
        {`${zip} ${city} ${countryName}`}
      </React.Fragment>
    );
  }

  const teamCode = getDisplayTeamCode(team.code);

  return (
    <Paper elevation={0} className={classes.paper} classes={{ root: classes.paperRoot }}>
      <div id={`team-card-${id}-actions`} className={classes.firstRow}>
        <h2 id={`team-card-${id}-name`} className={classes.teamName}>
          {team.name}
        </h2>
        <div className={classes.divActions}>
          {children}
        </div>
      </div>
      <div id={`team-card-${id}-infos`} className={classes.secondRow}>
        <TeamInfo id={id} label="code" value={teamCode} icon={<VerifiedIcon className={classes.teamInfoIcon} />} />
        <TeamInfo id={id} label="phone" value={team.phone} icon={<PhoneIcon className={classes.teamInfoIcon} />} />
        <TeamInfo id={id} label="address" value={address} icon={<LocationOnIcon className={classes.teamInfoIcon} />} />
        <TeamInfo id={id} label="email" value={team.email} icon={<EmailIcon className={classes.teamInfoIcon} />} />
      </div>
    </Paper>
  );
}

export default TeamCard;
