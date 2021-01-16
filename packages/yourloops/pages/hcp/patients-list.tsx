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
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { darken, makeStyles, Theme } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from "@material-ui/core/Toolbar";

import HomeIcon from "@material-ui/icons/Home";
import FlagIcon from "@material-ui/icons/Flag";
import FlagOutlineIcon from "@material-ui/icons/FlagOutlined";
import SearchIcon from "@material-ui/icons/Search";

import apiClient from "../../lib/api";
import { t } from "../../lib/language";
import { User } from "../../models/shoreline";

type SortDirection = "asc" | "desc";
type SortFields = "lastname" | "firstname";

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
  patients: User[];
  allPatients: User[];
  flagged: string[];
  order: SortDirection;
  orderBy: SortFields;
  filter: string;
}

interface BarProps {
  filter: string;
  onFilter: (text: string) => void;
}
const log = bows("PatientListPage");

const patientListStyle = makeStyles((/* theme_or_props */) => {
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
    },
    toolBarMiddle: {
      display: "flex",
      flexDirection: "column",
      marginRight: "auto",
      marginLeft: "auto",
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
        backgroundColor: darken(theme.palette.secondary.light, 0.05),
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
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.primary.main,
    },
    inputRoot: {
      color: 'black',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  };
});

function AppBarPage(props: BarProps): JSX.Element {
  const { filter, onFilter } = props;
  const classes = pageBarStyles();
  const history = useHistory();
  const handleClickMyPatients = (e: React.MouseEvent) => {
    e.preventDefault();
    history.push("/hcp/patients");
  };
  const handleFilterPatients = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    onFilter(value);
  };

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
        <div id="patients-list-toolbar-item-right">
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
      console.log("onClickFlag", e);
      onFlagPatient(userId);
    };
    const onRowClick = (e: React.MouseEvent) => {
      console.log("onRowClick", patient, e);
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
      patients: [],
      allPatients: [],
      flagged: whoAmI?.preferences?.patientsStarred ?? [],
      order: "asc",
      orderBy: "lastname",
      filter: "",
    };

    this.onSelectPatient = this.onSelectPatient.bind(this);
    this.onFlagPatient = this.onFlagPatient.bind(this);
    this.onSortList = this.onSortList.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  public componentDidMount(): void {
    log.debug("Mounted");

    apiClient.getUserShares().then((patients: User[]) => {
      this.setState({ patients, allPatients: patients, loading: false });
      this.onSortList(this.state.orderBy, this.state.order);
    }).catch((reason: unknown) => {
      log.error(reason);
    });
  }

  render(): JSX.Element | null {
    const { loading, patients, flagged, order, orderBy, filter } = this.state;

    if (loading) {
      return (
        <CircularProgress disableShrink style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }} />
      );
    }

    return (
      <React.Fragment>
        <AppBarPage filter={filter} onFilter={this.onFilter} />
        <Grid container direction="row" justify="center" alignItems="center" style={{ marginTop: "1.5em", marginBottom: "1.5em" }}>
          <Alert severity="info">{t("Data's are calculated for the last two weeks")}</Alert>
        </Grid>
        <Container maxWidth="lg">
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

  private onSelectPatient(user: User): void {
    log.info('Click on', user);
    this.props.history.push(`/hcp/patient/${user.userid}`);
  }

  private onFlagPatient(userId: string): void {
    apiClient.flagPatient(userId).then((flagged: string[]) => {
      this.setState({ flagged });
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
    const { patients, flagged } = this.state;

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

    this.setState({ patients, order, orderBy });
  }

  private onFilter(filter: string): void {
    const { allPatients, orderBy, order } = this.state;
    log.info("Filter patients with", filter);

    if (filter.length > 0) {
      const searchText = filter.toLocaleLowerCase();
      const patients = allPatients.filter((patient: User): boolean => {
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
      this.setState({ filter, patients }, () => this.onSortList(orderBy, order));
    } else {
      this.setState({ filter, patients: allPatients }, () => this.onSortList(orderBy, order));
    }
  }
}

export default PatientListPage;
