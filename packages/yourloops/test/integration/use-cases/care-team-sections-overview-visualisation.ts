/*
 * Copyright (c) 2026, Diabeloop
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

import {
  checkCareTeamSectionCardForAlertsCustom,
  checkCareTeamSectionCardForAlertsDefault,
  checkCareTeamSectionCardForInfos,
  checkCareTeamSectionCardForMembers,
  checkCareTeamSectionsOverviewNotVisible,
  checkCareTeamSectionsOverviewVisible,
  checkClickViewMoreAlerts,
  checkClickViewMoreInfos,
  checkClickViewMoreMembers
} from '../assert/care-team-sections-overview-mobile'

export const testCareTeamSectionsOverviewVisibleMobile = (): void => {
  checkCareTeamSectionsOverviewVisible()
  checkCareTeamSectionCardForInfos()
  checkCareTeamSectionCardForMembers()
  checkCareTeamSectionCardForAlertsDefault()
}

export const testCareTeamSectionsOverviewNotVisibleMobile = (): void => {
  checkCareTeamSectionsOverviewNotVisible()
}

export const testCareTeamSectionCardForAlertCustomMessage = (): void => {
  checkCareTeamSectionCardForAlertsCustom()
}

export const testClickViewMoreInfos = (): void => {
  checkClickViewMoreInfos()
}

export const testClickViewMoreMembers = (): void => {
  checkClickViewMoreMembers()
}

export const testClickViewMoreAlerts = (): void => {
  checkClickViewMoreAlerts()
}
