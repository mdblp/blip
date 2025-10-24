/*
 * Copyright (c) 2021-2025, Diabeloop
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

import React, { useEffect } from 'react'
import _ from 'lodash'
import bows from 'bows'

import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar';
import { BannerContent } from '../../lib/dbl-communication/models/banner.model'
import DblCommunicationApi from '../../lib/dbl-communication/dbl-communication.api'
import {
  isBannerInfoAcknowledged,
  registerBannerAck,
} from '../../lib/dbl-communication/storage'


export const Banner = (): JSX.Element => {
  const [closed, setClosed] = React.useState<boolean>(false)
  const [newBannerAvailable, setNewBannerAvailable] = React.useState<boolean>(false)
  const [banner, setBannerContent] = React.useState<BannerContent>()


  const acknowledgeCurrentBanner = () => {
    setClosed(true)
    registerBannerAck(banner?.id ?? 'N/A')
  }

  useEffect(() => {
    const dblInfo = DblCommunicationApi.getDblBanner()
    dblInfo.then((data) => {
      if(isBannerInfoAcknowledged(data)) {
        setNewBannerAvailable(false)
        return
      }
      setNewBannerAvailable(true)
      setBannerContent(data)
    })
  }, [])

  return (
    <Snackbar
      open={newBannerAvailable && !closed}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={null} // Pas de fermeture automatique pour les infos critiques
    >
      <Alert
        severity={banner?.level}
        onClose={acknowledgeCurrentBanner}
      >
        <div dangerouslySetInnerHTML={{ __html: banner?.message ?? '' }} />
      </Alert>
    </Snackbar>
  )
}
