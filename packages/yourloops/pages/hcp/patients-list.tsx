/**
 * Copyright (c) 2021, Diabeloop
 * Patient list for HCPs
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

import * as React from "react";
import bows from "bows";
import { useHistory, RouteComponentProps } from "react-router-dom";

import Alert from "@material-ui/lab/Alert";
import AppBar from "@material-ui/core/AppBar";
import Backdrop from "@material-ui/core/Backdrop";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import NativeSelect from "@material-ui/core/NativeSelect";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";

import HomeIcon from "@material-ui/icons/Home";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlineIcon from "@material-ui/icons/FlagOutlined";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SearchIcon from "@material-ui/icons/Search";

import apiClient from "../../lib/api";
import { defer, REGEX_EMAIL } from "../../lib/utils";
import { t } from "../../lib/language";
import { User } from "../../models/shoreline";

type SortDirection = "asc" | "desc";
type SortFields = "lastname" | "firstname";
type FilterType = "all" | "flagged" | "pending" | string;

/**
 * FIXME: Remove me when we have the team API
 */
interface Team {
  id: string;
  name: string;
}

interface PatientListProps {
  patients: User[];
  flagged: string[];
  order: SortDirection;
  orderBy: SortFields;
  onClickPatient: (user: User) => void;
  onFlagPatient: (userId: string) => void;
  onSortList: (field: SortFields, direction: SortDirection) => void;
}

interface PatientListPageState {
  loading: boolean;
  errorMessage: string | null;
  patients: User[];
  allPatients: User[];
  teams: Team[];
  flagged: string[];
  order: SortDirection;
  orderBy: SortFields;
  filter: string;
  filterType: FilterType;
}

interface BarProps {
  teams: Team[];
  filter: string;
  filterType: FilterType;
  onFilter: (text: string) => void;
  onFilterType: (filterType: FilterType) => void;
  onInvitePatient: (username: string, teamId: string) => void;
}

