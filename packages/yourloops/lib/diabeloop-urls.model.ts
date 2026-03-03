/*
 * Copyright (c) 2021-2026, Diabeloop
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
import { AppRoute } from '../models/enums/routes.enum'

/**
 * Class containing all external URLs related to Diabeloop
 */
class DiabeloopExternalUrls {
  readonly dblDiabetes: string = 'https://www.dbl-diabetes.com';
  readonly contactEmail: string = 'yourloops@diabeloop.com';
  readonly support: string = 'https://www.diabeloop.com';
}

export const diabeloopExternalUrls = new DiabeloopExternalUrls()
export const PUBLIC_ROUTES = [AppRoute.Login, AppRoute.VerifyEmail, AppRoute.VerifyEmailResult, AppRoute.SignupInformation]
export const ALWAYS_ACCESSIBLE_ROUTES = [AppRoute.ProductLabelling]
export const ROUTES_REQUIRING_LANGUAGE_SELECTOR = [
  AppRoute.RenewConsent,
  AppRoute.NewConsent,
  AppRoute.Training,
  AppRoute.SignupInformation,
  AppRoute.CompleteSignup,
  AppRoute.ProductLabelling,
  AppRoute.VerifyEmail,
  AppRoute.VerifyEmailResult
]
