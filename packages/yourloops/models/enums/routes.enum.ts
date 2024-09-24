/*
 * Copyright (c) 2023-2024, Diabeloop
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

export enum AppUserRoute {
  Caregivers = '/caregivers',
  CareTeamSettings = '/teams/:teamId',
  PrivatePatientsList = '/teams/private/patients',
  PatientsList = '/teams/:teamId/patients',
  PatientView = '/teams/:teamId/patients/:patientId/*',
  Daily = '/daily',
  Device = '/device',
  Dashboard = '/dashboard',
  Home = '/home',
  NotFound = '/not-found',
  Notifications = '/notifications',
  Patient = '/patient',
  Patients = '/patients',
  Preferences = '/preferences',
  TargetAndAlerts = '/target-and-alerts',
  Teams = '/teams',
  Trends = '/trends'
}

export enum AppRoute {
  CompleteSignup = '/complete-signup',
  Login = '/login',
  NewConsent = '/new-consent',
  ProductLabelling = '/product-labelling',
  RenewConsent = '/renew-consent',
  SignupInformation = '/signup-information',
  Training = '/training',
  VerifyEmail = '/verify-email',
  VerifyEmailResult = '/verify-email-result'
}
