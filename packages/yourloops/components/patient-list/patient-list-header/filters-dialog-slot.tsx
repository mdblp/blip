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

import React, { SetStateAction } from 'react'

import { PatientFiltersPopover } from '../patient-filters-popover'
import TeamCodeDialog from '../../patient/team-code-dialog'
import { Team } from '../../../lib/team'
import { InvitePatientDialog } from '../../patient/invite-patient-dialog/invite-patient-dialog'

interface FiltersDialogSlotProps {
  isFiltersDialogOpen: boolean
  teamCodeDialogSelectedTeam: Team
  anchorEl: HTMLElement | null
  onPatientFiltersClose: () => void
  isSelectedTeamPrivate: boolean
  setTeamCodeDialogSelectedTeam: (value: SetStateAction<Team>) => void
  showAddPatientDialog: boolean
  onAddPatientSuccessful: (team: Team) => void
  setShowAddPatientDialog: React.Dispatch<React.SetStateAction<boolean>>
}

export const FiltersDialogSlot: React.FC<FiltersDialogSlotProps> =
  ({
     isFiltersDialogOpen,
     teamCodeDialogSelectedTeam,
     anchorEl,
     onPatientFiltersClose,
     isSelectedTeamPrivate,
     setTeamCodeDialogSelectedTeam,
     showAddPatientDialog,
     onAddPatientSuccessful,
     setShowAddPatientDialog
   }) => {

    return (
      <>
        {showAddPatientDialog &&
          <InvitePatientDialog
            onAddPatientSuccessful={onAddPatientSuccessful}
            onClose={() => {
              setShowAddPatientDialog(false)
            }}
          />
        }
        {
          teamCodeDialogSelectedTeam &&
          <TeamCodeDialog
            code={teamCodeDialogSelectedTeam.code}
            name={teamCodeDialogSelectedTeam.name}
            onClose={() => {
              setTeamCodeDialogSelectedTeam(null)
            }}
          />
        }
        {
          isFiltersDialogOpen &&
          <PatientFiltersPopover
            anchorEl={anchorEl}
            onClose={onPatientFiltersClose}
            isSelectedTeamPrivate={isSelectedTeamPrivate}
          />
        }
      </>
    )
  }
