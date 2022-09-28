/**
 * Copyright (c) 2021, Diabeloop
 * Patient list filters (HCP / Caregivers) component for secondary header bar
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

import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, Theme } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'

import SearchIcon from '@material-ui/icons/Search'

export interface PatientFiltersProps {
  filter: string
  onFilter: (text: string) => void
}

const filtersStyles = makeStyles((theme: Theme) => {
  return {
    formControl: {
      marginRight: theme.spacing(1),
      minWidth: 120,
      [theme.breakpoints.down('sm')]: {
        marginRight: theme.spacing(1),
        marginLeft: 0,
        width: '50%'
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        marginRight: 0,
        marginBottom: theme.spacing(2),
        height: '3em'
      }
    },
    inputRoot: {
      color: theme.palette.grey[800],
      width: '100%'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, // eslint-disable-line no-magic-numbers
      transition: theme.transitions.create('width'),
      width: '100%'
    },
    search: {
      display: 'flex',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark
      },
      transition: theme.transitions.create('background-color'),
      marginRight: theme.spacing(2),
      marginLeft: 'auto',
      [theme.breakpoints.up('sm')]: {
        width: '100%'
      },
      [theme.breakpoints.down('sm')]: {
        width: '50%',
        marginRight: 0,
        marginLeft: theme.spacing(1),
        '&:first-child': {
          width: '100%'
        }
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        marginLeft: 0,
        height: '3em'
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.grey[800]
    },
    selectFilter: {
      flex: '1',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      [theme.breakpoints.up('sm')]: {
        width: '15em'
      },
      [theme.breakpoints.down('sm')]: {
        width: 'initial'
      }
    },
    selectFilterInnerDiv: {
      display: 'flex',
      alignItems: 'center',
      padding: '0px 0px 0px .5em',
      height: '100%',
      transition: theme.transitions.create('background-color'),
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark
      },
      '&:focus': {
        backgroundColor: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark
        }
      }
    }
  }
}, { name: 'ylp-secondary-bar-patient-filters' })

/**
 * Patient list filters (HCP / Caregivers) component for secondary header bar
 * @param props PatientFiltersProps
 * @returns The center element of the secondary header bar
 */
function PatientFilters(props: PatientFiltersProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const classes = filtersStyles()
  const { filter, onFilter } = props

  const handleFilterPatients = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    onFilter(e.target.value)
  }

  return (
    <React.Fragment>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          aria-label={t('patient-list-searchbar')}
          placeholder={t('placeholder-search')}
          classes={{ root: classes.inputRoot, input: classes.inputInput }}
          inputProps={{ 'aria-label': t('aria-search') }}
          value={filter}
          onChange={handleFilterPatients}
        />
      </div>
    </React.Fragment>
  )
}

export default PatientFilters
