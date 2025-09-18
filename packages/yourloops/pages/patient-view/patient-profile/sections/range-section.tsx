/*
 * Copyright (c) 2023-2025, Diabeloop
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

import React, { type FC, useMemo, useRef, useState } from 'react'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { Patient } from '../../../../lib/patient/models/patient.model'
import { InputAdornment } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Save } from '@mui/icons-material'
import { errorTextFromException } from '../../../../lib/utils'
import { logError } from '../../../../utils/error.util'
import { useAlert } from '../../../../components/utils/snackbar'
import {
  type BgUnit,
  DiabeticProfile,
  DiabeticProfileType,
  getDefaultRangeByDiabeticProfileType,
  Unit
} from 'medical-domain'
import Chip from '@mui/material/Chip'
import { usePatientsContext } from '../../../../lib/patient/patients.provider'
import { useAuth } from '../../../../lib/auth'
import { BgPrefs, formatBgValue } from 'dumb'
import { convertBG } from '../../../../lib/units/units.util'

interface RangeSectionProps {
  patient: Patient
}

interface ValidationErrors {
  severeHyperglycemia: boolean
  hyperglycemia: boolean
  hypoglycemia: boolean
  severeHypoglycemia: boolean
}

const DEFAULT_ERROR_STATE: ValidationErrors = {
  hyperglycemia: false,
  severeHyperglycemia: false,
  hypoglycemia: false,
  severeHypoglycemia: false
}


enum FieldType {
  SevereHyperglycemia = 'severeHyperglycemia',
  Hyperglycemia = 'hyperglycemia',
  Hypoglycemia = 'hypoglycemia',
  SevereHypoglycemia = 'severeHypoglycemia'
}

// Define which fields are disabled for each diabetic profile type
// TODO: FIELD_PERMISSIONS or FIELD_DISABLED?
const FIELD_PERMISSIONS: Record<DiabeticProfileType, Record<FieldType, boolean>> = {
  [DiabeticProfileType.DT1DT2]: {
    [FieldType.SevereHyperglycemia]: true,
    [FieldType.Hyperglycemia]: true,
    [FieldType.Hypoglycemia]: true,
    [FieldType.SevereHypoglycemia]: true
  },
  [DiabeticProfileType.DT1Pregnancy]: {
    [FieldType.SevereHyperglycemia]: false,
    [FieldType.Hyperglycemia]: true,
    [FieldType.Hypoglycemia]: true,
    [FieldType.SevereHypoglycemia]: false
  },
  [DiabeticProfileType.Custom]: {
    [FieldType.SevereHyperglycemia]: false,
    [FieldType.Hyperglycemia]: false,
    [FieldType.Hypoglycemia]: false,
    [FieldType.SevereHypoglycemia]: false
  }
}

// TODO for review: where to move this function? medical domain?
const convertAndFormatBgValue = (value: number, currentUnit: BgUnit): number => {
  const newUnit = currentUnit === Unit.MilligramPerDeciliter ? Unit.MmolPerLiter : Unit.MilligramPerDeciliter
  const formattedValueString = formatBgValue(convertBG(value, currentUnit), newUnit)

  return newUnit === Unit.MilligramPerDeciliter ? parseInt(formattedValueString) : parseFloat(formattedValueString)
}

export const convertIfNeeded = (bloodGlucosePreference: BgPrefs | null, requiredUnit: BgUnit): BgPrefs => {
  if (bloodGlucosePreference?.bgUnits != requiredUnit) {
    const currentUnit = bloodGlucosePreference?.bgUnits
    return {
      bgUnits: requiredUnit,
      bgClasses: {
        veryLow: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.veryLow, currentUnit),
        low: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.low, currentUnit),
        target: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.target, currentUnit),
        high: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.high, currentUnit),
        veryHigh: convertAndFormatBgValue(bloodGlucosePreference.bgClasses.veryHigh, currentUnit)
      },
      bgBounds: {
        veryHighThreshold: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.veryHighThreshold, currentUnit),
        targetUpperBound: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.targetUpperBound, currentUnit),
        targetLowerBound: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.targetLowerBound, currentUnit),
        veryLowThreshold: convertAndFormatBgValue(bloodGlucosePreference.bgBounds.veryLowThreshold, currentUnit)
      }
    }
  }
  return bloodGlucosePreference
}

export const RangeSection: FC<RangeSectionProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const { user } = useAuth()

  const displayedUnit = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter
  patient.diabeticProfile.bloodGlucosePreference = convertIfNeeded(patient.diabeticProfile.bloodGlucosePreference, displayedUnit)

  const rangeSection = useRef<HTMLElement>(null)
  const [selectedPatientType, setSelectedPatientType] = useState<DiabeticProfileType>(patient.diabeticProfile.name)
  const [selectedDiabeticProfile, setSelectedDiabeticProfile] = useState<DiabeticProfile>(patient.diabeticProfile)
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)
  const [errors, setErrors] = useState<ValidationErrors>(DEFAULT_ERROR_STATE)
  const { updatePatientDiabeticProfile } = usePatientsContext()

  const patientTypes = [
    { type: DiabeticProfileType.DT1DT2, label: t('range-profile-type-1-and-2') },
    { type: DiabeticProfileType.DT1Pregnancy, label: t('range-profile-pregnancy-type-1') },
    { type: DiabeticProfileType.Custom, label: t('range-profile-custom') }
  ]

  const hasErrorMessage = useMemo(() => {
    return Object.values(errors).some((error) => error === true)
  }, [errors])

  const saveButtonDisabled = useMemo(() => {
    return hasErrorMessage || saveInProgress
  }, [hasErrorMessage, saveInProgress])

  const getDefaultDiabeticProfile = (type: DiabeticProfileType): DiabeticProfile => {
    const ranges = getDefaultRangeByDiabeticProfileType(type, displayedUnit)

  return {
      name: type,
      bloodGlucosePreference: {
        bgUnits: patient.diabeticProfile.bloodGlucosePreference.bgUnits,
        bgClasses: {
          veryHigh: 600,
          high: ranges.veryHighThreshold,
          target: ranges.targetUpperBound,
          low: ranges.targetLowerBound,
          veryLow: ranges.veryLowThreshold
        },
        bgBounds: ranges
      }
    }
  }

  const handlePatientTypeChange = (type: DiabeticProfileType): void => {
    setSelectedPatientType(type)
    setSelectedDiabeticProfile(getDefaultDiabeticProfile(type))
    setErrors(DEFAULT_ERROR_STATE)
  }

  const isFieldDisabled = (type: DiabeticProfileType, field: FieldType): boolean => {
    return FIELD_PERMISSIONS[type]?.[field] ?? false
  }

  // Validate if the value is in an acceptable range
  const IsInRange = (value: number, unit: Unit): boolean => {
    switch (unit) {
      case  Unit.MilligramPerDeciliter:
        return value >= 40 && value <= 400
      case Unit.MmolPerLiter:
        return value >= 2.2 && value <= 22.2
      default:
        return false
    }
  }

  const handleRangeChange = (field: FieldType, value: string): void => {
    const numericValue = +value
    if (!isNaN(numericValue) && IsInRange(numericValue, displayedUnit)) {
      setErrors(DEFAULT_ERROR_STATE)
      setSelectedDiabeticProfile(prev => {
        const updated = structuredClone(prev)

        // Update the appropriate field in the diabetic profile structure
        switch (field) {
          case FieldType.SevereHyperglycemia:
            if (numericValue <= updated.bloodGlucosePreference.bgBounds.targetUpperBound) {
              setErrors({ ...errors, severeHyperglycemia: true })
              return prev
            }
            updated.bloodGlucosePreference.bgBounds.veryHighThreshold = numericValue
            updated.bloodGlucosePreference.bgClasses.high = numericValue
            break
          case FieldType.Hyperglycemia:
            if ((numericValue <= updated.bloodGlucosePreference.bgBounds.targetLowerBound || numericValue >= updated.bloodGlucosePreference.bgBounds.veryHighThreshold)){
              setErrors({ ...errors, hyperglycemia: true })
              return prev
            }
            updated.bloodGlucosePreference.bgBounds.targetUpperBound = numericValue
            updated.bloodGlucosePreference.bgClasses.target = numericValue
            break
          case FieldType.Hypoglycemia:
            if ((numericValue >= updated.bloodGlucosePreference.bgBounds.targetUpperBound || numericValue <= updated.bloodGlucosePreference.bgBounds.veryLowThreshold)){
              setErrors({ ...errors, hypoglycemia: true })
            }
            updated.bloodGlucosePreference.bgBounds.targetLowerBound = numericValue
            updated.bloodGlucosePreference.bgClasses.low = numericValue
            break
          case FieldType.SevereHypoglycemia:
            if (numericValue >= updated.bloodGlucosePreference.bgBounds.targetLowerBound) {
              setErrors({ ...errors, severeHypoglycemia: true })
              return prev
            }
            updated.bloodGlucosePreference.bgBounds.veryLowThreshold = numericValue
            updated.bloodGlucosePreference.bgClasses.veryLow = numericValue
            break
        }
        return updated
      })
    }
  }

  const save = async (): Promise<void> => {

    setSaveInProgress(true)
    try {
      await updatePatientDiabeticProfile(patient.userid, selectedDiabeticProfile)
      patient.diabeticProfile = selectedDiabeticProfile
      alert.success(t('patient-update-success'))
      setSaveInProgress(false)
    } catch (error) {
      const errorMessage = errorTextFromException(error)
      logError(errorMessage, 'update-patient-ranges')

      alert.error(t('patient-update-error'))
      setSaveInProgress(false)
    }
  }

  return (
    <Container data-testid="range-container">
      <Card variant="outlined" sx={{ padding: theme.spacing(2) }}>
        <CardHeader title={t('range')} />
        <CardContent>
          <section
            data-testid="range-configuration-section"
            ref={rangeSection}
          >
            {/* Description */}
            <Typography
              variant="body2"
            >
              {t('range-description')}
            </Typography>
            {/* Patient Type Selection */}
            <Box mb={3}>
              <Box display="flex" flexWrap="wrap" gap={1} marginTop={2}>
                {patientTypes.map((patientType) => (
                  <Chip
                    key={patientType.type}
                    label={patientType.label}
                    variant={selectedPatientType === patientType.type ? 'filled' : 'outlined'}
                    color="primary"
                    onClick={() => handlePatientTypeChange(patientType.type)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: theme.spacing(2),
                      minWidth: 'auto',
                      paddingX: theme.spacing(2),
                      paddingY: theme.spacing(0.5)
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Range Configuration */}
            <Grid container spacing={3}>
              {/* Left side - Visual representation */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 300,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  {/* Range visualization would go here */}
                  <Typography variant="body2" color="text.secondary" p={2}>
                  </Typography>
                </Box>
              </Grid>

              {/* Right side - Range inputs */}
              <Grid item xs={12} md={6}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <TextField
                    label={t('range-severe-hyperglycemia')}
                    margin="normal"
                    type="number"
                    disabled={isFieldDisabled(selectedPatientType, FieldType.SevereHyperglycemia)}
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.veryHighThreshold}
                    error={errors.severeHyperglycemia}
                    helperText={errors.severeHyperglycemia && t('error-severe-hyperglycemia')}
                    onChange={(e) => handleRangeChange(FieldType.SevereHyperglycemia, e.target.value)}
                    variant="outlined"
                    sx={{
                      // Root class for the input field
                      "& .MuiOutlinedInput-root": {
                        // Class for the border around the input field
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "var(--bg-very-high)",
                        },
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--bg-very-high)",
                          },
                        },
                        "&:hover:not(.Mui-focused)": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--bg-very-high)",
                          },
                        },
                      },
                      // Class for the label of the input field
                      "& .MuiInputLabel-outlined": {
                        "&.Mui-focused": {
                          color: "var(--bg-very-high)",
                        },
                      },
                    }}
                    InputProps={{ endAdornment: <InputAdornment position="end">{displayedUnit}</InputAdornment> }}
                  />

                  <TextField
                    label={t('range-hyperglycemia')}
                    margin="normal"
                    type="number"
                    disabled={isFieldDisabled(selectedPatientType, FieldType.Hyperglycemia)}
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.targetUpperBound}
                    error={errors.hyperglycemia}
                    helperText={errors.hyperglycemia && t('error-hyperglycemia')}
                    onChange={(e) => handleRangeChange(FieldType.Hyperglycemia, e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--bg-high)',
                          borderWidth: '2px'
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--bg-high)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--bg-high)'
                        }
                      },
                      // Class for the label of the input field
                      "& .MuiInputLabel-outlined": {
                        "&.Mui-focused": {
                          color: "var(--warning-color-light)",
                        },
                      },
                    }}
                    InputProps={{ endAdornment: <InputAdornment position="end">{displayedUnit}</InputAdornment> }}
                  />

                  <TextField
                    label={t('range-hypoglycemia')}
                    margin="normal"
                    type="number"
                    disabled={isFieldDisabled(selectedPatientType, FieldType.Hypoglycemia)}
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.targetLowerBound}
                    error={errors.hypoglycemia}
                    helperText={errors.hypoglycemia && t('error-hypoglycemia')}
                    onChange={(e) => handleRangeChange(FieldType.Hypoglycemia, e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--bg-low)',
                          borderWidth: '2px'
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--bg-low)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--bg-low)'
                        }
                      },
                      // Class for the label of the input field
                      "& .MuiInputLabel-outlined": {
                        "&.Mui-focused": {
                          color: "var(--bg-low)",
                        },
                      },
                    }}
                    InputProps={{ endAdornment: <InputAdornment position="end">{displayedUnit}</InputAdornment> }}
                  />

                  <TextField
                    label={t('range-severe-hypoglycemia')}
                    margin="normal"
                    type="number"
                    disabled={isFieldDisabled(selectedPatientType, FieldType.SevereHypoglycemia)}
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.veryLowThreshold}
                    error={errors.severeHypoglycemia}
                    helperText={errors.severeHypoglycemia && t('error-severe-hypoglycemia')}
                    onChange={(e) => handleRangeChange(FieldType.SevereHypoglycemia, e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'var(--bg-very-low)',
                          borderWidth: '2px'
                        },
                        '&:hover fieldset': {
                          borderColor: 'var(--bg-very-low)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'var(--bg-very-low)'
                        }
                      },
                      // Class for the label of the input field
                      "& .MuiInputLabel-outlined": {
                        "&.Mui-focused": {
                          color: "var(--bg-very-low)",
                        },
                      },
                    }}
                    InputProps={{ endAdornment: <InputAdornment position="end">{displayedUnit}</InputAdornment> }}
                  />
                </Box>
              </Grid>
            </Grid>
            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" marginTop={8}>
              <LoadingButton
                loading={saveInProgress}
                id="save-button-id"
                variant="contained"
                color="primary"
                disableElevation
                startIcon={<Save />}
                disabled={saveButtonDisabled}
                onClick={save}
                data-testid="range-config-save"
              >
                {t('button-save')}
              </LoadingButton>
            </Box>
          </section>
        </CardContent>
      </Card>
    </Container>
  )
}

