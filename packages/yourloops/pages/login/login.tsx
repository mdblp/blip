/**
 * Copyright (c) 2020, Diabeloop
 * Login page
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

import _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps, globalHistory } from "@reach/router";
import bows from 'bows';

// import { makeStyles } from '@material-ui/core/styles';

import {
  // AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  IconButton,
  // Toolbar,
  TextField,
} from '@material-ui/core';

// import AddCircle from '@material-ui/icons/AddCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { t } from "../../lib/language";
import api from "../../lib/api";
import { User } from 'models/shoreline';

// import brandingLogo from "branding/logo.png";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LoginProps extends RouteComponentProps {
}

interface LoginState {
  username: string;
  password: string;
  showPassword: boolean;
  validateError: boolean;
  loginFormStyles: string[];
}

// const loginStyle = makeStyles((theme) => ({
//   toolBar: {
//     backgroundColor: "var(--mdc-theme-surface, white)",
//   },
//   menuButton: {
//     padding: theme.spacing(1),
//   },
//   title: {
//     color: "var(--mdc-theme-text-primary-on-background, black)",
//   },
//   logo: {
//   },
//   signUpButton: {
//     color: "var(--mdc-theme-text-button-on-surface, black)",
//     marginLeft: "auto",
//     "&:hover": {
//       color: "var(--mdc-theme-text-button-hover-on-surface, black)",
//     },
//   },
// }));

// function LoginToolBar(): JSX.Element {
//   const classes = loginStyle();

//   return (
//     <AppBar position="static">
//       <Toolbar className={classes.toolBar}>
//         <div className={classes.logo}>
//           <img className="toolbar-logo" alt={t("Logo")} />
//         </div>
//         {/* <Typography variant="h6" className={classes.title}>
//           Yourloops
//         </Typography> */}
//         {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
//           <MenuIcon />
//         </IconButton>
//         <Button color="inherit">Login</Button> */}
//         <Button className={classes.signUpButton}>
//           <AddCircle />
//           {t("Sign up")}
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// }

/**
 * Login page
 */
class Login extends React.Component<LoginProps, LoginState> {
  private log: Console;

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      validateError: false,
      showPassword: false,
      loginFormStyles: ['stage-transition-container-variant'],
    };

    this.log = bows('Login');

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onClickShowPasswordVisibility = this.onClickShowPasswordVisibility.bind(this);
    this.onClickLoginButton = this.onClickLoginButton.bind(this);
    this.onClickForgotPassword = this.onClickForgotPassword.bind(this);
    this.onClickSignup = this.onClickSignup.bind(this);
  }

  public render(): JSX.Element {
    const { username, password, showPassword, validateError } = this.state;

    const emptyUsername = _.isEmpty(username);
    const emptyPassword = _.isEmpty(password);

    return (
      <React.Fragment>
        <Container fixed={true} maxWidth="sm" style={{ margin: "auto" }}>
          <Card>
            <CardMedia id="login-card-logo">{null}</CardMedia>
            <CardContent>
              <form style={{ display: "flex", flexDirection: "column" }} noValidate autoComplete="off">
                <TextField
                  id="login-username"
                  label={t('Email')}
                  value={username}
                  required
                  error={validateError && emptyUsername}
                  onChange={this.onUsernameChange}
                />
                <FormControl>
                  <InputLabel htmlFor="login-password">{t('Password')}</InputLabel>
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    required
                    error={validateError && emptyPassword}
                    onChange={this.onPasswordChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.onClickShowPasswordVisibility}
                          onMouseDown={this.onMouseDownPassword.bind(this)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.onClickLoginButton}
                disabled={emptyUsername || emptyPassword}
              >
                {t("Login")}
              </Button>
            </CardActions>
          </Card>
        </Container>
      </React.Fragment>
    );
  }

  private onUsernameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  private onPasswordChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  private onClickShowPasswordVisibility() {
    const { showPassword } = this.state;
    if (showPassword) {
      this.setState({ showPassword: false });
      api.sendMetrics("Hide password");
    } else {
      this.setState({ showPassword: true });
      api.sendMetrics("Show password");
    }
  }

  private onMouseDownPassword(ev: React.MouseEvent): void {
    this.log.debug('onMouseDownPassword', ev);
  }

  private onClickLoginButton() {
    const { username, password } = this.state;
    if (_.isEmpty(username) || _.isEmpty(password)) {
      this.setState({ validateError: true });
      return;
    }
    this.setState({ validateError: false });
    api.login(username, password).then((user: User) => {
      this.log.info(user);
      globalHistory.navigate("/patient");
    }).catch((reason: unknown) => {
      this.log.error(reason);
    });
  }

  private onClickForgotPassword() {
    this.log.debug("onClickForgotPassword");
  }

  private onClickSignup() {
    this.log.debug("onClickSignup");
  }
}

export default Login;
