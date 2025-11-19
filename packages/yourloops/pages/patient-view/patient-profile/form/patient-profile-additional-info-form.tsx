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

import React, { type FC, useMemo, useState } from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { Autocomplete } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { useTranslation } from 'react-i18next'
import { PhysicalActivityName } from 'medical-domain'
import { type PatientProfile } from '../../../../lib/patient/models/patient-profile.model'
import Box from '@mui/material/Box'
import { LoadingButton } from '@mui/lab'
import { Save } from '@mui/icons-material'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { useAlert } from '../../../../components/utils/snackbar'
import usePatient from '../../../../lib/patient/patient.hook'
import { makeStyles } from 'tss-react/mui'
import type { Theme } from '@mui/material/styles'
import { Patient } from '../../../../lib/patient/models/patient.model'
import { useAuth } from '../../../../lib/auth'

interface AdditionalInfoFormProps {
  patient: Patient
}


const useStyles = makeStyles()((theme: Theme) => ({
  formField: {
    marginBottom: theme.spacing(3),
    width: '80%'
  },
  openCommentsField: {
    width: '90%'
  }
}))

enum PatientProfileAdditionalInfoFormKey {
  DrugTreatment = 'drugTreatment',
  Diet = 'diet',
  Profession = 'profession',
  Hobbies = 'hobbies',
  PhysicalActivities = 'physicalActivities',
  HoursSpentOnPhysicalActivitiesPerWeek = 'hoursSpentOnPhysicalActivitiesPerWeek',
  Comments = 'comments'
}

const TEXT_FIELD_MAX_LENGTH = 100
const COMMENTS_MAX_LENGTH = 255
const MAX_HOURS_IN_WEEK = 168

