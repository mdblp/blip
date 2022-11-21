/*
 * Copyright (c) 2022, Diabeloop
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

import { UserRoles } from '../models/user'
import { useAuth } from '../lib/auth'
import { NotificationContextProvider } from '../lib/notifications/hook'
import { Redirect } from 'react-router-dom'
import { HcpLayout } from './hcp-layout'
import { CaregiverLayout } from './caregiver-layout'
import { PatientLayout } from './patient-layout'
import { DataContextProvider, DefaultDataContext } from '../lib/data/hook'

export function MainLayout(): JSX.Element {
  const { user } = useAuth()

  const getUserLayout = (): JSX.Element => {
    switch (user?.role) {
      case UserRoles.hcp:
        return <HcpLayout />
      case UserRoles.caregiver:
        return <CaregiverLayout />
      case UserRoles.patient:
        return <PatientLayout />
      default:
        console.error(`no layout found for role ${user?.role}`)
        return <Redirect to="/not-found" />
    }
  }

  return (
    <React.Fragment>
      {user &&
        <NotificationContextProvider>
          <DataContextProvider context={DefaultDataContext}>
            {getUserLayout()}
          </DataContextProvider>
        </NotificationContextProvider>
      }
    </React.Fragment>
  )
}
