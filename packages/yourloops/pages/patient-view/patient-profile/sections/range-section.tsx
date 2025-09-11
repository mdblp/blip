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
import { DiabeticProfile, DiabeticProfileType } from '../../../../lib/patient/models/patient-diabete-profile'
import { Unit } from 'medical-domain'
import Chip from '@mui/material/Chip'

interface RangeSectionProps {
  patient: Patient
}
// TODO: add mmol/L support in medical domain
const DEFAULT_RANGES = {
  [DiabeticProfileType.DT1DT2]: {
    veryHighThreshold: 250,
    targetUpperBound: 180,
    targetLowerBound: 70,
    veryLowThreshold: 54
  },
  [DiabeticProfileType.DT1Pregnancy]: {
    veryHighThreshold: 250,
    targetUpperBound: 140,
    targetLowerBound: 63,
    veryLowThreshold: 54
  }
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

export const RangeSection: FC<RangeSectionProps> = (props) => {
  const { patient } = props
  const theme = useTheme()
  const { t } = useTranslation('yourloops')
  const alert = useAlert()
  const rangeSection = useRef<HTMLElement>(null)

  const [selectedPatientType, setSelectedPatientType] = useState<DiabeticProfileType>(patient.diabeticProfile.name)
  const [selectedDiabeticProfile, setSelectedDiabeticProfile] = useState<DiabeticProfile>(patient.diabeticProfile)
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false)
  const [errors, setErrors] = useState<ValidationErrors>(DEFAULT_ERROR_STATE)
  const patientTypes = [
    { type: DiabeticProfileType.DT1DT2, label: t('type-1-and-2') },
    { type: DiabeticProfileType.DT1Pregnancy, label: t('pregnancy-type-1') },
    { type: DiabeticProfileType.Custom, label: t('custom') }
  ]

  const hasErrorMessage = useMemo(() => {
    return Object.values(errors).some((error) => error === true)
  }, [errors])

  const saveButtonDisabled = useMemo(() => {
    return hasErrorMessage || saveInProgress
  }, [hasErrorMessage, saveInProgress])


  const getDefaultDiabeticProfile = (type: DiabeticProfileType): DiabeticProfile => {
  const ranges = DEFAULT_RANGES[type] || DEFAULT_RANGES[DiabeticProfileType.DT1DT2]

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

  const handleRangeChange = (field: string, value: string): void => {
    const numericValue = parseInt(value, 10)
    if (!isNaN(numericValue) && IsInRange(numericValue, selectedDiabeticProfile.bloodGlucosePreference.bgUnits)) {
      setErrors(DEFAULT_ERROR_STATE)
      setSelectedDiabeticProfile(prev => {
        const updated = structuredClone(prev)

        // Update the appropriate field in the diabetic profile structure
        switch (field) {
          case 'severeHyperglycemia':
            if (numericValue <= updated.bloodGlucosePreference.bgBounds.targetUpperBound) {
              setErrors({ ...errors, severeHyperglycemia: true })
              //setErrors("Severe hyperglycemia must be greater than hyperglycemia")
              return prev
            }
            updated.bloodGlucosePreference.bgBounds.veryHighThreshold = numericValue
            updated.bloodGlucosePreference.bgClasses.high = numericValue
            break
          case 'hyperglycemia':
            if ((numericValue <= updated.bloodGlucosePreference.bgBounds.targetLowerBound || numericValue >= updated.bloodGlucosePreference.bgBounds.veryHighThreshold)){
              setErrors({ ...errors, hyperglycemia: true })
              //setErrors("Hyperglycemia must be between hypoglycemia and severe hyperglycemia")
              return prev
            }
            updated.bloodGlucosePreference.bgBounds.targetUpperBound = numericValue
            updated.bloodGlucosePreference.bgClasses.target = numericValue
            break
          case 'hypoglycemia':
            if ((numericValue >= updated.bloodGlucosePreference.bgBounds.targetUpperBound || numericValue <= updated.bloodGlucosePreference.bgBounds.veryLowThreshold)){
              setErrors({ ...errors, hypoglycemia: true })
              //setErrors("Hypoglycemia must be between severe hypoglycemia and hyperglycemia")
            }
            updated.bloodGlucosePreference.bgBounds.targetLowerBound = numericValue
            updated.bloodGlucosePreference.bgClasses.low = numericValue
            break
          case 'severeHypoglycemia':
            if (numericValue >= updated.bloodGlucosePreference.bgBounds.targetLowerBound) {
              setErrors({ ...errors, severeHypoglycemia: true })
              //setErrors("Severe hypoglycemia must be less than hypoglycemia")
              return prev
            }
            updated.bloodGlucosePreference.bgBounds.veryLowThreshold = numericValue
            updated.bloodGlucosePreference.bgClasses.veryLow = numericValue
            break
        }
        return updated
      })

      // If user manually changes values, switch to custom
      if (selectedPatientType !== DiabeticProfileType.Custom) {
        setSelectedPatientType(DiabeticProfileType.Custom)
      }
    }
  }


  const save = async (): Promise<void> => {

    setSaveInProgress(true)
    try {
      //await updatePatientMonitoringAlertsParameters(patient)
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
                    {t('glycemic-range-visualization')}
                  </Typography>
                </Box>
              </Grid>

              {/* Right side - Range inputs */}
              <Grid item xs={12} md={6}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <TextField
                    label={t('severe-hyperglycemia')}
                    margin="normal"
                    type="number"
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.veryHighThreshold}
                    error={errors.severeHyperglycemia}
                    helperText={errors.severeHyperglycemia && t('error-severe-hyperglycemia')}
                    onChange={(e) => handleRangeChange('severeHyperglycemia', e.target.value)}
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
                    InputProps={{ endAdornment: <InputAdornment position="end">{selectedDiabeticProfile.bloodGlucosePreference.bgUnits}</InputAdornment> }}
                  />

                  <TextField
                    label={t('hyperglycemia')}
                    margin="normal"
                    type="number"
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.targetUpperBound}
                    error={errors.hyperglycemia}
                    helperText={errors.hyperglycemia && t('error-hyperglycemia')}
                    onChange={(e) => handleRangeChange('hyperglycemia', e.target.value)}
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
                    InputProps={{ endAdornment: <InputAdornment position="end">{selectedDiabeticProfile.bloodGlucosePreference.bgUnits}</InputAdornment> }}
                  />

                  <TextField
                    label={t('hypoglycemia')}
                    margin="normal"
                    type="number"
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.targetLowerBound}
                    error={errors.hypoglycemia}
                    helperText={errors.hypoglycemia && t('error-hypoglycemia')}
                    onChange={(e) => handleRangeChange('hypoglycemia', e.target.value)}
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
                    InputProps={{ endAdornment: <InputAdornment position="end">{selectedDiabeticProfile.bloodGlucosePreference.bgUnits}</InputAdornment> }}
                  />

                  <TextField
                    label={t('severe-hypoglycemia')}
                    margin="normal"
                    type="number"
                    value={selectedDiabeticProfile.bloodGlucosePreference.bgBounds.veryLowThreshold}
                    error={errors.severeHypoglycemia}
                    helperText={errors.severeHypoglycemia && t('error-severe-hypoglycemia')}
                    onChange={(e) => handleRangeChange('severeHypoglycemia', e.target.value)}
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
                    InputProps={{ endAdornment: <InputAdornment position="end">{selectedDiabeticProfile.bloodGlucosePreference.bgUnits}</InputAdornment> }}
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

