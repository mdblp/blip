/*
 * Copyright (c) 2025, Diabeloop
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

import { BannerContent } from './models/banner.model'

const pageAckStorageKey = 'acknowledgedDblCommunicationIds'
const bannerStorageKey = 'acknowledgedBannersIds'

// Should this be moved to dbl-communication.api.ts to have all code in the same place?
export function registerDblCommunicationAck(id: string): void {
  const ids = JSON.parse(localStorage.getItem(pageAckStorageKey) ?? '[]')
  if (!ids.includes(id)) {
    ids.push(id)
    localStorage.setItem(pageAckStorageKey, JSON.stringify(ids))
  }
}

export function isDblCommunicationAcknowledged(id: string): boolean {
  const ids = JSON.parse(localStorage.getItem(pageAckStorageKey) ?? '[]')
  return ids.includes(id)
}

export function registerBannerAck(id: string): void {
  const acknowledgmentNumbers = JSON.parse(localStorage.getItem(bannerStorageKey) ?? '{}')
  if (!acknowledgmentNumbers[id]) {
    acknowledgmentNumbers[id] = 1
  } else {
    acknowledgmentNumbers[id] += 1
  }
  localStorage.setItem(bannerStorageKey, JSON.stringify(acknowledgmentNumbers))
}

export function isBannerInfoAcknowledged(banner: BannerContent): boolean {
  const acknowledgmentNumbers = JSON.parse(localStorage.getItem(bannerStorageKey) ?? '{}')
  if (!acknowledgmentNumbers[banner.id]) {
    return false
  }
  return acknowledgmentNumbers[banner.id] >= banner.nbOfViewsBeforeHide
}

