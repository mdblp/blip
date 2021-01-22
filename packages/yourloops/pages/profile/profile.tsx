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

import React, {
  CSSProperties,
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';

import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import HeaderBar from '../../components/header-bar';
import { User } from 'models/shoreline';
import { REGEX_EMAIL } from '../../lib/utils';

const getMockUser = (userid: User['userid']): User => ({
  userid,
  username: '',
  emails: ['ylp.ui.test+guest10@diabeloop.fr'],
  profile: {
    fullName: 'Léo Valette',
    firstName: 'Léo',
    lastName: 'Valette',
    patient: {},
  },
});

const availableLocalesMock = ['français', 'anglais', 'italien'];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

type Errors = {
  firstName: boolean;
  name: boolean;
  mail: boolean;
  password: boolean;
  passwordConfirmation: boolean;
};

export const ProfilePage: FunctionComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [locale, setLocale] = useState(availableLocalesMock[0]);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const userid = 'userid';
  const classes = useStyles();

  useEffect(() => {
    const { profile, emails } = getMockUser(userid);
    if (profile?.firstName) {
      setFirstName(profile.firstName);
    }
    if (profile?.lastName) {
      setName(profile.lastName);
    }
    if (emails && emails.length) {
      setMail(emails[0]);
    }
  }, [userid]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(event.target.value);
  };

  const handleLocaleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>
  ) => {
    setLocale(event.target.value as string);
  };

  const errors: Errors = useMemo(
    () => ({
      firstName: _.isEmpty(firstName),
      name: _.isEmpty(name),
      mail: !REGEX_EMAIL.test(mail),
      password: password.length < 10,
      passwordConfirmation: passwordConfirmation !== password,
    }),
    [firstName, name, mail, password, passwordConfirmation]
  );

  const onSave = useCallback(() => {
    console.log('save'); // TODO: API Call
  }, [firstName, name, mail]);

  const textFieldStyle: CSSProperties = { margin: '8px' };

  return (
    <Fragment>
      <HeaderBar />
      <div style={{ display: 'flex', flexDirection: 'column', margin: '16px' }}>
        <TextField
          id='firstName'
          label='firstName'
          value={firstName}
          onChange={(e) => handleChange(e, setFirstName)}
          error={errors.firstName}
          helperText={errors.firstName && 'Field required'}
          variant='outlined'
          style={textFieldStyle}
        />
        <TextField
          id='lastName'
          label='lastName'
          value={name}
          onChange={(e) => handleChange(e, setName)}
          error={errors.name}
          helperText={errors.name && 'Field required'}
          variant='outlined'
          style={textFieldStyle}
        />
        <TextField
          id='mail'
          label='mail'
          value={mail}
          onChange={(e) => handleChange(e, setMail)}
          error={errors.mail}
          helperText={errors.mail && 'Mail incorrect'}
          variant='outlined'
          style={textFieldStyle}
        />
        <TextField
          id='password'
          label='password'
          type='password'
          value={password}
          onChange={(e) => handleChange(e, setPassword)}
          error={errors.password}
          helperText={errors.password && 'Password too weak'}
          variant='outlined'
          style={textFieldStyle}
        />
        <TextField
          id='passwordConfirmation'
          label='password confirmation'
          type='password'
          value={passwordConfirmation}
          onChange={(e) => handleChange(e, setPasswordConfirmation)}
          error={errors.passwordConfirmation}
          helperText={
            errors.passwordConfirmation && 'Passwords are not matching'
          }
          variant='outlined'
          style={textFieldStyle}
        />
        <FormControl variant='outlined' className={classes.formControl}>
          <InputLabel
            style={{ backgroundColor: '#f7f7f8', padding: ' 0 8px' }}
            id='locale-selector'
          >
            Locale
          </InputLabel>
          <Select
            labelId='locale-selector'
            id='locale-selector'
            value={locale}
            onChange={handleLocaleChange}
          >
            {availableLocalesMock.map((locale) => (
              <MenuItem key={locale} value={locale}>
                {locale}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          onClick={onSave}
          style={{ margin: '8px' }}
        >
          Save
        </Button>
      </div>
    </Fragment>
  );
};
