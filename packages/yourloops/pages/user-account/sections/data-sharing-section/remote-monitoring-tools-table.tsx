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

import React, { FC } from 'react'
import { ExternalConsent } from '../../../../lib/external-consents/models/external-consent.model'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Card from '@mui/material/Card'
import { useTranslation } from 'react-i18next'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { makeStyles } from 'tss-react/mui'
import myDiabbyLogo from 'my-diabby-logo.svg'
import glookoLogo from 'glooko-logo.svg'
import { PartnerName } from '../../../../lib/external-consents/models/enum/partner-name.enum'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { RevokeConsentDialog } from './revoke-consent-dialog'
import { formatDate } from 'dumb'
import { getRemoteMonitoringToolLabel } from './remote-monitoring.util'

interface RemoteMonitoringToolsTableProps {
  consents: ExternalConsent[]
  patientId: string
  refresh: () => void
}

const useStyles = makeStyles()(() => ({
  tableHeader: {
    backgroundColor: 'var(--primary-color-background)'
  },
  hideLastBorder: {
    '&:last-child td, &:last-child th': {
      border: 0
    }
  },
  toolName: {
    fontWeight: 'bold'
  }
}))

export const RemoteMonitoringToolsTable: FC<RemoteMonitoringToolsTableProps> = (props) => {
  const { consents, patientId, refresh } = props
  const { t } = useTranslation()
  const { classes } = useStyles()

  const [consentToRevoke, setConsentToRevoke] = React.useState<ExternalConsent>(null)
  const [showRevokeDialog, setShowRevokeDialog] = React.useState<boolean>(false)

  const getFormattedDate = (date: string) => {
    if (!date) {
      return t('N/A')
    }

    return formatDate(date)
  }

  const getRemoteMonitoringToolLogo = (consentName: PartnerName) => {
    switch (consentName) {
      case PartnerName.MyDiabby:
        return myDiabbyLogo
      case PartnerName.GlookoXT:
        return glookoLogo
      default:
        return ''
    }
  }

  const onClickRevoke = (consent: ExternalConsent) => {
    setConsentToRevoke(consent)
    setShowRevokeDialog(true)
  }

  const onCloseRevokeDialog = () => {
    setShowRevokeDialog(false)
  }

  const onSuccessRevoke = () => {
    onCloseRevokeDialog()
    refresh()
  }

  return (
    <>
      <Box sx={{ my: 3 }}>
        <Typography
          variant="body1"
          data-testid="remote-monitoring-tools-description"
        >{t('remote-monitoring-description')}</Typography>
      </Box>

      <Card variant="outlined" data-testid="remote-monitoring-tools-table">
        <TableContainer>
          <Table
            data-testid="remote-monitoring-tools-table"
            aria-label={t('aria-table-remote-monitoring-tools')}
          >
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>{t('remote-monitoring-tool')}</TableCell>
                <TableCell>{t('activation-date')}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {consents.map((consent: ExternalConsent) => (
                  <TableRow
                    key={consent.partnerId}
                    className={classes.hideLastBorder}
                    data-testid={`monitoring-tool-row-${consent.partnerName}`}
                  >
                    <TableCell>
                      <Avatar
                        variant="square"
                        src={getRemoteMonitoringToolLogo(consent.partnerName)}
                        alt={getRemoteMonitoringToolLabel(consent.partnerName)}
                      />
                    </TableCell>
                    <TableCell>
                    <span className={classes.toolName}>
                      {getRemoteMonitoringToolLabel(consent.partnerName)}
                    </span>
                    </TableCell>
                    <TableCell>{getFormattedDate(consent.consentDate)}</TableCell>
                    <TableCell align="right" sx={{ py: 0 }}>
                      <Button
                        variant="outlined"
                        onClick={() => onClickRevoke(consent)}
                      >
                        {t('revoke-consent')}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {consentToRevoke && showRevokeDialog &&
        <RevokeConsentDialog
          patientId={patientId}
          consent={consentToRevoke}
          onClose={onCloseRevokeDialog}
          onSuccess={onSuccessRevoke}
        />
      }
    </>

  )
}
