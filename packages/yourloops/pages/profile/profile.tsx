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

import {
  AppBar,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Toolbar,
} from '@material-ui/core';
import React, {
  CSSProperties,
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import i18n, { t } from '../../lib/language';

import HeaderBar from '../../components/header-bar';
import HomeIcon from '@material-ui/icons/Home';
import { Password } from '../../components/utils/password';
import { REGEX_EMAIL } from '../../lib/utils';
import _ from 'lodash';
import apiClient from '../../lib/auth/api';
import locales from '../../../../locales/languages.json';

enum Units {
  mole = 'mmol/L',
  gram = 'mg/dL',
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    homeIcon: {
      marginRight: '0.5em',
    },
    breadcrumbLink: {
      display: 'flex',
    },
    toolBar: {
      display: 'grid',
      gridTemplateRows: 'auto',
      gridTemplateColumns: 'auto auto auto',
      paddingLeft: '6em',
      paddingRight: '6em',
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

const getCurrentLocaleName = (): string => {
  const shortLocale = i18n.language.split('-')[0] as
    | 'en'
    | 'de'
    | 'es'
    | 'fr'
    | 'it'
    | 'nl';

  return locales.resources[shortLocale]?.name;
};

const getLocaleShortname = (locale: string): string => {
  let shortName = '';
  _.forEach(locales.resources, ({ name }, key) => {
    if (name === locale) {
      shortName = key;
    }
  });

  return shortName;
};

export const ProfilePage: FunctionComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [locale, setLocale] = useState(getCurrentLocaleName());
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [unit, setUnit] = useState(Units.mole);
  const [hasChanged, setHasChanged] = useState(false);

  const classes = useStyles();

  const availableLocales = useMemo(
    () => _.map(locales.resources, ({ name }) => name),
    []
  );

  useEffect(() => {
    const user = apiClient.whoami;
    if (user?.profile?.firstName) {
      setFirstName(user.profile.firstName);
    }
    if (user?.profile?.lastName) {
      setName(user.profile.lastName);
    }
    if (user?.emails && user.emails.length) {
      setMail(user.emails[0]);
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    setHasChanged(true);
    setState(event.target.value);
  };

  const handleLocaleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: string | unknown;
    }>
  ): void => {
    setHasChanged(true);
    setLocale(event.target.value as string);
  };

  const handleUnitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setHasChanged(true);
    if (event.target.value === Units.mole) {
      setUnit(Units.mole);
    } else if (event.target.value === Units.gram) {
      setUnit(Units.gram);
    }
  };

  const errors: Errors = useMemo(
    () => ({
      firstName: _.isEmpty(firstName),
      name: _.isEmpty(name),
      mail: !REGEX_EMAIL.test(mail),
      password: password.length > 0 && password.length < 10,
      passwordConfirmation: passwordConfirmation !== password,
    }),
    [firstName, name, mail, password, passwordConfirmation]
  );

  const onSave = useCallback(() => {
    setHasChanged(false);
    if (getCurrentLocaleName() !== locale) {
      const newLocale = getLocaleShortname(locale);
      i18n.changeLanguage(newLocale);
    }
    console.log('save'); // TODO: API Call
  }, [firstName, name, mail, locale]);

  const textFieldStyle: CSSProperties = { margin: '8px' };

  return (
    <Fragment>
      <HeaderBar />
      <AppBar position='static' color='secondary'>
        <Toolbar className={classes.toolBar}>
          <Breadcrumbs aria-label={t('breadcrumb')}>
            <Link
              className={classes.breadcrumbLink}
              color='textPrimary'
              href='/hcp'
            >
              <HomeIcon className={classes.homeIcon} />
              {t('My Patients')}
            </Link>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Container maxWidth='lg'>
        <div
          style={{ display: 'flex', flexDirection: 'column', margin: '16px' }}
        >
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
          <Password
            id='password'
            label='password'
            value={password}
            error={errors.password}
            helperText={'Password too weak'}
            style={textFieldStyle}
            setState={setPassword}
          />
          <Password
            id='passwordConfirmation'
            label='password confirmation'
            value={passwordConfirmation}
            error={errors.passwordConfirmation}
            helperText={'Passwords are not matching'}
            style={textFieldStyle}
            setState={setPasswordConfirmation}
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
              {availableLocales.map((locale) => (
                <MenuItem key={locale} value={locale}>
                  {locale}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <RadioGroup
              row
              aria-label='position'
              name='unit'
              value={unit}
              onChange={handleUnitChange}
            >
              <FormControlLabel
                value={Units.mole}
                control={<Radio color='primary' />}
                label={Units.mole}
                labelPlacement='start'
              />
              <FormControlLabel
                value={Units.gram}
                control={<Radio color='primary' />}
                label={Units.gram}
                labelPlacement='start'
              />
            </RadioGroup>
          </FormControl>
          <Button
            variant='contained'
            disabled={!hasChanged}
            color='primary'
            onClick={onSave}
            style={{ margin: '8px' }}
          >
            {t('Save')}
          </Button>
        </div>
      </Container>
    </Fragment>
  );
};
