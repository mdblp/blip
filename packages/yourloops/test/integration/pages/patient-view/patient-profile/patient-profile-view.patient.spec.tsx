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

import { mockDataAPI } from '../../../mock/data.api.mock'
import { renderPage } from '../../../utils/render'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { testPatientPersonalInformation } from '../../../use-cases/patient-personal-information-management'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getTranslation } from '../../../../utils/i18n'
import PatientApi from '../../../../../lib/patient/patient.api'
import { mockPatientLogin } from '../../../mock/patient-login.mock'
import { patient1Info } from '../../../data/patient.api.data'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { UserRole } from '../../../../../lib/auth/models/enums/user-role.enum'

describe('Patient profile view for Patient', () => {

  const patientProfileRoute = `${AppUserRoute.PatientProfile}`

  describe('Information section', () => {
    beforeEach(() => {
      mockWindowResizer()
      mockAuth0Hook(UserRole.Patient)
      mockPatientLogin(patient1Info)
      mockDataAPI()
    })

    afterEach(() => {
      window.ResizeObserver = ResizeObserver
      jest.restoreAllMocks()
    })

    it('should display patient personal information section', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })
      // Test that the patient's personal information component is rendered
      const informationSection = await screen.findByTestId('information-section')
      expect(informationSection).toBeInTheDocument()

      await testPatientPersonalInformation()
    })

    it('should display patient avatar with initials and diabetic type', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      // Test avatar display with patient initials
      const avatar = screen.getByTestId('patient-avatar')
      expect(avatar).toBeVisible()
    })

    it('should display patient email with email icon', async () => {
      renderPage(patientProfileRoute)

      // Test email field with EmailIcon
      const emailText = await screen.findByText(/email/i)
      expect(emailText).toBeVisible()
    })

    it('should display patient gender with person icon', async () => {
      renderPage(patientProfileRoute)

      // Test gender field with PersonIcon
      const genderText = await screen.findByText(/gender/i)
      expect(genderText).toBeVisible()
    })

    it('should display patient birth date with cake icon', async () => {
      renderPage(patientProfileRoute)

      // Test birth date field with CakeIcon
      const birthDateText = await screen.findByText(/date.of.birth/i)
      expect(birthDateText).toBeVisible()
    })

    it('should display patient age with access time icon', async () => {
      renderPage(patientProfileRoute)

      // Test age field with AccessTimeIcon
      const ageText = await screen.findByText(/age/i)
      expect(ageText).toBeVisible()
    })

    it('should display HbA1c with science icon', async () => {
      renderPage(patientProfileRoute)

      // Test HbA1c field with ScienceIcon
      const hba1cText = await screen.findByText(/hba1c/i)
      expect(hba1cText).toBeVisible()
    })

    it('should display glycemia units', async () => {
      renderPage(patientProfileRoute)

      // Test units field
      const unitsText = await screen.findByText(/glycemia.units/i)
      expect(unitsText).toBeVisible()
    })

  })

  describe('Information section - Additional information form', () => {
    beforeEach(() => {
      mockAuth0Hook(UserRole.Patient)
      mockPatientLogin(patient1Info)
      mockDataAPI()
    })

    it('should display additional information section with disclaimer', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const disclaimer = await screen.findByTestId('additional-information-status-disclamer-label')
      expect(disclaimer).toBeVisible()
    })

    it('should display drug treatment field', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const drugTreatmentField = await screen.findByTestId('additional-patient-profile-drug-treatment')
      expect(drugTreatmentField).toBeVisible()
      expect(drugTreatmentField).toBeEnabled()
    })

    it('should display profession field', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const professionField = await screen.findByTestId('additional-patient-profile-profession')
      expect(professionField).toBeVisible()
      expect(professionField).toBeEnabled()
    })

    it('should display diet autocomplete', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const dietField = await screen.findByTestId('additional-patient-profile-diet')
      expect(dietField).toBeVisible()
      expect(dietField).toBeEnabled()
    })

    it('should display hobbies field', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const hobbiesField = await screen.findByTestId('additional-patient-profile-hobby')
      expect(hobbiesField).toBeVisible()
      expect(hobbiesField).toBeEnabled()
    })

    it('should display physical activities field', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const physicalActivitiesField = await screen.findByTestId('additional-patient-profile-physical-activity')
      expect(physicalActivitiesField).toBeVisible()
    })

    it('should display physical activity duration field', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const durationField = screen.getByLabelText(getTranslation('duration-per-week'))
      expect(durationField).toBeVisible()
      expect(durationField).toHaveValue(2)
    })

    it('should display open comments field', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const commentsField = await screen.findByTestId('additional-patient-profile-open-comments')
      expect(commentsField).toBeVisible()
    })

    it('should update drug treatment field value', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })
      const drugTreatmentField = screen.getByLabelText(getTranslation('drug-treatment-other-than-insulin'))
      await userEvent.type(drugTreatmentField, 'Metformin 1000mg')

      expect(drugTreatmentField).toHaveValue('Metformin 1000mg')
    })

    it('should update profession field value', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const professionField = screen.getByLabelText(getTranslation('profession'))
      await userEvent.clear(professionField)
      await userEvent.type(professionField, 'Software Engineer')

      expect(professionField).toHaveValue('Software Engineer')
    })

    it('should update diet field value', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const hobbiesField = screen.getByLabelText(getTranslation('diet'))
      await userEvent.type(hobbiesField, 'vegan')

      expect(hobbiesField).toHaveValue('vegan')
    })

    it('should update hobbies field value', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const hobbiesField = screen.getByLabelText(getTranslation('hobby'))
      await userEvent.clear(hobbiesField)
      await userEvent.type(hobbiesField, 'Reading')

      expect(hobbiesField).toHaveValue('Reading')
    })

    it('should update physical activities field value', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const physicalActivitiesField = screen.getByLabelText(getTranslation('physical-activity'))
      await userEvent.type(physicalActivitiesField, 'Golf')

      expect(physicalActivitiesField).toHaveValue('Golf')
    })

    it('should update physical activity duration', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const durationField = screen.getByLabelText(getTranslation('duration-per-week'))
      await userEvent.clear(durationField)
      await userEvent.type(durationField, '5')

      expect(durationField).toHaveValue(5)
    })

    it('should update open comments field value', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const commentsField = screen.getByLabelText(getTranslation('open-comments'))
      await userEvent.type(commentsField, 'Patient notes')

      expect(commentsField).toHaveValue('Patient notes')
    })

    it('should display save button enabled by default', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const saveButton = await screen.findByTestId('additional-patient-profile-save')
      expect(saveButton).toBeVisible()
      expect(saveButton).toBeEnabled()
    })

    it('should save additional patient information successfully', async () => {

      const updatePatientProfileSpy = jest.spyOn(PatientApi, 'updatePatientProfile').mockResolvedValue(undefined)

      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const drugTreatmentField = await screen.findByTestId('additional-patient-profile-drug-treatment')
      await userEvent.type(drugTreatmentField, 'Updated treatment')

      const saveButton = await screen.findByTestId('additional-patient-profile-save')
      await userEvent.click(saveButton)

      expect(updatePatientProfileSpy).toHaveBeenCalled()
    })

    // it('should disable save button while saving', async () => {
    //   await act(async () => {
    //     renderPage(patientProfileRoute)
    //   })
    //
    //   const saveButton = await screen.findByTestId('additional-patient-profile-save')
    //   await userEvent.click(saveButton)
    //
    //   expect(saveButton).toBeDisabled()
    // })
  })
})