export const AdditionalInfoForm: FC<AdditionalInfoFormProps> = (props) => {
  const { patient } = props
  const { user } = useAuth()
  const { t } = useTranslation()
  const  alert = useAlert()
  const { updatePatientProfile } = usePatient()
  const { classes } = useStyles()
  const [additionalPatientProfileForm, setAdditionalPatientProfileForm] = useState<PatientProfile>(patient.profile)
  const [errors, setErrors] = useState<Partial<Record<PatientProfileAdditionalInfoFormKey, string>>>({})
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)

  const onFieldChange = (key: PatientProfileAdditionalInfoFormKey, value: unknown): void => {
    setAdditionalPatientProfileForm((prevForm) => ({
      ...prevForm,
      [key]: value
    }))
  }

  const saveButtonDisabled = useMemo(() => {
    return saveInProgress || Object.values(errors).some((error) => error?.length > 0)
  }, [saveInProgress, errors])

  const physicalActivityNameList = Object.values(PhysicalActivityName)
  const dietOptions = ['no-specific-diet','vegetarian', 'gluten-free', 'low-carbohydrates-diet', 'vegan', 'ketogenic-diet', 'caloric-restriction', 'intermittent-fasting', 'paleolithic-diet', 'other']

  const validateHoursPerWeek = (hours: number): void => {
    const error = hours > MAX_HOURS_IN_WEEK ? t('max-hours-per-week', { max: TEXT_FIELD_MAX_LENGTH }) : ''
    setErrors(prev => ({ ...prev, [PatientProfileAdditionalInfoFormKey.HoursSpentOnPhysicalActivitiesPerWeek]: error }))
  }

  const validateDrugTreatment = (drugTreatment: string): void => {
    const error = drugTreatment.length > TEXT_FIELD_MAX_LENGTH ? t('max-length-exceeded', { max: TEXT_FIELD_MAX_LENGTH }) : ''
    setErrors(prev => ({ ...prev, [PatientProfileAdditionalInfoFormKey.DrugTreatment]: error }))
  }

  const validateProfession = (profession: string): void => {
    const error = profession.length > TEXT_FIELD_MAX_LENGTH ? t('max-length-exceeded', { max: TEXT_FIELD_MAX_LENGTH }) : ''
    setErrors( prev => ({ ...prev , [PatientProfileAdditionalInfoFormKey.Profession]: error }))
  }

  const validateComments = (comments: string): void => {
    const error = comments.length > COMMENTS_MAX_LENGTH ? t('max-length-exceeded', { max: COMMENTS_MAX_LENGTH }) : ''
    setErrors( prev => ({ ...prev , [PatientProfileAdditionalInfoFormKey.Comments]: error }))
  }

  const validateHobbies = (hobbies: string): void => {
    const error = hobbies.length > TEXT_FIELD_MAX_LENGTH ? t('max-length-exceeded', { max: TEXT_FIELD_MAX_LENGTH }) : ''
    setErrors(prev => ({ ...prev, [PatientProfileAdditionalInfoFormKey.Hobbies]: error }))
  }

  const save = async (): Promise<void> => {
    setSaveInProgress(true)
    try {
      await updatePatientProfile(patient.userid, additionalPatientProfileForm)
      alert.success(t('patient-update-success'))
    } catch (error) {
      const errorMessage = errorTextFromException(error)
      logError(errorMessage, 'update-patient-ranges')
      alert.error(t('patient-update-error'))
    }
    finally {
      setSaveInProgress(false)
    }
  }
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            data-testid="additional-patient-profile-drug-treatment"
            label={t('drug-treatment-other-than-insulin')}
            variant="outlined"
            className={classes.formField}
            value={additionalPatientProfileForm.drugTreatment || ''}
            onChange={(e) => {
              onFieldChange(PatientProfileAdditionalInfoFormKey.DrugTreatment, e.target.value)
              validateDrugTreatment(e.target.value)
            }}
            disabled={!user.isUserPatient()}
            error={!!errors.drugTreatment}
            helperText={errors.drugTreatment}
          />

          <TextField
            data-testid="additional-patient-profile-profession"
            label={t('profession')}
            variant="outlined"
            className={classes.formField}
            value={additionalPatientProfileForm.profession || ''}
            onChange={(e) => {
              onFieldChange(PatientProfileAdditionalInfoFormKey.Profession, e.target.value)
              validateProfession(e.target.value)
            }}
            disabled={!user.isUserPatient()}
            error={!!errors.profession}
            helperText={errors.profession}
          />
        </Grid>

        <Grid item xs={6}>
          <Autocomplete
            multiple
            data-testid="additional-patient-profile-diet"
            options={dietOptions}
            getOptionLabel={(option) => t(option)}
            limitTags={2}
            freeSolo
            className={classes.formField}
            value={additionalPatientProfileForm.diet || []} // to prevent MUI error when no value is selected (controlled component)
            onChange={(e, value) => onFieldChange(PatientProfileAdditionalInfoFormKey.Diet, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={t('diet')}
              />
            )}
            disabled={!user.isUserPatient()}
          />

          <TextField
            data-testid="additional-patient-profile-hobby"
            label={t('hobby')}
            variant="outlined"
            className={classes.formField}
            value={additionalPatientProfileForm.hobbies || ''}
            onChange={(e) => {
              onFieldChange(PatientProfileAdditionalInfoFormKey.Hobbies, e.target.value)
              validateHobbies(e.target.value)
            }}
            disabled={!user.isUserPatient()}
            error={!!errors.hobbies}
            helperText={errors.hobbies}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} mb={1}>
        <Grid item xs={6}>
          <Autocomplete
            multiple
            data-testid="additional-patient-profile-physical-activity"
            options={physicalActivityNameList}
            limitTags={3}
            getOptionLabel={(option: string) => t(`params|${option}`)}
            freeSolo
            className={classes.formField}
            value={additionalPatientProfileForm.physicalActivities || []} // to prevent MUI error when no value is selected (controlled component)
            onChange={(e, value) => onFieldChange(PatientProfileAdditionalInfoFormKey.PhysicalActivities, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={t('physical-activity')}
              />
            )}
            disabled={!user.isUserPatient()}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            data-testid="additional-patient-profile-physical-activity-duration"
            label={t('duration-per-week')}
            variant="outlined"
            className={classes.formField}
            type="number"
            value={additionalPatientProfileForm.hoursSpentOnPhysicalActivitiesPerWeek || ''}
            onChange={(e) => {
              onFieldChange(PatientProfileAdditionalInfoFormKey.HoursSpentOnPhysicalActivitiesPerWeek, +e.target.value)
              validateHoursPerWeek(+e.target.value)
            }} // the + allow conversion into number
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: <InputAdornment position="end">{t('hours')}</InputAdornment>
            }}
            disabled={!user.isUserPatient()}
            error={!!errors.hoursSpentOnPhysicalActivitiesPerWeek}
            helperText={errors.hoursSpentOnPhysicalActivitiesPerWeek}
          />
        </Grid>
      </Grid>

      <TextField
        data-testid="additional-patient-profile-open-comments"
        label={t('open-comments')}
        variant="outlined"
        multiline
        className={classes.openCommentsField}
        value={additionalPatientProfileForm.comments || ''}
        onChange={(e) => {
          onFieldChange(PatientProfileAdditionalInfoFormKey.Comments, e.target.value)
          validateComments(e.target.value)
        }}
        disabled={!user.isUserPatient()}
        error={!!errors.comments}
        helperText={errors.comments}
      />
      { user.isUserPatient() &&
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <LoadingButton
            loading={saveInProgress}
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<Save />}
            disabled={saveButtonDisabled}
            onClick={save}
            data-testid="additional-patient-profile-save"
            sx={{ minWidth: 120 }}
          >
            {t('button-save')}
          </LoadingButton>
        </Box>
      }
    </>
  )
}
