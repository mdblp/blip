/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { makeStyles } from 'tss-react/mui'

export const userAccountFormCommonClasses = makeStyles()((theme) => ({
  button: {
    marginLeft: theme.spacing(2)
  },
  cancelLink: {
    textDecoration: 'unset'
  },
  formInput: {
    marginTop: theme.spacing(2)
  },
  title: {
    color: theme.palette.primary.main,
    textAlign: 'center',
    width: '100%'
  },
  container: {
    backgroundColor: 'white',
    marginTop: '32px',
    padding: 0,
    [theme.breakpoints.up('sm')]: {
      border: 'solid',
      borderRadius: theme.spacing(3),
      borderColor: theme.palette.grey[300],
      borderWidth: '1px',
      padding: '0 64px'
    }
  },
  uppercase: {
    textTransform: 'uppercase'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.up('sm')]: {
      '& > div': {
        width: 'calc(50% - 16px)'
      }
    }
  },
  categoryLabel: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(5),
    '& > :nth-child(2)': {
      marginLeft: theme.spacing(1)
    }
  }
}))
