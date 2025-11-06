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

import React, { FC, useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import { formatBirthdate, formatDate } from 'dumb'
import { Patient } from '../../../../lib/patient/models/patient.model'
import PatientUtils from '../../../../lib/patient/patient.util'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import CakeIcon from '@mui/icons-material/Cake'
import ScaleIcon from '@mui/icons-material/Scale'
import HeightIcon from '@mui/icons-material/Height'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import StraightenIcon from '@mui/icons-material/Straighten'
import { BasalIcon } from '../../../../components/icons/diabeloop/basal-icon'
import { PatientDiabeticProfileChip } from '../../../../components/chips/patient-diabetic-profile-chip'
import { getUserName } from '../../../../lib/auth/user.util'
import { useAuth } from '../../../../lib/auth'
import { makeStyles } from 'tss-react/mui'
import { type Theme } from '@mui/material/styles'
import { Autocomplete, TextField } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment'
import { LoadingButton } from '@mui/lab'
import { Save } from '@mui/icons-material'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { useAlert } from '../../../../components/utils/snackbar'
import Alert from '@mui/material/Alert'
import { PhysicalActivityName } from 'medical-domain'
import { ProfilePatient } from '../../../../lib/patient/models/patient-profile.model'
import PatientApi from '../../../../lib/patient/patient.api'

export enum AdditionalPatientAdditionalPatientProfileFormKey {
  DrugTreatment = 'drugTreatment',
  Diet = 'diet',
  Profession = 'profession',
  Hobbies = 'hobbies',
  PhysicalActivities = 'physicalActivities',
  HoursSpentOnPhysicalActivitiesPerWeek = 'hoursSpentOnPhysicalActivitiesPerWeek',
  Comments = 'comments'
}

interface InformationSectionProps {
  patient: Patient
}

const useStyles = makeStyles()((theme: Theme) => ({
  separator: {
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  alert: {
    marginBottom: theme.spacing(1),
    width: '90%',
  },
  formField: {
    marginBottom: theme.spacing(3),
    width: '80%'
  },
  openCommentsField: {
    width: '90%'
  }
}))

export const PatientPersonalInformationSection: FC<InformationSectionProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { classes } = useStyles()

  const alert = useAlert()
  const [additionalPatientProfileForm, setAdditionalPatientProfileForm] = useState<ProfilePatient>(patient.profile)
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)

  const updateAdditionalPatientProfileForm = (key: AdditionalPatientAdditionalPatientProfileFormKey, value: unknown): void => {
    setAdditionalPatientProfileForm((prevForm) => ({
      ...prevForm,
      [key]: value
    }))
  }

  const saveButtonDisabled = useMemo(() => {
    return saveInProgress
  }, [saveInProgress])

  const save = async (): Promise<void> => {
    setSaveInProgress(true)
    try {
      await PatientApi.updatePatientProfile(patient.userid, additionalPatientProfileForm)
      patient.profile = additionalPatientProfileForm
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

  const physicalActivityNameList = Object.values(PhysicalActivityName)
  const dietOptions = ['no-specific-diet','vegetarian', 'gluten-free', 'low-carbohydrates-diet', 'vegan', 'ketogenic-diet', 'caloric-restriction', 'intermittent-fasting', 'paleolithic-diet', 'other']

  // read part
  const getGender = (): string => {
    return PatientUtils.getGenderLabel(patient.profile.sex)
  }

  const getPatientInitials = (): string => {
    const firstName = patient.profile.firstName || ''
    const lastName = patient.profile.lastName || ''
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getHbA1c = (): string => {
    // Get HbA1c from patient settings if available
    const a1c = patient?.settings?.a1c?.value
    const a1cDate = patient?.settings?.a1c?.date

    if (!a1c || !a1cDate) {
      return t('N/A')
    }

    return `${a1c}% - (${a1cDate})`

  }

  const getDbUnits = (): string => {
    if (!patient.settings.units) {
      return t('N/A')
    }

    return `${patient.settings.units.bg}`
  }

  const getAge = (): string => {
    if (!patient.profile.birthdate) {
      return t('N/A')
    }
    const birthDate = new Date(patient.profile.birthdate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return `${age} ${t('years-old')}`
  }

  return (
    <Card variant="outlined" sx={{ padding: theme.spacing(2) }} data-testid="information-section">
      <CardContent>

        <Box display="flex" flexDirection="column" gap={3}>
          {/* Patient Header with Avatar */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              data-testid="patient-avatar"
              sx={{
                width: 56,
                height: 56,
                backgroundColor: theme.palette.primary.main,
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              {getPatientInitials()}
            </Avatar>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" fontWeight="medium">
                {getUserName(patient.profile.firstName, patient.profile.lastName, patient.profile.fullName) || t('N/A')}
              </Typography>
              {user.isUserPatient() &&
                <PatientDiabeticProfileChip patientDiabeticType={patient.diabeticProfile.type} />
              }
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* Date of birth */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <CakeIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('date-of-birth')}
                  </Typography>
                  <Typography variant="body2">
                    {`${formatBirthdate(patient.profile.birthdate)} (${getAge()})`}
                  </Typography>
                </Box>
              </Box>

              {/* Gender */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <PersonIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('gender')}
                  </Typography>
                  <Typography variant="body2">
                    {getGender()}
                  </Typography>
                </Box>
              </Box>

              {/* Weight */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <MonitorWeightIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('params|WEIGHT')}
                  </Typography>
                  <Typography variant="body2">
                    {`${patient.profile.weight?.value || t('N/A')} ${patient.profile.weight?.unit || ''}`}
                  </Typography>
                </Box>
              </Box>

              {/* Height */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <HeightIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('params|HEIGHT')}
                  </Typography>
                  <Typography variant="body2">
                    {`${patient.profile.height?.value || t('N/A')} ${patient.profile.height?.unit || ''}`}
                  </Typography>
                </Box>
              </Box>

              {/* Email */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <EmailIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('email')}
                  </Typography>
                  <Typography variant="body2">
                    {patient.profile.email || t('N/A')}
                  </Typography>
                </Box>
              </Box>

            </Grid>
            <Grid item xs={6}>

              {/* Equipment Date */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <PhoneAndroidIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('equipment-date')}
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(patient.medicalData?.range?.startDate) || t('N/A')}
                  </Typography>
                </Box>
              </Box>

              {/* HbA1c */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <StraightenIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('hba1c')}
                  </Typography>
                  <Typography variant="body2">
                    {getHbA1c()}
                  </Typography>
                </Box>
              </Box>

              {/* glycemia units */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <ScaleIcon sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('glycemia-units')}
                  </Typography>
                  <Typography variant="body2">
                    {getDbUnits()}
                  </Typography>
                </Box>
              </Box>

              {/* insulin type */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                <BasalIcon data-testid="basal-icon" sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('params|INSULIN_TYPE')}
                  </Typography>
                  <Typography variant="body2">
                    {`${patient.settings.insulinType || t('N/A')}`}
                  </Typography>
                </Box>
              </Box>

            </Grid>
          </Grid>
          <div className={classes.separator} />

          {/* Additional Information Section */}
          <Typography variant="h6" className={classes.sectionTitle}>
            {t('additional-information')}
          </Typography>

          {/* Info Banner */}
          <Alert data-testid="additional-information-status-disclamer-label" severity="info" className={classes.alert}>
            {t('additional-information-disclaimer')}
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              {/* Drug Treatment Other Than Insulin */}
              <TextField
                data-testid="additional-patient-profile-drug-treatment"
                label={t('drug-treatment-other-than-insulin')}
                variant="outlined"
                className={classes.formField}
                value={additionalPatientProfileForm.drugTreatment || ''}
                onChange={(e) => updateAdditionalPatientProfileForm(AdditionalPatientAdditionalPatientProfileFormKey.DrugTreatment, e.target.value)}
                disabled={!user.isUserPatient()}
              />

              {/* Profession */}
              <TextField
                data-testid="additional-patient-profile-profession"
                label={t('profession')}
                variant="outlined"
                className={classes.formField}
                value={additionalPatientProfileForm.profession || ''}
                onChange={(e) => updateAdditionalPatientProfileForm(AdditionalPatientAdditionalPatientProfileFormKey.Profession, e.target.value)}
                disabled={!user.isUserPatient()}
              />
            </Grid>

            <Grid item xs={6}>
              {/* Diet */}
              <Autocomplete
                multiple
                data-testid="additional-patient-profile-diet"
                options={dietOptions}
                getOptionLabel={(option) => t(option)}
                limitTags={2}
                freeSolo
                className={classes.formField}
                value={additionalPatientProfileForm.diet}
                onChange={(e, value) => updateAdditionalPatientProfileForm(AdditionalPatientAdditionalPatientProfileFormKey.Diet, value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t('diet')}
                  />
                )}
                disabled={!user.isUserPatient()}
              />

              {/* Hobby */}
              <TextField
                data-testid="additional-patient-profile-hobby"
                label={t('hobby')}
                variant="outlined"
                className={classes.formField}
                value={additionalPatientProfileForm.hobbies || ''}
                onChange={(e) => updateAdditionalPatientProfileForm(AdditionalPatientAdditionalPatientProfileFormKey.Hobbies, e.target.value)}
                disabled={!user.isUserPatient()}
              />
            </Grid>
          </Grid>

          {/* Physical Activity Section */}
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
                value={additionalPatientProfileForm.physicalActivities}
                onChange={(e, value) => updateAdditionalPatientProfileForm(AdditionalPatientAdditionalPatientProfileFormKey.PhysicalActivities, value)}
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
                onChange={(e) => updateAdditionalPatientProfileForm(AdditionalPatientAdditionalPatientProfileFormKey.HoursSpentOnPhysicalActivitiesPerWeek, +e.target.value)} // the + allow convertion into number
                InputProps={{
                  endAdornment: <InputAdornment position="end">{t('hours')}</InputAdornment>
                }}
                disabled={!user.isUserPatient()}
              />
            </Grid>
          </Grid>

          {/* Open Comments*/}
          <TextField
            data-testid="additional-patient-profile-open-comments"
            label={t('open-comments')}
            variant="outlined"
            multiline
            className={classes.openCommentsField}
            value={additionalPatientProfileForm.comments || ''}
            onChange={(e) => updateAdditionalPatientProfileForm(AdditionalPatientAdditionalPatientProfileFormKey.Comments, e.target.value)}
            disabled={!user.isUserPatient()}
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
                data-testid="additional-info-save"
                sx={{ minWidth: 120 }}
              >
                {t('button-save')}
              </LoadingButton>
            </Box>
          }
        </Box>
      </CardContent>
    </Card>
  )
}
