/**
 * Copyright (c) 2021, Diabeloop
 * Patient list bar for HCPs
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

import * as React from "react";
import { useTranslation } from "react-i18next";

import { Theme, makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Backdrop from "@material-ui/core/Backdrop";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import { MenuProps } from "@material-ui/core/Menu";
import Modal from "@material-ui/core/Modal";
import NativeSelect from "@material-ui/core/NativeSelect";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import AccessTimeIcon from "@material-ui/icons/AccessTime";
import HomeIcon from "@material-ui/icons/Home";
import FlagIcon from "@material-ui/icons/Flag";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SearchIcon from "@material-ui/icons/Search";

import { TeamType } from "../../models/team";
import { defer, REGEX_EMAIL } from "../../lib/utils";
import { Team, useTeam } from "../../lib/team";
import { FilterType } from "./types";
import { MedicalServiceIcon } from "../../components/icons/MedicalServiceIcon";

export interface PatientListBarProps {
  filter: string;
  filterType: FilterType | string;
  onFilter: (text: string) => void;
  onFilterType: (filterType: FilterType | string) => void;
  onInvitePatient: (team: Team, username: string) => void;
}

const modalBackdropTimeout = 300;
const pageBarStyles = makeStyles((theme: Theme) => {
  return {
    appBar: {
      boxShadow: "0px 1px 2px #00000029",
      borderWidth: "0px",
    },
    toolBar: {
      display: "grid",
      gridTemplateRows: "auto",
      gridTemplateColumns: "auto auto auto",
      paddingLeft: "6em",
      paddingRight: "6em",
    },
    toolBarMiddle: {
      display: "flex",
      flexDirection: "row",
      marginRight: "auto",
      marginLeft: "auto",
    },
    toolBarRight: {
      display: "flex",
    },
    homeIcon: {
      marginRight: "0.5em",
    },
    breadcrumbText: {
      display: "flex",
      cursor: "default",
    },
    search: {
      display: "flex",
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.secondary.light,
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
      },
      transition: theme.transitions.create("background-color"),
      marginRight: theme.spacing(2),
      marginLeft: "auto",
      [theme.breakpoints.up("sm")]: {
        width: "15em",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.primary.main,
    },
    inputRoot: {
      color: "black",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, // eslint-disable-line no-magic-numbers
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    formControl: {
      marginRight: theme.spacing(1),
      minWidth: 120,
    },
    selectFilter: {
      flex: "1",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.secondary.light,
      [theme.breakpoints.up("sm")]: {
        width: "15em",
      },
    },
    selectFilterInnerDiv: {
      display: "flex",
      alignItems: "center",
      padding: "0px 0px 0px .5em",
      height: "100%",
      transition: theme.transitions.create("background-color"),
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
      },
      "&:focus": {
        backgroundColor: theme.palette.secondary.light,
        "&:hover": {
          backgroundColor: theme.palette.secondary.dark,
        },
      },
    },
    selectFilterIcon: {
      margin: "0 .5em 0 0",
    },
    buttonAddPatient: {
      marginLeft: "auto",
    },
    modalAddPatient: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    divModal: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[5], // eslint-disable-line no-magic-numbers
      padding: theme.spacing(2, 4, 3), // eslint-disable-line no-magic-numbers
      width: "25em",
    },
    formModal: {
      display: "flex",
      flexDirection: "column",
    },
    formControlSelectTeam: {
      marginTop: "1.5em",
    },
    divModalButtons: {
      display: "inline-flex",
      flexDirection: "row",
      marginTop: "2.5em",
    },
    divModalButtonCancel: {
      marginLeft: "auto",
      marginRight: theme.spacing(1),
    },
  };
});

function PatientsListBar(props: PatientListBarProps): JSX.Element {
  const selectMenuProps: Partial<MenuProps> = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };

  const { filter, filterType, onFilter, onFilterType, onInvitePatient } = props;
  const { t } = useTranslation("yourloops");
  const classes = pageBarStyles();
  const teamHook = useTeam();
  const [modalAddPatientOpen, setModalAddPatientOpen] = React.useState(false);
  const [modalSelectedTeam, setModalSelectedTeam] = React.useState("");
  const [modalUsername, setModalUsername] = React.useState("");
  const selectFilterValues = [
    { value: "all", label: t("select-all-patients"), icon: null },
    { value: "flagged", label: t("select-flagged-patients"), icon: <FlagIcon className={classes.selectFilterIcon} /> },
    {
      value: TeamType.private,
      label: t("private-practice"),
      icon: <MedicalServiceIcon className={classes.selectFilterIcon} />,
    },
    {
      value: "pending",
      label: t("select-pending-invitation-patients"),
      icon: <AccessTimeIcon className={classes.selectFilterIcon} />,
    },
  ];

  const handleFilterPatients = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onFilter(e.target.value);
  };
  const handleFilterTeam = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
    onFilterType(e.target.value as string);
  };
  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setModalUsername(e.target.value);
  };
  const handleChangeAddPatientTeam = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
    setModalSelectedTeam(e.target.value as string);
  };
  const handleOpenModalAddPatient = (): void => {
    setModalAddPatientOpen(true);
  };
  const handleCloseModalAddPatient = (): void => {
    defer(() => setModalUsername(""), modalBackdropTimeout);
    defer(() => setModalSelectedTeam(""), modalBackdropTimeout);
    setModalAddPatientOpen(false);
  };
  const handleModalAddPatient = (): void => {
    setModalAddPatientOpen(false);
    const team = teamHook.getTeam(modalSelectedTeam);
    if (team) {
      onInvitePatient(team, modalUsername);
    }
  };

  const optionsFilterCommonElements: JSX.Element[] = [];
  for (const sfv of selectFilterValues) {
    optionsFilterCommonElements.push(
      <MenuItem value={sfv.value} key={sfv.value} aria-label={sfv.label}>
        {sfv.icon}
        {sfv.label}
      </MenuItem>
    );
  }

  const optionsFilterTeamsElements: JSX.Element[] = [];
  const optionsTeamsElements: JSX.Element[] = [<option aria-label={t("aria-none")} value="" key="none" />];
  const teams = teamHook.getMedicalTeams();
  if (teams.length > 0) {
    optionsFilterTeamsElements.push(<ListSubheader key="team-sub-header">{t("teams")}</ListSubheader>);
    for (const team of teams) {
      optionsFilterTeamsElements.push(
        <MenuItem value={team.id} key={team.id} aria-label={team.name}>
          {team.name}
        </MenuItem>
      );
      optionsTeamsElements.push(
        <option value={team.id} key={team.id} aria-label={team.name}>
          {team.name}
        </option>
      );
    }
  }

  const buttonCreateDisabled = !(REGEX_EMAIL.test(modalUsername) && modalSelectedTeam.length > 0);

  return (
    <AppBar position="static" color="secondary" variant="outlined" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <div id="patients-list-toolbar-item-left">
          <Breadcrumbs aria-label={t("aria-breadcrumbs")}>
            <Typography color="textPrimary" className={classes.breadcrumbText}>
              <HomeIcon className={classes.homeIcon} />
              {t("my-patients-title")}
            </Typography>
          </Breadcrumbs>
        </div>
        <div id="patients-list-toolbar-item-middle" className={classes.toolBarMiddle}>
          <FormControl color="primary" className={classes.formControl}>
            <Select
              id="select-patient-list-filtertype"
              value={filterType}
              onChange={handleFilterTeam}
              classes={{ root: classes.selectFilterInnerDiv }}
              className={classes.selectFilter}
              disableUnderline
              MenuProps={selectMenuProps}>
              {optionsFilterCommonElements}
              {optionsFilterTeamsElements}
            </Select>
          </FormControl>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder={t("placeholder-search")}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": t("aria-search") }}
              value={filter}
              onChange={handleFilterPatients}
            />
          </div>
        </div>
        <div id="patients-list-toolbar-item-right" className={classes.toolBarRight}>
          <Button
            id="patient-list-toolbar-add-patient"
            color="primary"
            variant="contained"
            className={classes.buttonAddPatient}
            onClick={handleOpenModalAddPatient}>
            <PersonAddIcon />
            &nbsp;{t("add-patient")}
          </Button>
          <Modal
            id="patient-list-toolbar-modal-add-patient"
            aria-labelledby={t("add-patient")}
            className={classes.modalAddPatient}
            open={modalAddPatientOpen}
            onClose={handleCloseModalAddPatient}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: modalBackdropTimeout,
            }}>
            <Fade in={modalAddPatientOpen}>
              <div className={classes.divModal}>
                <h2 id="patient-list-toolbar-modal-add-patient-title">{t("modal-add-patient")}</h2>
                <form noValidate autoComplete="off" className={classes.formModal}>
                  <TextField
                    required
                    id="patient-list-toolbar-modal-add-patient-username"
                    onChange={handleChangeUsername}
                    value={modalUsername}
                    label={t("required")}
                  />
                  <FormControl className={classes.formControlSelectTeam}>
                    <InputLabel htmlFor="select-patient-list-modal-team">{t("team")}</InputLabel>
                    <NativeSelect
                      value={modalSelectedTeam}
                      onChange={handleChangeAddPatientTeam}
                      inputProps={{
                        name: "teamid",
                        id: "select-patient-list-modal-team",
                      }}>
                      {optionsTeamsElements}
                    </NativeSelect>
                  </FormControl>
                  <div className={classes.divModalButtons}>
                    <Button
                      id="patients-list-modal-button-close"
                      className={classes.divModalButtonCancel}
                      variant="contained"
                      onClick={handleCloseModalAddPatient}>
                      {t("common-cancel")}
                    </Button>
                    <Button
                      id="patients-list-modal-button-create"
                      disabled={buttonCreateDisabled}
                      onClick={handleModalAddPatient}
                      color="primary"
                      variant="contained">
                      {t("create")}
                    </Button>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default PatientsListBar;