const log = bows("PatientListPage");
const modalBackdropTimeout = 300;
const patientListStyle = makeStyles(( /* theme: Theme */) => {
  return {
    table: {
      width: "100%",
    },
    tableRow: {
      cursor: "pointer",
    },
    tableRowHeader: {
      fontVariant: "small-caps",
    },
  };
});
const pageBarStyles = makeStyles((theme: Theme) => {
  /* eslint-disable no-magic-numbers */
  return {
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
    breadcrumbLink: {
      display: "flex",
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
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
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
    nativeSelectFilter: {
      flex: "1",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.secondary.light,
      transition: theme.transitions.create("background-color"),
      "&:active": {
        backgroundColor: theme.palette.secondary.dark,
      },
      "&:hover": {
        backgroundColor: theme.palette.secondary.dark,
      },
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
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
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

function AppBarPage(props: BarProps): JSX.Element {
  const selectFilterValues = [
    { value: "all", label: t("select-all-patients") },
    { value: "flagged", label: t("🏴 Only flagged patients") },
    { value: "pending", label: t("🕓 Pending invitations") },
  ];

  const { filter, filterType, teams, onFilter, onFilterType, onInvitePatient } = props;
  const classes = pageBarStyles();
  const history = useHistory();
  const [modalAddPatientOpen, setModalAddPatientOpen] = React.useState(false);
  const [modalSelectedTeam, setModalSelectedTeam] = React.useState("");
  const [modalUsername, setModalUsername] = React.useState("");

  const handleClickMyPatients = (e: React.MouseEvent) => {
    e.preventDefault();
    history.push("/hcp/patients");
  };
  const handleFilterPatients = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onFilter(e.target.value);
  };
  const handleFilterTeam = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    onFilterType(e.target.value as string);
  };
  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setModalUsername(e.target.value);
  };
  const handleChangeAddPatientTeam = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    setModalSelectedTeam(e.target.value as string);
  };
  const handleOpenModalAddPatient = () => {
    setModalAddPatientOpen(true);
  };
  const handleCloseModalAddPatient = () => {
    defer(() => setModalUsername(""), modalBackdropTimeout);
    defer(() => setModalSelectedTeam(""), modalBackdropTimeout);
    setModalAddPatientOpen(false);
  };
  const handleModalAddPatient = () => {
    setModalAddPatientOpen(false);
    onInvitePatient(modalUsername, modalSelectedTeam);
  };

  const optionsFilterCommonElements: JSX.Element[] = [];
  for (const sfv of selectFilterValues) {
    optionsFilterCommonElements.push(<option value={sfv.value} key={sfv.value} aria-label={sfv.label}>{sfv.label}</option>);
  }

  const optionsFilterTeamsElements: JSX.Element[] = [];
  const optionsTeamsElements: JSX.Element[] = [
    <option aria-label={t("aria-none")} value="" key="none" />,
  ];
  for (const team of teams) {
    optionsFilterTeamsElements.push(<option value={team.id} key={team.id} aria-label={team.name}>{team.name}</option>);
    optionsTeamsElements.push(<option value={team.id} key={team.id} aria-label={team.name}>{team.name}</option>);
  }

  const buttonCreateDisabled = !(REGEX_EMAIL.test(modalUsername) && modalSelectedTeam.length > 0);

  return (
    <AppBar position="static" color="secondary">
      <Toolbar className={classes.toolBar}>
        <div id="patients-list-toolbar-item-left">
          <Breadcrumbs aria-label={t("breadcrumb")}>
            <Link color="textPrimary" className={classes.breadcrumbLink} href="/hcp/patients" onClick={handleClickMyPatients}>
              <HomeIcon className={classes.homeIcon} />
              {t("My Patients")}
            </Link>
          </Breadcrumbs>
        </div>
        <div id="patients-list-toolbar-item-middle" className={classes.toolBarMiddle}>
          <FormControl color="primary" className={classes.formControl}>
            <NativeSelect id="select-patient-list-filtertype" className={classes.nativeSelectFilter} value={filterType} onChange={handleFilterTeam}>
              {optionsFilterCommonElements}
              <optgroup label={t("Teams")}>
                {optionsFilterTeamsElements}
              </optgroup>
            </NativeSelect>
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
            onClick={handleOpenModalAddPatient}
          >
            <PersonAddIcon />&nbsp;{t("button-add-patient")}
          </Button>
          <Modal
            id="patient-list-toolbar-modal-add-patient"
            aria-labelledby={t("aria-modal-add-patient")}
            className={classes.modalAddPatient}
            open={modalAddPatientOpen}
            onClose={handleCloseModalAddPatient}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: modalBackdropTimeout,
            }}
          >
            <Fade in={modalAddPatientOpen}>
              <div className={classes.divModal}>
                <h2 id="patient-list-toolbar-modal-add-patient-title">{t("modal-add-patient")}</h2>
                <form noValidate autoComplete="off" className={classes.formModal}>
                  <TextField required id="patient-list-toolbar-modal-add-patient-username" onChange={handleChangeUsername} value={modalUsername} label={t("Required")} />
                  <FormControl className={classes.formControlSelectTeam}>
                    <InputLabel htmlFor="select-patient-list-modal-team">{t("Team")}</InputLabel>
                    <NativeSelect
                      value={modalSelectedTeam}
                      onChange={handleChangeAddPatientTeam}
                      inputProps={{ name: "teamid", id: "select-patient-list-modal-team" }}>
                      {optionsTeamsElements}
                    </NativeSelect>
                  </FormControl>
                  <div className={classes.divModalButtons}>
                    <Button id="patients-list-modal-button-close" className={classes.divModalButtonCancel} variant="contained" onClick={handleCloseModalAddPatient}>{t("Cancel")}</Button>
                    <Button id="patients-list-modal-button-create" disabled={buttonCreateDisabled} onClick={handleModalAddPatient} color="primary" variant="contained">{t("Create")}</Button>
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

function PatientsList(props: PatientListProps): JSX.Element {
  const { patients, flagged, order, orderBy, onClickPatient, onFlagPatient, onSortList } = props;
  const classes = patientListStyle();
  const elems = [];
  const nPatients = patients.length;

  for (let i = 0; i < nPatients; i++) {
    const patient = patients[i];
    const userId = patient.userid;
    const firstName = patient.profile?.firstName ?? "";
    const lastName = patient.profile?.lastName ?? patient.profile?.fullName ?? patient.username;
    const isFlagged = flagged.includes(userId);
    const onClickFlag = (e: React.MouseEvent) => {
      e.stopPropagation();
      log.debug("onClickFlag", e);
      onFlagPatient(userId);
    };
    const onRowClick = (e: React.MouseEvent) => {
      log.debug("onRowClick", patient, e);
      onClickPatient(patient);
    };
    elems.push(
      <TableRow id={`patients-list-row-${userId}`} key={userId} tabIndex={-1} hover onClick={onRowClick} className={classes.tableRow}>
        <TableCell id={`patients-list-row-flag-${userId}`}>
          <IconButton aria-label={t("aria-flag-patient")} size="small" onClick={onClickFlag}>
            {isFlagged ? <FlagIcon /> : <FlagOutlineIcon />}
          </IconButton>
        </TableCell>
        <TableCell id={`patients-list-row-lastname-${userId}`}>{lastName}</TableCell>
        <TableCell id={`patients-list-row-firstname-${userId}`}>{firstName}</TableCell>
        <TableCell id={`patients-list-row-tir-${userId}`}>{t("N/A")}</TableCell>
        <TableCell id={`patients-list-row-avg-glucose-${userId}`}>{t("N/A")}</TableCell>
        <TableCell id={`patients-list-row-tbr-${userId}`}>{t("N/A")}</TableCell>
        <TableCell id={`patients-list-row-upload-${userId}`}>{t("N/A")}</TableCell>
      </TableRow>
    );
  }

  const createSortHandler = (property: SortFields) => {
    return (/* event: React.MouseEvent */): void => {
      onSortList(property, order === "asc" ? "desc" : "asc");
    };
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label={t("aria-table-list-patient")} stickyHeader>
        <TableHead>
          <TableRow className={classes.tableRowHeader}>
            <TableCell id="patients-list-header-flag" />
            <TableCell id="patients-list-header-lastname">
              <TableSortLabel active={orderBy === "lastname"} direction={order} onClick={createSortHandler("lastname")}>
                {t("list-patient-lastname")}
              </TableSortLabel>
            </TableCell>
            <TableCell id="patients-list-header-firstname">
              <TableSortLabel active={orderBy === "firstname"} direction={order} onClick={createSortHandler("firstname")}>
                {t("list-patient-firstname")}
              </TableSortLabel>
            </TableCell>
            <TableCell id="patients-list-header-tir">{t("list-patient-tir")}</TableCell>
            <TableCell id="patients-list-header-avg-glucose">{t("list-patient-avg-glucose")}</TableCell>
            <TableCell id="patients-list-header-tbr">{t("list-patient-tbr")}</TableCell>
            <TableCell id="patients-list-header-upload">{t("list-patient-upload")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elems}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

class PatientListPage extends React.Component<RouteComponentProps, PatientListPageState> {
  constructor(props: RouteComponentProps) {
    super(props);

    const whoAmI = apiClient.whoami;
    this.state = {
      loading: true,
      errorMessage: null,
      patients: [],
      allPatients: [],
      teams: [{ // FIXME
        id: "team-1",
        name: "CHU Grenoble",
      }, {
        id: "team-2",
        name: "Clinique Nantes",
      }],
      flagged: whoAmI?.preferences?.patientsStarred ?? [],
      order: "asc",
      orderBy: "lastname",
      filter: "",
      filterType: "all",
    };

    this.onSelectPatient = this.onSelectPatient.bind(this);
    this.onFlagPatient = this.onFlagPatient.bind(this);
    this.onInvitePatient = this.onInvitePatient.bind(this);
    this.onSortList = this.onSortList.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onFilterType = this.onFilterType.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.updatePatientList = this.updatePatientList.bind(this);
  }

  public componentDidMount(): void {
    log.debug("Mounted");
    this.onRefresh();
  }

  render(): JSX.Element | null {
    const { loading, patients, teams, flagged, order, orderBy, filter, filterType, errorMessage } = this.state;

    if (loading) {
      return (
        <CircularProgress disableShrink style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }} />
      );
    }
    if (errorMessage !== null) {
      return (
        <div id="div-api-error-message" className="api-error-message">
          <Alert id="alert-api-error-message" severity="error" style={{ marginBottom: "1em" }}>{errorMessage}</Alert>
          <Button id="button-api-error-message" variant="contained" color="secondary" onClick={this.onRefresh}>{t("Again !")}</Button>
        </div>
      );
    }

    return (
      <React.Fragment>
        <AppBarPage
          filter={filter}
          filterType={filterType}
          teams={teams}
          onFilter={this.onFilter}
          onFilterType={this.onFilterType}
          onInvitePatient={this.onInvitePatient} />
        <Grid container direction="row" justify="center" alignItems="center" style={{ marginTop: "1.5em", marginBottom: "1.5em" }}>
          <Alert severity="info">{t("Data's are calculated for the last two weeks")}</Alert>
        </Grid>
        <Container maxWidth="lg" style={{ marginBottom: "2em" }}>
          <PatientsList
            patients={patients}
            flagged={flagged}
            order={order}
            orderBy={orderBy}
            onClickPatient={this.onSelectPatient}
            onFlagPatient={this.onFlagPatient}
            onSortList={this.onSortList} />
        </Container>
      </React.Fragment>
    );
  }

  private onRefresh(): void {
    this.setState({ loading: true, errorMessage: null }, async () => {
      try {
        const patients = await apiClient.getUserShares();
        this.setState({ patients, allPatients: patients, loading: false }, this.updatePatientList);
      } catch (reason: unknown) {
        log.error("onRefresh", reason);
        let errorMessage: string;
        if (reason instanceof Error) {
          errorMessage = reason.message;
        } else {
          const s = new String(reason);
          errorMessage = s.toString();
        }
        this.setState({ loading: false, errorMessage });
      }
    });
  }

  private onSelectPatient(user: User): void {
    log.info("Click on", user);
    this.props.history.push(`/hcp/patient/${user.userid}`);
  }

  private onFlagPatient(userId: string): void {
    apiClient.flagPatient(userId).then((flagged: string[]) => {
      this.setState({ flagged });
    });
  }

  private onInvitePatient(username: string, teamId: string): void {
    log.info("onInvitePatient", username, teamId);
    this.setState({ loading: true, errorMessage: null }, async () => {
      try {
        // await apiClient.invitePatient(username, teamId);
        const patients = await apiClient.getUserShares();
        this.setState({ patients, allPatients: patients, loading: false }, this.updatePatientList);
      } catch (reason: unknown) {
        let errorMessage: string;
        if (reason instanceof Error) {
          errorMessage = reason.message;
        } else {
          const s = new String(reason);
          errorMessage = s.toString();
        }
        this.setState({ loading: false, errorMessage });
      }
    });
  }

  /**
   * Compare two patient for sorting the patient table
   * @param a A patient
   * @param b A âtient
   * @param flagged Pinned patient
   * @param orderBy Sort field
   */
  private doCompare(a: User, b: User, orderBy: SortFields): number {
    let aValue: string;
    let bValue: string;
    switch (orderBy) {
    case "firstname":
      aValue = a.profile?.firstName ?? "😀";
      bValue = b.profile?.firstName ?? "😀";
      break;
    case "lastname":
      aValue = a.profile?.lastName ?? a.profile?.fullName ?? a.username;
      bValue = b.profile?.lastName ?? b.profile?.fullName ?? b.username;
      break;
    }

    return aValue.localeCompare(bValue);
  }

  private onSortList(orderBy: SortFields, order: SortDirection): void {
    log.info("Sort patients", orderBy, order);
    this.setState({ order, orderBy }, this.updatePatientList);
  }

  private onFilter(filter: string): void {
    log.info("Filter patients name", filter);
    this.setState({ filter }, this.updatePatientList);
  }

  private onFilterType(filterType: FilterType): void {
    log.info("Filter patients with", filterType);
    this.setState({ filterType }, this.updatePatientList);
  }

  private updatePatientList() {
    const { allPatients, filter, filterType, flagged, order, orderBy } = this.state;

    let patients = allPatients;
    if (filter.length > 0) {
      const searchText = filter.toLocaleLowerCase();
      patients = allPatients.filter((patient: User): boolean => {
        switch (filterType) {
        case "all":
          break;
        case "flagged":
          if (!flagged.includes(patient.userid)) {
            return false;
          }
          break;
        case "pending":
          return false; // TODO
        default:
          break;
        }

        const firstName = patient.profile?.firstName ?? "";
        if (firstName.toLocaleLowerCase().includes(searchText)) {
          return true;
        }
        const lastName = patient.profile?.lastName ?? patient.profile?.fullName ?? patient.username;
        if (lastName.toLocaleLowerCase().includes(searchText)) {
          return true;
        }
        return false;
      });
    } else if (filterType === "flagged") {
      patients = allPatients.filter((patient: User): boolean => flagged.includes(patient.userid));
    } else if (filterType === "pending") {
      patients = []; // TODO
    } else if (filterType !== "all") {
      // TODO
    }

    // Sort the patients
    patients.sort((a: User, b: User): number => {
      const aFlagged = flagged.includes(a.userid);
      const bFlagged = flagged.includes(b.userid);
      // Flagged: always first
      if (aFlagged && !bFlagged) {
        return -1; // eslint-disable-line no-magic-numbers
      }
      if (!aFlagged && bFlagged) {
        return 1;
      }

      let c = this.doCompare(a, b, orderBy);
      if (c === 0) {
        // In case of equality: choose another field
        if (orderBy === "lastname") {
          c = this.doCompare(a, b, "firstname");
        } else {
          c = this.doCompare(a, b, "lastname");
        }
      }
      return order === "asc" ? c : -c;
    });

    this.setState({ patients });
  }
}

export default PatientListPage;
