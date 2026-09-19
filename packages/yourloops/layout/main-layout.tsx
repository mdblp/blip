/*
 * Copyright (c) 2022-2026, Diabeloop
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

import React, { type FC, type ReactElement, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { NotificationContextProvider } from '../lib/notifications/notification.hook'
import { Navigate, Route } from 'react-router-dom'
import { CaregiverLayout } from './caregiver-layout'
import { PatientLayoutWithContext } from './patient-layout'
import { UserRole } from '../lib/auth/models/enums/user-role.enum'
import { HcpLayoutWithContext } from './hcp-layout'
import { AppUserRoute } from '../models/enums/routes.enum'
import metrics from '../lib/metrics'

export const MainLayout: FC = () => {
  const { user } = useAuth()

  const userRole = user?.role

  useEffect(() => {
    if (!userRole) {
      return
    }

    metrics.send('metrics', 'setRole', userRole)
  }, [userRole])

  const getUserLayout = (): ReactElement => {
    switch (userRole) {
      case UserRole.Hcp:
        return <HcpLayoutWithContext />
      case UserRole.Caregiver:
        return <CaregiverLayout />
      case UserRole.Patient:
        return <PatientLayoutWithContext />
      default:
        console.error(`no layout found for role ${user?.role}`)
        return <Route
          path="*"
          element={<Navigate to={AppUserRoute.NotFound} replace />}
        />
    }
  }

  return (
    <React.Fragment>
      {user &&
        <NotificationContextProvider>
          {getUserLayout()}
        </NotificationContextProvider>
      }
    </React.Fragment>
  )
}
