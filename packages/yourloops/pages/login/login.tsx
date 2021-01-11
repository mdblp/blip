/* eslint-disable no-unused-vars */
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

import _ from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
//import bows from "bows";

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  InputAdornment,
  IconButton,
  TextField,
  Grid,
  Button,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { t } from "../../lib/language";
import brandingLogo from "branding/logo.png";
import { useState } from "react";
import { useAuth } from "../../lib/auth/hook/use-auth";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LoginProps extends RouteComponentProps {
}

/**
 * Login page
 */
function Login(props : LoginProps ) : JSX.Element {
  //   this.log = bows("Login");

  function onUsernameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setUserName(event.target.value);
  }

  function onPasswordChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setPassword(event.target.value);
  }
  
  function onClickShowPasswordVisibility() {
    if (showPassword) {
      setShowPassword(false);
      //authApi.sendMetrics("Hide password");
    } else {
      setShowPassword(true);
      // authApi.sendMetrics("Show password");
    }
  }
  
  // function onMouseDownPassword(ev: React.MouseEvent): void {
  //   //this.log.debug("onMouseDownPassword", ev);
  // }
  
  function onClickLoginButton() {
    //const { username, password } = this.state;
    if (_.isEmpty(username) || _.isEmpty(password)) {
      setValidateError(true);
      return;
    }
    setValidateError(false);
    // eslint-disable-next-line no-use-before-define
    auth.login(username, password)
      .then(() => {
        props.history.push("/home");
        // if (api.userIsPatient) {
        //   this.props.history.push("/patient");
        // } else {
        //   this.props.history.push("/hcp");
        // }
      }).catch((reason: Error) => {
        console.log(reason);
        //this.log.error(reason);
        setValidateError(true);
        setHelperTextValue(reason.message);
      });
  }
  
  // function onClickForgotPassword() {
  //   //this.log.debug("onClickForgotPassword");
  // }
  
  // function onClickSignup() {
  //   //this.log.debug("onClickSignup");
  // }

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword ] = useState(false);
    const [validateError, setValidateError ] = useState(false);
    const [helperTextValue, setHelperTextValue ] = useState("");
    //const loginFormStyles = useState(["stage-transition-container-variant"]);
    const auth = useAuth();
    const emptyUsername = _.isEmpty(username);
    const emptyPassword = _.isEmpty(password);

    return (
      <Container maxWidth="sm" style={{ margin: "auto" }}>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item xs={12}>
            <Card>
              <CardMedia style={{ display: "flex", paddingTop: "1em", paddingBottom: "1em" }}>
                <img src={brandingLogo} style={{ height: "60px", marginLeft: "auto", marginRight: "auto" }} alt={t('Login Branding Logo')} />
              </CardMedia>
              <CardContent>
                <form style={{ display: "flex", flexDirection: "column" }} noValidate autoComplete="off">
                  <TextField
                    id="login-username"
                    label={t("Email")}
                    value={username}
                    required
                    error={validateError && emptyUsername}
                    onChange={onUsernameChange}
                    helperText={helperTextValue}
                  />
                  <TextField
                    id="login-password"
                    label={t("Password")}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    error={validateError && emptyPassword}
                    onChange={onPasswordChange}
                    helperText={helperTextValue}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onClickShowPasswordVisibility}
                            //onMouseDown={onMouseDownPassword.bind(this)}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClickLoginButton}
                  disabled={emptyUsername || emptyPassword}
                >
                  {t("Login")}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    ); 
  }

export default Login;
